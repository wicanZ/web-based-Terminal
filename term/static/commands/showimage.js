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

        // Assume you have an array of image objects with url and name properties
        const images = [
            {url: 'path/to/image1.jpg', name: 'Image 1'},
            {url: 'path/to/image2.jpg', name: 'Image 2'},
            // Add all your images here
        ];

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
    },
    description: 'Display a modal with images and their names'
};
