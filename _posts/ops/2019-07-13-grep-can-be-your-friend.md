---
layout: navbar-post-centered
title:  "grep can be your friend"
date:   2019-07-13 12:31:01 +0000
cover: assets/img/grep_friend.png
fill: true
published: true
class: vertical
author: "William Morris"
tags: git ci/cd docker
category: speak
time-to-read: 5 Minute
---

Lets go through the use cases for what you might actually use grep for. Maybe then, it can be your friend.

# 1. Search for a file

# 2. Search for a word located in the file.

* Count the number of occurances too!
* Return the file and its location
* Return the filenames
* With case in-sensitivity

`grep -rc -l "word" ./*`

# 3. Search for
