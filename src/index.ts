// Imports your SCSS stylesheet
import "@/styles/index.scss";
import { Cards } from "./until";

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

  const cardDivs = document.querySelectorAll("div");
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

displayCards();
