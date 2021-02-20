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

dep:
	cd frontend && yarn upgrade 
	go get -u ./studio332srv/...
	go mod tidy
	go mod verify
