# Utilização da estrutura do microfront feita para plataforma unificada

**Data:** 13/12/2021

# Status 

**Proposta** em 13/12/2021 

# Contexto 

- Para o projeto fidelize será necessário ter interface para os corretores visualizarem e solicitarem oportunidades de negócio.

# Decisão

- Foi investido no terceiro TRI de 2021 a construção de uma nova estrutura de frontend para atender a unificação das plataformas dos novos clientes e dos corretores
- O projeto utiliza uma biblioteca que possibilita a construção do projeto com estrutura de monorepo, permitindo criar novos apps e microfrontends facilmente conforme necessidade, além de permitir reutilizar componentes, bibliotecas e lógica de negocio entre as aplicaçoes front, desse modo vemos sentido em criar a plataforma do Fidelize nesta nova estrutura
- A estrutura de microfrontends facilita o encapsulamento e manutenção das plataformas, já que toda a lógica exclusiva de cada funcionalidade ficará contida no seu microfront, reduzindo a complexidade do código

# Consequências

- A estrutura do projeto feita no terceiro TRI de 2021 não contemplou a esteira de pipeline de publicação do projeto bem como os testes
- Vamos demandar de esforço do time de DevOps para implementar e disponibilizar a esteira do pipeline deste projeto nos ambientes QAS/STG/PRD
- Será possível utilizar o login da plataforma dos corretores hoje, uma vez que o cookie de acesso fica no domínio e é acessível a qualquer subdominio (*.juntoseguros.com)
- Necessidade de planejamento e estudo de como vai ficar a estrutura E2E na estrutura do monorepo/microfrontends
- Será utilizado o novo design-system da empresa como padronização do layout
- Alguns componentes não foram migrados para o novo design-system, dependendo de qual será usado terá que ser investido tempo para a migração


