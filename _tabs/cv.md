---
title: CV
icon: fas fa-info-circle
order: 1
---

# about

---

Hey! I'm Will! 29, from England. I'm a musician and engineer, based in Kreuzberg, Berlin. At the moment, I work as a `DevOps Engineer` at [PEAT GmbH](https://plantix.net/en/), and have help build and maintain infrastructure and architecture across a host of services there. Originally, I grew up with a more audio-artsy-based background, but I got into engineering later on. I studied 🎹 Music(BA) and `Computer Science`(MSc) at university. 

# current experience

---

**DevOps Engineer**, PEAT GmbH (Plantix), 2019 - present

---

As an engineer and Head of DevOps at PEAT (the only DevOps engineer actually), I work on the mission to help transform our engineering into a high-performance organisation, by being part of the discussions to prepare technical architecture, micro-services and engineering teams for future growth.

At Plantix, we help millions of small-scale farmers diagnose crop diseases using our machine learning algorithms and a single picture taken with their smart phones. Measurable social impact, indirect environment change and improving agricultural farming and sustainability not to mention an amazing bunch of workmates and friends were just some of the reasons I chose to work here at PEAT. Some of my project work at PEAT:

**Content distribution networks architecture and deployment (AWS Cloudfront & S3)**
* I worked hard on completely removing annoying nginx and apache technologies. They are error prone and are difficult to test. They have caused a lot of downtime and config bugs for me in the past. Actually, for a static website with a lot of pre-rendered content, you can just serve it with a content delivery network like AWS CloudFront. Once you've configured certificates and S3 origins, you can figure out S3 object metadata for client response headers, including for compression. The tricky part here to learn more about is understanding how to deliver and update content for clients too; but it's possible via object versionsing and cache invalidation.

**Service-orientated architecture and deployment (AWS Fargate ECS, ALB, IAM, RDS, Elasticache)**
* I worked with the backend team to help craft AWS resources with Terraform for their django-python API, hosted as a stateless application on AWS ECS. This included with it, a service worker and scheduler architecture task definition under the same service, running under within the same cluster. They also needed to integrate similar components, like statsd and flower too. This ran with RDS, an Elasticache cluster (Redis) and an application load balancer that was responsible for registering healthy tasks during a new deployment. I repeated this architecture for three of our APIs.
* I wanted to graph more low level application based metrics from our API. I worked on creating a custom Grafana/Prometheus stated client integration for AWS ECS. This worked like a sidecar, and was valuable because you can observe the behaviour of an application in a very lightweight manner - using a lightweight statsd UDP protocol method. Sometimes it went wrong, but the great thing about UDP is that you can design it to fail and not cause outage. Losing observability is not as bad as losing our application.

**Hosting on-premise architecture and scaling for better / less stressful deliveries**
* From scratch, I deployed, maintained and own an entire on-premise CI server (TeamCity). I used Terraform to create additional VM agents, and Ansible to provision them with the frameworks like correct Android SDK, and docker-compose to support pipeline portability across multiple agents. Docker was great for this, and it meant that we continuously create a stable and efficient delivery pipelines that ensure both high performance and portability, especially during SEV-1 incident hot-fixes.
* I supported 4 teams, who used TeamCity respectively on their own projects, giving advice on how they could scale and maintain a good pipeline without owning and being responsible for it myself. This was good, as it meant they felt more autonomous developing projects they owned and they were learning.
* I worked closely with PEAT's Android Team, the developers behind the Plantix App - to help craft two pipelines using mainly Gradle for both building and testing, and release track delivery on the Google Play Store. We even made a nightly build for or develop branch, which helped QA test upcoming features the following morning.
* I got really into operational metrics, especially with our onprem grafana. Because we had around 45 EC2 VMs that served development, production or internal purposes, we needed some basic observability. However, with so many VMs, this was far too laborious and prone to human error to do. So, I backwards wrote a grafana dashboard panel from json and converted it to jsonnet to make abstractions and create a standard of alert responses and thresholds that could be adjusted without manually having to fiddle with Grafana all the time.
* I also migrated all our old projects off from Jenkins and put them onto TeamCity, improving them by dockerising more or less all the pipelines so they can be more portable on different agent runner VMs if they need to be.


**Building Operational excellence and processes**
* I worked on creating documentation for standardisation of convenience in the cloud via accounts, logging, metrics and naming conventions across AWS. It was not the most exciting project, but extremely useful for ensuring collective responsibility for operational excellence across multiple teams.
* Creating maintenance windows for internal services - services that could afford downtime - was something that was difficult to maintain, but
* I wanted to graph more low level application based metrics from our API. I worked on creating a custom Grafana/Prometheus stated client integration for AWS ECS. This worked like a sidecar, and was valuable because you can observe the behaviour of an application in a very lightweight manner - using a lightweight statsd UDP protocol method. Sometimes it went wrong, but the great thing about UDP is that you can design it to fail and not cause outage. Losing observability is not as bad as losing our application.
* I was trying to figure out how we can be more sustainable in the cloud and less wasteful. Idle resource usage is the worst. I used ansible as a control point to calling the aws api to shutting instances and agents down when our teams weren't using them. It was great way to shut servers down at night. I actually made this into a mini TeamCity pipeline job and gave developers control over it. If they needed to work at night, they could just boot up the agent servers as they needed.

# previous experience 

---

**Software Developer/Platform Build Engineer**, Centre for Vision, Speech and Signal Processing, September 2017 - July 2019

---

Part of an EPSRC research project (named S3A) with BBC Research & Development departments for Computer Vision and Signal Processing, in collaboration with the Universities of Southampton and Salford, the project was focused on integral research in object-based audio for immersive home environments. I formed part of the development team to engineer cross-platform applications for the audio research and creative communities. Some of my project work at CVSSP:

**A Junior C++ Engineer & Audio QA on [Reverberant 3D Audio Application/VST](https://github.com/s3a-spatialaudio/VISR-Production-Suite)**
* Junior / Beginner with `C++11/14`, part of a research team to help produce a package of VST audio plugins.
* To produce software for object-based reverb audio software, we iteratively integrated our object-based audio
  rendering framework with a third party C++ framework, JUCE.
* Used `lib-boost` to parse and write JSON in real-time, ensuring synchronous audio signals.
* Creation of API Documentation using Doxygen and Sphinx.
* **If you are an audio DAW guru, download the Audio VST Plugin Package [here!](https://www.s3a-spatialaudio.org/plugins)**

**Platform Build Engineer on [Real-time 3D Spatial Audio Framework](https://github.com/s3a-spatialaudio/VISR)**
* Part of a small development team, obtained thorough understanding of automation for
  continuous delivery of cross-platform packages and source for of an object-based audio
  framework.
* Understanding of build processes to tailor CMT such as CMake, Python config and autodoc for
  auto-generated documentation using Sphinx, Breathe and Doxygen
* Learned and worked with Gitflow modelling for the first time
* My first project that I [built CI/CD pipeline for](https://github.com/williamdunstanmorris/VISR-Production-Suite/blob/master/.gitlab-ci.yml) - building, installing and deploying packages supporting different OS platforms.

# other selected project work

---

Here is a collection of projects that I really enjoyed, as either part of my career or in my free time.

**Creator & Max/MSP Developer on [Kluster Max/MSP Package](https://github.com/williamdunstanmorris/kluster)**
* Kluster is a Visual-Audio-Workstation (VAW) made using Max, which utilises both user and agent-generated graphics from your musical - all at your control!

> If you already have [Max/MSP](https://cycling74.com/products/max) and you want to try it, contact me. I haven't managed to properly package this project up yet. But I will get around to it. You can try and `git clone` it and see if you can get it working in Max/MSP yourself as some running modules.

**Creator & Developer: [SuperCollider VST](https://github.com/williamdunstanmorris/vst_gui)**
* My first ever programming project. I really want to go back to this language one day properly. A Graphical User Interface (GUI) that demonstrates the very basic use of subtractive synthesis within digital format. My aim was to build a two-oscillator synthesizer that gives the user some basic variable parameters. The GUI incorporates 2 oscillators of which you can xfade between the two waveforms

# where I'm going

---

The same place I am now, just a little older, and a little wiser. I would move into a leadership-based  role, as I discovered from previous roles and experience that this is what I loved most. I loved to lead, and I want more experience in it. I also want to become a better cook, a better programmer and a better pianist. I guess I want to get pretty smart in one programming language now that I’ve spent a lot of time in *operations* and the *cloud*. I feel like I really know how to host, maintain and deploy a project with some tricks up my sleeve. I just need to transition more into building the code for one now. Time will tell, I guess.

# talks and demonstrations

---

Before the pandemic, I made the most of my opportunities to give talks and demo on a series of topics. Below are some nice summaries of things I spoke about. 

**2018, Continuous Integration Practices**
Rising from my project work on developing a CI pipeline for a C++ framework using CMake, I gave a
live coding tutorial reflecting on continuous integration, notably on how it could be combined with
more computer intensive research. This was an independent initiative that addressed a gap in a
trending technology and led to interest from a broad range of participants.

**2018, “Git Poetry”**
To better my collegues’ understanding of version-control techniques, I gave a live git demonstration
on good practices for version control for collaborative workflow. As a result, I feel more confident
about pushing changes within a collabo- rative environment. This is summarised in my blog post,
https://williamdunstanmorris.github.io//gitflow-techniques.html

**2018, CVSSP 30th Anniversary - [Can Machines Think?](https://www.surrey.ac.uk/centre-vision-speech-signal-processing/about/30th-anniversary)** Ran my own demo stand for industry leaders in computer vision, speech and signal processing, an exploration into our- project’s object-based audio VSTs - the first ever open-source object-based VST eco-system for audio. You can see the program for this [here](https://indd.adobe.com/view/12e222f7-79ab-4921-9c15-6ac26cbd267d). 

**2020, Observability for Web Services**

# languages

---

* I prefer the Macbook trackpads and screen resolution, but I spend a lot of time on Linux. So I use both.
* I got into programming through [Max/MSP](https://cycling74.com/products/max) and [SuperCollider](https://supercollider.github.io/)
* I prefer [zsh](https://ohmyz.sh/) over fish.
* I really love [Terraform](https://www.terraform.io/). I've written tonnes of it to provision resources in AWS. It has made AWS so much less overwhelming.
* Written small scripts and sysops tasks with Python
* Written and collaborated on software with C++ and Java
* I'm learning [Golang](https://go.dev/)! Specifically, microservices with Golang. I've found it hard to find a language that I really liked, but I think that this is the language I really want to master eventually.
* I tried some wordpress development with PHP for Wordpress too. That was actually pretty fun. OO is nice.  


# skills, buzz-words and the tool soup

------

**Communication & leadership**
• Helping build a North * Engineering based on SOLID and observable 12-factor
• Comprehension of low level tasks management performance KIs (key insights)
• I believe in diplomacy as an engineer
• i believe successful engineering projects are constructed via well documented approaches that address the core objective and key insights from the top down.

**SysOps and Site Reliability**
• Experience building SEV-1 response protocols
• Experience responding to SEV-1 response protocols (on call experience)
• Deployed and maintained (Ansible) 3+ EC2 VM agents for CI/CD.

**Cloud (AWS)**
I have a huge amount of hands on experience working with AWS. It would take a long time to describe how I came into contact with every single one of these services, but in a nutshell:

* Creating regional VPCs, routing tables, private and public subnets
* EC2: EC2, EIPs, AMI, Snapshots, Volumes, application load balancers, target groups
* IAM, Whitelisting Roles, AWS Organizations (great for environment mapping!) 
* Autoscaling launch configurations
* Security groups, self referencing security groups
* ECS, ECR, CodeDeploy
* Creating ECS clusters for EC2 and ECS Fargate
* Application Load Balancing and Target Groups
* AWS Backup
* IAM Role and policy management via least privilege approach
* RDS Postgres
* Elasticache Redis

**Terraform**
Using modularised terraform, I have:
* Deploying stateless container application models (API)
* Deploying serverless application models (API)
* Deploying content delivery distribution and origins architecture (Website)
* Deploying and owning a custom internal on-premise CI/CD platform architecture (TeamCity) for multiple engineering teams.
* Deployed and own an internal on-premise Grafana for 4 teams


# additional experience

---

**English Teacher, British Institute of Rome, 2016**
Acquired a CELTA teaching qualification, built up teaching skills and acquired a modest
understanding of spoken Italian.

**Activities Manager, Education First, Brighton, 2015**
Organised and managed staff and activities leaders, managing budgets and events in venues across
Brighton and south-east England.

# references

---

* Dr Philip P Jackson, Reader in Machine Audition, University of Surrey, GU27XH
p.jackson@surrey.ac.uk 
* Professor Adrian Hilton, Director of CVSSP, University of Surrey, GU27XH
a.hilton@surrey.ac.uk

