// build deck of cards
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const deck = [];

function createDeck() {
    for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < suits.length; j++) {
            const points = parseInt(values[i]);
            if (values[i] === 'Jack' || values[i] === 'Queen' || values[i] === 'King')
                points = 10;
            if (values[i] === 'Ace')
                points = 11;
            const card = { Value: values[i], Suit: suits[j], Points: points };
            deck.push(card);
        }
    }
}