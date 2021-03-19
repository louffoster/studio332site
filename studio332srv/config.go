package main

import (
	"flag"
	"log"
	"os"
	"strconv"
)

type dbConfig struct {
	Host string
	Port int
	User string
	Pass string
	Name string
}

type serviceConfig struct {
	Port int
	DB   dbConfig
}

func loadConfig() *serviceConfig {
	var cfg serviceConfig
	defPortStr := os.Getenv("PORT")
	defPort := 8085
	if defPortStr != "" {
		defPort, _ = strconv.Atoi(defPortStr)
	}
	defDBPortStr := os.Getenv("S332_DB_PORT")
	defDBPort := 5432
	if defDBPortStr != "" {
		defDBPort, _ = strconv.Atoi(defDBPortStr)
	}
	flag.IntVar(&cfg.Port, "port", defPort, "Service port (default 8085)")
	flag.StringVar(&cfg.DB.Host, "dbhost", os.Getenv("S332_DB_HOST"), "Database host")
	flag.IntVar(&cfg.DB.Port, "dbport", defDBPort, "Database port")
	flag.StringVar(&cfg.DB.Name, "dbname", os.Getenv("S332_DB_NAME"), "Database name")
	flag.StringVar(&cfg.DB.User, "dbuser", os.Getenv("S332_DB_USER"), "Database user")
	flag.StringVar(&cfg.DB.Pass, "dbpass", os.Getenv("S332_DB_PASS"), "Database password")

	flag.Parse()

	if cfg.DB.Host == "" {
		log.Fatal("DB host is required")
	} else {
		log.Printf("DB Host: %s:%d", cfg.DB.Host, cfg.DB.Port)
	}
	if cfg.DB.Name == "" {
		log.Fatal("DB name is required")
	} else {
		log.Printf("DB name: %s", cfg.DB.Name)
	}
	if cfg.DB.User == "" {
		log.Fatal("DB user is required")
	} else {
		log.Printf("DB user: %s", cfg.DB.User)
	}

	return &cfg
}
