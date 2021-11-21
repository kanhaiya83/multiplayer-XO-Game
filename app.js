const express = require("express");
const app = express();

app.use(express.static("public"));
var http = require("http").Server(app);

var io = require("socket.io")(http);
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.sendFile("index.js");
});
const X_O_object={
  
}
//Whenever someone connects this gets executed
io.on("connection", function (socket) {



    socket.on("joinRoom",(data)=>{
        const roomCode=data.roomCode


        if(typeof(X_O_object[roomCode]) == "undefined"){
            X_O_object[roomCode]=0;
        }
        else{

            X_O_object[roomCode]=1;
        }


        socket.join("room-"+roomCode);

        socket.to("room-"+roomCode).emit('newPlayerJoinedRoom', "new player joined in room no. "+roomCode);


        socket.emit("joinedRoom",{message:"You have joined the room "+roomCode,X_O:X_O_object[roomCode],roomCode:roomCode})
        if (io.sockets.adapter.rooms['room-'+roomCode]) 
{
   // result
   ;
}
        
    })

    socket.on("playerMoved",(data)=>{
        socket.to("room-"+data.roomCode).emit("opponentMoved",{place:data.place});
    })

    socket.on("x_wins",({roomCode})=>{
        io.sockets.in("room-"+roomCode).emit("gameFinished",{message:"X wins the game"})
    })
    socket.on("o_wins",({roomCode})=>{
        io.sockets.in("room-"+roomCode).emit("gameFinished",{message:"O wins the game"})
    })

    socket.on("draw",({roomCode})=>{
        io.sockets.in("room-"+roomCode).emit("matchDraw",{message:"Match Draw!!!"})
    })

    socket.on("leaveRoom",({roomCode})=>{
        socket.leave("room-"+roomCode);
        socket.emit("leftRoom")
    })


  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

http.listen(port, function () {
  console.log("listening on ", port);
});
