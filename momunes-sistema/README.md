# MOMUNES - Sistema Web Completo

**Movimento de Mulheres Negras de Sorocaba**

Sistema web MVP composto por site público institucional e painel administrativo, desenvolvido para o MOMUNES — organização afro-brasileira fundada em 1997 em Sorocaba-SP.

---

## Estrutura do Projeto

Este repositório contém **um único sistema web** com duas interfaces:

### Site Público (`/`)
- Página inicial com apresentação do MOMUNES e suas frentes de atuação
- Listagem de eventos e atividades abertas para inscrição
- Formulário de inscrição online com confirmação

### Painel Administrativo (`/admin`)
- Dashboard com métricas (participantes, eventos ativos, inscrições recentes)
- Gestão de participantes (cadastro, busca, edição)
- Gestão de eventos (criar, editar, encerrar, visualizar inscritos)
- Gestão de projetos (cadastro e acompanhamento por frente de atuação)
- Exportação de relatórios em CSV para prestação de contas
- Notificação ao administrador em nova inscrição

---

## Frentes de Atuação

- **Acolhimento** — Casa de Acolhimento Recomeçar
- **Educação** — Creches com foco afro-brasileiro
- **Empoderamento** — Projetos de igualdade de gênero e raça
- **Atuação Política** — Monitoramento de políticas públicas

---

## Tecnologias

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Express + tRPC 11
- **Banco de dados:** MySQL (Drizzle ORM)
- **Autenticação:** Manus OAuth
- **Testes:** Vitest

---

## Identidade Visual

Design afro-brasileiro com paleta em tons terrosos (ocre, marrom escuro, dourado), tipografia Playfair Display + Lato, e elementos visuais que refletem a cultura e os valores do MOMUNES.

---

## Como Executar

```bash
# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

---

*Desenvolvido para o MOMUNES — Sorocaba, SP, 2026*
