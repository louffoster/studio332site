package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type checkWords struct {
	Words string `json:"words" binding:"required"`
}

func checkHandler(c *gin.Context) {
	var postData checkWords
	c.Bind(&postData)

	// Read list of words from post body
	log.Printf("Got words: %s", postData.Words)

	// Read the disctionary into an array for checking word valididty
	dict, err := ioutil.ReadFile("data/dict.txt")
	if err != nil {
		log.Printf("Unable to load distionary: %s", err.Error())
		c.String(http.StatusInternalServerError, "Unable to read distionary")
		return
	}
	dictWords := strings.Split(string(dict), "\n")

	// Split words into list and check each one
	words := strings.Split(string(postData.Words), ",")
	validCnt := 0
	total := 0
	letterValues := [6]int{0, 2, 5, 10, 15, 25}
	for _, word := range words {
		log.Printf("Is %s valid?", word)
		if isValidWord(word, dictWords) {
			score := letterValues[len(word)-1] * len(word)
			log.Printf("Yes. Score %d", score)
			validCnt++
			total += score
		} else {
			// If anything fails, the whole submissions is failed.
			// Zero everything out and bail
			log.Printf("Nope; get a 0 and return")
			total = 0
			validCnt = 0
			break
		}
	}
	if validCnt > 1 {
		for i := 0; i < validCnt-1; i++ {
			total *= 2
		}
	}
	c.String(http.StatusOK, "%d", total)
}

func isValidWord(value string, dict []string) bool {
	for _, v := range dict {
		if v == value {
			return true
		}
	}
	return false
}
