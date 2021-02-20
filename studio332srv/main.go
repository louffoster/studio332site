package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// Get config params. Heroku defines env PORT for each app. See
	// if it is present and bind to it if so. Default to 8085 which is
	// the port the dev front end expects to communicate with the back end on
	var port int
	defPort, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		defPort = 8085
	}
	flag.IntVar(&port, "port", defPort, "Site Server port (default 8085)")
	flag.Parse()

	// setup word game context
	wordSvc, err := InitWordGame()
	if err != nil {
		log.Fatalf("Unable to setup word game context: %s", err.Error())
	}

	gin.SetMode(gin.ReleaseMode)
	gin.DisableConsoleColor()
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./public", true)))
	api := router.Group("/api")
	lw := api.Group("/latticewords")
	{
		lw.POST("/check", wordSvc.checkHandler)
	}
	wd := api.Group("/wordomino")
	{
		wd.GET("/shapes", wordominoShapes)
		wd.POST("/check", wordSvc.wordominoCheck)
	}

	// add a catchall route that renders the index page.
	// based on no-history config setup info here:
	//    https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
	router.NoRoute(func(c *gin.Context) {
		c.File("./public/index.html")
	})

	portStr := fmt.Sprintf(":%d", port)
	log.Printf("Starting Studio332 site server on port %s", portStr)
	log.Fatal(router.Run(portStr))
}
