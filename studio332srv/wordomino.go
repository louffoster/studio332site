package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// cardsFile is the complete structure of the json cards data file
type cardsFile struct {
	Cards []card `json:"cards"`
}

type card struct {
	Name   string     `json:"name"`
	Layout []int      `json:"layout"`
	Words  []wordInfo `json:"words"`
}

type wordInfo struct {
	Row       int    `json:"row"`
	Col       int    `json:"col"`
	Direction string `json:"direction"`
	Length    int    `json:"wordLength"`
}

type wordsSubmission struct {
	Words []string `json:"words" binding:"required"`
}

func wordominoShapes(c *gin.Context) {
	jsonStr, err := ioutil.ReadFile("data/cards.json")
	if err != nil {
		log.Printf("Unable to load shapes: %s", err.Error())
		c.String(http.StatusInternalServerError, "Unable to read shapes")
		return
	}
	var cf cardsFile
	err = json.Unmarshal(jsonStr, &cf)
	if err != nil {
		log.Printf("FAILED PARSE: %+v", err)
		c.String(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, cf)
}

func wordominoCheck(c *gin.Context) {
	var postData wordsSubmission
	c.Bind(&postData)

	// Read list of words from post body
	log.Printf("Got words: %s", postData.Words)

	// Read the dictionary into an array for checking word valididty
	dict, err := ioutil.ReadFile("data/dict.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		c.String(http.StatusInternalServerError, "Unable to read dictionary")
		return
	}
	var resp struct {
		Success    bool   `json:"name"`
		WordStatus []bool `json:"wordStatus"`
	}
	dictWords := strings.Split(string(dict), "\n")
	for _, word := range postData.Words {
		if IsValidWord(word, dictWords) == false {
			resp.Success = false
			log.Printf("%s is not a valid word", word)
			resp.WordStatus = append(resp.WordStatus, false)
		} else {
			resp.WordStatus = append(resp.WordStatus, true)
		}
	}
	c.JSON(http.StatusOK, resp)
}
