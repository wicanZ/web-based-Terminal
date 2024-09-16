export default {
    execute: function(args, terminal) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        document.body.appendChild(container);

        const simonContainer = document.createElement('div');
        simonContainer.style.width = '300px';
        simonContainer.style.height = '300px';
        simonContainer.style.display = 'grid';
        simonContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        simonContainer.style.gridTemplateRows = 'repeat(2, 1fr)';
        container.appendChild(simonContainer);

        const colors = ['red', 'green', 'blue', 'yellow'];
        const sequence = [];
        let playerSequence = [];
        let level = 0;

        colors.forEach(color => {
            const button = document.createElement('div');
            button.style.backgroundColor = color;
            button.style.width = '100%';
            button.style.height = '100%';
            button.style.border = '1px solid black';
            button.addEventListener('click', () => {
                playerSequence.push(color);
                checkSequence();
            });
            simonContainer.appendChild(button);
        });

        function nextLevel() {
            playerSequence = [];
            level++;
            const nextColor = colors[Math.floor(Math.random() * colors.length)];
            sequence.push(nextColor);
            showSequence();
        }

        function showSequence() {
            let index = 0;
            const interval = setInterval(() => {
                if (index < sequence.length) {
                    const color = sequence[index];
                    const button = simonContainer.children[colors.indexOf(color)];
                    button.style.opacity = '0.5';
                    setTimeout(() => {
                        button.style.opacity = '1';
                    }, 500);
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }

        function checkSequence() {
            for (let i = 0; i < playerSequence.length; i++) {
                if (playerSequence[i] !== sequence[i]) {
                    alert('Game Over! You reached level ' + level);
                    container.remove();
                    terminal.enableInput();
                    return;
                }
            }
            if (playerSequence.length === sequence.length) {
                nextLevel();
            }
        }

        nextLevel();

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                container.remove();
                terminal.enableInput();
            }
        });

        terminal.disableInput();
    },
    description: 'Play the Simon memory game'
};
