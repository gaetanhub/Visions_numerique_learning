# Site web — Vision Numérique (Chapitre 1)

Ce dépôt contient un front-end React + Vite + TypeScript pour la théorie du chapitre 1.

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

## Build production

```bash
npm run build
```

## Note environnement

Dans l’environnement de développement de l’agent, `npm install` échoue avec `403 Forbidden` (registry npm), ce qui bloque la validation locale de `npm run build`.
Le code et la configuration sont prêts pour validation dans un environnement avec accès registry autorisé.
