---
layout: navbar-post-centered
title:  "Updating an API without interruption or downtime"
date:   2019-07-13 12:31:01 +0000
cover: assets/img/docker_noob.png
fill: true
published: true
class: vertical
author: "William Morris"
tags: git ci/cd docker
category: speak
time-to-read: 20 Minute
---

Often, application processes (API) interface requirements, usually for web and online platforms involve the continuous upgrade and continuous service to be running simultaneously. This means that users may often experience updates without even knowing it. This is been referred to before as zero-downtime deployment.

Pre-2014, before the DevOps explosion in the market, this would have been trickier to adopt, with local machines having to run sub-sub-sub scripts in the background and communication protocols in sync, but since the inception of Docker, things have been made easier with CLI's such as `docker` and even `docker-compose`, for multiple containers.

We assume that a client is running on a separate machine which is not accessible to us, and it queries the API on port 5000 frequently presumably through HTTP requests of GET and/or POST.

One should assume that the source code (data_source) is version controlled. If not, initialise using `git init`. I will assume that you know how to do initial commit, push and pull to an existing repo, if not, consult your local Search Engine, or other blog posts I made on this.

> IMO An understanding of git as a technology is so vital (and fun) before one even touches technologies like Docker.

## 1. Initialise a git repo in your source or app directory.

## 2. Set up a multi-container service for larger infrastructure service adoptions.

The `up` command in `docker-compose` will ensure that any containers are instantiated or re-instantiated if anything has changed - in this case, we may have a new version or patch of our source code `(0.1.0 -> 0.2.0)`

```
docker-compose up -d
```


## 2. Check for any listed containers that are running processes/commands already.

The standard way of doing so, and also displaying the size of the container storage being used:

```
docker ps -s
```

If nothing is

TODO: Explain how ports work! 


## 3.



This is initialised in the same directory as your `Dockerfile`.

An often confused notion between `docker ps` and `docker-compose ps` :

docker ps lists all running containers in docker engine. docker-compose ps lists containers related to images declared in docker-compose file.

The result of docker-compose ps is a subset of the result of docker ps.





Objectives

You are given an Ubuntu VM on Google cloud which hosts an API (version 1). Due to poor engineering practice, this API is both vital and exists without any redundancy. In the same network is a separate VM which is querying the API regularly. If the client losses connection to the API it will fail and knock-on effects will cause a large outage and therefore damages.

This is a simplified toy task, but for this challenge assume this would be a production environment and part of a larger infrastructure.

Your objectives are:

to find a way to upgrade the current API to version 2 without service interruption
to write up a documentation which allows us to perform more updates in future
Getting Started

You will be able to ssh into your machine (see IP below) using the attached ssh keys. You can install anything you like (you can sudo without password). All incoming ports except port 22 will be closed via the Google Cloud firewall.

Listing the running containers should show you a running devops_api_container. It exposes port 5000 for API calls. The client is already running on a separate machine which is not accessible to you. It queries the API on port 5000 frequently.

In case it is of use to you, we are making the container source code available to you. You will find a interview-devops folder in your home folder. This contains a data_source directory with basic python code and a working Dockerfile to get you started. You can compile it with

cd ~/interview-devops
./build_containers.sh
This will build the api container with the tag devops_api_container .

The API version is controlled with the API_VERSION environment variable. You can launch a new container with a new API version without rebuilding the image by passing this environment variable when launching the container.






Luckily, it looks as if you don't need complex scripting here: docker can handle this for you.

We should assume that the data_source directory is version controlled with git, but that is not present. (usually any source code will be).

## 1. Initialise a git repo in the source, before executing docker.


Because one container should ideally provide a single service, and this exercise should presume a larger infrastructure, we should also explore the usage of `docker-compose`, as a multi-container service too.

I have a docker-compose.yml file that contains 4 containers: redis, postgres, api, worker


```
sudo apt install docker-compose
```

In addition, check that the most recent version of `docker-py` >=1.2, otherwise you may run into versioning conflicts later on.

`pip list` and have a nice scroll


## 1. Create a `docker-compose.yml` file for multiple services.



## 2. Rebuild the containers
```
docker-compose up --build
```

How to restart a single container with docker-compose



Detect changes through periodic checks
Create a cronjob that runs a python script to see *if* there are differences between the two versions
If there is a new updated version available, we will keep the same port but change the container to a temporary container

Once a new image has been created, we can switch back to the devops_api_container again.

https://stackoverflow.com/questions/42529211/how-to-rebuild-and-update-a-container-without-downtime-with-docker-compose

https://superuser.com/questions/803772/remove-exposed-port-from-docker

https://stackoverflow.com/questions/31466428/how-to-restart-a-single-container-with-docker-compose/39501539#39501539

Run a command in a specified container, you need to specify the image.

Run this container in detached mode, exposing receiving and incoming port messages. Remember that in the magic of `docker run`, an image is created

`docker run -itdp 5000:5000 --name <any_container_name> <image_you_are_running>`



It is not clear what the process is for updating the source, but considering it is mentioned that this machine has included for reference the data_source directory, I would justify using version control here.

It would be lovely if one could just use git pull to update the API, but this

but because the image <devops_api_container> is a snapshot instance of the container, we cannot update the image like that

 rely on versioning with git to pull changes, and expect all queries on incoming ports to accept those changes.




```
docker run   
      --dns list                       Set custom DNS servers
      --dns-option list                Set DNS options
      --dns-search list                Set custom DNS search domains
```

Keep containers alive during daemon downtime

https://docs.docker.com/config/containers/live-restore/

If you define it as an API

Because port 5000 is being queried by consumers,  
Using the same port, we point to a replica image

* List all containers


* We should check that the service is running and see if/how is being queried. A nice way to do this is through

```
docker-compose logs -f
```



```
docker ps -a
docker
```


`docker run -it -p 5000:5000 devops_api_container:latest`
