export default {
    execute: function(args, terminal) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);

        canvas.width = 450;
        canvas.height = 450;
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.border = '1px solid red';

        const BOARD_SIZE = 450;
        const CELL_SIZE = BOARD_SIZE / 9;

        const board = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const x = col * CELL_SIZE;
                    const y = row * CELL_SIZE;

                    ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

                    if (board[row][col] !== 0) {
                        ctx.font = '20px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(board[row][col], x + CELL_SIZE / 2, y + CELL_SIZE / 2);
                    }
                }
            }
        }

        drawBoard();

        document.addEventListener('keydown', function(event) {
            if (event.key === 'q') {
                document.body.removeChild(canvas);
                terminal.printLine('Exited Sudoku game.');
            }
        });
    },
    description: 'Play the Sudoku game'
};
