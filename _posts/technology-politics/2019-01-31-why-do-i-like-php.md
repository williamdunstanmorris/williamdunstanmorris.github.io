---
layout: navbar-post-centered
title:  "Please don't hate on PHP."
cover: assets/img/php-elephant.png
date:   2018-02-07 09:31:01 +0000
categories: work
published: true
tags: philosophy php
---


Okay, this is a disclaimer: When I first encountered PHP, I thought it was disgusting. It started when I began developing a Wordpress theme, and was naturally introduced to the Wordpress Codex, a bed of PHP functions that helped you design the base of your theme. For me, it quickly became more than just a theme, and I was naturally thrown into a more full-stack environment. With that said, on my PHP journey to never-land, I did encounter some quick random caveats for PHP that make it totally shit, so are worth getting out the way first. In order not to contradict myself too much, there are also some things that make it such a powerful language to know once you have got the hard stuff out the way. With this language, there is a steep learning curve, but at least it's not C++.

## Documentation

The main PHP documentation page is not on par with some of its full-stack competitors, the like of ReactJS in JavaScript (ugh), but it is really readable and well worded. There are some neat ways you can declare arrays.

## Object Orientation

A friend of mine in the office noted that there is a trend of objects in the world at the moment. People love objects. In programming there is a trend for making as much as humanly possible an object-orientated way. In philosophy, there is a trending discussion on objective truth and objectivism.

With Java as one of my backbones when learning the world of computer science, I do enjoy the fact that PHP offers you great ways of using object orientated programming concepts. For instance, I really like `singleton` declaration in PHP. Something within a class, like:

```

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

These variables are about sending information between a web server and a client. These superglobals do this in three different ways. There are pros and cons of both.

The `$_GET` global variable in PHP is part of a way to construct a new http header. It is limited to 1024 chars and should NEVER be used for sensitive information. It contructs an http header using

```
echo $_GET['name']
```

See the deployed Voodoo code in

## Other Useful Variables

## The cool thing about require_once and include_once

## Useful Functions

### Querying and Inserting with `mysqli`


* Find the string length `strlen($string)`
* Find the occurrence of a needle in a haystack string with `strpos($haystack, mixed $needle [, int $offset = 0])`. The other function, `stripos(...)` is case sensitive btw.
* Create an empty array and push to it using `array_push(@array_to_push_to, mixed $value_to_push)`


# Useful variables
