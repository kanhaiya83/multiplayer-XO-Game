// var socket = io("https://xo404.herokuapp.com");
socket = io("localhost:4000");
console.log({ socket });

playWithFriendBtn.addEventListener("click", () => {
  showRoomPopup(true);
  gameMode = "online";
  game = {
    playerSide: "x", //value either x or o
    yourTurn: false, //boolean
    opponentIsReady: false, //boolean
  };
});

playOfflineBtn.addEventListener("click", () => {
  showLoader(true);
  (gameMode = "offline"),
    (game = {
      whoseTurn: "x", //x or o
      player1: "x",
      player2: "o",
    });
  //randomly assign the turn
  game.whoseTurn = randomizeOfflineTurn();
  //show the board
  showGameBoard();
  //show whose turn is this
  showWhoseTurnMessage(game.whoseTurn);
  //show xo icons

  changeXoIcon("o");
  updateOpponent(generateRandomUsername())
  showOpponentProfile()
  showLoader(false);
});
playWithBotBtn.addEventListener("click", () => {
  showLoader(true);
  gameMode = "bot";

  game = {
    playerSide: "",
    moves: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    isPlayerTurn: false,
  };
  game.playerSide = randomizeOfflineTurn();
  game.isPlayerTurn = true;
  //clears moves on board just in case
  clearBoard();

  showGameBoard();

  showWhoseTurnMessage("player");

  changeXoIcon(game.playerSide);
  
  updateOpponent("Mr. Bot");
  showOpponentProfile()


  showLoader(false);
});

function calculateAMove() {
  let availableMoves = [];
  game.moves.forEach((e, i) => {
    if (e == 1) {
    } else {
      availableMoves.push(i);
    }
  });
  if (availableMoves.length == 0) {
    return -1;
  }
  let rand = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[rand];
}

function randomizeOfflineTurn() {
  if (Math.random() > 0.5) {
    return "x";
  } else {
    return "o";
  }
}
function showGameBoard() {
  //show board
  boardContainer.classList.remove("d-none");
  //hide input
  buttonsWrapper.classList.add("d-none");
}

function hideGameBoard() {
  //hide board
  boardContainer.classList.add("d-none");
  //show input
  buttonsWrapper.classList.remove("d-none");
}
function clearBoard() {
  frames.forEach((frame) => {
    frame.children[0].children[0].classList.remove("show");
    frame.children[0].children[1].classList.remove("show");
    frame.classList.remove("x");
    frame.classList.remove("o");
  });
}

//show on screen that it is player's turn to play
const showYourTurn = (turn) => {
    if (turn) {
      yourTurn = true;
      turnInfo.textContent = "Your turn!";
    } else if (turn == false) {
      turnInfo.textContent = "Opponent's turn!";
      yourTurn = false;
    } else {
      yourTurn = false;
      turnInfo.textContent = "";
    }
  }


const showWhoseTurnMessage = (turn) => {
  if (turn === false && turn === "false" && turn === "") {
    turnInfo.textContent = "";
    return;
  } else if (gameMode === "offline") {
    if (turn == "x") {
      turnInfo.textContent = "Mr. X's Turn!";
      turnX = true;
    } else if (turn=="o") {
      turnInfo.textContent = "Mr. O's Turn!";
      turnY = true;
    }
  } else if (gameMode === "bot") {
    if (turn == "player") {
      turnInfo.textContent = "Your Turn!";
    } else if (turn=="bot") {
      turnInfo.textContent = "Mr. Bot's Turn!";
    }
  }
};

//reset game board,remove all moves
const resetOnlineGame = (swapTurns = false) => {
  clearBoard();
  //make both players turn to false
  showYourTurn(false);

  //swap turns
  if (swapTurns) {
    game.playerSide = game.playerSide == "x" ? "o" : "x"; //swap the player's turns
    changeXoIcon(game.playerSide);
  }
  //then randomly choose which one get to move first
  if (game.playerSide == "o") {
    showYourTurn(true);
  }
};
//reset game board,remove all moves
const resetGame = () => {
  if (gameMode == "offline") {
    clearBoard();

    //make both players turn to false
    showWhoseTurnMessage(false);
    game.whoseTurn = randomizeOfflineTurn();
    showWhoseTurnMessage(game.whoseTurn);
  } else if (gameMode == "bot") {
    clearBoard();

    game.playerSide = randomizeOfflineTurn();
    showWhoseTurnMessage("player");
    game.moves = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    game.isPlayerTurn = true;
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
function showBotLoader() {}
function makeBotMove() {
  let randomEmptyFrameIndex = calculateAMove();

  game.moves[randomEmptyFrameIndex]=1
  showXorO(frames[randomEmptyFrameIndex], game.playerSide === "x" ? "o" : "x");
}
//adding event listeners
frames.forEach((f) => {
  f.addEventListener("click", () => {
    if (gameMode === "online") {
      if (
        !f.classList.contains("x") &&
        !f.classList.contains("o") &&
        yourTurn &&
        opponentIsReady
      ) {
        //emit to server that player has moved
        socket.emit("playerMoved", {
          place: f.dataset.serial,
          roomCode: socket.roomCode,
        });
        //show the move on the board
        showXorO(f, game.playerSide);
        showYourTurn(false);
        checkForWin();
      }
    } else if (gameMode === "offline") {
      if (!f.classList.contains("x") && !f.classList.contains("o")) {
        //show the move on the board
        showXorO(f, game.whoseTurn);
        game.whoseTurn = game.whoseTurn == "x" ? "o" : "x";
        checkForWin();
        showWhoseTurnMessage(game.whoseTurn);
      }
    } else if (gameMode === "bot") {
      if (
        !f.classList.contains("x") &&
        !f.classList.contains("o") &&
        game.isPlayerTurn
      ) {
        //show the move on the board
        showXorO(f, game.playerSide);
        //update the array
        game.moves[f.dataset.serial] = 1;

        game.isPlayerTurn = false;
        let gameFinished = checkForWin();
        if (!gameFinished) {
          showWhoseTurnMessage("bot");
          showBotLoader(true);
          setTimeout(() => {
            makeBotMove();
            gameFinished=checkForWin()
            if(!gameFinished){

              showBotLoader(false);

              showWhoseTurnMessage("player");
              
            game.isPlayerTurn = true;
            }
          }, 2000);
        }
      }
    }
  });
});

//leave the online room
const leaveOnlineRoom = () => {
  socket.emit("leaveRoom", { roomCode: socket.roomCode });

  socket.on("leftRoom", () => {
    hideGameBoard();
    clearBoard();
    //remove loader
    showLoader(false);
    opponentDetailsContainer.classList.add("hide");
  });
};
//leave the room ; works for both bot and offline mode
const leaveRoom = () => {
  hideGameBoard();

  clearBoard();

  showWhoseTurnMessage(false);

  changeXoIcon(false);
showOpponentProfile(false);
  //remove loader
  showLoader(false);
};
//leave button event listener
leaveBtn.addEventListener("click", () => {
  showLoader(true);
  if (gameMode === "online") {
    leaveOnlineRoom();
  } else if (gameMode === "offline" || gameMode === "bot") {
    leaveRoom();
  }
  showLoader(false);
});


//((((only socket io section below))))
//when player successfully joins the room
socket.on("joinedRoom", (m) => {
  socket.roomCode = m.roomCode;
  //hide the room input
  buttonsWrapper.classList.add("d-none");
  //show the gameboard
  boardContainer.classList.remove("d-none");
  //display the room code
  roomNumberContainer.innerHTML = "Room:" + socket.roomCode;
  //show opponent
  opponentDetailsContainer.classList.remove("hide");
  //server sends a variable X_O with a value of either 1 or 0 to both player and opponent,we chose the player's side based on this number
  game.playerSide = m.X_O == 0 ? "x" : "o";

  changeXoIcon(game.playerSide);
  
  if (game.playerSide == "o") {
    showYourTurn(true);
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
socket.on("opponentJoined", async ({ message, opponentUsername }) => {
  resetOnlineGame();
  showLoader(true);


  await updateOpponent(opponentUsername);
  showLoader(false);
  showNotification(opponentUsername + " has joined the game!!");
  
  socket.emit("playerUsername", {
    username: playerUsername.textContent,
    roomCode: socket.roomCode,
  });
  opponentIsReady = true;
});
socket.on("opponentLeft", () => {
  showNotification("Opponent left!");
  updateOpponent("noOpponent");
  game.playerSide = "x";
  changeXoIcon(false); //make icon disappear

  resetGame();
});
socket.on("opponentUsername", async ({ username }) => {
  showLoader(true);
  await updateOpponent(username);
  showLoader(false);
  showNotification("You are playing against " + username);
  
  opponentIsReady = true;
});
socket.on("changedOpponentUsername", async ({ username }) => {
  await updateOpponent(username);
  console.log("Show notification");

  showNotification("Opponent changed username to " + username);
});
//when opponent make a move
socket.on("opponentMoved", (m) => {
  showXorO(frames[m.place], game.playerSide == "x" ? "o" : "x");
  showYourTurn(true);
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
    showRoomPopup(false);
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
  showRoomPopup(false);
  socket.emit("joinRoom", {
    roomCode: randomRoomNumber,
    username: "",
  });
});
