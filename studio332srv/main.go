package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	// Get config params. Heroku defines env PORT for each app. See
	// if it is present and bind to it if so. Default to 8085 which is
	// the port the dev front end expects to communicate with the back end on
	cfg := loadConfig()

	svc, err := initializeGameService()
	if err != nil {
		log.Fatalf("Unable to setup game context: %s", err.Error())
	}

	gin.SetMode(gin.ReleaseMode)
	gin.DisableConsoleColor()
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.GET("/info", svc.infoRequest)
	router.POST("/start", svc.startGameRequest)
	lw := router.Group("/latticewords")
	{
		lw.POST("/score", svc.latticeWordsScoreCheck)
	}
	virus := router.Group("/virus")
	{
		virus.POST("/check", svc.virusWordCheck)
	}

	portStr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("Starting Studio332 site server on port %s", portStr)
	log.Fatal(router.Run(portStr))
}

//go build -tags netgo -ldflags '-s -w' -o app
