```
 ______                    ____           ____
/_  __/__  __ _________   / __/__  ____  / __/_ _____
 / / / _ \/ // / __(_-<  / _// _ \/ __/ / _// // / _ \
/_/  \___/\___/_/ /___/ /_/  \___/_/   /_/  \___/_//_/
```

# Tailor for ToursForFun Frontend

## Instructions
- Based on webpack@3.0
- TODO List
	- Development
		- [x] multi-page support
		- [x] Compile
			- [x] less to css
			- [x] js uglify
			- [x] css sprite
			- [x] sourcemap
		- [x] hot reload
		- [ ] Lint
			- [x] eslint
			- [x] stylelint
			- [ ] htmlint
		- [x] ES6 supported
		- [x] Vue spported
		- [ ] Mock
	- [ ] Test
		- [ ] [Jest](http://facebook.github.io/jest/docs/zh-Hans/getting-started.html)
		- [x] git precommit hook
	- [ ] Build
		- [x] env diff:DEV QA PROD
	- [ ] [CI](https://zhuanlan.zhihu.com/p/26701038)
		- [ ] [Jekins](https://www.liaoxuefeng.com/article/001463233913442cdb2d1bd1b1b42e3b0b29eb1ba736c5e000)
	- [ ] more...

## Geting Started
- ### Install tailor global

```
npm install -g tf-tailor
```

- ### Run tailor

```
tailor -e test
```

- options
	- **e**: environment,`dev`、`test`、`prod`,default `dev`
	- **c**: config, json config in CLI
	- **f**: config file
- env config
	- base.env.json
	- env.json
	- custom.env.json
	- json config in CLI,config will rewrite the config file
	
	```
	CLI JSON config > file config = custom.env.json > env.json > base.env.json
	```
- example

	```
	tailor -e dev  (default)
	tailor -e test -f custom.env.json
	tailor -e test -c {env:'dev',basic:{cdn:'//cdn.tff.com',domain:'//tff.com'}}	
	```
### TODO

> [IE兼容指南](http://www.zuojj.com/archives/2157.html)
