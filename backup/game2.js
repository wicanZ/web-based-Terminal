// ./commands/game.js

export default {
    execute: async function(args, terminal) {
        // Define the game's state and world
        const gameState = {
            location: 'start',
            inventory: [],
            gameOver: false
        };

        const locations = {
            start: {
                description: `
You are at the start of your adventure.
There is a path to the north.`,
                asciiArt: `
      .____.
     /     \\
     |() ()|
     \  ^  /
      |||||
      |||||
`,
                exits: { north: 'forest' }
            },
            forest: {
                description: `
You are in a dense forest.
Paths lead to the south and east.`,
                asciiArt: `0v0`,
// //       .     .
// //     ..  :``;  :  ..
// //    ` ' '     ` '
// //       :         :
// //       :         :
// //      :  _____  :
// //     :  /     \  :
// //    :  /       \  :
// //   :  |  ^   ^  |  :
// //    : |  o   o  | :
// //     :\    O    /:
// //       \_______/
// `,
                exits: { south: 'start', east: 'cave' }
            },
            cave: {
                description: `
You are in a dark cave.
A path leads west back to the forest.
There is a treasure chest here.`,
                asciiArt: `
                   ________
                .-"      "-.
               /            \\
              |              |
              |,  .-.  .-.  ,|
              | )(__/  \__)( |
              |/     /\     \|
    _         (_     ^^     _)
   ( \         \__|IIIIII|__/
    \ \        | \IIIIII/ |
     \ \  _    \          /
      \ \/ )    '-......-'
       \  /           \\
        \(             '.
         '._.---._.  ._/ 
`,
                exits: { west: 'forest' }
            }
        };

        const commands = {
            look: () => {
                const location = locations[gameState.location];
                terminal.printLine(location.asciiArt);
                terminal.printLine(location.description);
                Object.keys(location.exits).forEach(exit => {
                    terminal.printLine(`There is a path to the ${exit}.`);
                });
            },
            go: (direction) => {
                const location = locations[gameState.location];
                if (location.exits[direction]) {
                    gameState.location = location.exits[direction];
                    commands.look();
                } else {
                    terminal.printLine(`You can't go that way.`);
                }
            },
            take: (item) => {
                if (gameState.location === 'cave' && item === 'treasure') {
                    terminal.printLine('You take the treasure. You win!');
                    gameState.inventory.push(item);
                    gameState.gameOver = true;
                } else {
                    terminal.printLine(`You can't take that.`);
                }
            },
            inventory: () => {
                if (gameState.inventory.length === 0) {
                    terminal.printLine('Your inventory is empty.');
                } else {
                    terminal.printLine('You have: ' + gameState.inventory.join(', '));
                }
            }
        };

        // Display the initial location
        commands.look();

        // Main game loop
        while (!gameState.gameOver) {
            const userInput = await promptUser('> ');
            const [command, ...args] = userInput.split(' ');

            if (commands[command]) {
                commands[command](...args);
            } else {
                terminal.printLine('I don\'t understand that command.');
            }

            if (gameState.gameOver) {
                terminal.printLine('Game Over. Thanks for playing!');
            }
        }

        // Function to prompt the user for input
        function promptUser(question) {
            return new Promise(resolve => {
                const originalCallback = terminal.inputCallback;
                terminal.inputCallback = (input) => {
                    terminal.inputCallback = originalCallback;
                    resolve(input.trim());
                };
                terminal.print(question);
            });
        }
    },
    description: 'Play a simple text-based adventure game with ASCII art.'
};
