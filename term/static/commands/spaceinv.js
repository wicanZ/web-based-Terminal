export default {
    execute: async function(args, terminal) {
        const container = document.createElement('div');
        container.id = 'space-invaders-container';
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.backgroundColor = '#000';
        container.style.border = '1px solid #fff';
        container.style.zIndex = '1000';

        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.id = 'space-invaders-game';
        container.appendChild(canvas);

        document.body.appendChild(container);

        // Disable terminal input
        terminal.inputElement.disabled = true;

        // Add event listener to close the game on Esc key press
        const closeGame = (event) => {
            if (event.key === 'Escape' || event.key === 'c') {
                document.body.removeChild(container);
                terminal.inputElement.disabled = false;
                terminal.inputElement.focus();
                document.removeEventListener('keydown', closeGame);
            }
        };

        document.addEventListener('keydown', closeGame);

        // Space Invaders game logic
        const ctx = canvas.getContext('2d');

        const invaderImage = new Image();
        invaderImage.src = 'path/to/invader.png';

        class Player {
            constructor() {
                this.width = 50;
                this.height = 50;
                this.x = (canvas.width / 2) - (this.width / 2);
                this.y = canvas.height - this.height - 10;
                this.speed = 5;
                this.lives = 3;
            }

            draw() {
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }

            moveLeft() {
                if (this.x > 0) {
                    this.x -= this.speed;
                }
            }

            moveRight() {
                if (this.x + this.width < canvas.width) {
                    this.x += this.speed;
                }
            }
        }

        class Invader {
            constructor(x, y) {
                this.width = 40;
                this.height = 40;
                this.x = x;
                this.y = y;
                this.speed = 2;
            }

            draw() {
                ctx.drawImage(invaderImage, this.x, this.y, this.width, this.height);
            }

            move() {
                this.y += this.speed;
            }
        }

        const player = new Player();
        const invaders = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 11; j++) {
                invaders.push(new Invader(j * 60, i * 60));
            }
        }

        function updateGame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            player.draw();
            invaders.forEach(invader => {
                invader.move();
                invader.draw();
            });

            requestAnimationFrame(updateGame);
        }

        function handleKeydown(event) {
            if (event.key === 'ArrowLeft') {
                player.moveLeft();
            } else if (event.key === 'ArrowRight') {
                player.moveRight();
            }
        }

        document.addEventListener('keydown', handleKeydown);
        updateGame();
    },
    description: 'Play Space Invaders game'
};
