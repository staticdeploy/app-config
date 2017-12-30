[![npm version](https://img.shields.io/npm/v/@staticdeploy/app-config.svg)](https://www.npmjs.com/package/@staticdeploy/app-config)
[![build status](https://travis-ci.org/staticdeploy/app-config.svg?branch=master)](https://travis-ci.org/staticdeploy/app-config)
[![coverage status](https://codecov.io/github/staticdeploy/app-config/coverage.svg?branch=master)](https://codecov.io/github/staticdeploy/app-config?branch=master)
[![dependency status](https://david-dm.org/staticdeploy/app-config.svg)](https://david-dm.org/staticdeploy/app-config)
[![devDependency status](https://david-dm.org/staticdeploy/app-config/dev-status.svg)](https://david-dm.org/staticdeploy/app-config#info=devDependencies)

# app-config

A tool for generating configuration files for static apps.

### Install

```
yarn add @staticdeploy/app-config
```

### Quickstart

* add the following `<script>` to your `public/index.html`:

  ```html
  <script id="app-config" src="http://localhost:3456/app-config.js"></script>
  ```

* access the config variable in your code:
  ```js
  console.log(window.APP_CONFIG.MY_VAR);
  ```

Then:

#### In development

* define configuration in the `.env` file:

  ```sh
  APP_CONFIG_MY_VAR=my_val
  ```

* start the development server with `$(npm bin)/dev-config-server`

#### In production

* build your app and get the path of the app's `index.html` (for example, for
  apps built with [create-react-app](https://github.com/facebookincubator/create-react-app)
  the path is `build/index.html`)

* defining configuration via environment variables:

  ```sh
  export APP_CONFIG_MY_VAR=my_val
  ```

* inject the configuration into the index file by running:
  ```sh
  $(npm bin)/inject-config --file path/to/index.html
  ```

### Additional documentation

* [how `window.APP_CONFIG` is generated](docs/config-generation.md)
* [`inject-config` cli options](docs/inject-config-cli-options.md)
* [`dev-config-server` cli options](docs/dev-config-server-cli-options.md)
