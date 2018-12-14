package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// Get config params
	var port int
	defPort, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		defPort = 8080
	} else {
		log.Printf("GOT PORT %d", defPort)
	}
	flag.IntVar(&port, "port", defPort, "Site Server port (default 8080)")
	flag.Parse()

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./public", true)))
	// router.Use(static.Serve("/assets", static.LocalFile("./frontend/public", true)))
	api := router.Group("/api")
	api.GET("/test", testHandler)
	lw := api.Group("/latticewords")
	{
		lw.POST("/check", checkHandler)
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

func testHandler(c *gin.Context) {
	c.String(http.StatusOK, "hello world")
}
