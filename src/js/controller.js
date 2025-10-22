class ChatController {
  constructor(model, view, getBotResponse) {
    this.model = model;
    this.view = view;
    this.getBotResponse = getBotResponse;

    this.view.addMessage('bot', 'Bot: Hello! How can I help you today?', Date.now(), null, null);

    this.view.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = this.view.getInputValue();
      if (message === '') return;

      const msg = this.model.addMessage('user', message);
      this.view.addMessage('user', "User: " + message, msg.id, 
        (el) => this.deleteMessage(el),
        (textEl, id) => this.editMessage(textEl, id)
      );
      this.view.clearInput();
      
      localStorage.setItem('user', JSON.stringify(message));
      alert("Your message has been sent to local storage.");

      const response = this.getBotResponse(message);
      this.model.addMessage('bot', response);
      this.view.addMessage('bot', "Bot: " + response, Date.now(), null, null);
      localStorage.setItem('bot', JSON.stringify(message));
    });

    if (this.view.clearButton) {
      this.view.clearButton.addEventListener('click', () => this.clearChat());
    }
  }

  deleteMessage(messageEl) {
    this.model.deleteMessage(messageEl);
    this.view.messagesContainer.removeChild(messageEl);
  }

  editMessage(textEl, id) {
    const currentText = textEl.textContent.replace(/^User:\s*/, '');
    const newText = prompt('Edit your message:', currentText);
    if (newText !== null) {
      textEl.textContent = "User: " + newText;
      this.model.editMessage(id, newText);
    }
  }

  clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.view.clearChat();
      this.model.clearMessages();
      localStorage.clear();
      alert('Chat history and localStorage have been cleared.');
    }
  }
}

export { ChatController };