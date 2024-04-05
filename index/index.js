// build cards, build deck, shuffle 
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
        const values = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
        const pointsMap = {
            'ace': [1, 11],
            'two': 2,
            'three': 3,
            'four': 4,
            'five': 5,
            'six': 6,
            'seven': 7,
            'eight': 8,
            'nine': 9,
            'ten': 10,
            'jack': 10,
            'queen': 10,
            'king': 10
        };

        for (let value of values) {
            for (let suit of suits) {
                let points = pointsMap[value];
                // let points = (value === 'ace') ? 11 : (isNaN(parseInt(value)) ? 10 : parseInt(value));
                this.cards.push(new Card(value, suit, points));
            }
        }
    }
    // shuffle 
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
        this.score = 0;
        for (let card of this.hand) {
            if (card.points === 'Ace') {
                numAces++;
                this.score += cardPoints[1];
            } else if (['Jack', 'Queen', 'King'].includes(card.value)) {
                this.score += 10;
            } else {
                this.score += card.points;
            }
        }
        while (this.score > 21 && numAces > 0) { // aces value switch
            this.score -= 10; // from 11 - 1
            numAces--;
        }
    }

    // checks if first two cards equal 21
    checkFor21() {
        if (this.hand.length === 2 && this.score === 21) {
            return true; // blackjack
        }
        return false;
    }

    checkForBusts(playerScore) {
        if (this.score > 21) {
            if (playerScore <= 21) {
                return true;
            }
        }
        return false;
    }
}

class Dealer extends Player {
    // logic for dealer's turn
    checkHand(dealerHand) {
        // first card face uup
        dealCard(this, dealerHand);
        // second card face down
        dealCard(this, dealerHand, true);

        // check first two cards are blackjack
        if (this.checkFor21()) {
            showResult('Dealer has Blackjack!😱');
            endGame();
            return;
        }

        // deal cards until the score is 17 or higher
        while (this.score < 17) {
            dealCard(this, dealerHand);
            this.addScore();
        }

        // reveal second card
        revealSecondCard(dealerHand);

        // result after the dealer finishes their turn
        if (this.score > 21) {
            showResult('Dealer Bust! You win!🥳');
        } else {
            this.compareScores(newPlayer.score);
        }
        endGame();
    }
    compareScores(playerScore) {
        if (playerScore > this.score) {
            showResult('You win!🥳');
        } else if (playerScore < this.score) {
            showResult('Dealer wins!😭');
        } else {
            showResult('Stand-off😅');
        }
    }
}

function revealSecondCard(dealerHand) {
    const cardContainers = dealerHand.querySelectorAll('.card-container');
    cardContainers[1].firstElementChild.src = `/cards/${newDealer.hand[1].value}${newDealer.hand[1].suit}.png`;
    cardContainers[1].firstElementChild.alt = `${newDealer.hand[1].value} of ${newDealer.hand[1].suit}`;
}


// TODO: FIX LOGIC OR FIND OUT WHY ITS BROKEN 70%


// new deck, player, & dealer
const newDeck = new Deck;
const newPlayer = new Player;
const newDealer = new Dealer;

const playerHand = document.getElementById('playerHand');
const dealerHand = document.getElementById('dealerHand');

// newDeck.createDeck();
// newDeck.createDeck();
// newDeck.shuffle();

const playerMoney = document.getElementById('playerMoney');
const gameOver = document.getElementById('gameOver');
const playerResult = document.getElementById('playerResult');
const dealerResult = document.getElementById('dealerResult');
const gambaButtons = document.getElementById('gambaButtons');
const gambaSection = document.getElementById('gambaSection');

//  DEAL CARDS AS IMG
function dealCard(person, playerHand, isFaceDown = false) {
    console.log("Hand container:", playerHand);
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const randomCard = newDeck.cards.pop();
    const cardImage = document.createElement('img');

    cardImage.src = isFaceDown ? `/cards/backCard.png` : `/cards/${randomCard.value}${randomCard.suit}.png`;
    cardImage.alt = isFaceDown ? 'Face-down card' : `${randomCard.value} of ${randomCard.suit}`;
    cardContainer.appendChild(cardImage);

    playerHand.appendChild(cardContainer);

    if (!isFaceDown) {
        person.hand.push(randomCard); // add card to hand if it's not face down
    }

}

// REMOVE CARDS 
function removeCards(playerHand, array) {
    playerHand.querySelectorAll('.card-container').forEach(cardContainer => {
        playerHand.removeChild(cardContainer);
    });
    array.splice(0, array.length);
}

// RESULT
function showResult(result) {
    playerResult.innerText = result;
    playerRow.style.display = 'block';
    // console.log(message);
}

// GAMBA SECTION 
let playerTotal = 1000;
let playerBet = 0;

const bet1Button = document.getElementById('bet1');
const bet5Button = document.getElementById('bet5');
const bet25Button = document.getElementById('bet25');
const bet100Button = document.getElementById('bet100');

const playerTotalDisplay = document.getElementById('playerMoney');
const playerBetDisplay = document.getElementById('playerBet');

bet1Button.addEventListener('click', function () {
    updateBet(1);
});

bet5Button.addEventListener('click', function () {
    updateBet(5);
});

bet25Button.addEventListener('click', function () {
    updateBet(25);
});

bet100Button.addEventListener('click', function () {
    updateBet(100);
});
// UPDATE BET
function updateBet(amount) {
    if (amount <= playerTotal) {
        playerBet += amount;
        playerTotal -= amount;
    } else {
        showResult('Not enough money for this bet🚨');
    }

    playerTotalDisplay.textContent = playerTotal;
    playerBetDisplay.textContent = playerBet;
}

const playerRow = document.getElementById('playerRow');
const closeButton = document.getElementsByClassName('close-button')[0];

// RESULT ALERT
closeButton.onclick = function () {
    playerRow.style.display = 'none';
}
window.onclick = function (event) {
    if (event.target === playerRow) {
        playerRow.style.display = 'none';
    }
}

// reset cards/hand/game
function resetGame() {
    updatePlayerMoney(playerResult, playerMoney, playerBet);
    // clear hands    
    removeCards(playerHand, newPlayer.hand);
    removeCards(dealerHand, newDealer.hand);
    //  reset scores
    newPlayer.score = 0;
    newDealer.score = 0;

    playerBet = 0;
    playerBetDisplay.textContent = playerBet;
    // enable deal button
    deal.disabled = false;

    if (newDeck.cards.length <= 12) {
        newDeck.createDeck();
        newDeck.shuffle();
    }
    console.log("Game Reset....");
}

function updatePlayerMoney(playerResult, playerMoney, playerBet) {
    let playerTotal = parseInt(playerMoney.textContent) || 0;
    const resultText = playerResult.innerText;
    if (resultText && typeof resultText === 'string') {
        if (resultText.includes('🤑') || resultText.includes('🥳')) {
            playerTotal += playerBet * 2;
        } else if (!resultText.includes('😭')) {
            playerTotal -= playerBet;
        }
    }

    // update the player's bet/ total money
    playerTotalDisplay.textContent = playerTotal;
    playerBetDisplay.textContent = 0; // reset to 0 after every round
}

// ui 
const deal = document.getElementById('deal');
const hit = document.getElementById('hit');
const stand = document.getElementById('stand');
const newHand = document.getElementById('newHand');

deal.addEventListener('click', () => {
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
        showResult('Dealer has Blackjack!😱');
        endGame();
    } else {
        hit.disabled = false;
        stand.disabled = false;
    }
    deal.disabled = true;
});

hit.addEventListener('click', () => {
    dealCard(newPlayer, playerHand);
    newPlayer.addScore();
    console.log('Player score after hit:', newPlayer.score);
    if (newPlayer.score > 21) {
        showResult('Player Bust! Dealer wins!😭');
        endGame();
    }
});


stand.addEventListener('click', () => {
    hit.disabled = true;
    stand.disabled = true;
    newDealer.checkHand(dealerHand);
});

function dealAsNeeded() {
    while (newDealer.score < 17) {
        dealCard(newDealer, dealerHand);
        newDealer.addScore();
    }
    if (newDealer.checkForBusts(newPlayer.score) || newPlayer.score > newDealer.score) {
        showResult('Player wins!🥳');
    } else if (newPlayer.score < newDealer.score) {
        showResult('Dealer wins!😭');
    } else {
        showResult('Stand-off!😅');
    }
    endGame();
}

function endGame() {
    hit.disabled = true;
    stand.disabled = true;
    newHand.disabled = false;
}

newHand.addEventListener('click', () => {
    console.log("New hand button clicked...");
    resetGame();
});

