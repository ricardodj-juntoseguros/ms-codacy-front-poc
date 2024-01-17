# App Fidelize

## Descrição

Aplicação front-end do projeto Fidelize.

### Como acessar

Disponível por meio da plataforma do corretor. É possível fazer o login com o mesmo acesso do corretor.

### Módulos:

- [Fidelize Dashboard](https://github.com/GitJMSeguradora/platform-web/tree/master/modules/fidelize-dashboard)

## Ambientes

URL QAs: https://fidelize-qas-2.juntoseguros.com

URL STG: https://fidelize-stg.juntoseguros.com

URL PRD: https://fidelize.juntoseguros.com/

## Comandos úteis

### Executar o server de desenvolvimento

- Observação: fazer as alterações caso necessárias nos arquivos .env antes de executar localmente.

`yarn start:fidelize`

ou

`yarn start:fidelize:{{SQUAD NUMBER}}`

---

### Rodando testes

default -> `yarn test fidelize`

coverage -> `yarn test fidelize --codeCoverage` ou `yarn test fidelize --collectCoverage=true`

watch -> `yarn test fidelize --watch`
