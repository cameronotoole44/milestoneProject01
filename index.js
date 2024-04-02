class Card {
    constructor(value, suit, points) {
        this.value = value;
        this.suit = suit;
        this.points = points;
    }
}
class Deck {
    constructor() {
        this.cards = [];
        this.initializeDeck();
    }

    initializeDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
        for (let value of values) {
            for (let suit of suits) {
                let points = (value === 'Ace') ? 11 : (isNaN(parseInt(value)) ? 10 : parseInt(value));
                this.cards.push(new Card(value, suit, points));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

const myDeck = new Deck();
// console.log(myDeck.cards);
myDeck.shuffle();
// console.log(myDeck.cards);
myDeck.cards.forEach(card => {
    console.log(card.value, card.suit, card.points);
});




const deal = document.getElementById('deal');
const hit = document.getElementById('hit');
const stand = document.getElementById('stand');
const dealer = document.getElementById('dealer');
const player = document.getElementById('player');
const result = document.getElementById('result');
// betting variables
let playerMoney = 1000;
let playerBet = 0;
const minBet = 1;
const maxBet = playerMoney;
// gamba section checks COMPLETE // 
// variables here instead 
const gambaButtons = document.querySelectorAll('#gambaButtons button');
const doubleButton = document.getElementById('doubleButton');
gambaButtons.forEach(button => {
    button.addEventListener('click', () => {
        const betAmountText = button.textContent.replace('$', '');
        const betAmount = parseInt(betAmountText, 10);
        // check validity of bet
        if (playerMoney >= betAmount) {
            playerBet += betAmount;
            playerMoney -= betAmount;
            updatePlayerTotal(playerMoney); // updates player money
            updatePlayerBet(playerBet); // keeps tab on how much player has bet
        } else {
            alert('Invalid bet or not enough money!');
        }
    })

})

double.addEventListener('click', doubleGamba);
// double gamba
function doubleGamba() {
    if (playerBet * 2 <= playerMoney) {
        playerBet *= 2;
        playerMoney -= playerBet / 2;
        updatePlayerTotal(playerMoney);
        updatePlayerBet(playerBet);
    } else {
        double.disabled = true;
        alert('Invalid bet! Not enough money!');
    }
}

function updatePlayerTotal(total) {
    const playerTotal = document.getElementById('playerMoney');
    playerTotal.textContent = total;
}
function updatePlayerBet(total) {
    const playerBet = document.getElementById('playerBet');
    playerBet.textContent = total;
}
// gamba check end