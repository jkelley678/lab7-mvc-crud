class ChatView {
  constructor(component) {
    this.messagesContainer = component.querySelector('.messages');
    this.form = component.querySelector('form.input-area');
    this.input = component.querySelector('input');
    this.clearButton = document.getElementById('clear-button');
  }

  addMessage(sender, text, id, onDelete, onEdit) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    messageEl.dataset.id = id;

    const textEl = document.createElement('div');
    textEl.textContent = text;
    messageEl.appendChild(textEl);

    // put action buttons into their own controls row so they appear on a separate line
    let controls = null;
    if (sender === 'user') {
      controls = document.createElement('div');
      controls.className = 'controls';

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-button';
      deleteBtn.addEventListener('click', () => onDelete(messageEl));
      controls.appendChild(deleteBtn);

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-button';
      editBtn.addEventListener('click', () => onEdit(textEl, id));
      controls.appendChild(editBtn);

      messageEl.appendChild(controls);
    }

    const timestampEl = document.createElement('span');
    const now = new Date();
    timestampEl.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    timestampEl.className = 'timestamp';
    // if controls exist (user message), put timestamp in the same row as buttons
    if (controls) {
      controls.appendChild(timestampEl);
    } else {
      messageEl.appendChild(timestampEl);
    }

    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  clearChat() {
    this.messagesContainer.innerHTML = '';
  }

  getInputValue() {
    return this.input.value.trim();
  }

  clearInput() {
    this.input.value = '';
  }
}

export { ChatView };