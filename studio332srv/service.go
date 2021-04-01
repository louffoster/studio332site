package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	dbx "github.com/go-ozzo/ozzo-dbx"
)

type Game struct {
	ID          int    `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
	URL         string `json:"url" db:"url"`
}

// TableName sets the name of the table in the DB that this struct binds to
func (u Game) TableName() string {
	return "games"
}

type HighScore struct {
	ID     int    `json:"-" db:"id"`
	GameID int    `json:"-" db:"game_id"`
	Player string `json:"player" db:"player"`
	Score  int    `json:"score" db:"score"`
}

// TableName sets the name of the table in the DB that this struct binds to
func (u HighScore) TableName() string {
	return "high_scores"
}

// GameService is a contet used for word games. It has a dictionary and word checker
type GameService struct {
	Words  []string
	DB     *dbx.DB
	JWTKey string
}

type checkWords struct {
	Words string `json:"words" binding:"required"`
}

func (svc *GameService) getGameStartAuthToken(c *gin.Context) {
	gameIface, _ := c.Get("game")
	game := gameIface.(*Game)
	log.Printf("Start game %s", game.Name)
	claims := jwt.StandardClaims{
		Issuer:    "studio332",
		IssuedAt:  time.Now().Unix(),
		ExpiresAt: time.Now().Add(5 * time.Minute).Unix(),
		Subject:   fmt.Sprintf("%s:%d", game.Name, time.Now().Unix()),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedStr, err := token.SignedString([]byte(svc.JWTKey))
	if err != nil {
		log.Printf("Unable to generate JWT: %s", err.Error())
		c.String(http.StatusInternalServerError, "cannot start game")
		return
	}
	c.String(http.StatusOK, signedStr)
}

func (svc *GameService) getGames(c *gin.Context) {
	log.Printf("Get all games")
	games := make([]Game, 0)
	q := svc.DB.NewQuery(`select * from games order by id asc`)
	err := q.All(&games)
	if err != nil {
		log.Printf("ERROR: Unable to get games: %s", err.Error())
		c.String(http.StatusInternalServerError, "no games found")
		return
	}
	c.JSON(http.StatusOK, games)
}

func (svc *GameService) getGameHiScores(c *gin.Context) {
	gameIface, _ := c.Get("game")
	game := gameIface.(*Game)
	log.Printf("Get high scores for game %d", game.ID)

	hs := make([]HighScore, 0)
	q := svc.DB.NewQuery(`select * from high_scores where game_id={:id} order by score desc`)
	q.Bind(dbx.Params{"id": game.ID})
	err := q.All(&hs)
	if err != nil {
		log.Printf("ERROR: No high scores found for %s: %s", game.Name, err.Error())
		c.String(http.StatusNotFound, "game not found")
		return
	}

	c.JSON(http.StatusOK, hs)
}

func (svc *GameService) updateGameHiScores(c *gin.Context) {
	gameIface, _ := c.Get("game")
	game := gameIface.(*Game)
	log.Printf("Update high scores for game %s", game.Name)

	var req struct {
		Name  string
		Score int
	}
	err := c.ShouldBindJSON(&req)
	if err != nil {
		log.Printf("ERROR: Invalid high score update request: %s", err.Error())
		c.String(http.StatusBadRequest, "invalid request")
		return
	}

	scores := make([]HighScore, 0)
	q := svc.DB.NewQuery(`select * from high_scores where game_id={:id} order by score desc`)
	q.Bind(dbx.Params{"id": game.ID})
	err = q.All(&scores)
	if err != nil {
		log.Printf("ERROR: No high scores found for %s: %s", game.Name, err.Error())
		c.String(http.StatusNotFound, "game not found")
		return
	}

	log.Printf("Add new high score for %s:%s - %d", game.Name, req.Name, req.Score)
	hs := HighScore{GameID: game.ID, Player: req.Name, Score: req.Score}
	if len(scores) < 10 {
		err := svc.DB.Model(&hs).Insert()
		if err != nil {
			log.Printf("ERROR: unable to add new high score %+v: %s", hs, err.Error())
		}
	} else {
		hs = scores[len(scores)-1]
		hs.Player = req.Name
		hs.Score = req.Score
		err := svc.DB.Model(&hs).Update()
		if err != nil {
			log.Printf("ERROR: unable to update high score %+v: %s", hs, err.Error())
		}
	}

	c.String(http.StatusOK, "added")
}

// IsValidWord looks up a word in the dictionary and returns result
func (svc *GameService) IsValidWord(value string) bool {
	for _, v := range svc.Words {
		if v == value {
			return true
		}
	}
	return false
}

// initializeGameService sets up a service for word games by loading / parsing a dictionary
func initializeGameService(db *dbx.DB, jwtKey string) (*GameService, error) {
	// Read the disctionary into an array for checking word valididty
	dict, err := ioutil.ReadFile("data/words.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		return nil, err
	}

	out := GameService{DB: db, JWTKey: jwtKey}
	out.Words = strings.Split(string(dict), "\n")
	log.Printf("Loaded %d word dictionary", len(out.Words))
	return &out, nil
}
