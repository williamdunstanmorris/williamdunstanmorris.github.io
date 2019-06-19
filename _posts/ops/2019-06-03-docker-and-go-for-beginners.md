---
layout: navbar-post-centered
title:  "A Go Application with Docker"
date:   2019-06-03 12:31:01 +0000
cover: assets/img/docker_noob.png
fill: true
published: true
class: vertical
author: "William Morris"
tags: git ci/cd midi graphics audio go research
category: speak
time-to-read: 20 Minute
---

Docker is described as a tool used to create and run containers. That doesn't mean much to the average noob, as the first two questions come to mind are - what is a container? And why do we need them?

Different computers in the world work differently - they have their own operating system, tools, libraries and versions of software that they rely on. Within DevOps, we refer to this more abstractly as an 'environment'.

If we develop software on one machine, that doesn't mean it will work on any other machine. Maybe that different machine will not have a certain library the software needs? Maybe you have an alternative library version? Maybe you just have a completely different processor architecture altogether!

Enter Docker. Docker is an engine for creating 'containers'. These 'containers' are essentially environment, that have their own operating system, tools, and libraries, and run your code in an isolated 'environment'. That means you don't have to worry about the libraries and the operating system architecture which can be different than your own development environment. Docker solves one of the most common excuses developers use when the production code fails: "But, it works on my machine".
