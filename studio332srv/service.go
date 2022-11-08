package main

import (
	"log"
	"os"
	"strings"
)

// GameService is a contet used for word games. It has a dictionary and word checker
type GameService struct {
	Words []string
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

func initializeGameService() (*GameService, error) {
	// Read the disctionary into an array for checking word valididty
	dict, err := os.ReadFile("data/words.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		return nil, err
	}

	out := GameService{}
	out.Words = strings.Split(string(dict), "\n")
	log.Printf("Loaded %d word dictionary", len(out.Words))
	return &out, nil
}
