# Vendors-Authentication Module

## Descrição

Este projeto engloba algumas funcionalidades encontradas na plataforma vendors.

Dentre suas principais atribuições estão:

- Autenticação de login na plataforma vendors.

- Recuperação de senha de acesso à plataforma vendors.

- Envio de email para recuperação de senha de acesso à plataforma vendors.

## Tecnologias usadas no Projeto

- React JS

- TypeScript

- Redux e Redux-Toolkit

- Sass (SCSS)

- Nx

- Jest (testes unitários)

## Ambientes

- URL QAs: https://vendors-qas-1.juntoseguros.com/login

- URL STG: https://vendors-stg.juntoseguros.com/login

- URL PRD: https://vendors.juntoseguros.com/login

## Projeto exposto fora da rede da Junto?

Apenas ambiente de produção.

## Serviços externos usado neste projeto

- [Firebase](https://console.firebase.google.com/?hl=pt-br)

- [TagManager](https://tagmanager.google.com/)

- [LogRocket](https://app.logrocket.com/sy75xm/plataforma-do-corretor/)

- [ms-vendors-bff](https://github.com/GitJMSeguradora/ms-vendors-bff)

## Instalação

Após baixar o projeto, instale as dependências com:

`yarn install`

## Rodando o projeto

Na raiz do projeto com:

`yarn start`

## Rodando testes

Na raiz do projeto com:

default -> `yarn nx test vendors-authentication`

um arquivo específico -> `yarn nx run vendors-authentication:test --testFile={{NOME DO ARQUIVO}}`

coverage -> `yarn nx run vendors-authentication:test --codeCoverage=true` ou `yarn test vendors-authentication --collectCoverage=true`

watch -> `yarn test vendors-authentication --watch`

## Requisitos

- Node

- Yarn
