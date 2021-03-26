package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	dbx "github.com/go-ozzo/ozzo-dbx"
	_ "github.com/lib/pq"
)

func main() {
	// Get config params. Heroku defines env PORT for each app. See
	// if it is present and bind to it if so. Default to 8085 which is
	// the port the dev front end expects to communicate with the back end on
	cfg := loadConfig()

	log.Printf("Connect to Postgres")
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%d sslmode=disable",
			cfg.DB.User, cfg.DB.Pass, cfg.DB.Name, cfg.DB.Host, cfg.DB.Port)
	}
	db, err := dbx.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	db.LogFunc = log.Printf

	// game service content with DB and dictionary
	svc, err := initializeGameService(db)
	if err != nil {
		log.Fatalf("Unable to setup word game context: %s", err.Error())
	}

	gin.SetMode(gin.ReleaseMode)
	gin.DisableConsoleColor()
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./public", true)))
	api := router.Group("/api")
	api.GET("/games/:id/hiscore", svc.getGameHiScores)
	api.POST("/games/:id/hiscore", svc.updateGameHiScores)
	lw := api.Group("/latticewords")
	{
		lw.POST("/check", svc.checkHandler)
	}
	wd := api.Group("/wordomino")
	{
		wd.GET("/shapes", wordominoShapes)
		wd.POST("/check", svc.wordominoCheck)
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
