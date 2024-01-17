# Fidelize-Dashboard Module

## Descrição

Módulo da aplicação Fidelize, que contém as seguintes funcionalidades:

- Dashboard das oportunidades do corretor no Fidelize.
- Tela de solicitação de mapeamentos por tomador e visualização do quantitativo das oportunidades por tomador.

### Como acessar

Disponível por meio da plataforma do corretor. É possível fazer o login com o mesmo acesso do corretor.

## Ambientes

URL QAs:

- https://fidelize-qas-2.juntoseguros.com/dashboard
- https://fidelize-qas-2.juntoseguros.com/solicitar

URL STG:

- https://fidelize-stg.juntoseguros.com/dashboard
- https://fidelize-stg.juntoseguros.com/solicitar

URL PRD:

- https://fidelize.juntoseguros.com/dashboard
- https://fidelize.juntoseguros.com/solicitar

## Serviços externos usado neste projeto

- [fidelize-bff](https://github.com/GitJMSeguradora/fidelize-bff/)

- [ms-plataforma-bff](https://github.com/GitJMSeguradora/ms-plataforma-bff)

## Comandos úteis

yarn start:fidelize -> Inicia o projeto que contém este módulo

### Rodando testes

default -> `yarn test fidelize-dashboard`

coverage -> `yarn test fidelize-dashboard --codeCoverage` ou `yarn test fidelize-dashboard --collectCoverage=true`

watch -> `yarn test fidelize-dashboard --watch`
