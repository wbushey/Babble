$(function() {
  var timeOut = null; // timeout ID
  var AUTOSEND_TIME = 1000; // Time (in ms) until text is sent to the server after speech recognition has occurred.
  var FADE_TIME = 150; // ms
  var COLORS = [ // Colors used for nicknames
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];
  // Each element of 'langs' contains the following information:
  //    0: The name of a language
  //    1: The Microsoft Translator abbreviation
  //    2: Does Microsoft provide speech output in this language? (Boolean)
  //    3: Dialect or array of dialects for Google Web Speech API
  //       (Equals the empty string '' if Google does not support the language)
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
      ['简化字 (Chinese Simplified)', 'zh-CHS', true, [
          ['cmn-Hans-CN', '普通话 (中国大陆)'],
          ['cmn-Hans-HK', '普通话 (香港)']]],
      ['正體字 (Chinese Traditional)', 'zh-CHT', true, [
          ['cmn-Hant-TW', '中文 (台灣)'],
          ['yue-Hant-HK', '粵語 (香港)']]],
      ['日本語 (Japanese)', 'ja', true, 'ja-JP']];

  // Initialize varibles
  var sessionID; // to prevent spoofing
  var $window = $(window);
  var $usernameInput = $('#username'); // Input for username
  var $languageDropdown = $('#language_select'); //Dropdown menu to select language
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box
  var socket = io();
  var media;
  var username_regex = /^[a-zA-Z0-9_]{1,14}$/;
  var msg_regex = /^\/msg\s(\S+?)\s(.+)/;
  var match_obj;
  var ignore_list = [];
  var query_list = [];
  var channel = 'public';
  var allow_audio = false;
  var audio_on = false;
  var chat_history = [];
  var draft_message;
  var history_ptr = 0;
  
  // Title bar
  var unread_message_count = 0;
  var TITLEBAR = 'Babble Chat Room';
  document.title = TITLEBAR;
  $window.focusin(function() {
    document.title = TITLEBAR;
    unread_message_count = 0;
  });
  
  // Speech recognition stuff
  var $microphone = $('.microphone'); // Microphone for audio input
  var recognizing = false; // Microphone active; recognizing speech
  var recognition;
  var final_transcript;
  var ignore_onend;
  var start_timestamp;
  
  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
  var $player = $('.player'); // The audio player
  $player.hide();
  var language;
  var language_index;
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
  var $currentInput = $usernameInput.focus();
 
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
    if (!username.match(username_regex)){
      $('.invalid_nick').css('visibility', 'visible');
      username = '';
      $usernameInput.val('');
    } else {
      $('.invalid_nick').css('visibility', 'hidden');
    }
    if (username) {
      language_index = $languageDropdown.val();
      language = langs[language_index][1];
      media = ['text'];
      if (langs[language_index][2]) {
        media = ['text', 'audio'];
        allow_audio = true;
        audio_on = true;
      }
      dialect = langs[language_index][3];
      if (typeof dialect == 'object'){
        dialect = $dialect_select.val();
      }

      if ((dialect === '') || !('webkitSpeechRecognition' in window)){
        $microphone.hide();
      } else {
        createRecognition();
        
      }
      connect();
    }
  }
  
  function connect(){
    
    // Socket events

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
      addChatMessage(data, {linkify: true});
    });

    // Whenever the server emits 'private message', update the chat body
    socket.on('private message', function (data) {
      addChatMessage(data, {type: 'private'});
    });
    
    // Whenever the server emits 'join', log it in the chat body
    socket.on('join', function (data) {
      data = JSON.parse(data);
      var other_user = data.orig_text.split(' ')[0];
      if (other_user != username) {
        log(data.text);
      }
    });

    // Whenever the server emits 'leave', log it in the chat body
    socket.on('leave', function (data) {
      data = JSON.parse(data);
      var other_user = data.orig_text.split(' ')[0];
      log(data.text);
    });
  
    // Whenever the server emits 'names', log it in the chat window
    socket.on('names', function (data) {
      log('Users: ' + data.join(', '));   
    });

    // Whenever the server emits 'error', log it in the chat body
    socket.on('err', function (data) {
      log('Error: ' + data, {error: true});
    });
    
    $loginPage.fadeOut();
    $chatPage.show();
    $loginPage.off('click');
    $currentInput = $inputMessage.focus();
    log("Welcome to Babble. Type /help for help.");
      
    // Tell the server your username
    sessionID = Math.random().toString().substr(2);
    var join_params = {name: username,
                       session: sessionID,
                       to_lang: language, 
                       from_lang: language, 
                       output_media: media};
    
    socket.emit('join', join_params);
    listNames();
  }
  
  // User Commands
  function userCommands(msg) {
    var tokens = msg.split(' ');
    var i;
    switch (tokens[0]) {
      case '/a':
      case '/audio':
        toggleAudio();
        break;
      case '/d':
      case '/dialect':
        changeDialect(tokens[1]);
        break;
      case '/h':
      case '/help':
        help(tokens[1]);
        break;
      case '/i':
      case '/ignore':
        ignoreUsers(tokens.slice(1));
        break;
      case '/j':
      case '/join':
        joinChannels(tokens.slice(1));
        break;
      case '/m':
      case '/msg':
        var recipient = tokens[1];
        var message = tokens.slice(2).join(' ');
        sendPrivateMessage(recipient, message);
        break;
      case '/n':
      case '/names':
        listNames(tokens[1]);
        break;
      case '/p':
      case '/part':
        partChannels(tokens.slice(1));
        break;
      case '/q':
      case '/query':
        query_list = tokens.slice(1);
        if (query_list.length > 0) {
          log('Private chat with ' + query_list.join(', '));
        } else {
          log('Public chat');
        }
        break;
      case '/x':
      case '/quit':
        restart();
        break;
      case '/set':
        userSettings(tokens.slice(1));
        break;
      case '/u':
      case '/unignore':
        unignoreUsers(tokens.slice(1));
        break;
      
      default:
        help();
    }
  }
  
  // Logout and restart chat application
  function restart() {
    socket.disconnect();
    location.reload();
  }

  // Retrieve client list and log it in the chat body
  function listNames(chan) {
    if (chan === undefined) {
      chan = channel;
    }
    socket.emit('names', chan);
  }
  
  // Ignore users
  function ignoreUsers(users) {
    if (users.length === 0){
      ignore_list = ignore_list.filter(function(u) {return (u !== undefined);});
      if (ignore_list.length > 0) {
        log('Ignore list: ' + ignore_list.join(', '));
      } else {
        log('Ignore list is empty');
      }
    } else {
      log('Ignoring ' + users);
      socket.emit('ignore', {names: ''+users});
      for (var i in users) 
        if (ignore_list.indexOf(users[i]) == -1)
          ignore_list.push(users[i]);
    }
  }
  
  function unignoreUsers(users) {
    if (users.length === 0) {
      socket.emit('unignore', {all: true});
      ignore_list = [];
      log('Removed all names from ignore list');
    } else {
      log('Unignore ' + users);
      socket.emit('unignore', {names: '' + users});
      users.forEach(function(name) {
        var idx = ignore_list.indexOf(name);
        if (idx != -1) {
          delete ignore_list[idx];
        }
      });
    }
  }
  
  function toggleAudio() {
    if (!allow_audio) {
      log('Your language does not support audio.');
    } else {
      if (audio_on) {
        media = ['text'];
        log('Audio is now OFF');
        $player.hide();
        audio_on = false;
      } else {
        media = ['text', 'audio'];
        log('Audio is now ON');
        $player.show();
        audio_on = true;
      }
      socket.emit('media', JSON.stringify(media));
    }
  }
  
  function userSettings(params) {
    if (params.length === 0){
      displayUserSettings();
    } else {
      emit_params = {};
      emit_params[params[0]] = params[1];
      socket.emit('settings', emit_params);
    }
  }

  function changeDialect(newdialect) {
    if (newdialect) {
      dialect = newdialect;
    } else {
      log('Current dialect is ' + dialect);
    }
  }
  
  function displayUserSettings(params) {
  }
        
  // Send a private message
  function sendPrivateMessage(recipients, message){
    addChatMessage({from_name: username, text: message}, {type: 'private'});
    var emit_params = {to: '' + recipients, msg: message, session: sessionID};
    socket.emit('private message', emit_params);
  }
  
  // Join channels
  function joinChannels(channels){
    if (channels.length === 0) {
      log('Current channel is ' + channel);
    } else {
      socket.emit('join channels', {channels: '' + channels});
      channel = channels[0];
      if (channels.length == 1) {
        log('Joining channel ' + channel);
      } else {
        log('Joining channels ' + channels.join(', '));
      }
      listNames();
    }
  }
  
  // Part channels
  function partChannels(channels){
    if (channels.length === 0)
      channels = [channel];
    socket.emit('part', {channels: '' + channels});
    if (channels.length == 1) {
      log('Leaving channel ' + channels);
    } else {
      log('Leaving channels ' + channels.join(', '));
    }
  }
    
  // Send a chat message
  function sendMessage () {
    var message = $inputMessage.val();
    $inputMessage.val('');
    
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    
    // if there is a non-empty message and a socket connection
    if (message) {
      // Add message to history
      chat_history.push(message);
      history_ptr = chat_history.length;

      // Check for user commands
      if (message.substr(0,1) == '/') {
        userCommands(message);
        return;
      }
      if (recognizing) {
        recognition.stop();
      }
      if (query_list.length > 0) {
        sendPrivateMessage(query_list, message);
        return;
      }
      
      addChatMessage({
        from_name: username,
        text: message,
        channel: channel
      }, {self: true, linkify: true});
      // tell server to execute 'new message' and send along one parameter
      var message_params = {msg: message, text: message, from_lang: language,
                            session: sessionID, channel: channel};
      socket.emit('new message', message_params);
    }
  }

  // Display help information
  function help (cmd) {
    if (typeof cmd == 'undefined') {
      cmd = 'help';
    }
    if (cmd.substr(0,1) == '/')
      cmd = cmd.substr(1);
    
    switch (cmd) {
      case 'audio':
        log('Type /audio to toggle audio (on or off).');
        break;
      case 'dialect':
        log('Type /dialect [language] to select the dialect for voice recognition.');
        log('Type /dialect with no arguments to display current dialect.');
        break;
      case 'help':
        log('Type /help [cmd] to get help on a specific command.');
        log('Commands: audio, help, ignore, join, msg, names, part, query, quit, unignore');
        break;
      case 'ignore':
        log('Type /ignore [user] to ignore all messages from a user.');
        log('To ignore multiple users, type /ignore [user1] [user2] [user3]');
        break;
      case 'join':
        log('Type /join #channel to join a channel.');
        log('To list current channel, type /join wth no arguments.');
        break;
      case 'msg':
        log('Type /msg [user] [text] to send a private message to a user.');
        break;
      case 'part':
        log('Type /part [channel] to leave a channel.');
        log('To leave multiple channels, type /part [channel1] [channel2] [channel3]');
        log('To leave current channel, type /part with no arguments.');
        break;
      case 'query':
        log('Type /query [user] to begin a private chat with a user.');
        log('To chat with multiple users, type /query [user1] [user2] [user3]');
        log('To return to public chat, type /query with no arguments.');
        break;
      case 'quit':
        log('Type /quit to disconnect and restart the application.');
        break;
      case 'unignore':
        log('Type /unignore [user] to remove a user from the ignore list.');
        log('To remove multiple users, type /ignore [user1] [user2] [user3]');
        log('To remove all users, type /ignore with no arguments.');
        break;
      case 'n':
      case 'who':
      case 'users':
      case 'names':
        log('Type /names [channel] to list the users in a channel.');
        log('Type /names to list the names in the current channel.');
        break;
      case 'set':
        log('/set changes user settings.');
        break;
      default:
        help();
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
        var translation_data = {
            text : d.text,
            to : language,
            from: language,
            appId : data.access_token,
            contentType: 'text/plain'
        };
        var audio_params = jQuery.param(translation_data);
        $player.show();
        $player.attr('src', '/translateAudio?' + audio_params);
    });
  }
  
  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    if (typeof data === 'string'){
      data = JSON.parse(data);
    }
    
    var colorStyle = 'style="color:' + getUsernameColor(data.from_name) + '"';
    var channelLabel = '';
    if ((typeof data.channel !== 'undefined') && (data.channel !== 'public'))
      channelLabel  = ' (' + data.channel + ')';
    var usernameDiv = '<span class="username"' + colorStyle + '>' +
      cleanInput(data.from_name) + channelLabel + '</span>';
    var text = cleanInput(data.text);
    var messageBodyDiv = '<span class="messageBody">' + text + '</span>';
    
    var originalText = '';
    if (data.orig_text && data.orig_text != text) {
        originalText = '&nbsp;&nbsp;<span class="originalText">' +
                       data.orig_text + '</span>';
    }
    
    var messageDiv = '<li class="message ' + '">' +
        usernameDiv + messageBodyDiv + originalText + '</li>';
    var $messageDiv = $(messageDiv).data('username', data.from_name);
    
    addMessageElement($messageDiv, options);
    
    if (!document.hasFocus()) {
      unread_message_count += 1;
      document.title = '(' + unread_message_count + ') ' + TITLEBAR;
    }
    
    // Insert audio
    if (data.audio && username != data.from_name) {
        getAudio(data);
    }
  }

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
    if (typeof options.type === 'undefined') {
      options.type = 'public';
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
    if (options.type == 'private'){
      $el.css('font-style', 'italic');
    }
    if ('error' in options){
      $el.css('color', 'red');
    }
    if ('self' in options){
      $el.css('color', 'Crimson');
    }
    if ('linkify' in options) {
      $el.attr('data-linkify', 'this');
      $el.linkify({
        tagName: 'a',
        target: '_blank',
        newLine: '\n',
        linkClass: null,
        linkAttributes: null
      });
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html() || input;
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
    switch (event.which) {
        case 13: // Client hits ENTER
          if (username && language) {
            sendMessage();
          } else {
            setUsername();
          }
          break;
        case 38: // Up Arrow
          previousMessage();
          break;
        case 40: // Down Arrow
          nextMessage();
    } 
  });

  $inputMessage.on('input', function() {
    if (recognizing) {
      recognition.stop();
    }
  });

  function previousMessage() {
    if (history_ptr > 0) {
      if (history_ptr == chat_history.length) {
        draft_message = $inputMessage.val();
      }
      history_ptr--;
      $inputMessage.val('');
      $inputMessage.val(chat_history[history_ptr]);
    }
  }
  
  function nextMessage(){
    var history_len = chat_history.length;
    if (history_ptr < history_len) {
      history_ptr++;
      $inputMessage.val('');
      if (history_ptr < history_len) {
        $inputMessage.val(chat_history[history_ptr]);
      } else {
        $inputMessage.val(draft_message);
      }
    }
  }
  
  // Click events

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  $microphone.on('click', function() {
    if (recognizing) {
       recognition.stop();
    } else {
       try {
          recognition.start();
       }
       catch(err) {
         log(err.message, {error:true});
         recognition.stop();
       }
    }     
  });
  
  

  
  // Speech recognition code
  function createRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = dialect;
    recognition.onstart = function() {
      recognizing = true;
      final_transcript = '';
      ignore_onend = false;
      $microphone.attr('src', 'pics/mic-animate.gif');
      $inputMessage.val('');
      $inputMessage.attr('placeholder', 'Speak now...');
      $inputMessage.focus();
    };
        
    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        $microphone.attr('src', 'pics/mic.gif');
        log('No speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        $microphone.attr('src', 'pics/mic.gif');
        log('No microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          log('Blocked');
        } else {
          log('Denied');
        }
        ignore_onend = true;
      }
    };
      
    recognition.onend = function() {
      window.clearTimeout(timeOut);
      recognizing = false;
      if (!ignore_onend) {
        $microphone.attr('src', 'pics/mic.gif');
      }
      $inputMessage.attr('placeholder', '');
    };
        
    recognition.onresult = function(event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      $inputMessage.val(final_transcript);
      if (timeOut !== null) {
         window.clearTimeout(timeOut);
      }
      timeOut = window.setTimeout(sendMessage, 1000);
    };
        
    var first_char = /\S/;
    function capitalize(s) {
      return s.replace(first_char, function(m) { 
        return m.toUpperCase(); });
    }
  }  
});
