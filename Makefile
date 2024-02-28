build: clean web

backend:
	go build -a -o studio332 studio332srv/*.go

clean:
	rm -f studio332
	rm -rf ./dist/

web:
	echo 'building web front end'
	cd frontend && npm install && npm run build
	mv ./frontend/dist ./dist
	cp -r ./frontend/images ./dist/images

dep:
	cd frontend && npm upgrade
	go get -u ./studio332srv/...
	go mod tidy
	go mod verify
