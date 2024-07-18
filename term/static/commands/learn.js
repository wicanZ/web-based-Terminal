export default {
    execute: function(args, terminal) {
        // Create a modal container
        const modal = document.createElement('div');
        modal.classList.add('modal');

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Close button
        const closeButton = document.createElement('span');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        // Add content to the modal
        modalContent.appendChild(closeButton);
        modalContent.innerHTML += `
            <h2>Learn Programming</h2>
            <p>Select a programming language to learn:</p>
            <ul>
                <li><a href="#" onclick="loadLesson('js')">JavaScript</a></li>
                <li><a href="#" onclick="loadLesson('python')">Python</a></li>
                <li><a href="#" onclick="loadLesson('html')">HTML</a></li>
                <li><a href="#" onclick="loadLesson('css')">CSS</a></li>
                <!-- Add more languages as needed -->
            </ul>
            <div id="lesson-content"></div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Show the modal
        modal.style.display = 'block';

        // Function to load lessons
        window.loadLesson = function(language) {
            const lessonContent = document.getElementById('lesson-content');
            lessonContent.innerHTML = `<h3>Loading ${language} lessons...</h3>`;
            
            // Simulate an API call or load static content
            setTimeout(() => {
                lessonContent.innerHTML = getLessonContent(language);
            }, 1000);
        };

        // Function to get lesson content
        function getLessonContent(language) {
            switch(language) {
                case 'js':
                    return `
                        <h3>JavaScript Basics</h3>
                        <p>JavaScript is a versatile programming language used for web development...</p>
                        <!-- Add more lesson content -->
                    `;
                case 'python':
                    return `
                        <h3>Python Basics</h3>
                        <p>Python is a popular programming language known for its simplicity...</p>
                        <!-- Add more lesson content -->
                    `;
                case 'html':
                    return `
                        <h3>HTML Basics</h3>
                        <p>HTML is the standard markup language for creating web pages...</p>
                        <!-- Add more lesson content -->
                    `;
                case 'css':
                    return `
                        <h3>CSS Basics</h3>
                        <p>CSS is used to control the style and layout of web pages...</p>
                        <!-- Add more lesson content -->
                    `;
                default:
                    return `<p>No lessons available for ${language}</p>`;
            }
        }
    },
    description: 'Learn programming languages with interactive lessons'
};
