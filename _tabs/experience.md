---
title: experience & projects
icon: fas fa-info-circle
order: 2
---

### **DevOps Engineer**, [PEAT GmbH (Plantix)](https://plantix.net/en/)
**2019 - present**

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


**Building standards and processes surrounding Operational Excellence**
* I worked on creating documentation for standardisation of convenience in the cloud via accounts, logging, metrics and naming conventions across AWS. It was not the most exciting project, but extremely useful for ensuring collective responsibility for operational excellence across multiple teams.
* Creating maintenance windows for internal services - services that could afford downtime - was something that was difficult to maintain, but
* I wanted to graph more low level application based metrics from our API. I worked on creating a custom Grafana/Prometheus stated client integration for AWS ECS. This worked like a sidecar, and was valuable because you can observe the behaviour of an application in a very lightweight manner - using a lightweight statsd UDP protocol method. Sometimes it went wrong, but the great thing about UDP is that you can design it to fail and not cause outage. Losing observability is not as bad as losing our application.
* I was trying to figure out how we can be more sustainable in the cloud and less wasteful. Idle resource usage is the worst. I used ansible as a control point to calling the aws api to shutting instances and agents down when our teams weren't using them. It was great way to shut servers down at night. I actually made this into a mini TeamCity pipeline job and gave developers control over it. If they needed to work at night, they could just boot up the agent servers as they needed.

---

### Software Developer/Platform Build Engineer, [CVSSP](https://www.surrey.ac.uk/centre-vision-speech-signal-processing)
**September 2017 - July 2019**

---

Part of an EPSRC research project (named S3A) with BBC Research & Development departments for Computer Vision and Signal Processing, in collaboration with the Universities of Southampton and Salford, the project was focused on integral research in object-based audio for immersive home environments. I formed part of the development team to engineer cross-platform applications for the audio research and creative communities. Some of my project work at CVSSP:

**A Junior C++ Engineer & Audio QA on [Reverberant 3D Audio Application/VST](https://github.com/s3a-spatialaudio/VISR-Production-Suite)**
* Junior / Beginner with `C++11/14`, part of a research team to help produce a package of VST audio plugins.
* To produce software for object-based reverb audio software, we iteratively integrated our object-based audio
  rendering framework with a third party C++ framework, JUCE.
* Used `lib-boost` to parse and write JSON in real-time, ensuring synchronous audio signals.
* Technical writing and auto-generation CMAKE configuration for our [API Documentation](https://cvssp.org/data/s3a/public/VISR/visr_installers/0.12.0/macosx/build_py36/doc/apidoc/html/index.html) using Doxygen and Sphinx.
* > If you are an audio DAW guru, download the Audio VST Plugin Package [here!](https://www.s3a-spatialaudio.org/plugins)

**Platform Build Engineer on [Real-time 3D Spatial Audio Framework](https://github.com/s3a-spatialaudio/VISR)**
* Part of a small development team, obtained thorough understanding of automation for
  continuous delivery of cross-platform packages and source for of an object-based audio
  framework.
* Understanding of build processes to tailor CMT such as CMake, Python config and autodoc for
  auto-generated documentation using Sphinx, Breathe and Doxygen
* Learned and worked with Gitflow modelling for the first time
* My first large-scale pipeline project that I [built CI/CD pipeline for](https://github.com/williamdunstanmorris/VISR-Production-Suite/blob/master/.gitlab-ci.yml) - building, installing and deploying packages supporting different OS platforms. (13 artifact packages!)

## other selected project work

---

Here is a collection of projects that I really enjoyed, as either part of my career or in my free time.

**Creator & Max/MSP Developer on [Kluster Max/MSP Package](https://github.com/williamdunstanmorris/kluster)**
* Kluster is a Visual-Audio-Workstation (VAW) made using Max, which utilises both user and agent-generated graphics from your musical - all at your control!

> If you already have [Max/MSP](https://cycling74.com/products/max) and you want to try it, contact me. I haven't managed to properly package this project up yet. But I will get around to it. You can try and `git clone` it and see if you can get it working in Max/MSP yourself as some running modules.

**Creator & Developer: [SuperCollider VST](https://github.com/williamdunstanmorris/vst_gui)**
* My first ever programming project. I really want to go back to this language one day properly. A Graphical User Interface (GUI) that demonstrates the very basic use of subtractive synthesis within digital format. My aim was to build a two-oscillator synthesizer that gives the user some basic variable parameters. The GUI incorporates 2 oscillators of which you can xfade between the two waveforms