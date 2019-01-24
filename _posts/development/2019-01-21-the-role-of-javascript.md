---
layout: navbar-post-left
title:  "The Role of JavaScript"
cover: assets/img/glslmatrix.png
date:   2018-01-21 12:31:01 +0000
categories: work
published: true
tags: javascript git
---

When sitting in front of the machine as the client. We do so sending a URL request to the server. A server running any language, PHP, Ruby on Rails, ASP.NET etc. will receive the query and give a response, usually in HTML format. This gives the parsed DOM, some rendered code, including some styling and JavaScript files which are also downloaded.

JavaScript runs on the client, not on the server. JavaScript is able to execute code without having to send a request to the server. This is an added benefit of JavaScript. This allows us to create greater user experiences.

There is a pattern coming more popular - where JavaScript runs our entire front-end, creating a single page application, where we get back one page, and JavaScript does things on the front-end, and only occasionally sends requests to the server.

Nowadays with modern CPU, JavaScript has become very fast and very instant, with powerful capabilities.

## Vanilla JavaScript

Without any frameworks, the ES5 version, is widely supported by most browsers now. You can go to the [JSFiddle]() to see some basic functionality using vanilla JavaScript.

Common JavaScript document property functions you see around, usually for assigning variables to an HTML property value:

```
var inputElement = document.querySelector('name-of-html-tag'); // Will query a selector
var taggedElement = document.getElementById('id-of-tag'); //
var createdElement = document.createElement('LI'); // Will create element accordingly.
```

Get variable information

## Dom Access and The Event Object in JavaScript

HTML DOM events allow JavaScript to register different event handlers on elements in an HTML document.

You can access elements through what looks like some kind of hook. Personally, I hate the idea of hooks, as the syntax starts to become messy. Wordpress especially - as they have hook that make use of functions in 'string-function' format. yuck.

A basic approach to using event listeners in JavaScript. Summary of functions to know:

```
inputButton.addEventListener('click' functionHookEvent);

// Function 'event' keyword variable type
function removeTodo(event){ // do something }

var elementTarget = event.target;
var
```

Example 1:

```
var inputButton = document.getElementById('name-of-element');
// Add Event Listener through some kind of hook.
inputButton.addEventListener('click' functionHookEvent);

function functionHookEvent() {
  //We can use the input object properties, of which there are many. The .value is one associated with the <input> tag.
  var userInput = inputElement.value;
  // userInput trimming methods to check whether strings are not only empty, but empty with spacebar escape sequences too.
  if (userInput.trim() !== ''){
    var todoLi = document.createElement('LI');
    // Add Event listener
    // A simple way to add text content from a user input.
    todoLi.textContent = userInput;
  }
}
```

an entire single page.


## Retrieving data from a page without refreshing the page.

Ajax is a way in which JSON metadata can be used to retrieve information from the server without having to refresh the page.
