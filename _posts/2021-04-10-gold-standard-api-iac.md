---
title: Infrastructure as Code - A High Availability API in AWS
author: William Morris
name: William Morris
date: 2021-04-10 20:55:00 +0800
categories: [Engineering]
pin: true
tags: [Terraform]
---

I worked with the backend team to help craft the terraform for their django-python api, hosted as a stateless application on AWS ECS. This included with it, a service worker and scheduler architecture, running under within the same cluster. They also needed to integrate similar components, like statsd and flower too.