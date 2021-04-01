package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	dbx "github.com/go-ozzo/ozzo-dbx"
)

func (svc *GameService) gameMiddleware(c *gin.Context) {
	gameID, _ := strconv.Atoi(c.Param("id"))
	game := Game{}
	q := svc.DB.NewQuery(`select * from games where id={:id}`)
	q.Bind(dbx.Params{"id": gameID})
	err := q.One(&game)
	if err != nil {
		log.Printf("ERROR: No game found for ID %d: %s", gameID, err.Error())
		c.AbortWithStatus(http.StatusNotFound)
		return
	}
	c.Set("game", &game)
}

func (svc *GameService) authMiddleware(c *gin.Context) {
	tokenStr, err := getBearerToken(c.Request.Header.Get("Authorization"))
	if err != nil {
		log.Printf("auth failed: [%s]", err.Error())
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if tokenStr == "undefined" {
		log.Printf("auth failed - bearer token is undefined")
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	claims := &jwt.StandardClaims{}
	_, err = jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(svc.JWTKey), nil
	})
	if err != nil {
		log.Printf("ERROR: Unable to validate token: %s", err.Error())
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	c.Set("jwt", tokenStr)
	log.Printf("got bearer token: [%s]", tokenStr)
	c.Next()
}

func getBearerToken(authorization string) (string, error) {
	// must have two components: Bearer and the a token
	components := strings.Split(strings.Join(strings.Fields(authorization), " "), " ")
	if len(components) != 2 || components[0] != "Bearer" || components[1] == "" {
		return "", fmt.Errorf("invalid authorization header: [%s]", authorization)
	}

	return components[1], nil
}
