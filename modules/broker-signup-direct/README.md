# Broker-Signup-Direct Module

## Descrição

Este projeto front-end é responsável pelo cadastro automático de novos corretores na plataforma do corretor.

Dentre suas principais atribuições estão:

- Cadastro de novos corretores.
- Validação de email do corretor conforme dados registrados na SUSEP.
- Cadastro do corretor no GV.
- Em casos de cadastros internalizados, solicita os documentos do corretor e envia email para a análise da área responsável pelo cadastro.

## Como acessar

Disponível por meio da plataforma do corretor. É possível fazer o login com o mesmo acesso do corretor.

## Ambientes

- URL QAs: https://corretor-qas-1.juntoseguros.com/signup

- URL STG: https://corretor-stg.juntoseguros.com/signup

- URL PRD: https://corretor.juntoseguros.com/signup

## Serviços externos usado neste projeto

- [Firebase](https://console.firebase.google.com/?hl=pt-br) ??

- [TagManager](https://tagmanager.google.com/)

- [LogRocket](https://app.logrocket.com/sy75xm/plataforma-do-corretor/) ??

- [Clarity](https://clarity.microsoft.com/)

- [Indecx](https://www.app-indecx.com/junto)

- [ms-plataforma-bff](https://github.com/GitJMSeguradora/ms-plataforma-bff)

- [ms-customer-surveys](https://github.com/GitJMSeguradora/ms-customer-surveys)

## Tecnologias usadas no Projeto

- React JS

- TypeScript

- Redux e Redux-Toolkit

- Sass (SCSS)

- Nx

- Jest (testes unitários)

## Projeto exposto fora da rede da Junto?

Apenas ambiente de produção.

## Instalação

Após baixar o projeto, instale as dependências com:

`yarn install`

## Rodando o projeto

Na raiz do projeto com:

`yarn start`

## Rodando testes

Na raiz do projeto, com:

default -> `yarn nx test broker-signup-direct`

um arquivo específico -> `yarn nx run broker-signup-direct:test --testFile={{NOME DO ARQUIVO}}`

coverage -> `yarn nx run broker-signup-direct:test --codeCoverage=true` ou `yarn test broker-signup-direct --collectCoverage=true`

watch -> `yarn test broker-signup-direct --watch`

## Requisitos

- Node

- Yarn
