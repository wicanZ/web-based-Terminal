export default {
    execute: function(args, terminal) {
        // Create and style the canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 400;
        canvas.style.border = '2px solid #875349';
        canvas.style.backgroundColor = '#fff';
        canvas.style.position = 'fixed';
        canvas.style.top = '50%';
        canvas.style.left = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.zIndex = '1000';

        document.body.appendChild(canvas);
        terminal.inputElement.disabled = true;

        // Snake game variables
        const box = 20;
        let snake = [{ x: 9 * box, y: 10 * box }];
        let food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        let score = 0;
        let direction;

        // Handle keyboard input for direction
        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
            else if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
            else if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
            else if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
            else if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) endGame();
        });

        function endGame() {
            clearInterval(game);
            document.body.removeChild(canvas);
            terminal.inputElement.disabled = false;
            terminal.inputElement.focus();
            terminal.printLine(`Game Over! Your score was: ${score}`);
        }

        function collision(newHead, snake) {
            for (let i = 0; i < snake.length; i++) {
                if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                    return true;
                }
            }
            return false;
        }

        function draw() {
            context.fillStyle = '#465983';
            context.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < snake.length; i++) {
                context.fillStyle = (i === 0) ? 'green' : 'white';
                context.fillRect(snake[i].x, snake[i].y, box, box);
                context.strokeStyle = 'red';
                context.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            context.fillStyle = 'red';
            context.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (direction === 'UP') snakeY -= box;
            if (direction === 'DOWN') snakeY += box;
            if (direction === 'LEFT') snakeX -= box;
            if (direction === 'RIGHT') snakeX += box;

            if (snakeX === food.x && snakeY === food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * 19 + 1) * box,
                    y: Math.floor(Math.random() * 19 + 1) * box
                };
            } else {
                snake.pop();
            }

            let newHead = {
                x: snakeX,
                y: snakeY
            };

            if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
                endGame();
            }

            snake.unshift(newHead);
        }

        let game = setInterval(draw, 600);
    },
    description: 'Play the Snake game'
};
