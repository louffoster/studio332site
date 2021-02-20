package main

import (
	"io/ioutil"
	"log"
	"strings"
)

type checkWords struct {
	Words string `json:"words" binding:"required"`
}

// WordGameService is a contet used for word games. It has a dictionary and word checker
type WordGameService struct {
	Words []string
}

// IsValidWord looks up a word in the dictionary and returns result
func (svc *WordGameService) IsValidWord(value string) bool {
	for _, v := range svc.Words {
		if v == value {
			return true
		}
	}
	return false
}

// InitWordGame sets up a service for word games by loading / parsing a dictionary
func InitWordGame() (*WordGameService, error) {
	// Read the disctionary into an array for checking word valididty
	dict, err := ioutil.ReadFile("data/words.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		return nil, err
	}

	out := WordGameService{}
	out.Words = strings.Split(string(dict), "\n")
	log.Printf("Loaded %d word dictionary", len(out.Words))
	return &out, nil
}
