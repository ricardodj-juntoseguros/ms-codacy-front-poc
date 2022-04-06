# platform-web

## Qualitys Gate

[![Maintainability](https://api.codeclimate.com/v1/badges/d27b34f14ad50da533ba/maintainability)](https://codeclimate.com/repos/60d5ff1714905d4c260012f8/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/d27b34f14ad50da533ba/test_coverage)](https://codeclimate.com/repos/60d5ff1714905d4c260012f8/test_coverage) [![CircleCI](https://circleci.com/gh/GitJMSeguradora/JuntoSeguros.Library.svg?style=svg&circle-token=acedae51865c9abfed87fa884cb8ec62b1ace486)](https://circleci.com/gh/GitJMSeguradora/platform-web)

## Descrição
Repositório em formato monorepo para as aplicações React front-end seguindo o novo padrão de arquitetura de micro-frontends, tendo como referência o [Guideline FrontEnd](https://github.com/GitJMSeguradora/guidelines/tree/master/frontend)

O repositório conta atualmente com 3 aplicações: 
- Fidelize 
- Plataforma (corretor)
- Digital

Obs: Apenas o app Fidelize possui a esteira de pipeline completa até o momento dessa atualização (16 de março de 2022).

Esse projeto foi criado utilizando Nx. Para saber mais sobre a biblioteca, clique no link a seguir.(https://nx.dev)

## Monorepo Nx - divisões

Este repositório é dividido em 3 principais partes:

- Apps
  - São as pastas das aplicações / plataformas que compõem o repositório. São compostas de uma aplicação react, podendo manter store do redux propria e de várias rotas, cada uma apontando para um module (micro-frontend) distinto.
- Modules (micro-frontends)
  - São pequenas aplicações react com escopo próprio e fechado, focando em uma ou poucas features. Os modules devem ser como uma "caixa preta", importados apenas dentro dos apps, não podendo haver interdependência entre os modules ou dependência de apps dentro de um module.
  - Os micro-frontends possuem 3 camadas de código (presentational, application e config)
    - Presentational: componentes react embutidos e componentes containers (páginas).
    - Config: Arquivos de configuração do micro-frontend, como redux store, rotas, etc.
    - Application: armazena a lógica interna do module, possui arquivos de chamadas de API, Redux Thunks e Redux Slices, tipos de dados (dtos e models).
- Libs
  - As libs são pequenos pacotes de código de responsabilidade única, com o intuito de serem reutilizáveis em todos os modules e apps. Ex: hooks, http client, componentes ui compartilhados.

---

## Tecnologias usadas no Projeto

- TypeScript

- React JS

- Sass (SCSS)

- Redux e Redux-Toolkit

- Nx

- Webpack

- Jest (testes unitários)

- Cypress (e2e)

---

## Ambientes

- App Fidelize 

URL QAS: https://fidelize-qas-2.juntoseguros.com/

URL STG: https://fidelize-stg.juntoseguros.com/

URL PRD: https://fidelize2.juntoseguros.com/

---

### Projeto exposto fora da rede da Junto?

Sim

---

## Acesso a banco de Dados?

Não

---

## Serviços externos usado neste projeto

- [fidelize-bff](https://app.circleci.com/pipelines/github/GitJMSeguradora/fidelize-bff)

- [ms-plataforma-bff](https://app.circleci.com/pipelines/github/GitJMSeguradora/ms-plataforma-bff)

---

## Instalação

Após baixar o projeto, instale as dependências com:

`yarn install`

Para facilitar o desenvolvimento, geração de código e manutenção com o Nx, é recomendado instalar a extensão do VSCode
[Nx Console](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)

Essa extensão abstrai os comandos de geração, execução, teste e build do Nx CLI para uma interface gráfica, além de exibir um resumo da sua workspace.

## Preparando os arquivos de ambiente

Para as aplicações funcionarem normalmente, é necessário que os arquivos de ambiente (_`.env`_) estejam propriamente configurados.

Os arquivos de ambiente que o Nx irá usar deverão estar localizados na raiz do projeto e na raiz do app que irá ser executado (./{{nome do app}}/.env).

A criação desses arquivos pode ser manual, realizando a cópia do arquivo do ambiente desejado que estão nas pastas `environments`, mas também há scripts criados para cada app para automatizar esse processo. Vide `package.json`

## Para rodar um app localmente

Para iniciar uma das aplicações na máquina localmente

`yarn nx serve {{nome do app}}`

Este comando compilará todo o código necessário importado no app escolhido (modules e libs), e servirá o app na rede local. A porta padrão do Nx é 4200,
mas se desejar rodar em outra, utilizar o comando como:

`yarn nx serve {{nome do app}} --port XXXX`

Obs: A extensão Nx Console possui uma interface visual para a montagem desse comando.

## Gerando um app

Para gerar uma aplicação no repositório, execute o comando `yarn nx g @nrwl/react:app {{nome do app}}`.

Ao rodar esse comando, poderá haver algumas etapas seguintes em que o console irá perguntar especificações do projeto. As seguintes opções deverão ser selecionadas:

- React Router - yes
- Style: sass/scss

No final, serão criadas 2 pastas, a pasta do app e a pasta do app-e2e, onde estarão localizados os testes end-to-end da aplicação.

**Importante**: Ao criar um app, será necessário criar um arquivo de configuração do webpack (webpack.config.js) para o mesmo. Para isso, utilizar como referência um arquivo já pronto de outro app, alterando as nomenclaturas necessárias.

Obs: A extensão Nx Console possui uma interface visual para a montagem desse comando.

## Gerando uma lib

Para gerar uma lib no repositório, execute o comando `yarn nx g @nrwl/react:lib {{nome da lib}}`.

A lib será gerada por padrão no diretório raiz de `/libs`, caso seja necessário, o diretório da lib pode ser especificado com a opção --directory=MEU_DIRETORIO

Obs: A extensão Nx Console possui uma interface visual para a montagem desse comando.

## Gerando um module / micro-frontend

Para gerar um micro-frontend no repositório, foi criado um gerador customizado do Nx, portanto, execute o comando

`yarn nx workspace-generator micro-frontend-generator --name={{nome do micro-frontend}}`

O micro-frontend será gerado por padrão no diretório `/modules`.

Obs: A extensão Nx Console possui uma interface visual para a montagem desse comando.

## O comando dep-graph

Um comando interessante ao ser utilizado no desenvolvimento com Nx é o dep-graph. Esse comando executa uma aplicação web que disponibiliza uma visualização interativa em grafo das dependências dentro da workspace.

## O comando affected

Uma modificação nos comandos muito útil no gerenciamento da workspace Nx são os comandos utilizando **affected**.

O prefixo `affected:` pode ser colocado em qualquer comando (com exceção do serve) para executá-lo em todos os projetos (libs, apps e modules) que foram afetados por alterações, ou seja, se foi realizado uma alteração na lib B e esta lib é utilizada apenas no app A, se o desenvolvedor executar `yarn nx affected:build`, apenas o app A e a lib B sofrerão com a build, ao inves de toda a workspace, facilitando o controle e a performance de alterações.

---

## Rodando testes unitários

Para rodar os testes de um projeto via [Jest](https://jestjs.io), executar o comando `yarn nx test {{nome do app/lib/module}}`.

Os testes unitários podem ser executados em qualquer um dos escopos do projeto (lib, module, app), basta apenas colocar o nome da pasta e o Nx saberá o que rodar.

**Importante**: Ao rodar os testes de um app, o teste poderá incluir as libs e módulos nas quais o app possui dependências com a opção `--with-deps`

Outro comando útil é o `yarn nx affected:test` que executa todos os testes de projetos que foram afetados por alguma alteração na workspace, por exemplo, mudança de código em uma lib ou módule

---

## Rodando testes end-to-end

### Fidelize

Os testes end-to-end são executados via Cypress, uma biblioteca de desenvolvimento de testes E2E em Node. A biblioteca utiliza por padrão o Chrome para a execução dos testes, e os drivers do mesmo será instalado juntamente com o pacote do Cypress, sem necessidade de configuração externa.

A execução dos testes end-to-end do projeto Fidelize é feita através do comando `yarn nx run fidelize-e2e:test:dev`. Os testes executarão em ambiente de desenvolvimento, e o próprio comando irá subir a aplicação.

O comando aceita a flag `--headless`, que modificará a execução dos testes para que seja feita sem a interface gráfica do Cypress.

---

## Rodando o Lint

Para rodar o linter de algum projeto execute o comando `yarn nx lint {{nome do app/lib/module}}`.

A execução do linter pode ter realizada em qualquer um dos escopos do projeto (lib, module, app), basta apenas colocar o nome da pasta e o Nx saberá o que rodar.

Esse comando também pode ser executado com affected: `yarn nx affected:lint`.

---

## Build

A geração de builds pode acontecer de três formas:

- Build de toda a workspace: `yarn nx build`
- Build de um app específico: `yarn nx build {{nome do app}}`
- Build de todos os apps afetados por alterações: `yarn nx affected:build`

Quando o processo de build for buildar um app, o Nx irá por meio do grafo de dependências, realizar também a build de todos os modules e libs utilizados neste app, portanto não é possível realizar a build de modules e libs.

Depois da finalização do processo, os artefatos da build estarão disponíveis na pasta `dist/`, separados por app.
