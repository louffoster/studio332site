package main

import (
	"io/ioutil"
	"log"
	"strings"

	dbx "github.com/go-ozzo/ozzo-dbx"
)

// GameService is a contet used for word games. It has a dictionary and word checker
type GameService struct {
	Words []string
	DB    *dbx.DB
}

type checkWords struct {
	Words string `json:"words" binding:"required"`
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
