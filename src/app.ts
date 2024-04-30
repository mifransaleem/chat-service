import "reflect-metadata";
import express, { Request, Response } from "express";
import * as http from "http";
import { Server } from "socket.io";
import cors from "cors";
import errHandlingMiddleware from "./middlewares/error.middleware";
import { config } from "dotenv";
import chatServiceRouter from "./routes/index.route";
import * as jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors/unauthorized.error";
import { createChatOrSaveMessage, saveNewMessage } from "./services/chat/chat.service";


config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Chat Service is running!");
});

app.use("/api", chatServiceRouter);

app.use(errHandlingMiddleware);

// Create HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the server instance
const io = new Server(server);

io.use((socket: any, next) => {
  const token = socket.handshake.query.token as string;
  if (!token) {
    return next(new UnauthorizedError('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new UnauthorizedError('Authentication error: Token expired'));
      } else {
        return next(new UnauthorizedError('Authentication error: Invalid Token'));
      }
    }
    socket.userId = decoded.userId;  // Store decoded information in socket for future use
    next();
  });
});

// WebSocket logic for real-time chat
io.on("connection", (socket: any) => {
  console.log('A user connected', socket.id);

  socket.on("setup", () => {
    socket.join(socket.userId.toString());
    socket.emit("connected", `${socket.userId} connected`);
  });

  /*
  msgData = {
    "message": {
      "content": "Hello, this is a test message!",
      "fileUrl": "",
      "messageType": "text"
      },
    "chatMembers": [2, 3]
  }
  */
  socket.on("newFirstMessage", async (msgData) => {
    // TODO: add check here if the msg is of right format and emit an error event if not

    msgData = JSON.parse(msgData);
    console.log('Message received:', msgData);

    // create a new chat with these chat members and save this message
    // connect both users to this chat and broadcast message
    const chatData = await createChatOrSaveMessage(socket.userId, msgData);

    const dataToSend = {
      chatId: chatData.id,
      message: msgData.message,
      senderId: socket.userId
    }

    const userIdsToSendReceiveMessageEvent = msgData.chatMembers.filter((userId: number) => userId !== socket.userId);
    userIdsToSendReceiveMessageEvent.forEach(userId => {
      io.to(userId.toString()).emit("receiveMessage", dataToSend);
    });

    io.to(socket.userId.toString()).emit("chatCreated", dataToSend);
  });

  /*
  msgData = {
    "message": {
      "content": "Hello, this is a test message!",
      "fileUrl": "",
      "messageType": "text"
      },
    "chatId": 3
  }
  */
  socket.on("newMessage", async (msgData) => {
    // TODO: add check here if the msg is of right format and emit an error event if not

    msgData = JSON.parse(msgData);
    console.log('Message received:', msgData);

    // create a new chat with these chat members and save this message
    // connect both users to this chat and broadcast message
    const chatData = await saveNewMessage(socket.userId, msgData);

    const dataToSend = {
      chatId: chatData.id,
      message: msgData.message,
      senderId: socket.userId
    }

    const userIdsToSendReceiveMessageEvent = chatData.members
      .filter(member => member.userId !== socket.userId)
      .map(member => member.userId);
    userIdsToSendReceiveMessageEvent.forEach(userId => {
      io.to(userId.toString()).emit("receiveMessage", dataToSend);
    });

    io.to(socket.userId.toString()).emit("messageSent", dataToSend);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.userId}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
