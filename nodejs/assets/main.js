$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  var langs = [
      ['Arabic', 'ar', false, ''],
      ['Bahasa Indonesia (Indonesian)', 'id', false, 'id-ID'],
      ['Bahasa Melayu (Malay)', 'ms', false, 'ms-MY'],
      ['Català (Catalan)', 'ca', true, 'ca-ES'],
      ['Čeština (Czech)', 'cs', false, 'cs-CZ'],
      ['Danish', 'da', true, ''],
      ['Deutsch (German)', 'de', true, 'de-DE'],
      ['English', 'en', true, [
        ['en-AU', 'Australia'],
        ['en-CA', 'Canada'],
        ['en-IN', 'India'],
        ['en-NZ', 'New Zealand'],
        ['en-ZA', 'South Africa'],
        ['en-GB', 'Great Britain'],
        ['en-US', 'United States']]],
      ['Español (Spanish)', 'es', true, [
        ['es-AR', 'Argentina'],
        ['es-BO', 'Bolivia'],
        ['es-CL', 'Chile'],
        ['es-CO', 'Colombia'],
        ['es-CR', 'Costa Rica'],
        ['es-EC', 'Ecuador'],
        ['es-SV', 'El Salvador'],
        ['es-ES', 'España'],
        ['es-US', 'Estados Unidos'],
        ['es-GT', 'Guatemala'],
        ['es-HN', 'Honduras'],
        ['es-MX', 'México'],
        ['es-NI', 'Nicaragua'],
        ['es-PA', 'Panamá'],
        ['es-PY', 'Paraguay'],
        ['es-PE', 'Perú'],
        ['es-PR', 'Puerto Rico'],
        ['es-DO', 'República Dominicana'],
        ['es-UY', 'Uruguay'],
        ['es-VE', 'Venezuela']]],
      ['Estonian', 'et', false, ''],
      ['Français (French)', 'fr', true, 'fr-FR'],
      ['Greek', 'el', false, ''],
      ['Hebrew', 'he', false, ''],
      ['Hindi', 'hi', false, ''],
      ['Hmong Daw', 'mww', false, ''],
      ['Klingon', 'tlh', false, ''],
      ['Italiano (Italian)', 'it', true, [
        ['it-IT', 'Italia'],
        ['it-CH', 'Svizzera']]],
      ['Latvian', 'lv', false, ''],
      ['Lithuanian', 'lt', false, ''],
      ['Magyar (Hungarian)', 'hu', false, 'hu-HU'],
      ['Maltese', 'mt', false, ''],
      ['Nederlands (Dutch)', 'nl', true, 'nl-NL'],
      ['Norsk bokmål (Norwegian)', 'no', true, 'nb-NO'],
      ['Persian', 'fa', false, ''],
      ['Polski (Polish)', 'pl', true, 'pl-PL'],
      ['Português (Portuguese)', 'pt', true, [
        ['pt-BR', 'Brasil'],
        ['pt-PT', 'Portugal']]],
      ['Română (Romanian)', 'ro', false, 'ro-RO'],
      ['Slovenčina (Slovak)', 'sk', false, 'sk-SK'],
      ['Slovenian', 'sl', false, ''],
      ['Suomi (Finnish)', 'fi', true, 'fi-FI'],
      ['Svenska (Swedish)', 'sv', true, 'sv-SE'],
      ['Thai', 'th', false, ''],
      ['Türkçe (Turkish)', 'tr', false, 'tr-TR'],
      ['Ukrainian', 'uk', false, ''],
      ['Urdu', 'ur', false, ''],
      ['Vietnamese', 'vi', false, ''],
      ['Welsh', 'cy', false, ''],
      ['български (Bulgarian)', 'bg', false, 'bg-BG'],
      ['Pусский (Russian)', 'ru', true, 'ru-RU'],
      ['한국어 (Korean)', 'ko', true, 'ko-KR'],
      ['中文 (Chinese)', 'zh-CHS', true, [
          ['cmn-Hans-CN', '普通话 (中国大陆)'],
          ['cmn-Hans-HK', '普通话 (香港)'],
          ['cmn-Hant-TW', '中文 (台灣)'],
          ['yue-Hant-HK', '粵語 (香港)']]],
      ['日本語 (Japanese)', 'ja', true, 'ja-JP']];
 
  // Initialize varibles
  var $window = $(window);
  var $usernameInput = $('#username'); // Input for username
  var $languageDropdown = $('#language_select');
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $player = $('#player'); // The audio player
  $player.hide();
  var $language_select = $('#language_select');
  var $dialect_select = $('#dialect_select');
  setDialects(langs[7][3]);
  
  $language_select.change(function() {
    var idx = $(this).val();
    setDialects(langs[idx][3]);
  });
         
  for (var i in langs) {
     var option = '<option value="' + i + '">' + langs[i][0] + '</option>';
     $language_select.append(option);
  }
  $language_select[0].selectedIndex = 7;
  $dialect_select[0].selectedIndex = 6;
  var dialect;
     
  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function addParticipantsMessage (data) {
  }
 
  function setDialects(dialects) {
     if (typeof dialects === 'object') {
        var options = '';
        for (var i in dialects) {
            options += '<option value="' + dialects[i][0] + '">' + dialects[i][1] + '</option>';
        }
        $dialect_select.html(options);
        $dialect_select.show();
      } else {
        $dialect_select.hide();
      }
   }
  

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());
    if (username) {
      var language_index = $languageDropdown.val();
      language = langs[language_index][1];
      var media = ['text'];
      if (langs[language_index][2]) {
        media = ['text', 'audio'];
      }
      dialect = langs[language_index][3];
      if (typeof dialect == 'object'){
        dialect = $dialect_select.val();
      }
      console.log('dialect = ', dialect);
      connected = true;
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();
      
      // Tell the server your username
      socket.emit('join', {name: username,
                           to_lang: language, 
                           from_lang: language, 
                           output_media: media});
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
        $player.show();
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
      if (username && language) {
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

  // Whenever the server emits 'join', log it in the chat body
  socket.on('join', function (data) {
    data = JSON.parse(data);
    if (data.orig_text != username + ' has joined') {
        log(data.text);
        addParticipantsMessage(data);
    }
  });

  // Whenever the server emits 'leave', log it in the chat body
  socket.on('leave', function (data) {
    data = JSON.parse(data);
    log(data.text);
    addParticipantsMessage(data);
    removeChatTyping(data);
  });
  
  // Whenever the server emits 'refused', disconnect
  socket.on('refused', function (data) {
      $loginPage.fadeIn();
      $chatPage.hide();
      $currentInput = $usernameInput.focus();
      connected = false;
      username = '';
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
