build: clean web

clean:
	rm -rf ./dist/

web:
	echo 'building web front end'
	npm install && npm run build

dep:
	npm upgrade
