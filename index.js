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
                points = 11; // default 11 will adjust value if needed when checking hand 
            const card = { Value: values[i], Suit: suits[j], Points: points };
            deck.push(card);
        }
    }
}
// shuffle deck
function shuffle() {
    for (let i = 0; i < 1000; i++) {
        var loc1 = Math.floor(Math.random() * deck.length);
        var loc2 = Math.floor(Math.random() * deck.length);
        var rdm = deck[loc1];
        deck[loc1] = deck[loc2];
        deck[loc2] = rdm;
    }
}





// create player 
const players = [];
function createPlayers(num) {
    players.length = 0;
    for (let i = 1; i <= num; i++) {
        const hand = [];
        const newPlayer = { Name: 'Player' + i, ID: i, Points: 0, Hand: hand };
        players.push(newPlayer);
    }
}

const dealers = [];
function createDealers(num) {
    dealers.length = 0;
    for (let i = 1; i <= num; i++) {
        const hand = [];
        const newDealer = { Name: 'Dealer' + i, ID: i, Points: 0, Hand: hand };
        dealers.push(newDealer);
    }
}








// start game
function startGame() {
    document.getElementById('deal').disabled = true;

    //reset ui
    document.getElementById('deal').value = 'New Hand';
    document.getElementById('status').style.display = 'none';

    // rest player, initialize game setup
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(1); // Assume one player for simplicity
    createDealers(1); // Assume one dealer for simplicity
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');

    // player controls enabled
    enablePlayerControls();
}

function enablePlayerControls() {
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    document.getElementById('double').disabled = false;
    document.getElementById('newHand').disabled = false;
}



// deal hand
function dealHands() {
    //  two cards to player
    for (let i = 0; i < 2; i++) {
        for (const player of players) {
            const card = deck.pop();
            player.Hand.push(card);
            updatePlayerHandUI(player);
        }
        const card = deck.pop();
        if (i === 0) {
            // deal face up
            dealers[0].Hand.push(card);
            updateDealerHandUI(dealers[0]);
        } else {
            // face down to 
            card.FaceDown = true;
            dealers[0].Hand.push(card);
            updateDealerHandUI(dealers[0]);
        }
    }
    updateDeck();
}

//create function that calculates points in hand
function evaluateHand(hand) {
    let totalPoints = 0;
    let numAces = 0;

    // total points
    for (const card of hand) {
        totalPoints += card.Points;
        if (card.Value === 'Ace')
            numAces++;
    }

    while (totalPoints > 21 && numAces > 0) {
        totalPoints -= 10; // adjusts 11 to 1
        numAces--;
    }
    return totalPoints;
}
function updatePlayerTotal(total) {
    const playerTotal = document.getElementById('playerMoney');
    playerTotal.textContent = total;
}
function updatePlayerBet(total) {
    const playerBet = document.getElementById('playerBet');
    playerBet.textContent = total;
}