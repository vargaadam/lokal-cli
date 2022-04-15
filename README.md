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
lokal-cli/0.0.1 darwin-arm64 node-v16.14.0
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
  image: test/image2
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
  $ lkl delete [WORKINGDIR] -w <value>

FLAGS
  -w, --workspaces=<value>...  (required)

EXAMPLES
  $ lkl delete DIRECTORY --workspaces WORKSPACE1 WORKSPACE2
```

_See code: [dist/commands/delete/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.1/dist/commands/delete/index.ts)_

## `lkl dev WORKINGDIR`

```
USAGE
  $ lkl dev [WORKINGDIR] -w <value>

FLAGS
  -w, --workspaces=<value>...  (required)

EXAMPLES
  $ lkl dev DIRECTORY --workspaces WORKSPACE1 WORKSPACE2
```

_See code: [dist/commands/dev/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.1/dist/commands/dev/index.ts)_

## `lkl generate WORKINGDIR`

```
USAGE
  $ lkl generate [WORKINGDIR] -w <value>

FLAGS
  -w, --workspaces=<value>...  (required)

EXAMPLES
  $ lkl generate DIRECTORY --workspaces WORKSPACE1 WORKSPACE2
```

_See code: [dist/commands/generate/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.1/dist/commands/generate/index.ts)_

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
  $ lkl init DIRECTORY --workspaces WORKSPACE
```

_See code: [dist/commands/init/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.0.1/dist/commands/init/index.ts)_
<!-- commandsstop -->
