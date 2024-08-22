package rooms

import (
	"gomeet/utils"
	"log"
	"strings"
	"sync"

	"github.com/gorilla/websocket"
)

const WS_CONNECTED = "CONNECTED"
const WS_CONNECT_FAILED = "CONNECT_FAILED"
const WS_NEW_USER = "NEW_USER"
const WS_EXISTING_USER_LIST = "EXISTING_USER_LIST"
const WS_CHAT = "CHAT"
const WS_LEAVE = "LEAVE"

type WSRequest struct {
	Type    string      `json:"type"`
	To      *string     `json:"to"`
	Content interface{} `json:"content"`
}

type WSResponse struct {
	From    string      `json:"from"`
	Type    string      `json:"type"`
	Content interface{} `json:"content"`
}

type Participant struct {
	Username   string
	Connection *websocket.Conn
}

type Room struct {
	Mutex        sync.RWMutex
	Name         string
	Participants []*Participant
}

func (room *Room) GetListUsername(excludeUsername *string) []string {
	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	list := make([]string, 0)
	for _, v := range room.Participants {
		if excludeUsername == nil || *excludeUsername != v.Username {
			list = append(list, v.Username)
		}

	}
	return list
}

func (room *Room) IsUsernameExist(username string) bool {
	for _, v := range room.Participants {
		if v.Username == username {
			return true
		}
	}
	return false
}

func (room *Room) Join(username string, connection *websocket.Conn) *Participant {
	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	participant := Participant{
		Username:   username,
		Connection: connection,
	}

	room.Participants = append(room.Participants, &participant)
	room.BroadcastMessage(&participant, WSResponse{From: username, Type: WS_NEW_USER})

	log.Println("New User: " + username)

	return &participant
}

func (room *Room) Delete(participant *Participant) {
	room.Mutex.Lock()
	defer room.Mutex.Unlock()

	newRange := make([]*Participant, len(room.Participants)-1)
	idx := 0
	for _, v := range room.Participants {
		if v.Username != participant.Username {
			newRange[idx] = v
			idx++
		}
	}
	log.Println("User Leave: " + participant.Username)

	room.Participants = newRange
}

func (room *Room) HandleWSIO(client *Participant) {
	defer client.Connection.Close()
	for {
		payload := WSRequest{}
		err := client.Connection.ReadJSON(&payload)
		if err != nil {
			if strings.Contains(err.Error(), "websocket: close") {
				room.BroadcastMessage(client, WSResponse{From: client.Username, Type: WS_LEAVE})
				room.Delete(client)
				return
			}

			log.Println(err)
			continue
		}

		message := WSResponse{
			From:    client.Username,
			Type:    payload.Type,
			Content: payload.Content,
		}
		if payload.To != nil {
			room.SingleClientMessage(client, *payload.To, message)
		} else {
			room.BroadcastMessage(client, message)
		}
	}
}

func (room *Room) BroadcastMessage(client *Participant, message WSResponse) {
	for _, conn := range room.Participants {
		if conn == client {
			continue
		}

		conn.Connection.WriteJSON(message)
	}
}

func (room *Room) SingleClientMessage(client *Participant, toUsername string, message WSResponse) {
	for _, conn := range room.Participants {
		if conn.Username == toUsername {
			conn.Connection.WriteJSON(message)
			return
		}
	}
}

type AppState struct {
	Mutex sync.RWMutex
	Rooms map[string]*Room
}

func (app *AppState) Init() {
	app.Rooms = make(map[string]*Room)
}

func (app *AppState) CreateRoom(name string) string {
	app.Mutex.Lock()
	defer app.Mutex.Unlock()

	roomId := utils.RandomString(4)
	_, exist := app.Rooms[roomId]
	if exist {
		return app.CreateRoom(name)
	}

	room := Room{
		Name:         name,
		Participants: make([]*Participant, 0),
	}

	app.Rooms[roomId] = &room
	log.Println("New Room: " + roomId)
	return roomId
}

func (app *AppState) IsRoomExist(roomId string) bool {
	_, exist := app.Rooms[roomId]

	return exist
}
