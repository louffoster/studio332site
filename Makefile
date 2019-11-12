build: web backend

backend:
	GOOS=darwin GOARCH=amd64 go build -a -o srv studio332srv/*.go

clean:
	rm -r srv
	rm -r ./public/

web:
	echo 'building web front end'
	cd ./frontend/; yarn install; yarn build
	mv ./frontend/dist ./public
