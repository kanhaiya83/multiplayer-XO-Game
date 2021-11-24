

const modalContainer = document.querySelector("#modal-container");
const modalTitle = document.querySelector(".modal__title");
const modalDescription = document.querySelector(".modal__description");
const showModal = (status) => {
  if (status == "win") {
    modalTitle.textContent = "You Won!!!";
    modalDescription.textContent = "You've Got a Winner's Attitude. Of Course!";
    modalContainer.classList.add("show-modal");
  } else if (status == "lose") {
    modalTitle.textContent = "You Lost!!!";
    modalDescription.textContent = "Better luck next time,Buddy!";
    modalContainer.classList.add("show-modal");
  } else {
    modalTitle.textContent = "Match draw!!!";
    modalTitle.textContent =
      "When an unstoppable force meets an immovable object!";
    modalContainer.classList.add("show-modal");
  }
};
//leave btn
document.querySelector(".close-modal").addEventListener("click", () => {
  closeModal();

  showLoader(true);
  leaveRoom();
  resetGame();
  opponentDetailsContainer.classList.add("hide");
});
//play again
document.querySelector(".play-again").addEventListener("click", () => {
  closeModal();
  resetGame();
  socket.emit("playerIsReady")
});
function closeModal() {
  modalContainer.classList.remove("show-modal");
}
