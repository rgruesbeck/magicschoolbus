default:
	find src -type f | entr -r -s 'npx webpack build --config webpack.config.js --mode development'

test:
	npx webpack serve --config webpack.config.js --mode development

old:
	find src -type f | entr -s 'python3 -t http.server --directory .'
