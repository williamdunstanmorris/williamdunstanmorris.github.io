---
layout: navbar-post-basic
title:  "Continuous Integration I: Gitlab-Runner"
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

## Basic usage:
 Assuming you use Gitlab and have installed gitlab-runner as a `CLI` on Linux, MacOS or Windows. You can follow the installation instructions, [here]("https://docs.gitlab.com/runner/install/#binaries").

 Your first step is to create an initially commit your ```.gitlab-ci.yml``` file. Inside the source directory where your ```.git``` root directory lives, on CLI (Command-line Interface) run
 ```
 $ touch .gitlab-ci.yml
 ```
Lets create a really simple function just to sit inside ```.gitlab-ci.yml``` for now. On commit and push, this can just `echo` a simple 'Hello World!' output. Inside the file, copy the thing in below. I'll explain the things you don't get as we go:

Before we start - one thing to remember - KEEP THINGS SIMPLE. DONT BE A FOOL. This should be a very very iterative process. No waterfall shit.

```
# =============================
# Project name: "repo/project"
# =============================

# Stages
# =============================
stages:
  - initial

# Jobs
# =============================
# Stage: initial
initial:HelloWorld:
  stage: initial
  script:
    - echo "Hello World!"
  tags:
    - macosx
  only:
    - master
```

On CLI, do an initial commit of the file through
```
$ git add .gitlab-ci.yml
$ git commit -m "Initial commit of .gitlab-ci.yml for gitlab-continuous integration. Need to register runner next."
$ git push origin master
```

 Now we have our file in a specified repo. The next stage of this process is to register a runner somewhere. Then proceed to register the runner.

 Okay, cards on the table here. You should have a conceptual awareness and knowledge of how the runner is setup and why a runner even exists in the first place. So, do you know:
 - what a runner is?
 - what we register it for?
 - what it will do for you?

If you do, then you should be asking yourself where you want the runner to be set up. Ask questions like:
- What machine do I want the runner on?
- I understand that the runner I register and therefore script will be restricted by that operating system (`Linux LTS 18`,  `MacOS 10.9` etc.). Basically, you can't write Windows commands in a script for a runner that runs on Linux right?
- Do I need multiple runners?
- How do I differentiate from different runners ?
- How many runners do I need?

## Using gitlab-runner
Okay. Don't get too stressed out. Better to learn by doing. So create the runner anon then. Lets run `help` to see all available commands, like any normal `CLI`

```
$ gitlab-runner help
$ gitlab-runner status
```

## Setting and/or removing a runner

 ```
 #!/bin/bash

 $ gitlab-runner list
 $ gitlab-runner register
 ```
Through the guided prompt, this is what I came up with:

```
#!/bin/bash

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
https://gitlab.eps.surrey.ac.uk
Please enter the gitlab-ci token for this runner:
naDrrwkXtdZ9jKuAvjNj
Please enter the gitlab-ci description for this runner:
[Williams-MacBook-Pro-15.local]: nifty
Please enter the gitlab-ci tags for this runner (comma separated):
macosx
Registering runner... succeeded                     runner=naDrrwkX
Please enter the executor: parallels, shell, virtualbox, docker+machine, docker-ssh+machine, kubernetes, docker, docker-ssh, ssh:
shell
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

Now, prove this to yourself by running
```
$ gitlab-runner list
Runtime platform                                    arch=amd64 os=darwin pid=68858 revision=cf91d5e1 version=11.4.2
Listing configured runners                          ConfigFile=/Users/williammorris/.gitlab-runner/config.toml
nifty                                               Executor=shell Token=piyycTjNnr8dfcWttrcn URL=https://gitlab.eps.surrey.ac.uk
```

The **token** is really hidden and annoying to find in gitlab. Assuming you are logged in, with access to the repo, this is accessed through:

Settings -> CI/CD -> Runners[Expand] -> Set up a specific Runner manually.

Copy the unique token to clipboard.

When asked for a runner name, give it something memorable. You can give it an OS name or something equal, but it is not vital as you can get this information through the CLI: I gave it something easy to remember when scripting.

Sometimes it is useful to remove the runner, just as it is to create it. I do this by passing it the runner name with the argument `--name`

```
$ gitlab-runner unregister --name my-runner-name
```

## So What are the success factors for Continuous Integration?

- Maintain a code repository
- Automate the build
- Make the build self-testing
- Everyone commits to the baseline every day
- Every commit (to baseline) should be built
- Keep the build fast
- Test in a clone of the production environment
- Make it easy to get the latest deliverables
- Everyone can see the results of the latest build
- Automate deployment
