REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --recursive --reporter $(REPORTER) --ignore-leaks --timeout 3000 --bail

tests: test

.PHONY: test tests