oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lokal-cli
$ lkl COMMAND
running command...
$ lkl (--version)
lokal-cli/0.0.0 darwin-arm64 node-v16.14.0
$ lkl --help [COMMAND]
USAGE
  $ lkl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lkl hello PERSON`](#lkl-hello-person)
* [`lkl hello world`](#lkl-hello-world)
* [`lkl help [COMMAND]`](#lkl-help-command)
* [`lkl plugins`](#lkl-plugins)
* [`lkl plugins:install PLUGIN...`](#lkl-pluginsinstall-plugin)
* [`lkl plugins:inspect PLUGIN...`](#lkl-pluginsinspect-plugin)
* [`lkl plugins:install PLUGIN...`](#lkl-pluginsinstall-plugin-1)
* [`lkl plugins:link PLUGIN`](#lkl-pluginslink-plugin)
* [`lkl plugins:uninstall PLUGIN...`](#lkl-pluginsuninstall-plugin)
* [`lkl plugins:uninstall PLUGIN...`](#lkl-pluginsuninstall-plugin-1)
* [`lkl plugins:uninstall PLUGIN...`](#lkl-pluginsuninstall-plugin-2)
* [`lkl plugins update`](#lkl-plugins-update)

## `lkl hello PERSON`

Say hello

```
USAGE
  $ lkl hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `lkl hello world`

Say hello world

```
USAGE
  $ lkl hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `lkl help [COMMAND]`

Display help for lkl.

```
USAGE
  $ lkl help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for lkl.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `lkl plugins`

List installed plugins.

```
USAGE
  $ lkl plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ lkl plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `lkl plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ lkl plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ lkl plugins add

EXAMPLES
  $ lkl plugins:install myplugin 

  $ lkl plugins:install https://github.com/someuser/someplugin

  $ lkl plugins:install someuser/someplugin
```

## `lkl plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ lkl plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ lkl plugins:inspect myplugin
```

## `lkl plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ lkl plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ lkl plugins add

EXAMPLES
  $ lkl plugins:install myplugin 

  $ lkl plugins:install https://github.com/someuser/someplugin

  $ lkl plugins:install someuser/someplugin
```

## `lkl plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ lkl plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ lkl plugins:link myplugin
```

## `lkl plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lkl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lkl plugins unlink
  $ lkl plugins remove
```

## `lkl plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lkl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lkl plugins unlink
  $ lkl plugins remove
```

## `lkl plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ lkl plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ lkl plugins unlink
  $ lkl plugins remove
```

## `lkl plugins update`

Update installed plugins.

```
USAGE
  $ lkl plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
