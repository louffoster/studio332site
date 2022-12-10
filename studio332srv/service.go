package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// GameService is a contet used for word games. It has a dictionary and word checker
type GameService struct {
	Words  []string
	JWTKey string
}

type checkWords struct {
	Words string `json:"words" binding:"required"`
}

// IsValidWord looks up a word in the dictionary and returns result
func (svc *GameService) IsValidWord(value string) bool {
	dcWord := strings.ToLower(value)
	log.Printf("INFO: check [%s] against %d words in dictionary", dcWord, len(svc.Words))
	for _, v := range svc.Words {
		if v == dcWord {
			return true
		}
	}
	return false
}

func initializeGameService(cfg *serviceConfig) (*GameService, error) {
	// Read the disctionary into an array for checking word valididty
	dict, err := os.ReadFile("data/words.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		return nil, err
	}

	out := GameService{JWTKey: cfg.JWTKey}
	out.Words = strings.Split(string(dict), "\n")
	log.Printf("Loaded %d word dictionary", len(out.Words))
	return &out, nil
}

func (svc *GameService) infoRequest(c *gin.Context) {
	c.String(http.StatusOK, "studdio332 game services")
}

func (svc *GameService) startGameRequest(c *gin.Context) {
	game := c.Query("game")
	log.Printf("INFO: start game %s", game)
	claims := jwt.StandardClaims{
		Issuer:    "studio332",
		IssuedAt:  time.Now().Unix(),
		ExpiresAt: time.Now().Add(5 * time.Minute).Unix(),
		Subject:   fmt.Sprintf("%s:%d", game, time.Now().Unix()),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedStr, err := token.SignedString([]byte(svc.JWTKey))
	if err != nil {
		log.Printf("Unable to generate JWT: %s", err.Error())
		c.String(http.StatusInternalServerError, "cannot start game")
		return
	}
	log.Printf("SLEEP")
	time.Sleep(time.Second * 10)
	log.Printf("DONE")
	c.String(http.StatusOK, signedStr)
}
