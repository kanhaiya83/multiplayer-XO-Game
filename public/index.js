let roomCode = null;
let X_O = null;
let yourTurn = false;
const boardContainer = document.querySelector(".board-container");
const leaveBtn = document.querySelector(".leave-room-btn");

const inputContainer= document.querySelector(".input-container");

const createRoomBtn = document.querySelector(".create-room-btn");
const joinRoomBtn = document.querySelector(".join-room-btn");
const roomCodeInput = document.querySelector(".room-code-input");

const roomNumberContainer=document.querySelector(".room-number")

const frames = document.querySelectorAll(".frame");
const frame0 = frames[0];
const frame1 = frames[1];
const frame2 = frames[2];
const frame3 = frames[3];
const frame4 = frames[4];
const frame5 = frames[5];
const frame6 = frames[6];
const frame7 = frames[7];
const frame8 = frames[8];

const showXorO = (frame, xOro) => {
  frame.children[0].children[xOro].classList.add("show");
  frame.classList.add(xOro);
};

//check for combination in straight lines
const straightLinesCheck = (xo) => {
  const temp =
    (frame0.classList.contains(xo) &&
      frame1.classList.contains(xo) &&
      frame2.classList.contains(xo)) ||
    (frame3.classList.contains(xo) &&
      frame4.classList.contains(xo) &&
      frame5.classList.contains(xo)) ||
    (frame6.classList.contains(xo) &&
      frame7.classList.contains(xo) &&
      frame8.classList.contains(xo)) ||
    (frame0.classList.contains(xo) &&
      frame3.classList.contains(xo) &&
      frame6.classList.contains(xo)) ||
    (frame1.classList.contains(xo) &&
      frame4.classList.contains(xo) &&
      frame7.classList.contains(xo)) ||
    (frame2.classList.contains(xo) &&
      frame5.classList.contains(xo) &&
      frame8.classList.contains(xo));

  return temp;
};
//check for combination in diagonal lines

const DiagonalLinesCheck = (xo) => {
  const temp =
    (frame0.classList.contains(xo) &&
      frame4.classList.contains(xo) &&
      frame8.classList.contains(xo)) ||
    (frame2.classList.contains(xo) &&
      frame4.classList.contains(xo) &&
      frame6.classList.contains(xo));

  return temp;
};
//check both straight and diagonal combination for both X and O
const checkForWin = () => {
  if (straightLinesCheck("0") || DiagonalLinesCheck("0")) {
    socket.emit("x_wins", { roomCode });
  } else if (straightLinesCheck("1") || DiagonalLinesCheck("1")) {
    socket.emit("o_wins", { roomCode });
  } else {
    checkForDraw();
  }
};
//check for draw
const checkForDraw = () => {
  let isDraw = true;
  frames.forEach((f) => {
    if (!(f.classList.contains("0") || f.classList.contains("1"))) {
      isDraw = false;
    }
  });
  console.log(isDraw);
  if (isDraw) {
    socket.emit("draw", { roomCode });
  }
};
//leave the room
const leaveRoom = () => {
  socket.emit("leaveRoom", { roomCode });

  socket.on("leftRoom", () => {
    //hide board
    boardContainer.classList.add("d-none");
    //show input
    inputContainer.classList.remove("d-none");
  });
};
//reset everything
const resetGame = () => {
 frames.forEach((frame)=>{
  frame.children[0].children[0].classList.remove("show");
  frame.children[0].children[1].classList.remove("show");
  frame.classList.remove("0")
  frame.classList.remove("1")
 })

  console.log({yourTurn})
  if(X_O=="1"){
    yourTurn=true
  }

};
//adding event listeners
frames.forEach((f) => {
  f.addEventListener("click", () => {
    if (!f.classList.contains(0) && !f.classList.contains(1) && yourTurn) {
      //emit to server that player has moved
      socket.emit("playerMoved", {
        place: f.dataset.serial,
        roomCode: roomCode,
      });
      //show the move on the board
      showXorO(f, X_O);
      yourTurn = false;
      checkForWin();
    }
  });
});
//leave button event listener
leaveBtn.addEventListener("click", () => {
  leaveRoom();
  resetGame();
});
//when player successfully joins the room
socket.on("joinedRoom", (m) => {
  //hide the room input
  inputContainer.classList.add("d-none");
  //show the gameboard
  boardContainer.classList.remove("d-none");
  //display the room code
  roomNumberContainer.innerHTML="Room:"+m.roomCode
  //initialize roomcode and xORo
  roomCode = m.roomCode;
  X_O = m.X_O;
  if (X_O == "1") {
    yourTurn = true;
  }
});

//when another player joins your room
socket.on("newPlayerJoinedRoom", (m) => {
  console.log(m);
});

//when opponent make a move
socket.on("opponentMoved", (m) => {
  showXorO(frames[m.place - 1], X_O == 1 ? 0 : 1);
  yourTurn = true;
});

//when someone wins
socket.on("gameFinished", ({ message }) => {
  alert(message);
  resetGame()
});

//when math is draw
socket.on("matchDraw", ({ message }) => {
  alert(message);
  resetGame()
});

joinRoomBtn.addEventListener("click", () => {
  socket.emit("joinRoom", {
    roomCode: roomCodeInput.value,
  });
});

createRoomBtn.addEventListener("click",()=>{
  const randomRoomNumber=Math.floor(Math.random() * 9000) +  1000
  socket.emit("joinRoom", {
    roomCode: randomRoomNumber,
  });
})