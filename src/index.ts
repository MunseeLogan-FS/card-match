// Imports your SCSS stylesheet
import "@/styles/index.scss";
import { Cards } from "./until";

// all HTMLElements stored in varibales
const cardFlip: NodeListOf<HTMLElement> = document.querySelectorAll(
  ".card__inner"
) as NodeListOf<HTMLElement>;
const setAttemps: HTMLElement = document.querySelector(
  "#attempts"
) as HTMLElement;
const gameStatus: HTMLElement = document.querySelector(
  "#gameStatus"
) as HTMLElement;
const btn: HTMLElement = document.querySelector("button") as HTMLElement;

// all reasignable varibales here
let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let isProcessing: boolean = false;
let attemptCount: number = 3;
let matchCount: number = 0;

// class for making the cards
class Card {
  value: Cards;
  str: string;
  constructor(value: Cards) {
    this.value = value;
    this.str = Cards[this.value];
  }
}

// display cards makees new cards and shuffles them before putting them on the board
const displayCards = () => {
  let i = 0;

  const cardDivs: NodeListOf<HTMLElement> =
    document.querySelectorAll(".card-value");
  const newCards: Card[] = [];
  while (i < 3) {
    newCards.push(new Card(getRandomCard()));

    i++;
  }
  const allCards: Card[] = [...newCards, ...newCards];
  // Shuffle the array of cards
  allCards.sort(() => Math.random() - 0.5);

  for (let j = 0; j < allCards.length; j++) {
    const element = allCards[j];
    if (element.value === 1 || element.value > 10) {
      cardDivs[j].innerText = element.str;
    } else {
      cardDivs[j].innerText = `${element.value}`;
    }
  }
};

// get random card is used by displayCards to make random cards each time
const getRandomCard = (): Cards => {
  const cardValues = Object.values(Cards).filter(
    (value) => typeof value === "number"
  ) as Cards[];
  const randomValue = cardValues[Math.floor(Math.random() * cardValues.length)];
  return randomValue as Cards;
};

// match cards is called by an eventlistener to check if the Text in the two cards is the same therefore making match or turning the cards back over
const matchCards = () => {
  if (firstCard && secondCard) {
    const firstCardValue = (
      firstCard.querySelector(".card-value") as HTMLElement
    )?.innerText;
    const secondCardValue = (
      secondCard.querySelector(".card-value") as HTMLElement
    )?.innerText;

    if (firstCardValue === secondCardValue) {
      console.log("Match found!");
      firstCard = null;
      secondCard = null;
      isProcessing = false;
      matchCount++;
      attemptCount--;
      setAttemps.innerHTML = `Attempts left: ${attemptCount}`;
      if (matchCount > 1 || attemptCount === 0) {
        gameOver();
      }
    } else {
      console.log("No match.");
      attemptCount--;
      setAttemps.innerHTML = `Attempts left: ${attemptCount}`;
      if (attemptCount === 0) {
        gameOver();
      }
      if (attemptCount > 0) {
        setTimeout(() => {
          firstCard?.classList.remove("is-flipped");
          secondCard?.classList.remove("is-flipped");
          console.log("flip");
          firstCard = null;
          secondCard = null;
          isProcessing = false;
        }, 1500);
      }
    }
  }
};

// game over is called after to many attempts or if the user guessing two matching pairs making them a winner
const gameOver = () => {
  isProcessing = true;

  if (matchCount > 1) {
    gameStatus.innerText = `You Win!`;
  } else if (matchCount < 2) {
    gameStatus.innerText = `You Lose!`;
  }
  cardFlip.forEach((element) => {
    element.classList.add("is-flipped");
  });
};

// called by the start over btn eventlistener to reset the game
const startOver = () => {
  attemptCount = 3;
  matchCount = 0;
  firstCard = null;
  secondCard = null;

  gameStatus.innerText = "";
  setAttemps.innerHTML = `Attempts left: ${attemptCount}`;
  cardFlip.forEach((element) => {
    element.classList.remove("is-flipped");
  });
  setTimeout(() => {
    displayCards();
  }, 400);
  isProcessing = false;
};

(() => {
  // call display cards to make the page
  displayCards();

  // addEventListeners to for the game
  cardFlip.forEach((element) => {
    element.addEventListener("click", () => {
      if (isProcessing || element.classList.contains("is-flipped")) return;

      element.classList.add("is-flipped");

      if (!firstCard) {
        firstCard = element as HTMLElement;
      } else if (!secondCard) {
        secondCard = element as HTMLElement;
        isProcessing = true;
        matchCards();
      }
    });
  });

  btn?.addEventListener("click", () => {
    startOver();
  });
})();
