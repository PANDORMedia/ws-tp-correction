# Exercice 3 - Protocole type + UI React

## Objectif
Structurer les messages avec des types TypeScript et creer une UI React.

## Walkthrough
1. Creer un fichier `shared/types.ts` avec des discriminated unions :
   ```ts
   // Messages envoyes par le client
   type ClientMessage =
     | { type: 'set-nick'; nick: string }
     | { type: 'chat'; text: string }
     | { type: 'typing' }

   // Messages envoyes par le serveur
   type ServerMessage =
     | { type: 'chat'; nick: string; text: string; ts: number }
     | { type: 'system'; text: string }
     | { type: 'user-list'; users: string[] }
     | { type: 'typing'; nick: string }
   ```
2. Refactoriser le serveur pour parser le JSON entrant et switcher sur `message.type`.
3. Creer l'app React avec Vite : `npm create vite@latest client -- --template react-ts`.
4. Creer le composant `App` avec :
   - Un input texte + bouton "Envoyer".
   - Une liste de messages scrollable.
   - Un indicateur de connexion (connecte/deconnecte).
5. Utiliser `useEffect` pour creer la connexion WebSocket au mount.
6. Afficher les messages avec un rendu different pour `'chat'` vs `'system'`.

## Checkpoints
- Les messages s'affichent dans l'UI React.
- Le type de chaque message est valide cote serveur (JSON.parse + switch).
- La liste des users se met a jour quand quelqu'un rejoint ou quitte.

## Aide
- `JSON.parse` peut throw : toujours wrapper dans un `try/catch`.
- Pour le typing indicator, utiliser un debounce de 300ms cote client.
- Stocker les messages dans un `useState<ServerMessage[]>([])`.
- Ne pas oublier le cleanup dans `useEffect` : `return () => ws.close()`.
