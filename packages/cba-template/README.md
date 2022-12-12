## About @builderx-framework/template

> **Note:** This repository contains example app built using the Builderx framework.

# Installation

```shell
$ npx @builderx-framework/create-builderx-app todo-app

OR

$ npm init @builderx-framework/builderx-app todo-app
```

# Commands

## bx Command

```shell
$ node bx
Usage: bx [options] [command]

BuilderX core

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  hello-world     Prints Hello world!
  help [command]  display help for command
```

## hello-world command

```shell
$ node bx hello-world

Hello world!
```

## list app-services command

```shell
$ node bx install service

┌──────────────────┬─────────────────────────────────────────────────┬────────────────────┬────────────────────┐
│     (index)      │                 Pre-requisites                  │ Directory Argument │ Installation Path  │
├──────────────────┼─────────────────────────────────────────────────┼────────────────────┼────────────────────┤
│       web        │                  'node, yarn'                   │     'required'     │      'web'         │
│       cms        │                  'node, yarn'                   │  'not supported'   │      'cms'         │
│ backend:database │ 'hasura, docker, docker-compose, docker-status' │  'not supported'   │ 'backend/database' │
│   backend:auth   │                  'node, yarn'                   │  'not supported'   │   'backend/auth'   │
└──────────────────┴─────────────────────────────────────────────────┴────────────────────┴────────────────────┘

```

## add web app-service command

```shell
$ node bx install service web admin
```

## add cms app-service command

```shell
$ node bx install service cms
```

## add backend:database app-service command

```shell
$ node bx install service backend:database

```

## add backend:auth app-service command

```shell
$ node bx install service backend:auth
```

## list services command

```shell
$ node bx install system

┌──────────┬───────────┬──────────────────────────────────────────────────┐
│ (index)  │   type    │                   Package Name                   │
├──────────┼───────────┼──────────────────────────────────────────────────┤
│ postgres │ 'service' │ '@builderx-framework/bx-system-service-postgres' │
│ traefik  │ 'service' │ '@builderx-framework/bx-system-service-traefik'  │
│ pgadmin  │  'tool'   │  '@builderx-framework/bx-system-tools-pgadmin'   │
└──────────┴───────────┴──────────────────────────────────────────────────┘
```

## add postgres system-service command

```shell
$ node bx install system postgres
```

## add traefik system-service command

```shell
$ node bx install system traefik
```

## add pgadmin system-tool command

```shell
$ node bx install system pgadmin
```
