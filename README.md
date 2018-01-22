```
 ______                    ____           ____
/_  __/__  __ _________   / __/__  ____  / __/_ _____
 / / / _ \/ // / __(_-<  / _// _ \/ __/ / _// // / _ \
/_/  \___/\___/_/ /___/ /_/  \___/_/   /_/  \___/_//_/
```

# Tailor for ToursForFun Frontend

## Instructions
Based on webpack@3.x

- HTML
	- [x] Multi pages support

- Style
	- [x] Less to css
	- [x] CSS sprite

- DevTool
	- [x] Source Map
	- [x] Hot reload middleware

- ES6 spport
	- [x] babel-preset-env
	- [x] babel-preset-stage-2

- Lint
	- [x] ES Lint
	- [x] Sty leLint
	- [x] HTML Lint
	- [ ] Pre push

- Advanced
	- [x] ES6 Support
	- [x] VUE Supported
	- [ ] Mock Server
	- [ ] TODO MORE...


## Geting Started
- ### Install tailor global

```
npm install -g tf-tailor
```

- ### Run tailor

```
tailor -e test
```

- ### Options
	- **e**: environment,`dev`、`test`、`prod`,default `dev`
	- **c**: config, json config in CLI,will rewrite the default config
	- **f**: config file

- ### Env config
	- tailor.config.json
	- json config in CLI,config will rewrite the config file

	```
	CLI JSON config > file config > tailor.config.json
	```
- example

	```
	tailor -e dev  (default)
	tailor -e test -f custom.env.json
	tailor -e test -c {output:{path:'custom-dest'},input:{path:'custom-src'}}
	```
