build: clean web backend

backend:
	go build -a -o studio332 studio332srv/*.go

clean:
	rm -f srv
	rm -rf ./public/

web:
	echo 'building web front end'
	cd frontend && npm install && npm run build
	mv ./frontend/dist ./public

dep:
	cd frontend && npm upgrade
	go get -u ./studio332srv/...
	go mod tidy
	go mod verify
