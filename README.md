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
lokal-cli/0.4.0 darwin-arm64 node-v16.14.0
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
    portForward: # (optional)
      - localPort: 3000
        port: 3000 
        resourceType: Service # (optional) default: Service
        resourceName: mongodb # (optional) default: name
    spec:
      chartPath: ./charts/mongodb
  - name: redis
    spec: 
      repo: https://charts.bitnami.com/bitnami
      remoteChart: redis
      version: 16.8.5
      valuesFiles: # (optional)
        - ./charts/redis/values.yaml
apps:
  - name: app1
    portForward: # (optional)
      - localPort: 3000
        port: 3000 # (optional) # default: app.deployment.port
        resourceType: Service # (optional) default: Service
        resourceName: app1 # (optional) default: name
    lokalFile: ".lokal" # (optional) default: .lokal
    spec:
      env: # (optional) append or override the App env config
        FOO: "workspaceFoo"
      repository:
        localPath: "./apps/service1"
        repoUrl: "git@github.com:vargaadam/example-service.git" # (optional)
        branch: "dev" # (optional)

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
* [`lkl generate WORKINGDIR`](#lkl-generate-workingdir)
* [`lkl help [COMMAND]`](#lkl-help-command)

## `lkl clone WORKINGDIR`

```
USAGE
  $ lkl clone [WORKINGDIR] [-w <value>] [-o <value>] [--pull]

FLAGS
  -o, --outDir=<value>     [default: .lokal] The directory of the generated manifests
  -w, --workspace=<value>  [default: .lokal.yaml] The workspace config file name
  --pull

EXAMPLES
  $ lkl clone WORKING_DIR
```

_See code: [dist/commands/clone/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.4.0/dist/commands/clone/index.ts)_

## `lkl generate WORKINGDIR`

```
USAGE
  $ lkl generate [WORKINGDIR] [-w <value>] [-o <value>] [--reset]

FLAGS
  -o, --outDir=<value>     [default: .lokal] The directory of the generated manifests
  -w, --workspace=<value>  [default: .lokal.yaml] The workspace config file name
  --reset                  Removes the output directory before generating

EXAMPLES
  $ lkl generate WORKING_DIR
```

_See code: [dist/commands/generate/index.ts](https://github.com/vargaadam/lokal-cli/blob/v0.4.0/dist/commands/generate/index.ts)_

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
<!-- commandsstop -->
