package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (svc *GameService) charromWordCheck(c *gin.Context) {
	testWord := c.Query("w")
	log.Printf("INFO: charrom game: is '%s' valid?", testWord)
	if svc.IsValidWord(testWord) {
		log.Printf("INFO: charrom game: %s is valid", testWord)
		c.String(http.StatusOK, "ok")
	} else {
		log.Printf("INFO: charrom game: %s is not valid", testWord)
		c.String(http.StatusBadRequest, "invalid")
	}

}
