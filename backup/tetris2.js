// ./commands/tetris.js

export default {
    execute: async function(args, terminal) {
        // Tetris configuration
        const cols = 10;
        const rows = 20;
        const board = Array.from({ length: rows }, () => Array(cols).fill(0));
        const shapes = [
            [[1, 1, 1, 1]],  // I shape
            [[1, 1], [1, 1]],  // O shape
            [[0, 1, 0], [1, 1, 1]],  // T shape
            [[1, 1, 0], [0, 1, 1]],  // S shape
            [[0, 1, 1], [1, 1, 0]]   // Z shape
        ];

        let currentShape = shapes[Math.floor(Math.random() * shapes.length)];
        let currentX = 3, currentY = 0;
        let interval;

        const drawBoard = () => {
            terminal.clear();
            board.forEach(row => {
                terminal.printLine(row.map(cell => (cell ? '[]' : '  ')).join(''));
            });
        };

        const canMove = (shape, offsetX, offsetY) => {
            return shape.every((row, dy) => {
                return row.every((cell, dx) => {
                    let x = currentX + dx + offsetX;
                    let y = currentY + dy + offsetY;
                    return (
                        cell === 0 ||
                        (x >= 0 && x < cols && y < rows && board[y][x] === 0)
                    );
                });
            });
        };

        const mergeShape = () => {
            currentShape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell) {
                        board[currentY + dy][currentX + dx] = cell;
                    }
                });
            });
        };

        const removeFullLines = () => {
            let lines = 0;
            board.forEach((row, y) => {
                if (row.every(cell => cell !== 0)) {
                    board.splice(y, 1);
                    board.unshift(Array(cols).fill(0));
                    lines++;
                }
            });
            if (lines > 0) {
                terminal.printLine(`Removed ${lines} line(s)`);
            }
        };

        const gameOver = () => {
            clearInterval(interval);
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
                currentShape = shapes[Math.floor(Math.random() * shapes.length)];
                currentX = 3;
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
                case 'w':
                    rotateShape();
                    break;
                case 's':
                    dropShape();
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

        interval = setInterval(dropShape, 1000);
        drawBoard();
    },
    description: 'Play a simplified version of Tetris in the terminal.'
};
