package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func (svc *WordGameService) checkHandler(c *gin.Context) {
	var postData checkWords
	c.Bind(&postData)

	// Read list of words from post body
	postData.Words = strings.ToLower(postData.Words)
	log.Printf("Got words: %s", postData.Words)

	// Split words into list and check each one
	words := strings.Split(string(postData.Words), ",")
	validCnt := 0
	total := 0
	letterValues := [6]int{0, 10, 20, 50, 100, 200}
	for _, word := range words {
		log.Printf("Is '%s' valid?", word)
		if svc.IsValidWord(word) {
			score := letterValues[len(word)-1]
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
