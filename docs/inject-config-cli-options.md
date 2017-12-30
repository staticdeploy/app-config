## `inject-config` cli options

The `inject-config` binary takes the following configuration options:

* `--file` (required): html file to inject config into
* `--selector`: selector for the script element to inject config into, defaults
  to `script#app-config`
* `--envKeyPrefix`: prefix of the environment variables to use for configuration,
  defaults to `APP_CONFIG_`
