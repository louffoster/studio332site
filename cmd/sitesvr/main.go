package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

func main() {
	fs := http.FileServer(http.Dir("public"))
	http.Handle("/", fs)
	http.HandleFunc("/check", checkHandler)

	log.Println("Listening on 8080...")
	http.ListenAndServe(":8080", nil)
}

func checkHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	// Read list of words from post body
	bodyText, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Unable to parse request")
		return
	}

	log.Printf("GOT WORDS: %s", bodyText)

	// Read the disctionary into an array for checking word valididty
	dict, err := ioutil.ReadFile("data/dict.txt")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Unable to read dictionary")
		return
	}
	dictWords := strings.Split(string(dict), "\n")

	// Split words into list and check each one
	words := strings.Split(string(bodyText), ",")
	validCnt := 0
	total := 0
	letterValues := [6]int{0, 2, 5, 10, 15, 25}
	for _, word := range words {
		log.Printf("Is %s valid?", word)
		if isValidWord(word, dictWords) {
			score := letterValues[len(word)-1] * len(word)
			log.Printf("Yes. Score %d", score)
			validCnt++
			total += score
		} else {
			// If anything fails, the whole submissions is failed.
			// Zero everything out and bail
			log.Printf("Nope; get a 0 and return")
			total = 0
			validCnt = 0
			break
		}
	}
	if validCnt > 1 {
		for i := 0; i < validCnt-1; i++ {
			total *= 2
		}
	}
	fmt.Fprintf(w, "%d", total)
}

func isValidWord(value string, dict []string) bool {
	for _, v := range dict {
		if v == value {
			return true
		}
	}
	return false
}
