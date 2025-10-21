import { getBotResponse } from './eliza.js';

class SimpleChat extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.messagesContainer = this.querySelector('.messages');
    this.form = this.querySelector('form.input-area');
    this.input = this.querySelector('input');


    this.addMessage('bot', 'Bot: Hello! How can I help you today?');

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = this.input.value.trim();
      if (message === '') return;

      this.addMessage('user', "User: " + message);
      this.input.value = '';

      const response = getBotResponse(message);
      this.addMessage('bot', "Bot: " + response);
    });
  }

  addMessage(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.textContent = text;
    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    
  }
  
}

customElements.define('simple-chat', SimpleChat);