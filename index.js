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

    addCardToHand(card) {
        this.hand.push(card);
        this.addScore();
    }

    addScore() {
        let numAces = 0;
        let totalScore = 0;

        for (const card of this.hand) {
            if (card.value === 'ace') {
                numAces++;
                totalScore += card.points[1];
            } else if (['jack', 'queen', 'king'].includes(card.value)) {
                totalScore += 10;
            } else {
                totalScore += card.points;
            }
        }

        while (totalScore > 21 && numAces > 0) {
            totalScore -= 10; // from 11 to 1
            numAces--;
        }

        this.score = totalScore;
    }

    checkFor21() {
        return this.hand.length === 2 && this.score === 21;
    }

    checkForBust() {
        return this.score > 21;
    }
}

class Dealer extends Player {
    checkHand(dealerHand) {
        revealCards(dealerHand);

        if (this.checkFor21()) {
            showResult('Dealer has Blackjack!😭');
            endGame();
            return;
        }

        while (this.score < 17) {
            dealCard(this, dealerHand);
            this.addScore();
        }

        if (this.checkForBust()) {
            showResult('Dealer Bust! You win!🥳');
        } else {
            this.compareScores(newPlayer.score);
        }
        endGame();
    }

    compareScores(playerScore) {
        if (playerScore > 21) {
            showResult('Player Bust! Dealer wins!😭');
        } else if (this.score > 21) {
            showResult('Dealer Bust! You win!🥳');
        } else if (playerScore > this.score) {
            showResult('You win!🥳');
        } else if (playerScore === this.score) {
            showResult('Stand-off😅');
        } else {
            showResult('Dealer wins!😭');
        }
        endGame();
    }
}

function showResult(result) {
    playerResult.innerText = result;
    playerRow.style.display = 'block';
}

function revealCards(dealerHand) {
    dealerHand.innerHTML = '';

    for (let card of newDealer.hand) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        const cardImage = document.createElement('img');
        cardImage.src = `./cards/${card.value}${card.suit}.png`;
        cardImage.alt = `${card.value} of ${card.suit}`;

        cardContainer.appendChild(cardImage);
        dealerHand.appendChild(cardContainer);
    }
}

function removeCards(handElement, array) {
    handElement.querySelectorAll('.card-container').forEach((cardContainer) => {
        handElement.removeChild(cardContainer);
    });
    array.splice(0, array.length);
}

function dealCard(person, handElement, isFaceDown = false) {
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

    handElement.appendChild(cardContainer);

    if (!isFaceDown) {
        person.hand.push(randomCard);
        person.addScore();
    }
}

const newDeck = new Deck();
const newPlayer = new Player();
const newDealer = new Dealer();

const playerHand = document.getElementById('playerHand');
const dealerHand = document.getElementById('dealerHand');
const playerMoneyElement = document.getElementById('playerMoney');
const playerResult = document.getElementById('playerResult');
const dealerResult = document.getElementById('dealerResult');
const gambaButtons = document.getElementById('gambaButtons');
const gambaSection = document.getElementById('gambaSection');

let playerTotal = 1000;
let playerBet = 0;

const bet1Button = document.getElementById('bet1');
const bet5Button = document.getElementById('bet5');
const bet25Button = document.getElementById('bet25');
const bet100Button = document.getElementById('bet100');

const playerTotalDisplay = document.getElementById('playerMoney');
const playerBetDisplay = document.getElementById('playerBet');

bet1Button.addEventListener('click', () => updateBet(1));
bet5Button.addEventListener('click', () => updateBet(5));
bet25Button.addEventListener('click', () => updateBet(25));
bet100Button.addEventListener('click', () => updateBet(100));

function updateBet(amount) {
    if (amount <= playerTotal) {
        playerBet += amount;
        playerTotal -= amount;
        playerTotalDisplay.textContent = playerTotal;
        playerBetDisplay.textContent = playerBet;
        console.log("Player placed bet:", playerBet);
    } else {
        showResult('Not enough money for this bet🚨');
    }
}

function updatePlayerMoney() {
    console.log("Updating player's money...");
    console.log("Player result:", playerResult.innerText);
    console.log("Player money before update:", playerTotal);
    console.log("Player bet:", playerBet);

    const resultText = playerResult.innerText;
    if (resultText.includes('😭')) {
        // Player loses bet
    } else if (resultText.includes('🤑') || resultText.includes('🥳')) {
        playerTotal += playerBet * 2; // Player wins bet
    }

    playerTotalDisplay.textContent = playerTotal;
    playerBet = 0; // Reset bet after the round
    playerBetDisplay.textContent = playerBet;

    console.log("Player money after update:", playerTotal);
}

function resetGame() {
    removeCards(playerHand, newPlayer.hand);
    removeCards(dealerHand, newDealer.hand);

    newPlayer.score = 0;
    newDealer.score = 0;

    updatePlayerMoney();

    deal.disabled = false;

    if (newDeck.cards.length <= 12) {
        newDeck.createDeck();
        newDeck.shuffle();
    }
}

function endGame() {
    hit.disabled = true;
    stand.disabled = true;
    newHand.disabled = false;
}

const playerRow = document.getElementById('playerRow');
const closeButton = document.getElementsByClassName('close-button')[0];

closeButton.addEventListener('click', closeResultPopup);
window.addEventListener('click', (event) => {
    if (event.target === playerRow) {
        closeResultPopup();
    }
});

function closeResultPopup() {
    playerRow.style.display = 'none';
}

const deal = document.getElementById('deal');
const hit = document.getElementById('hit');
const stand = document.getElementById('stand');
const newHand = document.getElementById('newHand');

deal.addEventListener('click', () => {
    newDeck.shuffle();
    dealCard(newPlayer, playerHand);
    dealCard(newPlayer, playerHand);
    dealCard(newDealer, dealerHand, true);
    dealCard(newDealer, dealerHand);

    deal.disabled = true;
    hit.disabled = false;
    stand.disabled = false;
    newHand.disabled = true;

    if (newPlayer.checkFor21()) {
        showResult('Player has Blackjack!🤑');
        endGame();
    } else if (newDealer.checkFor21()) {
        showResult('Dealer has Blackjack!😭');
        endGame();
    }
});

hit.addEventListener('click', () => {
    dealCard(newPlayer, playerHand);
    if (newPlayer.checkForBust()) {
        showResult('Player Bust! Dealer wins!😭');
        endGame();
    } else if (newPlayer.score === 21) {
        showResult('Player has Blackjack!🤑');
        endGame();
    }
});

stand.addEventListener('click', () => {
    hit.disabled = true;
    stand.disabled = true;
    newDealer.checkHand(dealerHand);
});

newHand.addEventListener('click', resetGame);


