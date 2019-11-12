build: web backend

backend:
	GOOS=darwin GOARCH=amd64 go build -a -o studio332site cmd/*.go

clean:
	rm -r studio332site
	rm -r ./public/

web:
	echo 'building web front end'
	cd ./frontend/; yarn install; yarn build
	mv ./frontend/dist ./public
