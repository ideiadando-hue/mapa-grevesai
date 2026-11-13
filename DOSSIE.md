# Dossiê Técnico — Projeto Mapa de Greves

Documento de contexto do projeto. Use este arquivo no início de qualquer conversa sobre correções ou novas funcionalidades.

## 1. Identificação do projeto

|
 Item 
|
 Valor 
|
|
---
|
---
|
|
 Nome 
|
 mapa-grevesai 
|
|
 Versão 
|
 0.1.0 
|
|
 Repositório 
|
 github.com/ideiadando-hue/mapa-grevesai 
|
|
 Branch principal 
|
 main 
|
|
 Time Vercel 
|
 ideiadando-3952 (plano Hobby) 
|
|
 Domínio público 
|
 mapa-grevesai.vercel.app 
|
|
 Pasta local 
|
 C:\Users\User\mapa-grevesai 
|
|
 Sistema 
|
 Windows (terminal CMD) 
|

## 2. Stack e tecnologias

### Framework e runtime
- Next.js 16.4.6 com App Router e Turbopack
- React 19.3.0 e React DOM 19.3.0
- TypeScript ^5

### Banco de dados
- Prisma ^6.19.3 (ORM) e @prisma/client ^6.19.3
- Neon (Postgres serverless) como banco de produção — mesmo DATABASE_URL em local e produção

### Estilo
- Tailwind CSS 4.3.3
- @tailwindcss/turbopack 4.3.3 (dev)
- @tailwindcss/postcss (dev, adicionado para corrigir o build da Vercel)
- postcss.config.mjs na raiz do projeto

### Mapa
- Leaflet ^1.9.4
- react-leaflet ^5.0.0
- @types/leaflet ^1.9.22

### IA
- @anthropic-ai/sdk ^1.8.0 — usado na extração de greves a partir de texto de notícias

### Qualidade
- ESLint ^9 com eslint-config-next 16.4.6

### Deploy
- Vercel, deploy automático a cada git push na branch main

## 3. Estrutura de arquivos conhecida
