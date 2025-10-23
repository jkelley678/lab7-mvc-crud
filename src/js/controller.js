class ChatController {
  constructor(model, view, getBotResponse) {
    this.model = model;
    this.view = view;
    this.getBotResponse = getBotResponse;
    this.loadMessages();
    

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
      this.saveMessages();
      
      localStorage.setItem('user', JSON.stringify(message));

      const response = this.getBotResponse(message);
      this.model.addMessage('bot', response);
      this.view.addMessage('bot', "Bot: " + response, Date.now(), null, null);
      localStorage.setItem('bot', JSON.stringify(message));
      this.saveMessages();
    });

    if (this.view.clearButton) {
      this.view.clearButton.addEventListener('click', () => this.clearChat());
    }

    const exportBtn = document.getElementById('export-button');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportLocalStorage());
    }
    const importBtn = document.getElementById('import-button');
    if (importBtn) {
      importBtn.addEventListener('click', () => this.importLocalStorage());
    }
  }

  deleteMessage(messageEl) {
  const id = parseInt(messageEl.dataset.id);
  this.model.deleteMessage(id);
  this.view.messagesContainer.removeChild(messageEl);
  this.saveMessages(); 
  if (this.view.updateMessageCount) this.view.updateMessageCount(-1);
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
  loadMessages() {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        this.model.messages = messages;

        messages.forEach(msg => {
          if (msg.sender === 'user') {
            this.view.addMessage('user', "User: " + msg.text, msg.id,
              (el) => this.deleteMessage(el),
              (textEl, id) => this.editMessage(textEl, id)
            );
          } else {
            this.view.addMessage('bot', "Bot: " + msg.text, msg.id, null, null);
          }
        });
        if (this.view.updateMessageCount) this.view.updateMessageCount(true);
      } catch (e) {
        console.error('Error loading messages from localStorage:', e);
      }
    }
  }
  saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(this.model.messages));
  }

  exportLocalStorage() {
    try {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = new Date().toISOString().replace(/[:.]/g, '-');
      a.href = url;
      a.download = `lab7-localStorage-${now}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Failed to export localStorage. See console for details.');
    }
  }
    async importLocalStorage() {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.chatMessages) {
          alert('Invalid file format. No chatMessages found.');
          return;
        }

        localStorage.clear();
        for (const [key, value] of Object.entries(data)) {
          localStorage.setItem(key, JSON.stringify(value));
        }

        this.model.messages = data.chatMessages;
        this.view.clearChat();
        this.loadMessages();
        this.saveMessages();

        alert('Chat history successfully imported!');
      });

      input.click();
    } catch (e) {
      console.error('Import failed', e);
      alert('Failed to import chat history. See console for details.');
    }
  }
}

export { ChatController };