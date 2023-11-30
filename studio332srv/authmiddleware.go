package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func (svc *GameService) authMiddleware(c *gin.Context) {
	log.Printf("Authorize access to %s", c.Request.URL)
	tokenStr, err := getBearerToken(c.Request.Header.Get("Authorization"))
	if err != nil {
		log.Printf("WARNING: authentication failed: [%s]", err.Error())
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	if tokenStr == "undefined" {
		log.Printf("WARNING: authentication failed; bearer token is undefined")
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	log.Printf("INFO: validating JWT auth token")
	jwtClaims := jwt.MapClaims{}
	_, jwtErr := jwt.ParseWithClaims(tokenStr, jwtClaims, func(token *jwt.Token) (interface{}, error) {
		return []byte(svc.JWTKey), nil
	})
	if jwtErr != nil {
		log.Printf("WARNING: authentication failed; token validation failed: %+v", jwtErr)
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	log.Printf("INFO: got valid bearer token: [%s]", tokenStr)
	c.Set("jwt", tokenStr)
	c.Set("claims", jwtClaims)
	c.Next()
}

func getBearerToken(authorization string) (string, error) {
	components := strings.Split(strings.Join(strings.Fields(authorization), " "), " ")

	// must have two components, the first of which is "Bearer", and the second a non-empty token
	if len(components) != 2 || components[0] != "Bearer" || components[1] == "" {
		return "", fmt.Errorf("invalid authorization header: [%s]", authorization)
	}

	return components[1], nil
}
