# LGD — LetsGetDrunk

Aplicativo móvel desenvolvido em **React Native**, **Expo Router** e **TypeScript** para consulta de receitas de coquetéis, 
descoberta de bebidas a partir de ingredientes disponíveis e gerenciamento de favoritos com persistência local, utilizando a **TheCocktailDB API**.

---

## Informações Acadêmicas

* **Aluno:** Lucas Silva Mattos Vieira
* **Disciplina / Período:** Desenvolvimento Móvel / 6º Período
* **Professor:** Victor Vidigal

---

## 1. Visão Geral

O **LGD — LetsGetDrunk** é uma aplicação mobile voltada para Android e iOS que atua como um assistente interativo de coquetelaria. 
A proposta do projeto é permitir que o usuário explore receitas de drinks, identifique opções preparáveis com os itens disponíveis em 
seu bar doméstico, salve receitas de interesse sem necessidade de login ou servidor próprio e visualize instruções completas de preparo.

---

## 2. Escopo e Funcionalidades

### Navegação e Telas da Aplicação

* **Início / Explorar (app/index.tsx e app/(drinks)/index.tsx):** apresentação inicial e catálogo com 30 coquetéis clássicos carregados via API, com acesso à tela de detalhes e ação rápida de favoritar.
* **Detalhes do Drink (app/(drinks)/[id].tsx):** rota dinâmica que exibe fotografia, categoria, teor alcoólico, lista de ingredientes com medidas e modo de preparo completo do drink selecionado.
* **Meu Bar (app/meu-bar.tsx):** seleção de ingredientes disponíveis para consultar coquetéis compatíveis e navegar até as respectivas receitas.
* **Roleta Russa (app/roleta-russa.tsx):** sorteio de até três drinks aleatórios sem repetição na rodada, com animação visual e exibição direta das receitas sorteadas.
* **Favoritos (app/favoritos.tsx):** listagem em grade dos coquetéis salvos pelo usuário, com remoção rápida e estado vazio orientado para exploração.
* **Compras (app/compras.tsx) e Sobre (app/sobre.tsx):** telas complementares de apoio ao fluxo do usuário e informações do aplicativo.

### Integração com a TheCocktailDB API
* **Busca por nome:** https://www.thecocktaildb.com/api/json/v1/1/search.php?s={nome}
* **Filtro por ingrediente:** https://www.thecocktaildb.com/api/json/v1/1/filter.php?i={ingrediente}
* **Consulta de detalhes por ID:** https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i={id}
* **Sorteio de coquetel aleatório:** https://www.thecocktaildb.com/api/json/v1/1/random.php

### Persistência Local
Gerenciamento de estado e persistência no dispositivo por meio de contexto React (context/FavoriteContext.tsx) e armazenamento local, 
permitindo favoritar e remover drinks sem autenticação externa.

### Observação de Escopo (Tradução / Mapeamento)
O mapeamento local de tradução de ingredientes e categorias para o português não foi implementado nesta versão do trabalho, 
mantendo os termos originais retornados pela TheCocktailDB API.

## 3. Arquitetura e Estrutura de Pastas

lgd/
├── app/
│   ├── (drinks)/
│   │   ├── _layout.tsx       # Layout em pilha (Stack) do grupo de drinks
│   │   ├── index.tsx         # Catálogo de drinks clássicos
│   │   └── [id].tsx          # Rota dinâmica de detalhes da receita
│   ├── _layout.tsx           # Layout raiz da navegação com Expo Router
│   ├── compras.tsx           # Tela de lista de compras
│   ├── favoritos.tsx         # Tela de drinks favoritados
│   ├── index.tsx             # Tela inicial da aplicação
│   ├── meu-bar.tsx           # Tela de filtro por ingredientes disponíveis
│   ├── roleta-russa.tsx      # Tela de sorteio aleatório de drinks
│   └── sobre.tsx             # Tela institucional e informações do projeto
├── assets/                   # Recursos gráficos e imagens estáticas
├── context/
│   └── FavoriteContext.tsx   # Estado global e persistência de favoritos
├── app.json                  # Configurações do projeto Expo
├── index.ts                  # Ponto de entrada da aplicação
├── package.json              # Dependências e scripts do projeto
└── tsconfig.json             # Configurações do TypeScript
