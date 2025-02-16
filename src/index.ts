// Imports your SCSS stylesheet
import "@/styles/index.scss";
import { Cards } from "./until";

const cardFlip = document.querySelectorAll(".card__inner");
const setAttemps: HTMLElement = document.querySelector(
  "#attempts"
) as HTMLElement;
const gameStatus: HTMLElement = document.querySelector(
  "#gameStatus"
) as HTMLElement;
const btn = document.querySelector("button");

let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let isProcessing: boolean = false;
let attemptCount: number = 3;
let matchCount: number = 0;

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

class Card {
  value: Cards;
  str: string;
  constructor(value: Cards) {
    this.value = value;
    this.str = Cards[this.value];
  }
}

const getRandomCard = (): Cards => {
  const cardValues = Object.values(Cards).filter(
    (value) => typeof value === "number"
  ) as Cards[];
  const randomValue = cardValues[Math.floor(Math.random() * cardValues.length)];
  return randomValue as Cards;
};

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

const startOver = () => {
  attemptCount = 3;
  matchCount = 0;
  firstCard = null;
  secondCard = null;
  isProcessing = false;
  gameStatus.innerText = "";
  setAttemps.innerHTML = `Attempts left: ${attemptCount}`;
  cardFlip.forEach((element) => {
    element.classList.remove("is-flipped");
  });
  setTimeout(() => {
    displayCards();
  }, 400);
};

displayCards();
