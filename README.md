Babble
======

A realtime audio/text translation prototype

Speech to Text
==============

* Google Web Speech API
  * Free
  * Only Chrome has support
  * [Demo](http://23.235.12.35/Babble/webspeechdemo/)
  * [Introduction](http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API)

Translation Services
====================

* Bing
  * Free up to 2 million characters
  * [End User Site](http://www.bing.com/translator)
  * [Using the API](https://www.microsoft.com/web/post/using-the-free-bing-translation-apis)
* Google Translate
  * $20 per 1 million characters

Text to Speech Services
=======================

* Microsoft/Bing
  * Free version
* eSpeak
  * FOSS Local Server
  * Output could be better
* AT&T
* HTML 5 API?
* Dragon Speech API
  * Might have a free API trial
* Voice RSS
  * Free version has a 100KB response max
* Google Web Speech
  * Free version ?

NodeJS
======

What's up with the nodejs folder? Once we write the JavaScript that connects
the speech-to-text, translations, and text-to-speech services together and
runs on a single user's computer, we'll want to move that connecting JavaScript
to a central server so we can have multiple user computers output the
translation. [Node.JS](http://nodejs.org/) is a framework for running JavaScript
on a server instead of in a browser, and will allow us to write a server
application that coordinates the clients and connects the services.

Installing Node.JS
~~~~~~~~~~~~~~~~~~

Node.JS is already installed on our Ignite server. In case we need to install
it again, or you want to install it on your own computer, [here are 
instructions on how to install Node.JS on a variety of platforms](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).
