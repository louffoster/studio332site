package main

// IsValidWord looks up a word in the dictionary and returns result
func IsValidWord(value string, dict []string) bool {
	for _, v := range dict {
		if v == value {
			return true
		}
	}
	return false
}
