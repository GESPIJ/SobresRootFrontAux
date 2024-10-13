import { io } from "socket.io-client";

const getSocket = () => {
  const socket = io("http://localhost:4000");
  console.log("Im inside get socket, gonna call the on connection method")
  socket.on("connect", () => {
    console.log("This is the socket that is being printed", socket);
  });
  return socket;
};

const buildSocketMessage =  (socket, event, parameter) => {

  let message;
  const { nm, system, expirationTime } = parameter || {}; 
  switch (event) {
    case "newRootEnvelope":
      message = `Acaba de ser procesada una nueva solicitud de sobre root por parte del usuario con  parameter.nm ${nm} para el sistema de nombre
          ${system}. Hora estimada de finalización de la solicitud: ${expirationTime}.`
      break;
    case "rootEnvelopeAboutToEnd":
     message = `La solicitud de sobres root activa por el operador ${nm} sobre el sistema de nombre ${system} 
          esta proxima a terminar. Hora estimada de finalización de la solicitud: ${expirationTime}.` 
      break;
    case "rootEnvelopeEnded":
      message = `La solicitud de sobres root activa por el operador ${nm} sobre el sistema de nombre ${system} ha finalizado`;
      break;
    default: 
      message = "";
      break;
  }
  return message;
}



export { buildSocketMessage, getSocket };
//export default getSocket;
