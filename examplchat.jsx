<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT-Style Chat Interface</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #212121;
            color: #ececec;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }

        .message {
            width: 100%;
            padding: 24px 0;
            border-bottom: 1px solid #2f2f2f;
        }

        .message-content {
            max-width: 768px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: flex-start;
        }

        .user-message {
            background: #2f2f2f;
        }

        .ai-message {
            background: #212121;
        }

        .content {
            flex: 1;
            font-size: 16px;
            line-height: 1.7;
            color: #ececec;
            word-wrap: break-word;
        }

        .content p {
            margin-bottom: 16px;
        }

        .content p:last-child {
            margin-bottom: 0;
        }

        .content code {
            background: #0d1117;
            color: #f0f6fe;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
        }

        .content pre {
            background: #0d1117;
            color: #f0f6fe;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.4;
        }

        .content ul, .content ol {
            margin: 16px 0;
            padding-left: 24px;
        }

        .content li {
            margin: 8px 0;
        }

        .input-container {
            background: #212121;
            padding: 20px;
            border-top: 1px solid #2f2f2f;
        }

        .input-wrapper {
            max-width: 768px;
            margin: 0 auto;
            position: relative;
            background: #2f2f2f;
            border-radius: 12px;
            padding: 12px 60px 12px 16px;
            border: 1px solid #404040;
        }

        .input-wrapper:focus-within {
            border-color: #5436da;
            box-shadow: 0 0 0 3px rgba(84, 54, 218, 0.1);
        }

        #messageInput {
            width: 100%;
            border: none;
            outline: none;
            font-size: 16px;
            background: transparent;
            color: #ececec;
            resize: none;
            max-height: 200px;
            min-height: 24px;
            line-height: 1.5;
            font-family: inherit;
        }

        #messageInput::placeholder {
            color: #8e8ea0;
        }

        #sendButton {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            background: #5436da;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        #sendButton:hover:not(:disabled) {
            background: #4c2ec7;
        }

        #sendButton:disabled {
            background: #404040;
            cursor: not-allowed;
            color: #8e8ea0;
        }

        .typing-indicator {
            display: none;
            width: 100%;
            padding: 24px 0;
            border-bottom: 1px solid #2f2f2f;
        }

        .typing-content {
            max-width: 768px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            align-items: center;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
            margin-left: 4px;
        }

        .dot {
            width: 8px;
            height: 8px;
            background: #8e8ea0;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
        }

        .dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                opacity: 0.4;
                transform: scale(1);
            }
            30% {
                opacity: 1;
                transform: scale(1.2);
            }
        }

        /* Scrollbar styling */
        .chat-container::-webkit-scrollbar {
            width: 6px;
        }

        .chat-container::-webkit-scrollbar-track {
            background: transparent;
        }

        .chat-container::-webkit-scrollbar-thumb {
            background: #404040;
            border-radius: 3px;
        }

        .chat-container::-webkit-scrollbar-thumb:hover {
            background: #565656;
        }

        /* Welcome message styling */
        .welcome-section {
            display: none;
        }
    </style>
</head>
<body>
    <div class="chat-container" id="chatContainer">
        <div class="welcome-section" id="welcomeSection">
            <div class="welcome-title">How can I help you today?</div>
            <div class="welcome-subtitle">Ask me anything or start a conversation</div>
        </div>
    </div>

    <div class="typing-indicator" id="typingIndicator">
        <div class="typing-content">
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    </div>

    <div class="input-container">
        <div class="input-wrapper">
            <textarea 
                id="messageInput" 
                placeholder="Message ChatGPT..." 
                rows="1"
            ></textarea>
            <button id="sendButton">↑</button>
        </div>
    </div>

    <script>
        const chatContainer = document.getElementById('chatContainer');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const typingIndicator = document.getElementById('typingIndicator');
        const welcomeSection = document.getElementById('welcomeSection');

        // Sample AI responses for demo
        const aiResponses = [
            "That's a great question! I'd be happy to help you with that. Let me think through this step by step and provide you with a comprehensive answer.\n\nThis is actually quite an interesting topic that has several different aspects to consider. Would you like me to go deeper into any specific part of this?",
            
            "I understand what you're asking about. This is something that many people wonder about, and there are several important factors to keep in mind.\n\nHere are the key points:\n• First consideration is always the context\n• Second, we need to look at the practical implications\n• Finally, the long-term effects are worth discussing\n\nWhat specific aspect would you like me to elaborate on?",
            
            "Thanks for bringing this up! Based on what you've shared, here are some thoughts and suggestions that might be helpful.\n\nThe approach I'd recommend is to start with the fundamentals and then build up complexity gradually. This ensures a solid foundation while maintaining flexibility for future changes.",
            
            "That's a fascinating point you've raised. Let me break this down and explore the different dimensions of this topic.\n\n```\n// Here's a simple example to illustrate the concept\nfunction example() {\n    return 'This demonstrates the principle';\n}\n```\n\nThe code above shows how we can implement this in practice. Does this help clarify what you were looking for?",
            
            "I appreciate you asking about this. This is actually quite nuanced, and the answer depends on several variables.\n\nLet me walk you through the reasoning process:\n\n1. **First principle**: We need to establish the baseline\n2. **Second consideration**: Context matters significantly\n3. **Third factor**: Implementation details can vary\n\nWould you like me to dive deeper into any of these areas?"
        ];

        function hideWelcome() {
            if (welcomeSection) {
                welcomeSection.style.display = 'none';
            }
        }

        function addMessage(content, isUser = false) {
            hideWelcome();
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
            
            // Process content for basic markdown-like formatting
            let processedContent = content;
            if (!isUser) {
                processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                processedContent = processedContent.replace(/`([^`]+)`/g, '<code>$1</code>');
                processedContent = processedContent.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
                processedContent = processedContent.replace(/^• (.+)$/gm, '<li>$1</li>');
                processedContent = processedContent.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
                processedContent = processedContent.replace(/^\d+\.\s*\*\*(.*?)\*\*:\s*(.+)$/gm, '<li><strong>$1</strong>: $2</li>');
                processedContent = processedContent
                    .split('\n\n')
                    .map(p => p.trim())
                    .filter(p => p)
                    .map(p => `<p>${p}</p>`)
                    .join('');
            } else {
                processedContent = `<p>${processedContent}</p>`;
            }
            
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="content">${processedContent}</div>
                </div>
            `;
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function showTypingIndicator() {
            hideWelcome();
            typingIndicator.style.display = 'block';
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function hideTypingIndicator() {
            typingIndicator.style.display = 'none';
        }

        function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;

            addMessage(message, true);
            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendButton.disabled = true;

            showTypingIndicator();

            setTimeout(() => {
                hideTypingIndicator();
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                addMessage(randomResponse);
                sendButton.disabled = false;
                messageInput.focus();
            }, 1000 + Math.random() * 2000);
        }

        sendButton.addEventListener('click', sendMessage);

        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });

        messageInput.focus();
    </script>
</body>
</html>