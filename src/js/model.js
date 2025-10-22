class ChatModel {
  constructor() {
    this.messages = [];
  }
  addMessage(sender, text) {
    const message = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date()
    };
    this.messages.push(message);
    return message;
  }
  deleteMessage(messageEl) {
    const index = Array.from(messageEl.parentNode.children).indexOf(messageEl);
    this.messages.splice(index, 1);
  }

  editMessage(id, newText) {
    const message = this.messages.find(msg => msg.id === id);
    if (message) {
      message.text = newText;
    }
  }

  clearMessages() {
    this.messages = [];
  }
}

export { ChatModel };