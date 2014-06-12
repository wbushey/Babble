$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('#username'); // Input for username
  var $languageInput = $('#language'); // Input for language
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $player = $('#player'); // The audio player
  $player.hide();
  
  // Prompt for setting a username
  var username;
  var connected = true;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function addParticipantsMessage (data) {
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    language = cleanInput($languageInput.val().trim());
    // If the username is valid
    if (username && language) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      $player.show();
      // Tell the server your username
      socket.emit('join', {name: username,
                           to_lang: language, 
                           from_lang: language, 
                           output_media: ['text', 'audio']});
    }
  }

  // Sends a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        from_name: username,
        text: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', {msg: message, text: message, from_lang: language});
    }
  }

  // Log a message
  function log (message, options) {
    var el = '<li class="log">' + message + '</li>';
    addMessageElement(el, options);
  }

  // Get the URL for the audio translation
  function getAudio(d) {
    jQuery.get('/requestTranslateToken', function(data) {
        translation_data = {
            text : d.text,
            to : language,
            from: language,
            appId : data.access_token,
            contentType: 'text/plain'
        };
        audio_params = jQuery.param(translation_data);
        $player.attr('src', '/translateAudio?' + audio_params);
    });
  }
  
  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    if (typeof data === 'string')
        data = JSON.parse(data);
 
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    };
    var colorStyle = 'style="color:' + getUsernameColor(data.from_name) + '"';
    var usernameDiv = '<span class="username"' + colorStyle + '>' +
      cleanInput(data.from_name) + '</span>';
    var messageBodyDiv = '<span class="messageBody">' +
      cleanInput(data.text) + '</span>';
    var originalText = '';
    if (data.orig_text) {
        originalText = '&nbsp;&nbsp;<span class="originalText" style="color:gray; font-size:10pt">' +
                       data.orig_text + '</span>';
    }
    
    var typingClass = data.typing ? 'typing' : '';
    var messageDiv = '<li class="message ' + typingClass + '">' +
        usernameDiv + messageBodyDiv + originalText + '</li>';
    var $messageDiv = $(messageDiv).data('username', data.from_name);
    addMessageElement($messageDiv, options);
    
    // Insert audio
    if (data.audio && username != data.from_name) {
        getAudio(data);
    }
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.text = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html() || input;
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('from_name') === data.from_name;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {

    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    // if (!(event.ctrlKey || event.metaKey || event.altKey)) {
    //  $currentInput.focus();
    // }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    // $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat &mdash; ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('join', function (data) {
    data = JSON.parse(data);
    log(data.text);
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('leave', function (data) {
    data = JSON.parse(data);
    log(data.text);
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });
});
