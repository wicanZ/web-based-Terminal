export default {
    execute: async function(args, terminal) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
        modal.style.zIndex = '1000';
        modal.style.overflowY = 'scroll';
        modal.style.padding = '20px';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';

        const closeModal = () => {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', keyHandler);
            terminal.inputElement.disabled = false;
            terminal.inputElement.focus();
        };

        const keyHandler = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                closeModal();
            }
        };

        document.addEventListener('keydown', keyHandler);

        terminal.inputElement.disabled = true;

        try {
            const response = await fetch('/get_images/');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const images = await response.json();

            images.forEach(image => {
                const imgDiv = document.createElement('div');
                imgDiv.style.margin = '10px';
                imgDiv.style.textAlign = 'center';

                const img = document.createElement('img');
                img.src = image.url;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';

                const name = document.createElement('p');
                name.style.color = 'white';
                name.textContent = image.name;

                imgDiv.appendChild(img);
                imgDiv.appendChild(name);
                modal.appendChild(imgDiv);
            });

            document.body.appendChild(modal);
        } catch (error) {
            terminal.displayOutput(`Error fetching images: ${error.message}`);
            terminal.inputElement.disabled = false;
            terminal.inputElement.focus();
        }
    },
    description: 'Display a modal with images and their names fetched from the backend'
};
