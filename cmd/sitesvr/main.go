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
	// Get config params
	var port int
	defPort, err := strconv.Atoi(os.Getenv("STUDIO_332_PORT"))
	if err != nil {
		defPort = 8080
	}
	flag.IntVar(&port, "port", defPort, "Site Server port (default 8080)")
	flag.Parse()

	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("./public", true)))
	api := router.Group("/api")
	lw := api.Group("/latticewords")
	{
		lw.POST("/check", checkHandler)
	}

	portStr := fmt.Sprintf(":%d", port)
	log.Printf("Starting Studio332 site server on port %s", portStr)
	log.Fatal(router.Run(portStr))
}
