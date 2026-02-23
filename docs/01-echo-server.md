# Exercice 1 - Echo server + client browser

## Objectif
Creer un serveur WebSocket echo et se connecter depuis le navigateur.

## Walkthrough
1. Importer `WebSocketServer` depuis `ws`.
2. Creer un `new WebSocketServer({ port: 8080 })`.
3. Ecouter l'evenement `'connection'` sur le serveur.
4. Dans le callback, ecouter `'message'` sur le socket.
5. Renvoyer le message tel quel avec `ws.send(message.toString())` (echo).
6. Logger les connexions et deconnexions (`'close'`).
7. Creer un fichier `client/index.html` avec un `new WebSocket('ws://localhost:8080')`.
8. Ouvrir le HTML dans le navigateur, envoyer un message depuis la console :
   ```js
   ws.send("Hello WebSocket!")
   ```
9. Verifier que le message revient identique.

## Checkpoints
- Le serveur demarre sur le port 8080 sans erreur.
- Un message envoye depuis le browser revient identique dans `onmessage`.
- Les connexions et deconnexions sont loggees cote serveur.

## Aide
- Verifier que le port 8080 n'est pas deja utilise (`lsof -i :8080`).
- `message` est un `Buffer` cote Node.js, utiliser `.toString()` avant de renvoyer.
- Dans la console du browser : `const ws = new WebSocket('ws://localhost:8080')` puis `ws.onmessage = e => console.log(e.data)`.
