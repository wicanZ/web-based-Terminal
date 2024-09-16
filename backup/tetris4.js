// ./commands/tetris.js

export default {
    execute: async function(args, terminal) {
        const width = 10;
        const height = 20;
        const emptyCell = ' ';
        const filledCell = '█';

        const shapes = [
            [[1, 1, 1, 1]],                // I shape
            [[1, 1], [1, 1]],              // O shape
            [[1, 1, 0], [0, 1, 1]],        // Z shape
            [[0, 1, 1], [1, 1, 0]],        // S shape
            [[0, 1, 0], [1, 1, 1]],        // T shape
            [[1, 0, 0], [1, 1, 1]],        // L shape
            [[0, 0, 1], [1, 1, 1]]         // J shape
        ];

        const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];

        let board = Array.from({ length: height }, () => Array(width).fill(emptyCell));
        let currentShape = getRandomShape();
        let currentX = Math.floor(width / 2) - Math.floor(currentShape[0].length / 2);
        let currentY = 0;
        let gameInterval;

        const drawBoard = () => {
            terminal.clear();
            const displayBoard = board.map(row => row.slice());
            currentShape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        displayBoard[currentY + dy][currentX + dx] = filledCell;
                    }
                });
            });
            displayBoard.forEach(row => terminal.printLine(row.join('')));
        };

        const canMove = (shape, offsetX, offsetY) => {
            return shape.every((row, dy) => {
                return row.every((cell, dx) => {
                    if (!cell) return true;
                    let newX = currentX + dx + offsetX;
                    let newY = currentY + dy + offsetY;
                    return (
                        newX >= 0 && newX < width &&
                        newY >= 0 && newY < height &&
                        board[newY][newX] === emptyCell
                    );
                });
            });
        };

        const mergeShape = () => {
            currentShape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        board[currentY + dy][currentX + dx] = filledCell;
                    }
                });
            });
        };

        const removeFullLines = () => {
            board = board.filter(row => row.some(cell => cell === emptyCell));
            while (board.length < height) {
                board.unshift(Array(width).fill(emptyCell));
            }
        };

        const gameOver = () => {
            clearInterval(gameInterval);
            terminal.printLine('Game Over');
            terminal.printLine('Press any key to exit...');
            terminal.inputCallback = () => {
                terminal.clear();
                terminal.inputCallback = null;
            };
        };

        const dropShape = () => {
            if (canMove(currentShape, 0, 1)) {
                currentY++;
            } else {
                mergeShape();
                removeFullLines();
                currentShape = getRandomShape();
                currentX = Math.floor(width / 2) - Math.floor(currentShape[0].length / 2);
                currentY = 0;
                if (!canMove(currentShape, 0, 0)) {
                    gameOver();
                }
            }
            drawBoard();
        };

        const moveShape = (dx) => {
            if (canMove(currentShape, dx, 0)) {
                currentX += dx;
            }
            drawBoard();
        };

        const rotateShape = () => {
            const rotatedShape = currentShape[0].map((_, index) =>
                currentShape.map(row => row[index]).reverse()
            );
            if (canMove(rotatedShape, 0, 0)) {
                currentShape = rotatedShape;
            }
            drawBoard();
        };

        terminal.inputCallback = (input) => {
            switch (input.toLowerCase()) {
                case 'a':
                    moveShape(-1);
                    break;
                case 'd':
                    moveShape(1);
                    break;
                case 's':
                    dropShape();
                    break;
                case 'w':
                    rotateShape();
                    break;
                case 'esc':
                case 'exit':
                case 'ctrl+c':
                    clearInterval(gameInterval);
                    terminal.printLine('Game exited.');
                    terminal.inputCallback = null;
                    return;
            }
        };

        const gameLoop = () => {
            dropShape();
        };

        drawBoard();
        gameInterval = setInterval(gameLoop, 1000);
    },
    description: 'Play a simplified version of Tetris with ASCII art.'
};
