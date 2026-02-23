# Exercice 0 - Setup monorepo TS + Node

## Objectif
Creer la structure du projet avec TypeScript et Node.js.

## Walkthrough
1. `mkdir ws-workshop && cd ws-workshop`
2. `npm init -y`
3. Creer les dossiers `server/` et `client/`.
4. Dans `server/`, installer les deps : `typescript`, `ts-node`, `@types/node`.
5. Installer `ws` et `@types/ws` dans `server/`.
6. Creer `server/tsconfig.json` avec `strict: true`, `esModuleInterop: true`, `outDir: dist`.
7. Creer `server/src/index.ts` avec un simple `console.log("Server ready")`.
8. Ajouter un script `"dev": "npx ts-node src/index.ts"` dans `server/package.json`.

## Checkpoints
- `npm run dev` dans `server/` demarre sans erreur.
- `tsconfig.json` est en mode strict.
- La structure `server/src/index.ts` existe et compile.

## Aide
- Si erreur ts-node, verifier que typescript est installe globalement ou utiliser `npx`.
- Utiliser `npx tsc --init` pour generer un tsconfig de base, puis activer `strict`.
- Node 18+ recommande.
