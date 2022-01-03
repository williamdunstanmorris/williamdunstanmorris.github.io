---
title:  "Please don't hate on PHP."
date:   2018-02-07 09:31:01 +0000
published: true
tags: philosophy php
---


Okay, this is a disclaimer: When I first encountered PHP, I thought it was disgusting. It started when I began developing a Wordpress theme, and was naturally introduced to the Wordpress Codex, a bed of PHP functions that helped you design the base of your theme. For me, it quickly became more than just a theme, and I was naturally thrown into a more full-stack environment. With that said, on my PHP journey to never-land, I did encounter some quick random caveats for PHP that make it totally shit, so are worth getting out the way first. In order not to contradict myself too much, there are also some things that make it such a powerful language to know once you have got the hard stuff out the way. With this language, there is a steep learning curve, but at least it's not C++.

## Documentation

The main PHP documentation page is not on par with some of its full-stack competitors, the like of ReactJS in JavaScript (ugh), but it is really readable and well worded. There are some neat ways you can declare arrays.

## Object Orientation

A friend of mine in the office noted that there is a trend of objects in the world at the moment. People love objects. In programming there is a trend for making as much as humanly possible an object-orientated way. In philosophy, there is a trending discussion on objective truth and objectivism.

With Java as one of my backbones when learning the world of computer science, I do enjoy the fact that PHP offers you great ways of using object orientated programming concepts. For instance, I really like `singleton` declaration in PHP. Something within a class, like:

In PHP, remember the difference between using the `self` and `$this->member` keywords when writing OO classes. `self::$member` refers to the class itself, whereas `$this->member` refers to the current object in question. With a singleton design, `self::$member` is what we should be using, to access a static member.

```php

// Hold the class instance.
private static $instance = null;

// The constructor is private
// to prevent initiation with outer code.
private function __construct()
{
  // The expensive process (e.g.,db connection) goes here.
}

// The object is created from within the class itself
// only if the class has no instance.
public static function getInstance()
{
  if (self::$instance == null)
  {
    self::$instance = new Singleton();
  }

  return self::$instance;
}

```

## `$_GET, $_POST` and `$_REQUEST`

`$_GET` is actually an inbuilt array which collects values from the URL. You can access it like any array, with a function like `print_r($__GET)` function

* `$__GET` can only be used to request data.
* `$__GET` can be cached and remain in the browser history.
* GET requests can be bookmarked.
* They are useful to retrieve for instance a list of questions or responses on a site like StackOverflow, but not for any creational things that edit the system state on a web site or web application. For this, we use `$__POST`.

`$_POST` is alos a superglobal that is an inbuilt array in PHP. We should use this for destructive creation, because you can't hit a post action in the address bar of your browser.

`$_REQUEST`

But, even if you are not following RESTful principles, it can be useful to think in terms of using GET for retrieving / viewing information and POST for creating / editing information.


These variables are about sending information between a web server and a client. These superglobals do this in three different ways. There are pros and cons of both.

The `$_GET` global variable in PHP is part of a way to construct a new http header. It is limited to 1024 chars and should NEVER be used for sensitive information. It constructs an http header using

```
echo $_GET['name']
```

See the deployed Voodoo code in

## Other Useful Variables

## The cool thing about require_once and include_once

## Useful Functions

`print_r($variable)`
`isset($variable_to_check)`
`header( 'WWW-Authenticate: Basic realm="My Realm"')`


### Querying and Inserting with `mysqli`

* Find the string length `strlen($string)`
* Find the occurrence of a needle in a haystack string with `strpos($haystack, mixed $needle [, int $offset = 0])`. The other function, `stripos(...)` is case sensitive btw.
* Create an empty array and push to it using `array_push(@array_to_push_to, mixed $value_to_push)`


# Useful variables

# Cray cray hacks::

How do you push an a key:value element of one associative array onto the end of another associative array (similar to array_push(...)). You can use array_merge ($existing_array, $array_to_add), but this does not solve pushing single elements onto the stack. The only way I found I could actually do this was by using array_slice(...) and set the offset of a specific element within the array to return a brand new array. Kind of annoying, but there was no better way to do that from what I read on 'tinternet . 
