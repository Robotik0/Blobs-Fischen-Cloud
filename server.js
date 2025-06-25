const WebSocket = require('ws');
const PORT = 53158;

let rekordValue = "0"; // Default starting value

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`Cloud server running on port ${PORT}`);
});

wss.on('connection', (ws) => {
  console.log("New client connected.");

  // Send current value to new client
  ws.send(`0\nRekord ($)\n${rekordValue}`);

  ws.on('message', (msg) => {
    const [prefix, name, value] = msg.toString().split("\n");

    if (name === "Rekord ($)") {
      rekordValue = value;

      // Broadcast new value to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(`0\nRekord ($)\n${rekordValue}`);
        }
      });

      console.log(`Updated Rekord ($): ${rekordValue}`);
    }
  });

  ws.on('close', () => {
    console.log("Client disconnected.");
  });
});
