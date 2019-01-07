---
layout: navbar-post-basic
title:  "Introduction To Continuous Integration"
cover: assets/img/git-cover-2.png
date:   2018-02-07 12:31:01 +0000
categories: speak
published: true
tags: continuous-integration ci/cd git
---

## Problem Scenario: What if you want to…

- Compile on multiple platforms
- Use automation for a neater workflow
- Embed command scripts
- Stop wasting time waiting around for builds to compile
- Collate and organise multiple datasets or binaries
- Increase code coverage and decrease code review time
- Not break stuff that already exists
- Streamline Version Control and Condor Interactions
- Morale (stop being afraid to code in isolation)

> “Continuous integration is a DevOps software development practice where developers regularly merge their code changes into a central repository, after which automated builds and tests are run. Continuous integration most often refers to the build or integration stage of the software release process…”

## Breakdown. What you have?

- You have a repository you commit to regularly
- You have a repository you build, test, compile, lint, document or package with regularly
- You have a repository you work on in isolation or collaborate with others on

## Breakdown. How does it work?

- Create/modify a configuration file ```.gitlab-ci.yml```. Similar to a .gitignore file or .git directory that exists in repo. This configuration file has special keywords and attributes.
- Commit changes to your code
- Trigger a pipeline through git push
- Available configured runner assigned a job to perform
- Successfully created artefacts uploaded
