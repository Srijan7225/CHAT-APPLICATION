# CHAT-APPLICATION

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: SRIJAN SHAKYA

*INTERN ID*: CT08DZ2454

*DOMAIN*: FULL STACK DEVELOPMENT

*DURATION*: 4 WEEKS

*MENTOR*: NEELA SANTOSH

*DESCRIPTION*:

Real-Time Chat App with Socket.IO
The project contains a real-time chat website where people can join rooms and send messages instantly.
Messages appear right away without refreshing the page.

Technologies used:
1. Node.js + Express → Backend server to handle requests and serve files.
2. Socket.IO → Enables real-time, two-way communication between browser and server.
3. HTML, CSS, JavaScript → Frontend (chat interface).

How it works:

1. Backend (server.js)
*Starts an Express server and attaches Socket.IO.
*Listens for users joining rooms, sending messages, or typing.
*Broadcasts messages to everyone in the same room.

2. Frontend (HTML, CSS, JS)
*Has a simple interface with fields for username, room name, and chat area.
*Uses socket.emit() to send messages or events (like “typing”).
*Displays incoming messages and system updates in real-time.

Running locally:
1. Install dependencies with npm install.
2. Start the app using npm run dev.
3. Open http://localhost:3000 in two tabs → you can chat between them instantly.

#OUTPUT

