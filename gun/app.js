// Initialize Gun
const gun = Gun();

// Get DOM elements
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Function to add message to the DOM
function addMessageToDOM(id, username, message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${username}: ${message}`;
    messageElement.setAttribute('data-id', id);
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom

    // Set timeout to remove the message after 10 seconds
    setTimeout(() => {
        removeMessage(id);
    }, 10000);
}

// Function to remove message from the DOM and Gun.js
function removeMessage(id) {
    // Remove message from the DOM
    const messageElement = messagesDiv.querySelector(`[data-id="${id}"]`);
    if (messageElement) {
        messagesDiv.removeChild(messageElement);
    }
    
    // Remove message from Gun.js
    gun.get('messages').get(id).put(null);
    
    // Clear Gun's localStorage state to ensure removal
    localStorage.clear();
}

// Listen for new messages in Gun
gun.get('messages').map().on((message, id) => {
    if (message) {
        addMessageToDOM(id, message.username, message.text);
    } else {
        removeMessage(id);
    }
});

// Send button click event
sendButton.addEventListener('click', () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
        const message = {
            username: 'Anonymous', // Replace with actual username logic if needed
            text: messageText,
            timestamp: Date.now()
        };
        gun.get('messages').set(message, (ack) => {
            const messageId = ack['#'];
            setTimeout(() => {
                removeMessage(messageId);
            }, 10000);
        });
        messageInput.value = ''; // Clear the input field
    }
});

// Enter key press event to send message
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
