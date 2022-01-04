---
title: Please stop using Jenkins in 2020. Use TeamCity.
author: William Morris
name: William Morris
date: 2020-05-03 20:55:00 +0800
pin: true
published: false
---

I deployed, maintained and own an entire on-premise CI server (TeamCity). I used Terraform to create additional VM agents, and Ansible to provision them with the frameworks like correct Android SDK, and docker-compose to support pipeline portability across multiple agents. Docker was great for this, and it meant that we continuously create a stable and efficient delivery pipelines that ensure both high performance and portability, especially during SEV-1 incident hot-fixes.

I worked with the backend team to help craft the terraform for their django-python api, hosted as a stateless application on AWS ECS. This included with it, a service worker and scheduler architecture, running under within the same cluster. They also needed to integrate similar components, like statsd and flower too.

I worked closely with PEAT's Android Team, the developers behind the Plantix App - to help craft two pipelines using mainly Gradle for both building and testing, and release track delivery on the Google Play Store. We even made a nightly build for or develop branch, which helped QA test upcoming features in the morning.

I was trying to figure out how we can be more sustainable in the cloud and less wasteful. Idle resource usage is the worst. I used ansible as a control point to calling the aws api to shutting instances and agents down when our teams weren't using them. It was great way to shut servers down at night. I actually made this into a mini TeamCity pipeline job and gave developers control over it. If they needed to work at night, they could just boot up the agent servers as they needed.

I also migrated all our old projects off from Jenkins and put them onto TeamCity, improving them by dockerising more or less all the pipelines so they can be more portable on different agent runner VMs if they need to be.

I got really into operational metrics, especially with our onprem grafana. Because we had around 45 EC2 VMs that served development, production or internal purposes, we needed some basic observability. However, with so many VMs, this was far too laborious and prone to human error to do. So, I backwards wrote a grafana dashboard panel from json and converted it to jsonnet to make abstractions and create a standard of alert responses and thresholds that could be adjusted without manually having to fiddle with Grafana all the time.

I worked as the platform lead and cloud engineer on our business-focused API. The API was focused on providing communication channels (like WhatsApp, SMS) between retailers and farmers throughout India. The API was integrated into Plantix, our Android-based app for Farmers. I really liked using AWS Code Deploy for this. We configured it to be Green/Blue, and it meant that we could fail fast without impacting farmers with outage. CodeDeploy acted like a controller between AWS ECS and potential registered targets from the AWS application load balancer. I would definitely utilise these exact technologies again for a versioned API.

I wanted to graph more low level application based metrics from our API. I worked on creating a custom Grafana/Prometheus stated client integration for AWS ECS. This worked like a sidecar, and was valuable because you can observe the behaviour of an application in a very lightweight manner - using a lightweight statsd UDP protocol method. Sometimes it went wrong, but the great thing about UDP is that you can design it to fail and not cause outage. Losing observability is not as bad as losing our application.

I worked on creating documentation for standardisation of convenience in the cloud via accounts, logging, metrics and naming conventions across AWS. It was not the most exciting project, but extremely useful for ensuring collective responsibility for operational excellence across multiple teams.

I worked hard on completely removing annoying nginx and apache technologies. They are error prone and are difficult to test. They have caused a lot of downtime and config bugs for me in the past. Actually, for a static website with a lot of prerendered content, you can just serve it with a content delivery network like AWS CloudFront. Once you've configured certificates and S3 origins, you can figure out S3 object metadata for client response headers, including for compression. The tricky part here to learn more about is understanding how to deliver and update content for clients too; something that's possible via object versionsing and cache invalidation.

Creating maintenance windows for internal services - services that could afford downtime - was something that was difficult to maintain, but




