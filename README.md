loKal
=================

## Config example:

```yaml
version: lokal/v1alpha1
name: lokal
workspaces:
  - name: foo
    namespace: foo
    apps:
      - name: redis
        alias: foo-redis
      - name: service1
        portForward: 3000
      - name: service2
        portForward: 3001
  - name: bar
    namespace: bar
    apps:
      - name: redis
        alias: bar-redis
      - name: service2
        portForward: 3002

apps:
  # redis
  - name: redis
    helm:
      repo: https://charts.bitnami.com/bitnami
      remoteChart: redis
      valuesFiles:
        - ./charts/redis/values.yaml

  # service1
  - name: service1
    repository:
      localPath: service
      repoPath: "git@github.com:vargaadam/example-service.git"
    manifests:
      deployment:
        enabled: true
        port: 3000
    build:
      image: test/image1
      docker:
        dockerfile: Dockerfile
      sync:
        manual:
          - src: "src/**/*.js"
            dest: .

  # service2
  - name: service2
    repository:
      localPath: service2
      repoPath: "git@github.com:vargaadam/example-service.git"
    manifests:
      deployment:
        enabled: true
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


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lokal
$ lkl COMMAND
running command...
$ lkl (--version)
lokal/0.0.0 darwin-arm64 node-v16.14.0
$ lkl --help [COMMAND]
USAGE
  $ lkl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
- [loKal](#lokal)
  - [Config example:](#config-example)
- [Usage](#usage)
- [Commands](#commands)
  - [`lkl delete WORKINGDIR`](#lkl-delete-workingdir)
  - [`lkl dev WORKINGDIR`](#lkl-dev-workingdir)
  - [`lkl generate WORKINGDIR`](#lkl-generate-workingdir)
  - [`lkl help [COMMAND]`](#lkl-help-command)
  - [`lkl init WORKINGDIR`](#lkl-init-workingdir)

## `lkl delete WORKINGDIR`

```
USAGE
  $ lkl delete [WORKINGDIR]

EXAMPLES
  $ lkl delete DIRECTORY
```

_See code: [dist/commands/delete/index.ts](https://github.com/Magyar-Bankholding-Zrt/lokal/blob/v0.0.0/dist/commands/delete/index.ts)_

## `lkl dev WORKINGDIR`

```
USAGE
  $ lkl dev [WORKINGDIR]

EXAMPLES
  $ lkl dev DIRECTORY
```

_See code: [dist/commands/dev/index.ts](https://github.com/Magyar-Bankholding-Zrt/lokal/blob/v0.0.0/dist/commands/dev/index.ts)_

## `lkl generate WORKINGDIR`

```
USAGE
  $ lkl generate [WORKINGDIR] -w <value>

FLAGS
  -w, --workspaces=<value>...  (required)

EXAMPLES
  $ lkl generate DIRECTORY --workspace WORKSPACE1 WORKSPACE2
```

_See code: [dist/commands/generate/index.ts](https://github.com/Magyar-Bankholding-Zrt/lokal/blob/v0.0.0/dist/commands/generate/index.ts)_

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

_See code: [dist/commands/init/index.ts](https://github.com/Magyar-Bankholding-Zrt/lokal/blob/v0.0.0/dist/commands/init/index.ts)_
<!-- commandsstop -->
