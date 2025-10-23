class ChatController {
  constructor(model, view, getBotResponse) {
    this.model = model;
    this.view = view;
    this.getBotResponse = getBotResponse;

    this.loadMessages();
    this.addBotMessage('Hello! How can I help you today?');
    this.initEventListeners();
  }

  initEventListeners() {
    this.view.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    this.view.clearButton?.addEventListener('click', () => this.clearChat());
    document.getElementById('export-button')?.addEventListener('click', () => this.exportLocalStorage());
    document.getElementById('import-button')?.addEventListener('click', () => this.importLocalStorage());
  }

  handleSubmit(event) {
    event.preventDefault();
    const message = this.view.getInputValue();
    if (!message) return;

    this.addUserMessage(message);
    const response = this.getBotResponse(message);
    this.addBotMessage(response);
  }

  addUserMessage(text) {
    const msg = this.model.addMessage('user', text);
    this.view.addMessage('user', `User: ${text}`, msg.id,
      (el) => this.deleteMessage(el),
      (textEl, id) => this.editMessage(textEl, id)
    );
    this.view.clearInput();
    this.saveMessages();
    localStorage.setItem('user', JSON.stringify(text));
  }

  addBotMessage(text) {
    this.model.addMessage('bot', text);
    this.view.addMessage('bot', `Bot: ${text}`, Date.now());
    this.saveMessages();
    localStorage.setItem('bot', JSON.stringify(text));
  }

  deleteMessage(el) {
    const id = +el.dataset.id;
    this.model.deleteMessage(id);
    el.remove();
    this.saveMessages();
    this.view.updateMessageCount?.(-1);
  }

  editMessage(textEl, id) {
    const current = textEl.textContent.replace(/^User:\s*/, '');
    const updated = prompt('Edit your message:', current);
    if (updated !== null) {
      textEl.textContent = `User: ${updated}`;
      this.model.editMessage(id, updated);
    }
  }

  clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) return;
    this.view.clearChat();
    this.model.clearMessages();
    localStorage.clear();
    alert('Chat history and localStorage have been cleared.');
  }

  loadMessages() {
    try {
      const data = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      this.model.messages = data;

      data.forEach(msg =>
        this.view.addMessage(msg.sender, `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`, msg.id,
          msg.sender === 'user' ? (el) => this.deleteMessage(el) : null,
          msg.sender === 'user' ? (textEl, id) => this.editMessage(textEl, id) : null
        )
      );

      this.view.updateMessageCount?.(true);
    } catch (e) {
      console.error('Error loading messages from localStorage:', e);
    }
  }

  saveMessages() {
    localStorage.setItem('chatMessages', JSON.stringify(this.model.messages));
  }

  exportLocalStorage() {
    try {
      const data = Object.fromEntries(
        Array.from({ length: localStorage.length }, (_, i) => {
          const key = localStorage.key(i);
          try {
            return [key, JSON.parse(localStorage.getItem(key))];
          } catch {
            return [key, localStorage.getItem(key)];
          }
        })
      );

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `lab7-localStorage-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
      });
      document.body.append(a);
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
      const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json' });
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = JSON.parse(await file.text());
        if (!data.chatMessages) return alert('Invalid file format. No chatMessages found.');

        localStorage.clear();
        Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));

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