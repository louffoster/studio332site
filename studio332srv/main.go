package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
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

	router.Use(static.Serve("/", static.LocalFile("./public", true)))
	lw := router.Group("/latticewords")
	{
		lw.POST("/score", svc.latticeWordsScoreCheck)
	}

	// add a catchall route that renders the index page.
	// based on no-history config setup info here:
	//    https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
	router.NoRoute(func(c *gin.Context) {
		c.File("./public/index.html")
	})

	portStr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("Starting Studio332 site server on port %s", portStr)
	log.Fatal(router.Run(portStr))
}
