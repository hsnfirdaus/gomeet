package main

import (
	"gomeet/server"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	server.AppState.Init()

	r := mux.NewRouter()
	r.HandleFunc("/rooms", server.HandleCreateRoom).Methods("POST", "OPTIONS")
	r.HandleFunc("/rooms/{roomId}/ws", server.HandleRoomWS).Queries("username", "{username}")

	r.Use(corsMiddleware)
	bindAddress := os.Getenv("BIND_ADDRESS")
	sslCertPath := os.Getenv("SSL_CERT_PATH")
	if sslCertPath == "" {
		log.Println("Listening http address " + bindAddress + "...")
		err := http.ListenAndServe(bindAddress, r)
		if err != nil {
			log.Println(err)
			log.Fatalln("Failed to listen in " + bindAddress + "!")
		}
	} else {
		sslKeyPath := os.Getenv("SSL_KEY_PATH")
		log.Println("Listening https address " + bindAddress + "...")
		err := http.ListenAndServeTLS(bindAddress, sslCertPath, sslKeyPath, r)
		if err != nil {
			log.Println(err)
			log.Fatalln("Failed to listen in " + bindAddress + "!")
		}
	}
}
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("content-type", "application/json")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
