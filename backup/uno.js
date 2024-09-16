// ./commands/uno.js

export default {
    execute: async function(args, terminal) {
        // Utility function to prompt the user for input
        const promptUser = (question) => {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback; // Restore original callback
                    resolve(input.trim());
                };
                terminal.print(question);
            });
        };

        // Utility function to generate a deck of UNO cards
        const generateDeck = () => {
            const colors = ['Red', 'Yellow', 'Green', 'Blue'];
            const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let deck = [];

            colors.forEach(color => {
                values.forEach(value => {
                    deck.push({ color, value });
                    if (value !== '0') { // Each color has two sets of 1-9 and one set of 0
                        deck.push({ color, value });
                    }
                });
            });

            return shuffle(deck);
        };

        // Utility function to shuffle the deck
        const shuffle = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Function to deal cards to players
        const dealCards = (deck, numPlayers, numCards) => {
            let hands = Array.from({ length: numPlayers }, () => []);
            for (let i = 0; i < numCards; i++) {
                for (let j = 0; j < numPlayers; j++) {
                    hands[j].push(deck.pop());
                }
            }
            return hands;
        };

        // Function to display the current hand
        const displayHand = (hand) => {
            return hand.map(card => `${card.color} ${card.value}`).join(', ');
        };

        // Function to check if a card can be played
        const canPlay = (card, topCard) => {
            return card.color === topCard.color || card.value === topCard.value;
        };

        // Main game logic
        const playUno = async () => {
            const deck = generateDeck();
            const numPlayers = 2;
            let hands = dealCards(deck, numPlayers, 7);
            let topCard = deck.pop();
            let currentPlayer = 0;
            let winner = null;

            terminal.printLine(`Starting UNO! Top card: ${topCard.color} ${topCard.value}`);

            while (!winner) {
                const hand = hands[currentPlayer];
                terminal.printLine(`Player ${currentPlayer + 1}'s turn. Your hand: ${displayHand(hand)}`);
                terminal.printLine(`Top card: ${topCard.color} ${topCard.value}`);
                const userInput = await promptUser('Enter the card to play (color value) or "draw" to draw a card: ');

                if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'esc' || userInput.toLowerCase() === 'ctrl+c') {
                    terminal.printLine('Game exited.');
                    return;
                }

                if (userInput.toLowerCase() === 'draw') {
                    const newCard = deck.pop();
                    hand.push(newCard);
                    terminal.printLine(`You drew a ${newCard.color} ${newCard.value}`);
                } else {
                    const [color, value] = userInput.split(' ');
                    const cardIndex = hand.findIndex(card => card.color.toLowerCase() === color.toLowerCase() && card.value === value);

                    if (cardIndex !== -1 && canPlay(hand[cardIndex], topCard)) {
                        topCard = hand.splice(cardIndex, 1)[0];
                        terminal.printLine(`You played ${topCard.color} ${topCard.value}`);

                        if (hand.length === 0) {
                            winner = currentPlayer;
                        }
                    } else {
                        terminal.printLine('Invalid card. Please try again.');
                    }
                }

                currentPlayer = (currentPlayer + 1) % numPlayers;
            }

            terminal.printLine(`Player ${winner + 1} wins!`);
        };

        await playUno();
    },
    description: 'Play a simplified version of the UNO game.'
};
