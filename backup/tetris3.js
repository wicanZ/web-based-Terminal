// ./commands/tetris.js

export default {
    execute: async function(args, terminal) {
        const rows = 20;
        const cols = 10;
        let board = Array.from({ length: rows }, () => Array(cols).fill(' '));
        const shapes = [
            { shape: [[1, 1, 1, 1]], color: 'I' },
            { shape: [[1, 1], [1, 1]], color: 'O' },
            { shape: [[0, 1, 0], [1, 1, 1]], color: 'T' },
            { shape: [[0, 1, 1], [1, 1, 0]], color: 'S' },
            { shape: [[1, 1, 0], [0, 1, 1]], color: 'Z' },
            { shape: [[1, 0, 0], [1, 1, 1]], color: 'L' },
            { shape: [[0, 0, 1], [1, 1, 1]], color: 'J' }
        ];

        let currentPiece = null;
        let currentX = 0;
        let currentY = 0;
        let interval;

        const drawBoard = () => {
            terminal.clear();
            let displayBoard = board.map(row => [...row]);
            if (currentPiece) {
                currentPiece.shape.forEach((row, dy) => {
                    row.forEach((cell, dx) => {
                        if (cell) {
                            displayBoard[currentY + dy][currentX + dx] = currentPiece.color;
                        }
                    });
                });
            }
            displayBoard.forEach(row => terminal.printLine(row.join(' ')));
        };

        const newPiece = () => {
            const rand = Math.floor(Math.random() * shapes.length);
            currentPiece = shapes[rand];
            currentX = Math.floor(cols / 2) - 1;
            currentY = 0;
            if (!canMove(0, 0)) {
                gameOver();
            }
        };

        const canMove = (dx, dy) => {
            return currentPiece.shape.every((row, y) => {
                return row.every((cell, x) => {
                    if (!cell) return true;
                    const newX = currentX + x + dx;
                    const newY = currentY + y + dy;
                    return (
                        newX >= 0 &&
                        newX < cols &&
                        newY >= 0 &&
                        newY < rows &&
                        board[newY][newX] === ' '
                    );
                });
            });
        };

        const move = (dx, dy) => {
            if (canMove(dx, dy)) {
                currentX += dx;
                currentY += dy;
                drawBoard();
                return true;
            }
            return false;
        };

        const rotate = () => {
            const newShape = currentPiece.shape[0].map((_, i) => currentPiece.shape.map(row => row[i]).reverse());
            const originalShape = currentPiece.shape;
            currentPiece.shape = newShape;
            if (!canMove(0, 0)) {
                currentPiece.shape = originalShape;
            }
            drawBoard();
        };

        const drop = () => {
            if (!move(0, 1)) {
                merge();
                clearLines();
                newPiece();
            }
        };

        const merge = () => {
            currentPiece.shape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        board[currentY + dy][currentX + dx] = currentPiece.color;
                    }
                });
            });
        };

        const clearLines = () => {
            let linesCleared = 0;
            board = board.filter(row => {
                if (row.every(cell => cell !== ' ')) {
                    linesCleared++;
                    return false;
                }
                return true;
            });
            while (board.length < rows) {
                board.unshift(Array(cols).fill(' '));
            }
            if (linesCleared > 0) {
                terminal.printLine(`Cleared ${linesCleared} line(s)!`);
            }
        };

        const gameOver = () => {
            clearInterval(interval);
            terminal.printLine('Game Over. Press any key to exit...');
            terminal.inputCallback = () => {
                terminal.clear();
                terminal.inputCallback = null;
            };
        };

        const gameLoop = () => {
            drop();
            drawBoard();
        };

        terminal.inputCallback = (input) => {
            switch (input.toLowerCase()) {
                case 'a':
                    move(-1, 0);
                    break;
                case 'd':
                    move(1, 0);
                    break;
                case 's':
                    drop();
                    break;
                case 'w':
                    rotate();
                    break;
                case 'esc':
                case 'exit':
                case 'ctrl+c':
                    clearInterval(interval);
                    terminal.printLine('Game exited.');
                    terminal.inputCallback = null;
                    return;
            }
        };

        newPiece();
        interval = setInterval(gameLoop, 1000);
        drawBoard();
    },
    description: 'Play a simplified version of Tetris with ASCII art.'
};
