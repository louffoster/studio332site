package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	dbx "github.com/go-ozzo/ozzo-dbx"
)

type Game struct {
	ID   int    `json:"id" db:"id"`
	Name string `json:"name" db:"name"`
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
	Words []string
	DB    *dbx.DB
}

type checkWords struct {
	Words string `json:"words" binding:"required"`
}

func (svc *GameService) getGameHiScores(c *gin.Context) {
	gameID, _ := strconv.Atoi(c.Param("id"))
	log.Printf("Get high scores for game %d", gameID)
	game := Game{}
	q := svc.DB.NewQuery(`select * from games where id={:id}`)
	q.Bind(dbx.Params{"id": gameID})
	err := q.One(&game)
	if err != nil {
		log.Printf("ERROR: No game found for ID %d: %s", gameID, err.Error())
		c.String(http.StatusNotFound, "game not found")
		return
	}

	hs := make([]HighScore, 0)
	q = svc.DB.NewQuery(`select * from high_scores where game_id={:id} order by score desc`)
	q.Bind(dbx.Params{"id": gameID})
	err = q.All(&hs)
	if err != nil {
		log.Printf("ERROR: No high scores found for %s: %s", game.Name, err.Error())
		c.String(http.StatusNotFound, "game not found")
		return
	}

	c.JSON(http.StatusOK, hs)
}

func (svc *GameService) updateGameHiScores(c *gin.Context) {
	gameID := c.Param("id")
	log.Printf("Update high scores for game %s", gameID)
	c.String(http.StatusNotImplemented, "nope")
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
func initializeGameService(db *dbx.DB) (*GameService, error) {
	// Read the disctionary into an array for checking word valididty
	dict, err := ioutil.ReadFile("data/words.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		return nil, err
	}

	out := GameService{DB: db}
	out.Words = strings.Split(string(dict), "\n")
	log.Printf("Loaded %d word dictionary", len(out.Words))
	return &out, nil
}
