loKal
=================

<!-- toc -->
* [Requirements](#requirements)
* [Usage](#usage)
* [Workspace Config](#workspace-config)
* [App config](#app-config)
* [Commands](#commands)
<!-- tocstop -->

# Requirements

- [skaffold](https://skaffold.dev/docs/install/#standalone-binary)

- [git](https://git-scm.com/downloads)
# Usage
<!-- usage -->
```sh-session
$ npm install -g lokal-cli
$ lkl COMMAND
running command...
$ lkl (--version)
lokal-cli/0.1.0 darwin-arm64 node-v16.14.0
$ lkl --help [COMMAND]
USAGE
  $ lkl COMMAND
...
```
<!-- usagestop -->

# Workspace Config

```yaml
version: lokal/v1alpha1
kind: Workspace
name: foo
namespace: foo
helmReleases:
  - name: redis
    repo: https://charts.bitnami.com/bitnami
    remoteChart: redis
    # valuesFiles:
    #   - ./charts/redis/values.yaml
apps:
  - name: service1
    repository:
      repoPath: "git@github.com:vargaadam/example-service.git"
    portForward: 3000
  - name: service2
    repository:
      repoPath: "git@github.com:vargaadam/example-service.git"
    portForward: 3001

```

# App config

```yaml
version: lokal/v1alpha1
kind: App
name: service1
manifests:
  deployment:
    port: 3000
build:
  docker:
    dockerfile: Dockerfile
  sync:
    manual:
      - src: "src/**/*.js"
        dest: .
```
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
  $ lkl delete [WORKINGDIR] [-c <value>] [-o <value>]

FLAGS
  -c, --configFile=<value>  [default: .lokal] the lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory

EXAMPLES
  $ lkl delete WORKING_DIR
```

_See code: [dist/commands/delete/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.1.0/dist/commands/delete/index.ts)_

## `lkl dev WORKINGDIR`

```
USAGE
  $ lkl dev [WORKINGDIR] [-c <value>] [-o <value>]

FLAGS
  -c, --configFile=<value>  [default: .lokal] the lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory

EXAMPLES
  $ lkl dev WORKING_DIR
```

_See code: [dist/commands/dev/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.1.0/dist/commands/dev/index.ts)_

## `lkl generate WORKINGDIR`

```
USAGE
  $ lkl generate [WORKINGDIR] [-c <value>] [-o <value>]

FLAGS
  -c, --configFile=<value>  [default: .lokal] the lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory

EXAMPLES
  $ lkl generate WORKING_DIR
```

_See code: [dist/commands/generate/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.1.0/dist/commands/generate/index.ts)_

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
  $ lkl init [WORKINGDIR] [-c <value>] [-o <value>] [--pull]

FLAGS
  -c, --configFile=<value>  [default: .lokal] the lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory
  --pull

EXAMPLES
  $ lkl init WORKING_DIR
```

_See code: [dist/commands/init/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.1.0/dist/commands/init/index.ts)_
<!-- commandsstop -->
