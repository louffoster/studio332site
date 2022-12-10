package main

import (
	"flag"
	"log"
	"os"
)

type serviceConfig struct {
	Port   int
	JWTKey string
}

func loadConfig() *serviceConfig {
	var cfg serviceConfig

	envKey := os.Getenv("JWT_KEY")
	flag.IntVar(&cfg.Port, "port", 8085, "Service port (default 8085)")
	flag.StringVar(&cfg.JWTKey, "jwt", envKey, "JWT signing key")
	flag.Parse()

	if cfg.JWTKey == "" {
		log.Fatal("jwt param or JWT_KEY env is required")
	}

	return &cfg
}
