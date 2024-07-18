export default {
    execute: async function(args, terminal) {
        // Create the popup container
        const popupContainer = document.createElement('div');
        popupContainer.id = 'aboutme-popup';
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%) scale(0)';
        popupContainer.style.width = '80%';
        popupContainer.style.height = '80%';
        popupContainer.style.backgroundColor = '#f0f0f0';
        popupContainer.style.border = '1px solid #000';
        popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popupContainer.style.padding = '20px';
        popupContainer.style.overflowY = 'auto';
        popupContainer.style.zIndex = '1000';
        popupContainer.style.transition = 'transform 0.3s ease-in-out';

        // Add content to the popup
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <h1 style="text-align: center;">About This Terminal</h1>
            <p style="text-align: justify;">
                This terminal is a web-based simulation of a command-line interface, allowing you to execute various commands
                as if you were using a real terminal. The commands are implemented using JavaScript on the frontend and Django
                on the backend, providing a seamless integration between the client and server.
            </p>
            <p style="text-align: justify;">
                Some of the features of this terminal include:
                <ul>
                    <li>Custom commands for various utilities.</li>
                    <li>Interactive games and tools.</li>
                    <li>Integration with backend services for authentication and data retrieval.</li>
                    <li>A simple and intuitive design that mimics a real terminal environment.</li>
                </ul>
            </p>
            <p style="text-align: justify;">
                This terminal is designed to be easily extensible. New commands can be added by creating new JavaScript files
                and defining their behavior. The commands are organized in a modular fashion to maintain clean and readable code.
            </p>
            <p style="text-align: center;">
                Press <strong>Ctrl+C</strong> or <strong>Esc</strong> to close this popup and return to the terminal.
            </p>
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
    description: 'Display a 3D popup about this terminal',
};
