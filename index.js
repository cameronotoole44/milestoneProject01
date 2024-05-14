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
        this.createDeck();
        this.shuffle();
    }
    createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = [
            { value: 'ace', points: [1, 11] },
            { value: 'two', points: 2 },
            { value: 'three', points: 3 },
            { value: 'four', points: 4 },
            { value: 'five', points: 5 },
            { value: 'six', points: 6 },
            { value: 'seven', points: 7 },
            { value: 'eight', points: 8 },
            { value: 'nine', points: 9 },
            { value: 'ten', points: 10 },
            { value: 'jack', points: 10 },
            { value: 'queen', points: 10 },
            { value: 'king', points: 10 },
        ];

        for (const value of values) {
            for (const suit of suits) {
                const points = value.points;
                this.cards.push(new Card(value.value, suit, points));
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

class Player {
    constructor() {
        this.score = 0;
        this.hand = [];
    }

    // Add a card to the player's hand and update the score
    addCardToHand(card) {
        this.hand.push(card);
        this.addScore();
    }

    // Calculate the player's score
    addScore() {
        let numAces = 0;
        let totalScore = 0;

        for (const card of this.hand) {
            if (card.value === 'ace') {
                numAces++;
                totalScore += card.points[1]; // Assume ace is 11 initially
            } else if (['jack', 'queen', 'king'].includes(card.value)) {
                totalScore += 10;
            } else {
                totalScore += card.points;
            }
        }

        // Adjust for aces if total score exceeds 21
        while (totalScore > 21 && numAces > 0) {
            totalScore -= 10; // Treat ace as 1 instead of 11
            numAces--;
        }
        this.score = totalScore;
    }

    // Check if the player has a blackjack (21 with 2 cards)
    checkFor21() {
        return this.hand.length === 2 && this.score === 21;
    }

    // Check if the player has busted (score over 21)
    checkForBusts() {
        return this.score > 21;
    }
}

class Dealer extends Player {
    checkHand(dealerHand) {
        if (this.hand.length === 2) {
            // reveal the second card
            revealCards(dealerHand);
        } else if (this.hand.length > 2) {
            // any cards beyond the first two, deal them face up
            dealCard(this, dealerHand);
        }

        // Check if the dealer has Blackjack
        if (this.checkFor21()) {
            revealCards(dealerHand);
            showResult('Dealer has Blackjack!😭');
            endGame();
            return;
        }

        // deal cards until the score is 17 or higher
        while (this.score < 17) {
            revealCards(dealerHand);
            dealCard(this, dealerHand);
            this.addScore();
        }
        // reveal second card
        revealCards(dealerHand);
        // result after the dealer finishes their turn
        if (this.score > 21) {
            showResult('Dealer Bust! You win!🥳');
        } else {
            this.compareScores(newPlayer.score);
        }
        endGame();
    }

    compareScores(playerScore) {
        // console.log(`Player score: ${playerScore}`);
        // console.log(`Dealer score: ${this.score}`);
        if (playerScore > 21) {
            showResult('Player Bust! Dealer wins!😭');
        } else if (this.score > 21) {
            showResult('Dealer Bust! You win!🥳');
        } else if (playerScore === this.score) {
            showResult('Push! It\'s a tie!😐');
        } else if (playerScore > this.score) {
            showResult('You win!🥳');
        } else {
            showResult('Dealer wins!😭');
        }
    }
}

function updatePlayerMoney(playerResult, playerMoney, playerBet) {
    if (playerResult === 'win') {
        playerMoney += playerBet;
    } else if (playerResult === 'lose') {
        playerMoney -= playerBet;
    }
    // update player's money display
    playerMoneyDisplay.textContent = playerMoney;
}

function removeCards(handElement, handArray) {
    while (handElement.firstChild) {
        handElement.removeChild(handElement.firstChild);
    }
    handArray.length = 0;
}

function dealCard(person, playerHand, isFaceDown = false) {
    if (newDeck.cards.length === 0) { // Check if deck is empty
        showResult('No more cards in the deck! Please reset the game.🚨');
        return;
    }
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const randomCard = newDeck.cards.pop();
    const cardImage = document.createElement('img');

    cardImage.src = isFaceDown
        ? `./cards/backCard.png`
        : `./cards/${randomCard.value}${randomCard.suit}.png`;
    cardImage.alt = isFaceDown
        ? 'Face-down card'
        : `${randomCard.value} of ${randomCard.suit}`;
    cardContainer.appendChild(cardImage);

    playerHand.appendChild(cardContainer);

    if (!isFaceDown) {
        person.hand.push(randomCard); // add card to hand if it's not face down
    }
}

function revealCards(dealerHand) {
    const cardImages = dealerHand.querySelectorAll('img');
    cardImages.forEach((card, index) => {
        if (card.src.includes('backCard.png')) {
            const cardData = newDealer.hand[index];
            card.src = `./cards/${cardData.value}${cardData.suit}.png`;
        }
    });
}

function showResult(message) {
    resultDisplay.textContent = message;
}

function endGame() {
    hit.disabled = true;
    stand.disabled = true;
    deal.disabled = false;
}

function resetGame() {
    // clear hands
    removeCards(playerHand, newPlayer.hand);
    removeCards(dealerHand, newDealer.hand);
    //  reset scores
    newPlayer.score = 0;
    newDealer.score = 0;

    // update player money
    updatePlayerMoney(playerResult, playerMoney, playerBet);

    // reset bet
    playerBet = 0;
    playerBetDisplay.textContent = playerBet;

    // enable deal button
    deal.disabled = false;

    if (newDeck.cards.length <= 12) {
        newDeck.createDeck();
        newDeck.shuffle();
    }
}

const newDeck = new Deck();
const newPlayer = new Player();
const newDealer = new Dealer();
let playerMoney = 100;
let playerBet = 0;

// UI elements
const playerHand = document.querySelector('#player-hand');
const dealerHand = document.querySelector('#dealer-hand');
const playerMoneyDisplay = document.querySelector('#player-money');
const playerBetDisplay = document.querySelector('#player-bet');
const resultDisplay = document.querySelector('#result');

const betButtons = document.querySelectorAll('.bet');
betButtons.forEach(button => {
    button.addEventListener('click', () => {
        const betAmount = parseInt(button.value);
        if (playerMoney >= betAmount) {
            playerBet += betAmount;
            playerMoney -= betAmount;
            playerBetDisplay.textContent = playerBet;
            playerMoneyDisplay.textContent = playerMoney;
        } else {
            showResult('Not enough money to place that bet!🚨');
        }
    });
});

const deal = document.querySelector('#deal');
const hit = document.querySelector('#hit');
const stand = document.querySelector('#stand');

deal.addEventListener('click', () => {
    if (playerBet > 0) { // Check if a bet is placed
        newDeck.shuffle();
        dealCard(newPlayer, playerHand);
        dealCard(newPlayer, playerHand);
        dealCard(newDealer, dealerHand, true); // dealer card, face down
        dealCard(newDealer, dealerHand); // dealer card, face up

        deal.disabled = true;
        hit.disabled = false;
        stand.disabled = false;

        if (newPlayer.checkFor21()) {
            showResult('Player has Blackjack!🤑');
            endGame();
        } else if (newDealer.checkFor21()) {
            showResult('Dealer has Blackjack!😭');
            endGame();
        } else {
            hit.disabled = false;
            stand.disabled = false;
        }
        deal.disabled = true;
    } else {
        showResult('Place a bet first!🚨');
    }
});

hit.addEventListener('click', () => {
    dealCard(newPlayer, playerHand);
    newPlayer.addScore();
    if (newPlayer.checkFor21()) {
        showResult('Player has Blackjack!🤑');
        endGame();
    } else if (newPlayer.checkForBusts()) {
        showResult('Player Bust! Dealer wins!😭');
        endGame();
    }
});

stand.addEventListener('click', () => {
    newDealer.checkHand(dealerHand);
});

// Reset the game initially
resetGame();
