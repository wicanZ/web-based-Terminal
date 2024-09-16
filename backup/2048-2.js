export default {
    execute: function(args, terminal) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.createElement('div');
        document.body.appendChild(canvas);
        document.body.appendChild(scoreElement);

        canvas.width = 400;
        canvas.height = 400;
        canvas.style.position = 'absolute';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.border = '1px solid black';
        terminal.inputElement.disabled = true;

        scoreElement.style.position = 'absolute';
        scoreElement.style.top = 'calc(50% + 210px)';
        scoreElement.style.left = '50%';
        scoreElement.style.transform = 'translateX(-50%)';
        scoreElement.style.fontSize = '20px';
        scoreElement.style.fontFamily = 'Arial';
        scoreElement.style.marginTop = '10px';
        scoreElement.style.color = 'white';
        let score = 0;

        const SIZE = 4;
        const CELL_SIZE = 100;
        let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let row = 0; row < SIZE; row++) {
                for (let col = 0; col < SIZE; col++) {
                    ctx.fillStyle = board[row][col] === 0 ? 'lightgrey' : 'orange';
                    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

                    if (board[row][col] !== 0) {
                        ctx.font = '40px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'black';
                        ctx.fillText(board[row][col], col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2);
                    }
                }
            }
        }

        function updateScore(points) {
            score += points;
            scoreElement.innerText = `Score: ${score}`;
        }

        function addRandomTile() {
            let emptyCells = [];
            for (let row = 0; row < SIZE; row++) {
                for (let col = 0; col < SIZE; col++) {
                    if (board[row][col] === 0) {
                        emptyCells.push({ row, col });
                    }
                }
            }

            if (emptyCells.length > 0) {
                const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                board[row][col] = Math.random() < 0.9 ? 2 : 4;
            }
        }

        function slide(row) {
            let arr = row.filter(val => val);
            let missing = SIZE - arr.length;
            let zeros = Array(missing).fill(0);
            arr = zeros.concat(arr);
            return arr;
        }

        function combine(row) {
            for (let i = SIZE - 1; i >= 1; i--) {
                if (row[i] === row[i - 1]) {
                    row[i] *= 2;
                    row[i - 1] = 0;
                    updateScore(row[i]); // Update score
                }
            }
            return row;
        }

        function operate(row) {
            row = slide(row);
            row = combine(row);
            row = slide(row);
            return row;
        }

        function rotateLeft(matrix) {
            let result = [];
            for (let col = 0; col < SIZE; col++) {
                let newRow = [];
                for (let row = SIZE - 1; row >= 0; row--) {
                    newRow.push(matrix[row][col]);
                }
                result.push(newRow);
            }
            return result;
        }

        function rotateRight(matrix) {
            let result = [];
            for (let col = SIZE - 1; col >= 0; col--) {
                let newRow = [];
                for (let row = 0; row < SIZE; row++) {
                    newRow.push(matrix[row][col]);
                }
                result.push(newRow);
            }
            return result;
        }

        function endGame() {
            document.body.removeChild(canvas);
            document.body.removeChild(scoreElement);
            terminal.inputElement.disabled = false;
            terminal.inputElement.focus();
            terminal.animatetext(`Score : ${score}`) ;
        }

        addRandomTile();
        addRandomTile();
        drawBoard();
        updateScore(0); // Initialize score display

        document.addEventListener('keydown', function(event) {
            if (event.key === 'q') {
                document.body.removeChild(canvas);
                document.body.removeChild(scoreElement);
                terminal.printLine('Exited 2048 game.');
                endGame();
                return;
            }

            let played = false;
            if (event.key === 'ArrowUp') {
                let rotated = rotateLeft(board);
                rotated = rotated.map(row => operate(row));
                board = rotateRight(rotated);
                played = true;
            } else if (event.key === 'ArrowDown') {
                let rotated = rotateRight(board);
                rotated = rotated.map(row => operate(row));
                board = rotateLeft(rotated);
                played = true;
            } else if (event.key === 'ArrowLeft') {
                board = board.map(row => operate(row));
                played = true;
            } else if (event.key === 'ArrowRight') {
                board = board.map(row => operate(row.reverse()).reverse());
                played = true;
            }

            if (played) {
                addRandomTile();
                drawBoard();
            }
        });
    },
    description: 'Play the 2048 game and press q to exit'
};
