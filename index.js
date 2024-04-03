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
        const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
        for (let value of values) {
            for (let suit of suits) {
                let points = (value === 'A') ? 11 : (isNaN(parseInt(value)) ? 10 : parseInt(value));
                this.cards.push(new Card(value, suit, points));
            }
        }
    }
    // shuffle refactored a bit
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

class Player {
    constructor(name) {
        this.score = 0;
        this.hand = [];
    }
    addScore() {
        this.score = 0;
        for (let i = 0; i < this.hand.length; i++) {
            const card = this.hand[i];
            this.score += card;
        }
    }
    checkFor21() {
        if (this.score == 21) {
            showResult();
            playerResult.innerText = '21! Blackjack!';
        }
    }
    checkForBusts() {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] == 11 && this.score > 21) {
                this.score = this.score - 10;
            }
        }
        if (this.score > 21) {
            showResult();
            playerResult.innerText = 'Bust! Dealer wins!';
        } else {
            return;
        }
    }
    removeCards() {
        let player = document.getElementById('playerHand');
        let cards = player.getElementsByClassName('card');
        for (let i = cards.length - 1; i >= 0; i--) {
            let allCards = cards[i];
            player.removeChild(allCards);
        }
    }
}

class Dealer {
    constructor() {
        this.score = 0;
        this.hand = [];
    }
    addScore() {
        this.score = 0;
        for (let i = 0; i < this.hand.length; i++) {
            const card = this.hand[i];
            this.score += card;
        }
    }
    checkFor21() {
        if (this.score == 21) {
            dealerHand.firstElementChild.classList.toggle('back');
            showResult();
            dealerResult.innerText = 'Dealer drew 21! Blackjack!';
        }
    }
    checkHand() {
        this.addScore();
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i] == 11 && this.score > 21) {
                this.score -= 10;
            }
        }
        if (this.score > 21) {
            showResult();
            dealerResult.innerText = 'Dealer Bust! You win!';
        }
        if (this.score < 17) {
            dealCard(dealerHand, this.hand);
            this.addScore();
        }
        if (this.score > 16 && this.score <= 21) {
            if (newPlayer.score > newDealer.score) {
                showResult();
                dealerResult.innerText = 'You win!';
                return;
            } else if (newPlayer.score < newDealer.score) {
                showResult();
                dealerResult.innerText = 'Dealer wins!';
                return;
            } else if (newPlayer.score == newDealer.score) {
                showResult();
                dealerResult.innerText = 'Stand-off!';
                return;
            } else {
                console.log(outcome);
                return;
            }
        }
    }
    removeCards() {
        let dealer = document.getElementById('dealerHand');
        let cards = dealer.getElementsByClassName('card');
        for (let i = cards.length - 1; i >= 0; i--) {
            let allCards = cards[i];
            dealer.removeChild(allCards);
        }
    }
}

const newDeck = new Deck;
newDeck.createDeck();
newDeck.createDeck();
newDeck.createDeck();
newDeck.shuffle();

const newPlayer = new Player;
const newDealer = new Dealer;

