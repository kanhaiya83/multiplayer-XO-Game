//game variables
let gameMode; //"online"/"offline"/"bot"

let game = {};
let yourTurn = false; //for online and bot
let turnX = false;
let turnY = false;
let opponentIsReady = false;

//home screen
const playWithFriendBtn = document.querySelector("button.play-with-friend");
const playOfflineBtn = document.querySelector("button.play-offline");
const playWithBotBtn = document.querySelector("button.play-with-bot");

//popup for room(create or join button)
const popupBackdrop = document.querySelector(".room-popup-bg");
const popupContainer = document.querySelector(".room-popup-container");
const popupCloseBtn = document.querySelector(
  ".room-popup-container .popup-close-btn"
);

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

const turnInfo = document.querySelector(".turn-info");
//events listeners
popupCloseBtn.addEventListener("click", () => {
  showRoomPopup(false);
});

const showRoomPopup = (show = true) => {
  if (show) {
    popupBackdrop.classList.add("show");
    popupContainer.classList.add("show");
  } else {
    popupBackdrop.classList.remove("show");
    popupContainer.classList.remove("show");
  }
};

//change the XO icon near the profile sections of players
function changeXoIcon(x_or_o) {
  if (x_or_o == "x") {
    document
      .querySelector(".player-details .player-xo")
      .classList.add("show-x");
    document
      .querySelector(".player-details .player-xo")
      .classList.remove("show-o");
    document
      .querySelector(".opponent-details .player-xo")
      .classList.add("show-o");
    document
      .querySelector(".opponent-details .player-xo")
      .classList.remove("show-x");
  } else if (x_or_o == "o") {
    document
      .querySelector(".player-details .player-xo")
      .classList.add("show-o");
    document
      .querySelector(".player-details .player-xo")
      .classList.remove("show-x");

    document
      .querySelector(".opponent-details .player-xo")
      .classList.add("show-x");
    document
      .querySelector(".opponent-details .player-xo")
      .classList.remove("show-o");
  } else {
    document
      .querySelector(".player-details .player-xo")
      .classList.remove("show-x");
    document
      .querySelector(".player-details .player-xo")
      .classList.remove("show-o");
    document
      .querySelector(".opponent-details .player-xo")
      .classList.remove("show-o");
    document
      .querySelector(".opponent-details .player-xo")
      .classList.remove("show-x");
  }
}

//show a loader over whole page
const showLoader = (show) => {
  if (show) {
    loaderBg.classList.remove("d-none");
  } else {
    loaderBg.classList.add("d-none");
  }
};
//a little drop down notification with a custom message
const showNotification = (message, time = 2000) => {
  document.querySelector(".notification").textContent = message;
  notificationContainer.classList.add("show-notification");
  setTimeout(() => {
    notificationContainer.classList.remove("show-notification");
  }, time);
};
//fetch avatar svg based on the seed provided;returns svg markup code
const fetchAvatar = async (seed) => {
  const data = await fetch(
    "https://avatars.dicebear.com/api/big-smile/" + seed.trim() + ".svg"
  );
  let svg = await data.text();
  return svg;
};
//update player profile based on username provided;uses fetchAvatar()
updatePlayer = (username) => {
  showLoader(true);
  fetchAvatar(username).then((svg) => {
    playerUsername.innerHTML = username;
    playerIcon.innerHTML = svg;
    showLoader(false);
  });
};
//initial username given to player
updatePlayer(generateRandomUsername());
//update opponent profile based on username provided;uses fetchAvatar()

updateOpponent = async (username) => {
  if (username == "noOpponent") {
    opponentUsername.innerHTML = "No Opponent!!";

    opponentIcon.innerHTML = `<img src="./images/default-avatar.svg" alt="">`;
    return;
  }
  await fetchAvatar(username).then((svg) => {
    opponentUsername.innerHTML = username;

    opponentIcon.innerHTML = svg;
    console.log("changed the username");
  });
};

function showOpponentProfile(show=true){
  if(show){
    opponentDetailsContainer.classList.remove("hide");

  }
  else{
    updateOpponent("noOpponent")
    opponentDetailsContainer.classList.add("hide");

  }

}
//change username button below profile ;shows a input field and a submit button
changeBtn.addEventListener("click", () => {
  changeBtn.classList.add("hide");

  changeUsernameContainer.classList.remove("d-none");
});

//update player username based on given input;
//hides the change-username input field and button
//if gameMode=="online" =>emits a "changedPlayerUsername" with the new username as payload
changeUsernameBtn.addEventListener("click", async () => {
  updatePlayer(changeUsernameInput.value);
  showLoader(true);
  //hide input and button
  changeUsernameContainer.classList.add("d-none");
  //show change btn
  changeBtn.classList.remove("hide");

  showLoader(false);
  showNotification("Username changed!!!", 1000);

  if (gameMode == "online") {
    socket.emit("changedPlayerUsername", {
      username: changeUsernameInput.value,
    });
  }
});
//shows the X or O based on the input("x" or "o") on the gameboard at right place
const showXorO = (frame, xOro) => {
  let temp = xOro == "x" ? 0 : 1;
  frame.children[0].children[temp].classList.add("show");
  frame.classList.add(xOro);
};

//#region win/lose logic
//check for combination in straight lines;returns boolean
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
//check for combination in diagonal lines;returns boolean

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
//
const checkForWin = () => {
  if (straightLinesCheck("x") || DiagonalLinesCheck("x")) {
    if (gameMode == "online" && game.playerSide == "x") {
      socket.emit("playerWon");
      showModal("win")
      return true;
      opponentIsReady = false;
    } else if (gameMode === "offline") {
      showModal("x")
      return true;

    }
    else if(gameMode==="bot"){
      if(game.playerSide=="x"){

      
      showModal("win")
      return true
        }
      else{
        
      
      showModal("lose")
      return true
      }    }
  } else if (straightLinesCheck("o") || DiagonalLinesCheck("o")) {
    if (gameMode == "online" && game.playerSide == "o") {
      socket.emit("playerWon");
      showModal("win")
      return true;
    } else if (gameMode === "offline") {
      showModal("o")
      return true;

    }
    else if(gameMode==="bot" ){
      if(game.playerSide=="o"){

      
      showModal("win")
      return true
        }
      else{
        
      
      showModal("lose")
      return true
      } 
    }
  } else {
    return checkForDraw();

  }
};
//check for draw
const checkForDraw = () => {
  let isDraw = true;
  frames.forEach((f) => {
    if (!(f.classList.contains("x") || f.classList.contains("o"))) {
      isDraw = false;
    }
  });
  console.log(isDraw);
  if (isDraw) {
    if (gameMode == "online") {
      socket.emit("draw", { roomCode: socket.roomCode });
    } else {
      showModal("draw");
      opponentIsReady = false;
    }
    return true
  }
  return false
};
//#endregion win/lose logic
