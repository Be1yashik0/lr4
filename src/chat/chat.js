const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('Новый пользователь подключился');

  ws.on('message', (message) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log('Пользователь отключился');
  });
});

console.log('WebSocket сервер запущен на ws://localhost:8081');

