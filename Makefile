build: clean web backend

backend:
	GOOS=darwin GOARCH=amd64 go build -a -o srv studio332srv/*.go

clean:
	rm -f srv
	rm -rf ./public/

web:
	echo 'building web front end'
	cd ./frontend/; yarn install; yarn build
	mv ./frontend/dist ./public
