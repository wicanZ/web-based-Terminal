export default {
    execute: function(args, terminal) {
        class Game2048 {
            constructor(terminal) {
                this.terminal = terminal;
                this.gridSize = 4;
                this.grid = this.createEmptyGrid();
                this.addNewTile();
                this.addNewTile();
                this.renderGrid();
                this.setupInput();
                this.disableTerminalInput();
            }

            createEmptyGrid() {
                return Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
            }

            addNewTile() {
                let emptyCells = [];
                for (let r = 0; r < this.gridSize; r++) {
                    for (let c = 0; c < this.gridSize; c++) {
                        if (this.grid[r][c] === 0) emptyCells.push([r, c]);
                    }
                }

                if (emptyCells.length > 0) {
                    let [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
                }
            }

            renderGrid() {
                this.terminal.outputElement.innerHTML = ''; // Clear terminal

                this.grid.forEach(row => {
                    const line = document.createElement("div");
                    line.classList.add("terminal-line");
                    line.textContent = row.map(val => val === 0 ? '#' : val).join(' ');
                    this.terminal.outputElement.appendChild(line);
                });
            }

            setupInput() {
                this.handleInput = this.handleInput.bind(this);
                document.addEventListener("keydown", this.handleInput);
            }

            handleInput(e) {
                let moved = false;
                switch (e.key) {
                    case 'ArrowUp':
                        moved = this.moveUp();
                        break;
                    case 'ArrowDown':
                        moved = this.moveDown();
                        break;
                    case 'ArrowLeft':
                        moved = this.moveLeft();
                        break;
                    case 'ArrowRight':
                        moved = this.moveRight();
                        break;
                    case 'q':
                    case 'Escape':
                        this.exitGame();
                        return;
                }

                if (moved) {
                    this.addNewTile();
                    this.renderGrid();
                    if (this.isGameOver()) {
                        this.terminal.displayOutput('Game Over! Press Enter to restart.');
                        document.removeEventListener("keydown", this.handleInput);
                        document.addEventListener("keydown", (e) => {
                            if (e.key === "Enter") {
                                this.startNewGame();
                            }
                        }, { once: true });
                    }
                }
            }

            moveUp() {
                let moved = false;
                for (let c = 0; c < this.gridSize; c++) {
                    let col = this.grid.map(row => row[c]);
                    let newCol = this.mergeTiles(col);
                    for (let r = 0; r < this.gridSize; r++) {
                        if (this.grid[r][c] !== newCol[r]) moved = true;
                        this.grid[r][c] = newCol[r];
                    }
                }
                return moved;
            }

            moveDown() {
                let moved = false;
                for (let c = 0; c < this.gridSize; c++) {
                    let col = this.grid.map(row => row[c]).reverse();
                    let newCol = this.mergeTiles(col).reverse();
                    for (let r = 0; r < this.gridSize; r++) {
                        if (this.grid[r][c] !== newCol[r]) moved = true;
                        this.grid[r][c] = newCol[r];
                    }
                }
                return moved;
            }

            moveLeft() {
                let moved = false;
                for (let r = 0; r < this.gridSize; r++) {
                    let newRow = this.mergeTiles(this.grid[r]);
                    if (this.grid[r].toString() !== newRow.toString()) moved = true;
                    this.grid[r] = newRow;
                }
                return moved;
            }

            moveRight() {
                let moved = false;
                for (let r = 0; r < this.gridSize; r++) {
                    let newRow = this.mergeTiles(this.grid[r].slice().reverse()).reverse();
                    if (this.grid[r].toString() !== newRow.toString()) moved = true;
                    this.grid[r] = newRow;
                }
                return moved;
            }

            mergeTiles(line) {
                let newLine = line.filter(val => val !== 0);
                for (let i = 0; i < newLine.length - 1; i++) {
                    if (newLine[i] === newLine[i + 1]) {
                        newLine[i] *= 2;
                        newLine[i + 1] = 0;
                    }
                }
                return newLine.filter(val => val !== 0).concat(Array(this.gridSize).fill(0)).slice(0, this.gridSize);
            }

            isGameOver() {
                for (let r = 0; r < this.gridSize; r++) {
                    for (let c = 0; c < this.gridSize; c++) {
                        if (this.grid[r][c] === 0) return false;
                        if (c < this.gridSize - 1 && this.grid[r][c] === this.grid[r][c + 1]) return false;
                        if (r < this.gridSize - 1 && this.grid[r][c] === this.grid[r + 1][c]) return false;
                    }
                }
                return true;
            }

            startNewGame() {
                this.grid = this.createEmptyGrid();
                this.addNewTile();
                this.addNewTile();
                this.renderGrid();
                this.setupInput();
            }

            exitGame() {
                document.removeEventListener("keydown", this.handleInput);
                this.enableTerminalInput();
                this.terminal.displayOutput('Exited 2048 game.');
            }

            disableTerminalInput() {
                this.terminal.inputElement.disabled = true;
            }

            enableTerminalInput() {
                this.terminal.inputElement.disabled = false;
                this.terminal.inputElement.focus();
            }
        }

        new Game2048(terminal);
    },
    description: 'Play the 2048 game'
};
