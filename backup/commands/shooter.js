export default {
    execute: function(args, terminal) {
        const width = 20;
        const height = 10;
        let playerX = Math.floor(width / 2);
        let bullets = [];
        let enemies = generateEnemies();
        let score = 0;

        const drawBoard = () => {
            terminal.clear();

            const board = Array.from({ length: height }, () => Array(width).fill(' '));

            // Place player
            board[height - 1][playerX] = 'A';

            // Place bullets
            bullets.forEach(bullet => {
                if (bullet.y >= 0) {
                    board[bullet.y][bullet.x] = '|';
                }
            });

            // Place enemies
            enemies.forEach(enemy => {
                if (enemy.y < height) {
                    board[enemy.y][enemy.x] = 'X';
                }
            });

            // Render board
            board.forEach(row => terminal.printLine(row.join('')));
            terminal.printLine(`Score: ${score}`);
        };

        const generateEnemies = () => {
            const enemyPositions = [];
            for (let i = 0; i < width; i += 2) {
                enemyPositions.push({ x: i, y: 0 });
            }
            return enemyPositions;
        };

        const moveEnemies = () => {
            enemies.forEach(enemy => {
                enemy.y += 1;
                if (enemy.y >= height) {
                    gameOver();
                }
            });
        };

        const moveBullets = () => {
            bullets = bullets.map(bullet => ({ ...bullet, y: bullet.y - 1 }));
            bullets = bullets.filter(bullet => bullet.y >= 0);
        };

        const checkCollisions = () => {
            bullets.forEach((bullet, bulletIndex) => {
                enemies.forEach((enemy, enemyIndex) => {
                    if (bullet.x === enemy.x && bullet.y === enemy.y) {
                        enemies.splice(enemyIndex, 1);
                        bullets.splice(bulletIndex, 1);
                        score += 10;
                    }
                });
            });
        };

        const gameOver = () => {
            clearInterval(gameLoop);
            terminal.printLine("Game Over! Final Score: " + score);
            terminal.inputCallback = () => {
                terminal.clear();
                terminal.inputCallback = null;
            };
        };

        const gameLoop = setInterval(() => {
            moveEnemies();
            moveBullets();
            checkCollisions();
            drawBoard();

            // Respawn enemies if all are destroyed
            if (enemies.length === 0) {
                enemies = generateEnemies();
            }
        }, 500);

        terminal.inputCallback = (input) => {
            switch (input.toLowerCase()) {
                case 'a':
                    if (playerX > 0) playerX -= 1;
                    break;
                case 'd':
                    if (playerX < width - 1) playerX += 1;
                    break;
                case ' ':
                    bullets.push({ x: playerX, y: height - 2 });
                    break;
                case 'exit':
                    clearInterval(gameLoop);
                    terminal.clear();
                    terminal.inputCallback = null;
                    return;
            }
            drawBoard();
        };

        drawBoard();
    },

    description: 'Play a Galaxy Shooter game in the terminal'
};
