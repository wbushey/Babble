[![Build Status](https://travis-ci.org/wbushey/Babble.svg)](https://travis-ci.org/wbushey/Babble)

Babble
======

A realtime audio/text translation prototype

Giants
======

* [Node.js](http://nodejs.org/)
* [Socket.io](http://socket.io/)


Install and Run
===============

Debian/Ubuntu
--------------

    apt-get install nodejs npm
    cd nodejs
    npm install
    node app.js

Speech to Text
==============

* Google Web Speech API
  * Free
  * Only Chrome has support
  * [Demo](https://babble-gotmath.rhcloud.com/chat)
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

Node.JS Tutorials and Docs
--------------------------

* [A few Hello World examples](http://howtonode.org/hello-node)
* [Node.JS API Docs](http://nodejs.org/api/)(Pretty Cryptic)

Node.JS Libraries
-----------------

* [node-simple-router](https://www.npmjs.org/package/node-simple-router)

Installing Node.JS
------------------

Node.JS is already installed on our Ignite server. In case we need to install
it again, or you want to install it on your own computer, [here are 
instructions on how to install Node.JS on a variety of platforms](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).


Socket.io
=========

Babble will use [Socket.io](http://socket.io/) to allow multiple users to 
connect to a single server and talk to each other across languages. This 
functionality, it turns out, is very similar to a simple chatroom 
client/server. Fortunately for us, Socket.io provides an [example chatroom
server/client](http://chat.socket.io/), with 
[source code](https://github.com/Automattic/socket.io/tree/master/examples/chat),
that guide our development.

* [Socket.io Docs](http://socket.io/docs/)
* [Server API](http://socket.io/docs/server-api/)
* [Client API](http://socket.io/docs/client-api/)

Testing
=======

Tuts+ has a [great article](http://code.tutsplus.com/tutorials/testing-in-nodejs--net-35018)
on using [Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/)
for testing in Node.js, as well as general Test Driven Development in Node.js.

And [here's an article](http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/)
on testing the client side of Socket.io.

[Travis-CI](https://travis-ci.org/) provides contineous integration. Awesome.

Run Tests
---------

    cd nodejs
    make test

Secrets
=======

In order to allow both developers and Travis-CI to access needed secret keys,
the utils/getSecrets module was created that contains the
getSecret(secret_name) function. This function will return the value of
secret_name from either a secret.js file found in the utils folder, or from
environmental variables if Babble is running on Travis-CI.

Example of using getSecrets:

    var secerts = require('utils/getSecrets');
    var our_little_secret = secerts.getSecret('our_little_secret');

How to add secrets for Travis-CI
--------------------------------

See these [instructions](http://docs.travis-ci.com/user/encryption-keys/).
