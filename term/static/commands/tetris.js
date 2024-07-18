export default {
    execute: function(args, terminal) {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 400;
        terminal.outputElement.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const COLS = 10;
        const ROWS = 20;
        const BLOCK_SIZE = 20;

        const tetrominoes = [
            [1, 1, 1, 1], // I
            [1, 1, 1, 0, 1], // L
            [1, 1, 1, 0, 0, 1], // J
            [1, 1, 0, 1, 1], // O
            [1, 1, 0, 0, 1, 1], // Z
            [0, 1, 1, 1, 1], // S
            [0, 1, 0, 1, 1, 1] // T
        ];

        let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        let tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
        let position = { x: 3, y: 0 };

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    if (board[y][x]) {
                        ctx.fillStyle = 'blue';
                        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }
        }

        function drawTetromino() {
            ctx.fillStyle = 'red';
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (tetromino[y * 4 + x]) {
                        ctx.fillRect((position.x + x) * BLOCK_SIZE, (position.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.strokeRect((position.x + x) * BLOCK_SIZE, (position.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }
        }

        function moveTetromino(dx, dy) {
            position.x += dx;
            position.y += dy;
            if (position.y < 0 || position.x < 0 || position.x + 4 > COLS || position.y + 4 > ROWS) {
                position.x -= dx;
                position.y -= dy;
                return false;
            }
            return true;
        }

        function dropTetromino() {
            if (!moveTetromino(0, 1)) {
                mergeTetromino();
                tetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
                position = { x: 3, y: 0 };
            }
        }

        function mergeTetromino() {
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    if (tetromino[y * 4 + x]) {
                        board[position.y + y][position.x + x] = 1;
                    }
                }
            }
        }

        function gameLoop() {
            drawBoard();
            drawTetromino();
            dropTetromino();
            requestAnimationFrame(gameLoop);
        }

        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') moveTetromino(-1, 0);
            if (event.key === 'ArrowRight') moveTetromino(1, 0);
            if (event.key === 'ArrowDown') moveTetromino(0, 1);
            if (event.key === 'ArrowUp') moveTetromino(0, -1);
        });

        gameLoop();
    },
    description: 'Play the Tetris game'
};


// export default {
//     execute: function(args, terminal) {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         document.body.appendChild(canvas);

//         canvas.width = 300;
//         canvas.height = 600;
//         canvas.style.position = 'absolute';
//         canvas.style.top = '50%';
//         canvas.style.left = '50%';
//         canvas.style.transform = 'translate(-50%, -50%)';
//         canvas.style.border = '1px solid black';

//         const COLS = 10;
//         const ROWS = 20;
//         const BLOCK_SIZE = 30;

//         let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
//         let pieces = 'IJLOSTZ';
//         let colors = [
//             null, 'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
//         ];

//         function drawBoard() {
//             for (let row = 0; row < ROWS; row++) {
//                 for (let col = 0; col < COLS; col++) {
//                     ctx.fillStyle = colors[board[row][col]];
//                     ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
//                     ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
//                 }
//             }
//         }

//         function newPiece() {
//             const piece = pieces[pieces.length * Math.random() | 0];
//             return {
//                 x: COLS / 2 | 0,
//                 y: 0,
//                 shape: shapes[piece],
//                 color: colors[pieces.indexOf(piece) + 1]
//             };
//         }

//         function drawPiece(piece) {
//             ctx.fillStyle = piece.color;
//             piece.shape.forEach((row, y) => {
//                 row.forEach((value, x) => {
//                     if (value > 0) {
//                         ctx.fillRect((piece.x + x) * BLOCK_SIZE, (piece.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
//                         ctx.strokeRect((piece.x + x) * BLOCK_SIZE, (piece.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
//                     }
//                 });
//             });
//         }

//         let shapes = {
//             'I': [[1, 1, 1, 1]],
//             'J': [
//                 [2, 0, 0],
//                 [2, 2, 2]
//             ],
//             'L': [
//                 [0, 0, 3],
//                 [3, 3, 3]
//             ],
//             'O': [
//                 [4, 4],
//                 [4, 4]
//             ],
//             'S': [
//                 [0, 5, 5],
//                 [5, 5, 0]
//             ],
//             'T': [
//                 [0, 6, 0],
//                 [6, 6, 6]
//             ],
//             'Z': [
//                 [7, 7, 0],
//                 [0, 7, 7]
//             ]
//         };

//         let piece = newPiece();
//         drawBoard();
//         drawPiece(piece);

//         document.addEventListener('keydown', function(event) {
//             if (event.key === 'q') {
//                 document.body.removeChild(canvas);
//                 terminal.printLine('Exited Tetris game.');
//             }
//         });

//         function update() {
//             drawBoard();
//             drawPiece(piece);
//             piece.y += 1;

//             if (piece.y > ROWS) {
//                 piece = newPiece();
//             }

//             setTimeout(update, 1000);
//         }

//         update();
//     },
//     description: 'Play the Tetris game'
// };
