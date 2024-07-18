export default {
    execute: async function(args, terminal) {
        // Create chat popup
        const chatPopup = document.createElement('div');
        chatPopup.style.position = 'fixed';
        chatPopup.style.bottom = '10px';
        chatPopup.style.right = '10px';
        chatPopup.style.width = '300px';
        chatPopup.style.height = '400px';
        chatPopup.style.backgroundColor = 'white';
        chatPopup.style.border = '1px solid #ccc';
        chatPopup.style.zIndex = '1000';
        chatPopup.style.overflow = 'auto';
        chatPopup.style.display = 'flex';
        chatPopup.style.flexDirection = 'column';
        
        // Chat messages container
        const messagesContainer = document.createElement('div');
        messagesContainer.style.flex = '1';
        messagesContainer.style.padding = '10px';
        messagesContainer.style.overflowY = 'auto';

        // Chat input
        const chatInput = document.createElement('input');
        chatInput.type = 'text';
        chatInput.style.width = 'calc(100% - 20px)';
        chatInput.style.margin = '10px';
        chatInput.style.border = '1px solid #ccc';
        chatInput.style.padding = '5px';
        
        chatPopup.appendChild(messagesContainer);
        chatPopup.appendChild(chatInput);
        document.body.appendChild(chatPopup);

        const socket = new WebSocket('ws://localhost:8000/ws/chat/');

        socket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            const message = data.message;

            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        socket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };

        chatInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                const message = chatInput.value.trim();
                if (message) {
                    socket.send(JSON.stringify({ 'message': message }));
                    chatInput.value = '';
                }
            }
        });

        terminal.displayOutput('Chat started. Type your messages in the popup.');
    },
    description: 'Start a chat session with other users.'
};
