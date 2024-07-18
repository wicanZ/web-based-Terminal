export default {
    execute: async function(args, terminal) {
        // Disable input
        terminal.inputElement.disabled = true;

        // Create container for image cards
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'center';
        container.style.gap = '10px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#000';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflowY = 'auto';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.zIndex = '1000';

        // Fetch images from the internet
        try {
            const response = await fetch('https://api.unsplash.com/photos/random?count=10&client_id=YOUR_UNSPLASH_API_KEY');
            const images = await response.json();

            images.forEach(image => {
                const card = document.createElement('div');
                card.style.width = '200px';
                card.style.margin = '10px';
                card.style.border = '1px solid #ccc';
                card.style.borderRadius = '5px';
                card.style.overflow = 'hidden';
                card.style.backgroundColor = '#fff';

                const img = document.createElement('img');
                img.src = image.urls.small;
                img.alt = image.alt_description || 'Image';
                img.style.width = '100%';
                img.style.height = 'auto';

                const caption = document.createElement('div');
                caption.style.padding = '10px';
                caption.style.textAlign = 'center';
                caption.style.color = '#333';
                caption.innerText = image.description || image.alt_description || 'No description';

                card.appendChild(img);
                card.appendChild(caption);
                container.appendChild(card);
            });

            terminal.element.appendChild(container);
        } catch (error) {
            terminal.printLine('Error fetching images.');
        }

        const closeViewer = () => {
            container.remove();
            terminal.inputElement.disabled = false;
            terminal.inputElement.focus();
        };

        // Exit viewer on Esc or Ctrl+C
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' || (event.ctrlKey && event.key === 'c')) {
                closeViewer();
                window.removeEventListener('keydown', handleKeyDown);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
    },
    description: 'Display images in a responsive card view fetched from the internet',
};
