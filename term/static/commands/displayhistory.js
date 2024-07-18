export default {
    execute: function(args, terminal) {
        // Load the history
        const historyData = JSON.parse(localStorage.getItem(`tabHistory_${terminal.activeTab}`));
        if (!historyData) {
            terminal.displayOutput('No history found.');
            return;
        }

        const commandHistory = historyData.commandHistory || [];
        const outputHTML = historyData.outputHTML || '';

        // Create the popup container
        const popupContainer = document.createElement('div');
        popupContainer.id = 'history-popup';
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.width = '80%';
        popupContainer.style.height = '80%';
        popupContainer.style.backgroundColor = '#fff';
        popupContainer.style.border = '1px solid #000';
        popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popupContainer.style.padding = '20px';
        popupContainer.style.overflowY = 'auto';
        popupContainer.style.zIndex = '1000';
        popupContainer.style.transition = 'transform 0.3s ease-in-out';

        // Add content to the popup
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <h5>Command History</h5>
            <p>Press <strong>Ctrl+C</strong> or <strong>Esc</strong> to close this popup and return to the terminal.</p>
            <div class="history-output">${outputHTML}</div>
            <ul class="command-history">
                ${commandHistory.map(cmd => `<li>${cmd}</li>`).join('')}
            </ul>
            
        `;
        popupContainer.appendChild(popupContent);

        // Add the popup container to the document body
        document.body.appendChild(popupContainer);

        // Apply 3D transform to show the popup
        requestAnimationFrame(() => {
            popupContainer.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Function to close the popup
        const closePopup = () => {
            popupContainer.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                document.body.removeChild(popupContainer);
            }, 300);
        };

        // Add event listeners for Ctrl+C and Esc to close the popup
        const keydownHandler = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                closePopup();
                document.removeEventListener('keydown', keydownHandler);
            }
        };
        document.addEventListener('keydown', keydownHandler);
    },
    description: 'Displays the command history in a popup.',
};
