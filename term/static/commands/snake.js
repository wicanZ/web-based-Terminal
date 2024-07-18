export default {
    execute: async function(args, terminal) {
        const container = document.createElement('div');
        container.id = 'snake-container';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.width = '300px';
        container.style.height = '300px';
        container.style.backgroundColor = '#000';
        container.style.border = '1px solid #fff';
        container.style.zIndex = '1000';

        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.id = 'snake-game';
        container.appendChild(canvas);

        document.body.appendChild(container);

        // Disable terminal input
        terminal.inputElement.disabled = true;

        // Add event listener to close the game on Esc key press
        const closeGame = (event) => {
            if (event.key === 'Escape') {
                document.body.removeChild(container);
                terminal.inputElement.disabled = false;
                terminal.inputElement.focus();
                document.removeEventListener('keydown', closeGame);
            }
        };

        document.addEventListener('keydown', closeGame);

        // Snake game logic
        const ctx = canvas.getContext('2d');
        const scale = 10;
        const rows = canvas.height / scale;
        const columns = canvas.width / scale;

        let snake;
        let fruit ;

        (function setup() {
            snake = new Snake();
            fruit = new Fruit();
            fruit.pickLocation();

            window.setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                fruit.draw();
                snake.update();
                snake.draw();

                if (snake.eat(fruit)) {
                    fruit.pickLocation();
                }

                snake.checkCollision();
            }, 250);
        }());

        function Snake() {
            this.x = 0;
            this.y = 0;
            this.xSpeed = scale * 1;
            this.ySpeed = 0;
            this.total = 0;
            this.tail = [];

            this.draw = function() {
                ctx.fillStyle = "#FFFFFF";

                for (let i = 0; i < this.tail.length; i++) {
                    ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
                }

                ctx.fillRect(this.x, this.y, scale, scale);
            };

            this.update = function() {
                for (let i = 0; i < this.tail.length - 1; i++) {
                    this.tail[i] = this.tail[i + 1];
                }

                this.tail[this.total - 1] = { x: this.x, y: this.y };

                this.x += this.xSpeed;
                this.y += this.ySpeed;

                if (this.x >= canvas.width) {
                    this.x = 0;
                }

                if (this.y >= canvas.height) {
                    this.y = 0;
                }

                if (this.x < 0) {
                    this.x = canvas.width - scale;
                }

                if (this.y < 0) {
                    this.y = canvas.height - scale;
                }
            };

            this.changeDirection = function(direction) {
                switch(direction) {
                    case 'Up':
                        if (this.ySpeed === 0) {
                            this.xSpeed = 0;
                            this.ySpeed = -scale * 1;
                        }
                        break;
                    case 'Down':
                        if (this.ySpeed === 0) {
                            this.xSpeed = 0;
                            this.ySpeed = scale * 1;
                        }
                        break;
                    case 'Left':
                        if (this.xSpeed === 0) {
                            this.xSpeed = -scale * 1;
                            this.ySpeed = 0;
                        }
                        break;
                    case 'Right':
                        if (this.xSpeed === 0) {
                            this.xSpeed = scale * 1;
                            this.ySpeed = 0;
                        }
                        break;
                }
            };

            this.eat = function(fruit) {
                if (this.x === fruit.x && this.y === fruit.y) {
                    this.total++;
                    return true;
                }

                return false;
            };

            this.checkCollision = function() {
                for (let i = 0; i < this.tail.length; i++) {
                    if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                        this.total = 0;
                        this.tail = [];
                    }
                }
            };
        }

        function Fruit() {
            this.x;
            this.y;

            this.pickLocation = function() {
                this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
                this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
            };

            this.draw = function() {
                ctx.fillStyle = "#4cafab";
                ctx.fillRect(this.x, this.y, scale, scale);
            };
        }

        window.addEventListener('keydown', (event) => {
            const direction = event.key.replace('Arrow', '');
            snake.changeDirection(direction);
        });
    },
    description: 'Play the classic Snake game'
};
