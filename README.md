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
lokal-cli/0.3.0 darwin-arm64 node-v16.14.0
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
  - name: mongodb
    chartPath: ./charts/mongodb
  - name: redis
    repo: https://charts.bitnami.com/bitnami
    remoteChart: redis
    version: 16.8.5
    valuesFiles: # (optional)
      - ./charts/redis/values.yaml
apps:
  - name: service1
    lokalFile: ".lokal" # (optional) default: .lokal
    env: # (optional) append or override the App env config
      FOO: "workspaceFoo"
    repository:
      localPath: "./apps/service1"
      repoUrl: "git@github.com:vargaadam/example-service.git" # (optional)
      branch: "dev" # (optional)
    portForward: 3000

```

# App config

```yaml
version: lokal/v1alpha1
kind: App
name: service1
manifests:
  configMap: # (optional)
    fromFile: .env.example
    env:
      FOO: FOO
  deployment:
    replicas: 1 # (optional) default: 1
    size: NO_LIMIT | SMALL | MEDIUM | LARGE # (optional) default: NO_LIMIT
    port: 3000
build:
  docker:
    dockerfile: Dockerfile
  buildArgs: # (optional)
    BUILD_ARG: build_arg
  sync:
    manual:
      - src: "src/**/*.js"
        dest: .
```
# Commands
<!-- commands -->
* [`lkl clone WORKINGDIR`](#lkl-clone-workingdir)
* [`lkl delete WORKINGDIR`](#lkl-delete-workingdir)
* [`lkl dev WORKINGDIR`](#lkl-dev-workingdir)
* [`lkl generate WORKINGDIR`](#lkl-generate-workingdir)
* [`lkl help [COMMAND]`](#lkl-help-command)
* [`lkl run WORKINGDIR`](#lkl-run-workingdir)

## `lkl clone WORKINGDIR`

```
USAGE
  $ lkl clone [WORKINGDIR] [-c <value>] [-o <value>] [--pull]

FLAGS
  -c, --configFile=<value>  [default: .lokal] The lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory
  --pull

EXAMPLES
  $ lkl clone WORKING_DIR
```

_See code: [dist/commands/clone/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.3.0/dist/commands/clone/index.ts)_

## `lkl delete WORKINGDIR`

```
USAGE
  $ lkl delete [WORKINGDIR] [-c <value>] [-o <value>]

FLAGS
  -c, --configFile=<value>  [default: .lokal] The lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory

EXAMPLES
  $ lkl delete WORKING_DIR
```

_See code: [dist/commands/delete/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.3.0/dist/commands/delete/index.ts)_

## `lkl dev WORKINGDIR`

```
USAGE
  $ lkl dev [WORKINGDIR] [-c <value>] [-o <value>] [--skip-generate]

FLAGS
  -c, --configFile=<value>  [default: .lokal] The lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory
  --skip-generate

EXAMPLES
  $ lkl dev WORKING_DIR
```

_See code: [dist/commands/dev/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.3.0/dist/commands/dev/index.ts)_

## `lkl generate WORKINGDIR`

```
USAGE
  $ lkl generate [WORKINGDIR] [-c <value>] [-o <value>]

FLAGS
  -c, --configFile=<value>  [default: .lokal] The lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory

EXAMPLES
  $ lkl generate WORKING_DIR
```

_See code: [dist/commands/generate/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.3.0/dist/commands/generate/index.ts)_

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

## `lkl run WORKINGDIR`

```
USAGE
  $ lkl run [WORKINGDIR] [-c <value>] [-o <value>] [--skip-generate]

FLAGS
  -c, --configFile=<value>  [default: .lokal] The lokal config file name
  -o, --outDir=<value>      [default: .lokal] The generated manifests directory
  --skip-generate

EXAMPLES
  $ lkl dev WORKING_DIR
```

_See code: [dist/commands/run/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.3.0/dist/commands/run/index.ts)_
<!-- commandsstop -->
