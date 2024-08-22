package server

import (
	"encoding/json"
	"gomeet/rooms"
	"gomeet/utils"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var AppState rooms.AppState

type createRoomBody struct {
	Name string `json:"name"`
}

func HandleCreateRoom(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var req createRoomBody

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		utils.ErrorResponse(w, "Failed to read body!")
		return
	}

	roomId := AppState.CreateRoom(req.Name)

	utils.SuccessResponse(w, roomId)

}

var wsUpgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func HandleRoomWS(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	roomId := params["roomId"]
	username := params["username"]

	ws, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.ErrorResponse(w, "Failed to connect websocket!")
		return
	}

	if username == "" {
		ws.WriteJSON(rooms.WSResponse{
			From:    "",
			Type:    rooms.WS_CONNECT_FAILED,
			Content: "Username can't be empty!",
		})
		ws.Close()
		return
	}

	exist := AppState.IsRoomExist(roomId)
	if !exist {
		ws.WriteJSON(rooms.WSResponse{
			From:    "",
			Type:    rooms.WS_CONNECT_FAILED,
			Content: "Room doesn't exist!",
		})
		ws.Close()
		return
	}
	room := AppState.Rooms[roomId]
	exist = room.IsUsernameExist(username)
	if exist {
		ws.WriteJSON(rooms.WSResponse{
			From:    "",
			Type:    rooms.WS_CONNECT_FAILED,
			Content: "Username exist in same room!",
		})
		ws.Close()
		return
	}

	participant := room.Join(username, ws)
	ws.WriteJSON(rooms.WSResponse{
		From:    "",
		Type:    rooms.WS_CONNECTED,
		Content: "",
	})

	ws.WriteJSON(rooms.WSResponse{
		From:    "",
		Type:    rooms.WS_EXISTING_USER_LIST,
		Content: room.GetListUsername(&username),
	})

	go room.HandleWSIO(participant)
}
