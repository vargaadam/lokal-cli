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
* [`lkl delete WORKINGDIR`](#lkl-delete-workingdir)
* [`lkl dev WORKINGDIR`](#lkl-dev-workingdir)
* [`lkl generate WORKINGDIR`](#lkl-generate-workingdir)
* [`lkl help [COMMAND]`](#lkl-help-command)
* [`lkl init WORKINGDIR`](#lkl-init-workingdir)

## `lkl delete WORKINGDIR`

```
USAGE
  $ lkl delete [WORKINGDIR]

EXAMPLES
  $ lkl delete DIRECTORY
```

_See code: [dist/commands/delete/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.0/dist/commands/delete/index.ts)_

## `lkl dev WORKINGDIR`

```
USAGE
  $ lkl dev [WORKINGDIR]

EXAMPLES
  $ lkl dev DIRECTORY
```

_See code: [dist/commands/dev/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.0/dist/commands/dev/index.ts)_

## `lkl generate WORKINGDIR`

```
USAGE
  $ lkl generate [WORKINGDIR] -w <value>

FLAGS
  -w, --workspaces=<value>...  (required)

EXAMPLES
  $ lkl generate DIRECTORY --workspace WORKSPACE1 WORKSPACE2
```

_See code: [dist/commands/generate/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.0/dist/commands/generate/index.ts)_

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

## `lkl init WORKINGDIR`

```
USAGE
  $ lkl init [WORKINGDIR] -w <value> [--pull]

FLAGS
  -w, --workspaces=<value>...  (required)
  --pull

EXAMPLES
  $ lkl init DIRECTORY --workspace WORKSPACE
```

_See code: [dist/commands/init/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.0/dist/commands/init/index.ts)_
<!-- commandsstop -->
