const app = document.getElementById('app');

const chatThreads = [
    {
        id: 1,
        name: 'Maya Chen',
        status: 'Online',
        avatar: 'MC',
        accent: '#ff8a65',
        preview: 'Can you send the revised mockup before lunch?',
        unread: 2,
        messages: [
            { sender: 'received', text: 'Morning! Did you get a chance to review the landing page copy?', time: '9:14 AM' },
            { sender: 'sent', text: 'Yeah, I left comments in the doc. The headline feels much better now.', time: '9:16 AM', seen: true },
            { sender: 'received', text: 'Perfect. Can you send the revised mockup before lunch?', time: '9:18 AM' }
        ]
    },
    {
        id: 2,
        name: 'Alex Rivera',
        status: 'Last seen 12m ago',
        avatar: 'AR',
        accent: '#4db6ac',
        preview: 'I booked the table for 8.',
        unread: 0,
        messages: [
            { sender: 'received', text: 'Dinner plan is locked in.', time: 'Yesterday' },
            { sender: 'sent', text: 'Nice. What time are we meeting?', time: 'Yesterday', seen: true },
            { sender: 'received', text: 'I booked the table for 8.', time: 'Yesterday' }
        ]
    },
    {
        id: 3,
        name: 'Product Team',
        status: '5 members',
        avatar: 'PT',
        accent: '#7986cb',
        preview: 'Standup moved to 10:30.',
        unread: 0,
        messages: [
            { sender: 'received', text: 'Heads up, standup moved to 10:30.', time: '8:42 AM' },
            { sender: 'sent', text: 'Works for me.', time: '8:44 AM', seen: true }
        ]
    }
];

let activeChatId = 1;
let typingTimeout;

function getActiveChat() {
    return chatThreads.find((chat) => chat.id === activeChatId);
}

function formatCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function createMessageElement(message) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-row ${message.sender}`;

    const bubble = document.createElement('div');
    bubble.className = `message ${message.sender}`;

    const text = document.createElement('p');
    text.className = 'message-text';
    text.textContent = message.text;

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = message.sender === 'sent' && message.seen ? `${message.time}  Seen` : message.time;

    bubble.appendChild(text);
    bubble.appendChild(meta);
    wrapper.appendChild(bubble);
    return wrapper;
}

function createChatListItem(chat) {
    const item = document.createElement('button');
    item.className = `chat-list-item${chat.id === activeChatId ? ' active' : ''}`;
    item.type = 'button';

    item.innerHTML = `
        <div class="avatar" style="--avatar-accent: ${chat.accent};">${chat.avatar}</div>
        <div class="chat-list-copy">
            <div class="chat-list-top">
                <strong>${chat.name}</strong>
                <span>${chat.messages.at(-1)?.time || ''}</span>
            </div>
            <div class="chat-list-bottom">
                <span>${chat.preview}</span>
                ${chat.unread ? `<em class="unread-badge">${chat.unread}</em>` : ''}
            </div>
        </div>
    `;

    item.addEventListener('click', () => {
        activeChatId = chat.id;
        render();
    });

    return item;
}

function buildReply(messageText) {
    const responses = [
        `That helps. I'll take care of "${messageText.slice(0, 18)}${messageText.length > 18 ? '...' : ''}" next.`,
        'Makes sense. Give me a few minutes and I will send an update.',
        'Sounds good to me.',
        'I am on it. Thanks for the heads up.'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

function render() {
    const activeChat = getActiveChat();
    app.innerHTML = '';

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <div>
                <p class="eyebrow">Messages</p>
                <h1>Inbox</h1>
            </div>
            <button class="icon-button" type="button" aria-label="New chat">+</button>
        </div>
        <label class="search-box">
            <span>Search chats</span>
            <input type="text" placeholder="Search or start a new chat">
        </label>
    `;

    const chatList = document.createElement('div');
    chatList.className = 'chat-list';
    chatThreads.forEach((chat) => chatList.appendChild(createChatListItem(chat)));
    sidebar.appendChild(chatList);

    const chat = document.createElement('main');
    chat.className = 'chat';

    const header = document.createElement('header');
    header.className = 'chat-header';
    header.innerHTML = `
        <div class="chat-header-main">
            <div class="avatar large" style="--avatar-accent: ${activeChat.accent};">${activeChat.avatar}</div>
            <div>
                <h2>${activeChat.name}</h2>
                <p>${activeChat.status}</p>
            </div>
        </div>
        <div class="chat-actions">
            <button class="icon-button text" type="button" aria-label="Call">Call</button>
            <button class="icon-button text" type="button" aria-label="More options">...</button>
        </div>
    `;

    const messages = document.createElement('section');
    messages.className = 'messages';
    activeChat.messages.forEach((message) => {
        messages.appendChild(createMessageElement(message));
    });

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator hidden';
    typingIndicator.innerHTML = `
        <span>${activeChat.name} is typing</span>
        <div class="typing-dots">
            <i></i><i></i><i></i>
        </div>
    `;
    messages.appendChild(typingIndicator);

    const inputBox = document.createElement('form');
    inputBox.className = 'input-box';

    const inputWrap = document.createElement('div');
    inputWrap.className = 'input-wrap';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Message ${activeChat.name}`;

    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.textContent = 'Send';

    inputWrap.appendChild(input);
    inputBox.appendChild(inputWrap);
    inputBox.appendChild(sendButton);

    inputBox.addEventListener('submit', (event) => {
        event.preventDefault();
        const userMessage = input.value.trim();
        if (!userMessage) return;

        activeChat.messages.push({
            sender: 'sent',
            text: userMessage,
            time: formatCurrentTime(),
            seen: false
        });
        activeChat.preview = userMessage;
        activeChat.unread = 0;
        render();

        const updatedChat = getActiveChat();
        const updatedMessages = document.querySelector('.messages');
        const indicator = document.querySelector('.typing-indicator');
        indicator.classList.remove('hidden');
        updatedMessages.scrollTop = updatedMessages.scrollHeight;

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            updatedChat.messages.push({
                sender: 'received',
                text: buildReply(userMessage),
                time: formatCurrentTime()
            });
            updatedChat.preview = updatedChat.messages.at(-1).text;
            render();
        }, 1400);
    });

    chat.appendChild(header);
    chat.appendChild(messages);
    chat.appendChild(inputBox);

    app.appendChild(sidebar);
    app.appendChild(chat);

    messages.scrollTop = messages.scrollHeight;
}

render();
