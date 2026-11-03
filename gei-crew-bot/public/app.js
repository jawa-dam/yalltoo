(function () {
  'use strict';

  var welcomeScreen = document.getElementById('welcome-screen');
  var chatContainer = document.getElementById('chat-container');
  var messagesArea = document.getElementById('messages-area');
  var inputForm = document.getElementById('input-form');
  var userInput = document.getElementById('user-input');
  var sendBtn = document.getElementById('send-btn');
  var headerBack = document.getElementById('header-back');
  var headerStatus = document.getElementById('header-status');
  var errorBanner = document.getElementById('error-banner');
  var errorText = document.getElementById('error-text');
  var errorDismiss = document.getElementById('error-dismiss');
  var starterBtns = document.querySelectorAll('.starter-btn');

  var conversationHistory = [];
  var isProcessing = false;
  var lastSendTime = 0;
  var MIN_SEND_INTERVAL = 2000;
  var MAX_CLIENT_MESSAGES = 30;

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

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  function renderMarkdown(text) {
    var html = escapeHtml(text);

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      function (_, label, url) {
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
      }
    );

    html = html.replace(
      /(^|[^"=])(https?:\/\/[^\s<)]+)/g,
      function (_, prefix, url) {
        return prefix + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
      }
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
    text = (text || '').trim();
    if (!text || isProcessing) return;

    var now = Date.now();
    if (now - lastSendTime < MIN_SEND_INTERVAL) {
      showError('Please wait a moment before sending another message.');
      return;
    }

    if (conversationHistory.length >= MAX_CLIENT_MESSAGES) {
      showError('Conversation limit reached. Please start a new conversation.');
      return;
    }

    isProcessing = true;
    lastSendTime = now;
    updateSendBtn();
    hideError();

    if (!chatContainer.classList.contains('active')) {
      showChat();
    }

    addMessage('user', text);
    conversationHistory.push({ role: 'user', content: text });

    setStatus('Investigating...');
    showTyping();

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 35000);

    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
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
          showError(errData.message || 'Too many requests. Please wait a minute and try again.');
          setStatus('Rate limited');
        } else if (errData.error === 'timeout') {
          showError('The response took too long. Try a shorter or simpler question.');
          setStatus('Timed out');
        } else {
          showError(errData.message || 'Something went wrong. Please try again.');
          setStatus('Error');
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
      clearTimeout(timeoutId);
      hideTyping();
      if (err.name === 'AbortError') {
        showError('The request timed out. Please try again.');
        setStatus('Timed out');
      } else {
        showError('Network error — please check your connection and try again.');
        setStatus('Connection issue');
      }
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
