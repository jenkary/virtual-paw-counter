const express = require('express');
const app = express();
const http = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server: http });

let count = 0;

app.use(express.static('public'));

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'count', count }));

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    if (data.type === 'boop') {
      count++;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'count', count }));
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`wet cat has connected! listening on http://localhost:${PORT}`);
});
