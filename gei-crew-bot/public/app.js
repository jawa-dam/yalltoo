(function () {
  'use strict';

  const welcomeScreen = document.getElementById('welcome-screen');
  const chatContainer = document.getElementById('chat-container');
  const messagesArea = document.getElementById('messages-area');
  const inputForm = document.getElementById('input-form');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const headerBack = document.getElementById('header-back');
  const headerStatus = document.getElementById('header-status');
  const errorBanner = document.getElementById('error-banner');
  const errorText = document.getElementById('error-text');
  const errorDismiss = document.getElementById('error-dismiss');
  const starterBtns = document.querySelectorAll('.starter-btn');

  let conversationHistory = [];
  let isProcessing = false;

  function showChat() {
    welcomeScreen.classList.add('hidden');
    chatContainer.classList.add('active');
    userInput.focus();
  }

  function showWelcome() {
    chatContainer.classList.remove('active');
    welcomeScreen.classList.remove('hidden');
    conversationHistory = [];
    messagesArea.innerHTML = '';
    hideError();
    setStatus('Ready to investigate');
  }

  function setStatus(text) {
    headerStatus.textContent = text;
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorBanner.hidden = false;
  }

  function hideError() {
    errorBanner.hidden = true;
    errorText.textContent = '';
  }

  function autoResize() {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
  }

  function updateSendBtn() {
    sendBtn.disabled = !userInput.value.trim() || isProcessing;
  }

  function scrollToBottom() {
    requestAnimationFrame(function () {
      messagesArea.scrollTop = messagesArea.scrollHeight;
    });
  }

  function renderMarkdown(text) {
    var html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    html = html.replace(
      /(^|[^"=])(https?:\/\/[^\s<)]+)/g,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'
    );

    var lines = html.split('\n');
    var result = [];
    var inList = false;
    var listType = '';

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var bulletMatch = line.match(/^(\s*)[-*]\s+(.+)/);
      var numberMatch = line.match(/^(\s*)\d+\.\s+(.+)/);

      if (bulletMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) result.push('</' + listType + '>');
          result.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        result.push('<li>' + bulletMatch[2] + '</li>');
      } else if (numberMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) result.push('</' + listType + '>');
          result.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        result.push('<li>' + numberMatch[2] + '</li>');
      } else {
        if (inList) {
          result.push('</' + listType + '>');
          inList = false;
        }
        if (line.trim() === '') {
          if (result.length > 0 && result[result.length - 1] !== '') {
            result.push('');
          }
        } else {
          result.push(line);
        }
      }
    }
    if (inList) result.push('</' + listType + '>');

    var paragraphs = result.join('\n').split(/\n{2,}/);
    return paragraphs
      .map(function (p) {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<ul>') || p.startsWith('<ol>')) return p;
        return '<p>' + p + '</p>';
      })
      .filter(Boolean)
      .join('');
  }

  function addMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'msg msg-' + (role === 'user' ? 'user' : 'bot');

    if (role === 'user') {
      div.textContent = text;
    } else {
      div.innerHTML = renderMarkdown(text);
    }

    messagesArea.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typing';
    div.innerHTML =
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>';
    messagesArea.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    var el = document.getElementById('typing');
    if (el) el.remove();
  }

  async function sendMessage(text) {
    if (!text.trim() || isProcessing) return;

    isProcessing = true;
    updateSendBtn();
    hideError();

    if (!chatContainer.classList.contains('active')) {
      showChat();
    }

    addMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });

    setStatus('Investigating...');
    showTyping();

    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      hideTyping();

      if (!res.ok) {
        var errData;
        try {
          errData = await res.json();
        } catch (e) {
          errData = {};
        }

        if (errData.error === 'not_configured') {
          showError(
            'API key not configured. The bot owner needs to set ANTHROPIC_API_KEY in the deployment environment variables.'
          );
          setStatus('Configuration needed');
        } else if (errData.error === 'rate_limited') {
          showError('Rate limited — please wait a moment and try again.');
          setStatus('Rate limited');
        } else {
          showError(errData.message || 'Something went wrong. Please try again.');
          setStatus('Error — try again');
        }

        conversationHistory.pop();
        isProcessing = false;
        updateSendBtn();
        return;
      }

      var data = await res.json();
      var reply = data.reply || 'I received your message but had trouble formulating a response. Could you try rephrasing?';

      addMessage('assistant', reply);
      conversationHistory.push({ role: 'assistant', content: reply });
      setStatus('Ready to investigate');
    } catch (err) {
      hideTyping();
      showError('Network error — please check your connection and try again.');
      setStatus('Connection issue');
      conversationHistory.pop();
    }

    isProcessing = false;
    updateSendBtn();
    userInput.focus();
  }

  inputForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = userInput.value.trim();
    if (text) {
      userInput.value = '';
      autoResize();
      sendMessage(text);
    }
  });

  userInput.addEventListener('input', function () {
    autoResize();
    updateSendBtn();
  });

  userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputForm.dispatchEvent(new Event('submit'));
    }
  });

  headerBack.addEventListener('click', showWelcome);

  errorDismiss.addEventListener('click', hideError);

  starterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      sendMessage(btn.getAttribute('data-message'));
    });
  });

  updateSendBtn();
})();
