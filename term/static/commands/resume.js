export default {
    execute: function(args, terminal) {
        // Create the resume popup container
        const popup = document.createElement('div');
        popup.id = 'resume-popup';
        popup.className = 'popup hidden';

        // Create the resume content
        const resumeContent = document.createElement('div');
        resumeContent.className = 'resume-content';
        resumeContent.innerHTML = `
            <h1>My Resume</h1>
            <p>Experience, Education, Skills, etc.</p>
            <!-- You can add more sections as needed -->
        `;
        popup.appendChild(resumeContent);

        // Append the popup to the terminal element
        terminal.element.appendChild(popup);

        // Add CSS styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            .popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                width: 80%;
                height: 80%;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                transition: transform 0.3s ease-in-out;
            }
            .popup.show {
                transform: translate(-50%, -50%) scale(1);
            }
            .resume-content {
                padding: 20px;
                overflow-y: auto;
                height: 100%;
            }
            .hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);

        // Show the popup
        popup.classList.remove('hidden');
        popup.classList.add('show');

        // Close the popup on 'Escape' or 'Ctrl+C'
        const closePopup = (event) => {
            if (event.key === 'Escape' || (event.key === 'c' && event.ctrlKey)) {
                popup.classList.remove('show');
                popup.classList.add('hidden');
                document.removeEventListener('keydown', closePopup);
                terminal.element.removeChild(popup);
            }
        };

        document.addEventListener('keydown', closePopup);
    },
    description: 'Display the resume in a 3D popup'
};
