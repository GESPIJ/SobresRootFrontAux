import { io } from "socket.io-client";

const getSocket = () => {
  const socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("El cliente se conecto bien al servidor");
    console.log(socket);
  });
  return socket;
};

export default getSocket();
