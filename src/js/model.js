import { getBotResponse } from './eliza.js';

class SimpleChat extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.messagesContainer = this.querySelector('.messages');
    this.form = this.querySelector('form.input-area');
    this.input = this.querySelector('input');
    this.clearButton = document.getElementById('clear-button');


    this.addMessage('bot', 'Bot: Hello! How can I help you today?');

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = this.input.value.trim();
      if (message === '') return;


      this.addMessage('user', "User: " + message);
      this.input.value = '';
      localStorage.setItem('user', JSON.stringify(message));
      alert("Your message has been sent to local storage.");

      const response = getBotResponse(message);
      this.addMessage('bot', "Bot: " + response);
      localStorage.setItem('bot', JSON.stringify(message));
    });
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => this.clearChat());
    }
  }

addMessage(sender, text) {  
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;

  const textEl = document.createElement('div');
  textEl.textContent = text;

  messageEl.appendChild(textEl);

  if (sender === 'user') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-button';

    deleteBtn.addEventListener('click', () => {
      this.messagesContainer.removeChild(messageEl);
    });

    messageEl.appendChild(deleteBtn);

    const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-button';
      editBtn.addEventListener('click', () => {
        const currentText = textEl.textContent.replace(/^User:\s*/, '');
        const newText = prompt('Edit your message:', currentText);
        textEl.textContent = "User: " + newText;
      });
      messageEl.appendChild(editBtn);
  }
    const timestampEl = document.createElement('span');
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  timestampEl.textContent = `${hours}:${minutes}:${seconds}`;
  timestampEl.className = 'timestamp';

  messageEl.appendChild(timestampEl);
  

  this.messagesContainer.appendChild(messageEl);
  this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
}
clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.messagesContainer.innerHTML = '';  
      localStorage.clear();                    
      alert('Chat history and localStorage have been cleared.');
    }
  }
}

customElements.define('simple-chat', SimpleChat);