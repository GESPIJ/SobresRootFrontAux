import { io } from "socket.io-client";

const getSocket = () => {
  const socket = io("http://localhost:4000");

  socket.on("connect", () => {});
  return socket;
};

export default getSocket();
