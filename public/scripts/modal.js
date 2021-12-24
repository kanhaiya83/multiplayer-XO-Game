const modalContainer = document.querySelector("#modal-container");
const modalTitle = document.querySelector(".modal__title");
const modalDescription = document.querySelector(".modal__description");
const body = document.querySelector("body");
const showModal = (status) => {
  if (status == "win") {
    modalTitle.textContent = "You Won!!!";
    modalDescription.textContent = "You've Got a Winner's Attitude. Of Course!";
    modalContainer.classList.add("show-modal");
  } else if (status == "lose") {
    modalTitle.textContent = "You Lost!!!";
    modalDescription.textContent = "Better luck next time,Buddy!";
    modalContainer.classList.add("show-modal");
  } else if (status == "x") {
    modalTitle.textContent = "Mr. X won the game!!";
    modalDescription.textContent = "Better luck next time,Mr. O!";
    modalContainer.classList.add("show-modal");
  } else if (status == "o") {
    modalTitle.textContent = "Mr. O won the game!!";
    modalDescription.textContent = "Better luck next time,Mr. X!";
    modalContainer.classList.add("show-modal");
  } else {
    modalTitle.textContent = "Match draw!!!";
    modalDescription.textContent =
      "When an unstoppable force meets an immovable object!";
    modalContainer.classList.add("show-modal");
  }
  body.style.overflow = "hidden";
};
//leave btn
document.querySelector(".close-modal").addEventListener("click", () => {
  closeModal();

  showLoader(true);
  if (gameMode === "online") {
    leaveOnlineRoom();
  } else if (gameMode === "offline" || gameMode === "bot") {
    
    leaveRoom();
  }

  opponentDetailsContainer.classList.add("hide");

  showLoader(false)
});
//play again
document.querySelector(".play-again").addEventListener("click", () => {
  closeModal();
  if (gameMode === "online") {
    resetOnlineGame(true);
    socket.emit("playerIsReady");
  } else if (gameMode === "offline" || gameMode === "bot") {
    resetGame();
  }
});
function closeModal() {
  body.style.overflow = "auto";
  modalContainer.classList.remove("show-modal");
}
