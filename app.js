const express = require("express");
const Generator = require("do-usernames");
const app = express();

//for avataars
const  { createAvatar } = require('@dicebear/avatars');
const avatarStyle = require('@dicebear/big-smile');
// set the view engine to ejs
app.set('view engine', 'ejs');



app.use(express.static("public"));

var http = require("http").Server(app);

var io = require("socket.io")(http);
const port = process.env.PORT || 3001;


const generateAvatarSvg=(seed)=>{
  return createAvatar(avatarStyle, {
    seed: seed.trim()
  });
}
app.get("/", (req, res) => {
  const myGenerator = new Generator({
    size: 15,
  });
  let username=myGenerator.getName()


  let userProfileSvg = generateAvatarSvg(username)


  
  res.render("index",{username,userProfileSvg})
});

const getRoomClientsNumber = (roomCode) => {
  if (io.sockets.adapter.rooms.get("room-" + roomCode)) {
    return io.sockets.adapter.rooms.get("room-" + roomCode).size;
  }
  return 0;
};
//Whenever someone connects this gets executed
io.on("connection", function (socket) {
  socket.on("joinRoom", ({ roomCode, username }) => {
    let userX_O;

    if (getRoomClientsNumber(roomCode) == 0) {
      userX_O = 0;
    } else {
      userX_O = 1;
    }

    if (getRoomClientsNumber(roomCode) < 2) {
      socket.join("room-" + roomCode);
      socket.roomCode = roomCode;
      socket.to("room-" + roomCode).emit("opponentJoined", {
        message: "new player joined in room no. " + roomCode,
        opponentUsername: username,
        opponentAvatarSvg:generateAvatarSvg(username)

      });

      socket.emit("joinedRoom", {
        message: "You have joined the room " + roomCode,
        X_O: userX_O,
        roomCode: roomCode,
      });
    } else {
      socket.emit("roomFull", { roomCode });
    }
  });

  socket.on("playerMoved", (data) => {
    socket
      .to("room-" + data.roomCode)
      .emit("opponentMoved", { place: data.place });
  });

  socket.on("playerWon", () => {
    socket.to("room-"+socket.roomCode)
      
      .emit("opponentWon", {});
  });

  socket.on("draw", ({ roomCode }) => {
    io.sockets
      .in("room-" + roomCode)
      .emit("matchDraw", { message: "Match Draw!!!" });
  });

  socket.on("playerIsReady",()=>{socket.to("room-"+socket.roomCode).emit("opponentIsReady")})
  socket.on("playerUsername", ({ username }) => {
    socket.to("room-" + socket.roomCode).emit("opponentUsername", { username:username,opponentAvatarSvg:generateAvatarSvg(username) });
  });
  socket.on("changedPlayerUsername", ({ username }) => {
    socket
      .to("room-" + socket.roomCode)
      .emit("changedOpponentUsername", { username ,opponentAvatarSvg: generateAvatarSvg(username)});
  });

  socket.on("leaveRoom", ({ roomCode }) => {
    socket.leave("room-" + roomCode);
    socket.emit("leftRoom");
    socket.to("room-" + roomCode).emit("opponentLeft");
    socket.roomCode=undefined
  });

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
    socket.to("room-" + socket.roomCode).emit("opponentLeft");
  });
});
http.listen(port, function () {
  console.log("listening on ", port);
});
