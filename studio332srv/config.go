package main

import (
	"flag"
)

type serviceConfig struct {
	Port int
}

func loadConfig() *serviceConfig {
	var cfg serviceConfig
	flag.IntVar(&cfg.Port, "port", 8085, "Service port (default 8085)")

	flag.Parse()

	return &cfg
}
