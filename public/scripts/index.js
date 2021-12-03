const playWithFriendBtn = document.querySelector("button.play-with-friend");
const playOfflineBtn = document.querySelector("button.play-offline");
const playWithBotBtn = document.querySelector("button.play-with-bot");
const popupBackdrop = document.querySelector(".popup-bg");
const popupContainer = document.querySelector(".popup-container");
const popupCloseBtn = document.querySelector(".popup-close-btn");

const showPopup = (show = true) => {
  if (show) {
    popupBackdrop.classList.add("show");
    popupContainer.classList.add("show");
  } else {
    popupBackdrop.classList.remove("show");
    popupContainer.classList.remove("show");
  }
};
popupCloseBtn.addEventListener("click",()=>{
  showPopup(false)
})
playWithFriendBtn.addEventListener("click", () => {
  showPopup(true);
});

playOfflineBtn.addEventListener("click", () => {
  console.log("object");
});

playWithBotBtn.addEventListener("click", () => {
  console.log("object");
});

let roomCode = null;
let X_O = null;
let yourTurn = false;
let opponentIsReady = false;
const boardContainer = document.querySelector(".board-container");
const leaveBtn = document.querySelector(".leave-room-btn");

const buttonsWrapper = document.querySelector(".buttons-wrapper");

const createRoomBtn = document.querySelector(".create-room-btn");
const joinRoomBtn = document.querySelector(".join-room-btn");
const roomCodeInput = document.querySelector(".room-code-input");
const inputWarning = document.querySelector(".input-warning");

const roomNumberContainer = document.querySelector(".room-number");

const playerUsername = document.querySelector(".player-details .username span");
const playerIcon = document.querySelector(".player-details .user-icon");

const opponentDetailsContainer = document.querySelector(".opponent-details");
const opponentUsername = document.querySelector(
  ".opponent-details .username span"
);
const opponentIcon = document.querySelector(".opponent-details .user-icon");

const changeBtn = document.querySelector(".change-username");
const changeUsernameContainer = document.querySelector(
  ".change-username-container"
);
const changeUsernameInput = document.querySelector(
  ".change-username-container input"
);
const changeUsernameBtn = document.querySelector(
  ".change-username-container button"
);

const loaderBg = document.querySelector(".loader-bg");

const notificationContainer = document.querySelector(".notification-container");

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

const showLoader = (show) => {
  if (show) {
    loaderBg.classList.remove("d-none");
  } else {
    loaderBg.classList.add("d-none");
  }
};

const showNotification = (message, time = 2000) => {
  document.querySelector(".notification").textContent = message;
  notificationContainer.classList.add("show-notification");
  setTimeout(() => {
    notificationContainer.classList.remove("show-notification");
  }, time);
};

updatePlayer = (username, svg) => {
  playerUsername.innerHTML = username;
  playerIcon.innerHTML = svg;
};

updateOpponent = (username, svg) => {
  opponentUsername.innerHTML = username;

  opponentIcon.innerHTML = svg;
};

const fetchAvatar = async (seed) => {
  const data = await fetch(
    "https://avatars.dicebear.com/api/big-smile/" + seed.trim() + ".svg"
  );
  let svg = await data.text();
  return svg;
};

changeBtn.addEventListener("click", () => {
  changeBtn.classList.add("hide");

  changeUsernameContainer.classList.remove("d-none");
});
changeUsernameBtn.addEventListener("click", async () => {
  showLoader(true);

  let avatarSvg = await fetchAvatar(changeUsernameInput.value);
  updatePlayer(changeUsernameInput.value, avatarSvg);
  //hide input and button
  changeUsernameContainer.classList.add("d-none");
  //show change btn
  changeBtn.classList.remove("hide");
  //emit the username so that it can reflect on the opponent side
  socket.emit("changedPlayerUsername", { username: changeUsernameInput.value });
  showLoader(false);
  showNotification("Username changed!!!", 1000);
});

const showXorO = (frame, xOro) => {
  frame.children[0].children[xOro].classList.add("show");
  frame.classList.add(xOro);
};
//#region win/lose logic
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
    console.log({ X_O });
    if (X_O == "0") {
      socket.emit("playerWon");
      showModal("win");
      opponentIsReady = false;
    }
  } else if (straightLinesCheck("1") || DiagonalLinesCheck("1")) {
    console.log({ X_O });
    if (X_O == "1") {
      socket.emit("playerWon");
      showModal("win");
      opponentIsReady = false;
    }
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
//#endregion win/lose logic

//leave the room
const leaveRoom = () => {
  socket.emit("leaveRoom", { roomCode });

  socket.on("leftRoom", () => {
    //hide board
    boardContainer.classList.add("d-none");
    //show input
    buttonsWrapper.classList.remove("d-none");
    //remove loader
    showLoader(false);
  });
};
//show on screen that it is player's turn to play
const showYourTurn = () => {
  console.log("Your turn!!");
};
//reset game board,remove all moves
const resetGame = () => {
  frames.forEach((frame) => {
    frame.children[0].children[0].classList.remove("show");
    frame.children[0].children[1].classList.remove("show");
    frame.classList.remove("0");
    frame.classList.remove("1");
  });
  //make both players turn to false
  yourTurn = false;
  //then randomly choose which one get to move first
  if (X_O == 1) {
    yourTurn = true;
    showYourTurn();
  }
};
//validateRoomCode
const validateRoomCode = (code) => {
  if (code.length != 4) {
    inputWarning.classList.remove("d-none");
    return false;
  }
  inputWarning.classList.add("d-none");

  return true;
};
//adding event listeners
frames.forEach((f) => {
  f.addEventListener("click", () => {
    if (
      !f.classList.contains(0) &&
      !f.classList.contains(1) &&
      yourTurn &&
      opponentIsReady
    ) {
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
  showLoader(true);
  leaveRoom();
  resetGame();
  opponentDetailsContainer.classList.add("hide");
});
//when player successfully joins the room
socket.on("joinedRoom", (m) => {
  socket.roomCode = m.roomCode;
  //hide the room input
  buttonsWrapper.classList.add("d-none");
  //show the gameboard
  boardContainer.classList.remove("d-none");
  //display the room code
  roomNumberContainer.innerHTML = "Room:" + m.roomCode;
  //show opponent
  opponentDetailsContainer.classList.remove("hide");
  //initialize roomcode and xORo
  roomCode = m.roomCode;
  X_O = m.X_O;
  if (X_O == "1") {
    yourTurn = true;
    showYourTurn();
  }

  //hide loader
  showLoader(false);
});
//when the room is full
socket.on("roomFull", () => {
  showLoader(false);
  showNotification("The room is full!!");
});
//when another player joins your room
socket.on(
  "opponentJoined",
  ({ message, opponentUsername, opponentAvatarSvg }) => {
    resetGame();
    updateOpponent(opponentUsername, opponentAvatarSvg);
    showNotification(opponentUsername + " has joined the game!!");
    socket.emit("playerUsername", {
      username: playerUsername.textContent,
      roomCode: roomCode,
    });
    opponentIsReady = true;
  }
);
socket.on("opponentLeft", () => {
  showNotification("Opponent left!");
  updateOpponent("No opponent", "");
  resetGame();
  X_O = 0;
});
socket.on("opponentUsername", ({ username, opponentAvatarSvg }) => {
  showNotification("You are playing against " + username);
  updateOpponent(username, opponentAvatarSvg);
  opponentIsReady = true;
});
socket.on("changedOpponentUsername", ({ username, opponentAvatarSvg }) => {
  showNotification("Opponent changed username to " + username);
  updateOpponent(username, opponentAvatarSvg);
});
//when opponent make a move
socket.on("opponentMoved", (m) => {
  showXorO(frames[m.place - 1], X_O == 1 ? 0 : 1);
  yourTurn = true;
  showYourTurn();
});

//when someone wins
socket.on("opponentWon", ({ message }) => {
  showModal("lose");
  opponentIsReady = false;
});
//when math is draw
socket.on("matchDraw", ({ message }) => {
  showModal("draw");
  opponentIsReady = false;
});

socket.on("opponentIsReady", () => {
  opponentIsReady = true;
});

joinRoomBtn.addEventListener("click", () => {
  if (validateRoomCode(roomCodeInput.value)) {
    //close input popup
    showPopup(false)
    //start showing loader
    showLoader(true);
    //emit the joinroom request to the given room code
    socket.emit("joinRoom", {
      roomCode: roomCodeInput.value,
      username: playerUsername.textContent,
    });
    //empty the input
    roomCodeInput.value = "";
  }
});

createRoomBtn.addEventListener("click", () => {
  const randomRoomNumber = Math.floor(Math.random() * 9000) + 1000;
  showLoader(true);
  
    //close input popup
    showPopup(false)
  socket.emit("joinRoom", {
    roomCode: randomRoomNumber,
    username: "",
  });
});