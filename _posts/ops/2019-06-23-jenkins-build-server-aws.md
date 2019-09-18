---
layout: navbar-post-centered
title:  "Setting Up a Jenkins Build Server with AWS"
date:   2019-06-03 12:31:01 +0000
cover: assets/img/docker_noob.png
fill: true
published: false
class: vertical
author: "William Morris"
tags: git ci/cd midi graphics audio go research
category: speak
time-to-read: 20 Minute
---

Key Terminology:

Jenkins is an open-source automation server that integrates with a number of
AWS Services, such as AWS CodeCommit, AWS CodeDeploy, Amazon EC2 Spot,
and Amazon EC2 Fleet. You can use Amazon Elastic Compute Cloud (Amazon
EC2) to deploy a Jenkins application on AWS in a matter of minutes.

* AWS account, an
* AWS Identity and
* Access Management (IAM) user name and password, an
* Amazon EC2 key pair,
* Configured Virtual Private Cloud (VPC).
* RAID - data storage virtualisation technology that combines multiple physical disk drive components into one or more logical units for the purposes of data redundancy, performance improvement, or both. Data is distributed across the drives in one of several ways, referred to as RAID levels or schemes. Each scheme, or RAID level, provides a different balance among the key goals: reliability, availability, performance, and capacity.
* High Availability: Refers to systems that are durable and likely to operate continuously without failure for a long time. To enable more durable data storage, engineers seeking high availability can use a RAID design
* Amazon Elastic File System (Amazon EFS)
* Elastic Beanstalk
* Decouples
* Blue/green deployment
* Amazon Relational Database Service (Amazon RDS)
* Amazon Virtual Private Cloud (Amazon VPC)
* Elastic Beanstalk
* Arm - A family of reduced instruction set computing architecture. These are suitable for smaller use computing - like mobile, tablet or smartphone use, requiring fewer transitors, and fewer
* Subnet
* VPC
* AMI - Amazon Machine Image
* Nginx


The benefit of creating a security group acts as a firewall that controls the traffic allowed to reach one
or more EC2 instances.

https://aws.amazon.com/blogs/mt/running-ansible-playbooks-using-ec2-systems-manager-run-command-and-state-manager/


## AWS Configurations

### IAM

### Image vs Instance

## EC2 Instance Configurations



### Create Security Group

Jenkins uses the port 22 to connect to slaves through SSH



## Jenkins Pathways

## Running Jenkins with Kubernetes
## Running Jenkins with an EC2 Fleet
## Running Jenkins with Docker EC2 Instances
## Running Jenkins with EC2 Instance Slaves (Unix-Based only)


### Jenkins Cloud Configuration

Setting up slaves

There's a lot of DevOps slang thrown around and a shit load of stupidly named accronyms, so learning these from the get go makes life easier:

nodes, runners, slaves, jobs, stages
High availability in reference to slaves.


Used for EC2 Elastic Cloud Computing.
Not trivial to setup
Use Aws IAM Accesss Key to connect to Ec2. If not specified, implicit authentication mechanisms are used (IAM roles).


 those slaves should be used to guarantee the minimum availability.


 “Remote ssh port” which is typically 22. Enter the labels that you want this slave to respond to under the “Labels” section. Keep in mind that Jenkins uses these labels to determine when to launch more new slaves. Now select the “Advanced” button and another window will pop up:

 For “Number of Executors” I recommend entering a value equalling the number of cores on the instance type you chose earlier. Under “Subnet ID for VPC” enter the subnet id that you want to launch the slaves in. For “Instance Cap” select the maximum number of this AMI you would like to have running at once. Finally at the bottom of the configuration page of Jenkins hit “Save”

For “Number of Executors” I recommend entering a value equalling the number of cores on the instance type you chose earlier.

“Subnet ID for VPC” enter the subnet id that you want to launch the slaves in. For “Instance Cap” select the maximum number of this AMI you would like to have running at once. Finally at the bottom of the configuration page of Jenkins hit “Save”


There are a few optimizations you can make to save the most money with this configuration:

Use smaller instances with less executors and reduce the idle time termination.
Smaller instances are cheaper and by reducing the idle time termination you can effectively only run slaves when you need them.
Change to spot instances.
Under the Cloud configuration you can list a maximum spot price. Set this to the on demand price of your chosen instance type and enjoy the savings!
Use labels wisely.
Some jobs may need bigger instances to run. Use labels and multiple AMI configurations to only use big instances when they are absolutely necessary.


Get EC2 Instance Metadata, using cURL .
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html

Tutorials followed:

https://d1.awsstatic.com/Projects/P5505030/aws-project_Jenkins-build-server.pdf?refid=gs_card

https://aws.amazon.com/blogs/devops/set-up-a-build-pipeline-with-jenkins-and-amazon-ecs/

https://blog.nimbleci.com/2016/08/31/how-to-build-docker-images-automatically-with-jenkins-pipeline/#setting-up-a-jenkins-slave-in-ec2

https://www.cloudbees.com/blog/setting-jenkins-ec2-slaves


https://blog.iseatz.com/ec2-plugin-jenkins-automatically-provision-slaves/


Other useful tutorials

https://www.howtoforge.com/linux-service-command/

On using the `service` command for Linux.




What are Ansible and Terraform?
If you are in, or looking to get into, the “DevOps” world, Terraform and Ansible are going to be two names you hear very frequently. There is a good reason for this! Both are outstanding products for creating infrastructure as code that can be used to deploy repeatable environments that meet a vast range of complexity requirements. But what is the difference between these two? Why should you choose one over the other…or should you? Let’s dive a little deeper and talk about some of the similarities and differences these applications have.


Configuration Management vs. Orchestration
For those of you who have read previous writing from me (blogs, guides, etc.), you already know I’m a huge fan of analogies, similes, metaphors, etc. This piece will be no different! Ansible and Terraform are two very similar applications with some key differences. One of those key differences involves two very common DevOps concepts: configuration management and orchestration. These terms generally describe types of tools. Ansible is primarily a configuration management tool, commonly abbreviated as “CM”, and Terraform is an orchestration tool. Now, understand that there are overlaps and these terms are not necessarily mutually exclusive. It helps to use tools that match their strengths, so let’s talk a little about what each type of tool is optimized for.

Ok, as promised, time for the analogy! Think of these tools as an orchestra of musicians. The orchestration tool is akin to the conductor. The conductor ensures the right number of instruments are there and that all of them are playing correctly. If there is an issue, an orchestration tool will generally remove the misbehaving instrument and replace it with another. Orchestration tools are usually focused on the end result and help to ensure the environment is always in that “state”. Terraform is like this. Terraform will store the state of the environment, and if anything is out of order or missing, it will automatically provide that resource when it is run again. This is fantastic for environments that require a very steady state. If something goes wrong, another “Terraform Apply” will rectify the issue! On the other hand, a configuration management tool is more like an instrument repair person. The configuration management tool, such as Ansible, will configure each instrument to ensure it is on key, free of damage, and is working properly. If there is a problem with an instrument, the CM tool will work to repair the issue rather than just replace the instrument entirely.

Do keep in mind that Ansible is somewhat of a hybrid in this aspect and able to replace infrastructure and perform orchestration tasks as well, but Terraform is generally regarded as a superior product in this respect due to its more advanced state management capabilities.


Procedural vs. Declarative
Most DevOps tools can be grouped into one of two categories that describe how they perform their actions. These categories are “procedural” and “declarative”. Now, the definition of these terms are pretty succinct, but there is a large overlap in tools that don’t always fit the mold of one or the other exactly. Procedural describes an application that requires the exact steps to be laid out in the code. For instance, if you needed to scale up the EC2 instances in your environment, you would specify exactly how many instances needed to be created. If you needed to scale down, you would specify the number to be removed. Back to our orchestra metaphor, this is like a conductor asking for 5 trumpets and getting 5 MORE trumpets. Declarative “declares” exactly what is needed, not the process by which the result is achieved. So, if the conductor needed 5 trumpets, or you needed 5 EC2 instances, that’s exactly how many you would have after the code has been executed. If you had 10 and you needed 5, you would just specify a count of 5. In procedural, if you had 10 and you needed 5, you would have to specify that 5 be removed.

So where am I going with all this? Terraform is strictly declarative. You will define your environment, and if that environment changes, it will be corrected on the next “Terraform Apply”. Ansible, on the other hand, is somewhat of a hybrid. You can perform ad-hoc commands that allow for procedural-style configuration or use most of the modules that perform declarative-style. Make sure you read the documentation for any Ansible role you read to ensure you understand the behavior to expect and to know whether you need to explicitly indicate the resources required or if you need to add or subtract those resources to obtain the correct result.



What’s best for me?
I honestly wish I could give you a simple answer. Ansible and Terraform both do a lot of things very well. I personally prefer to use Terraform for orchestration and Ansible for configuration management. Why? Because I find Terraform to be much more intuitive for infrastructure orchestration. Orchestration is what Terraform was created for, and that is its primary purpose. All updates for Terraform are focused on orchestration, and it just seems to be more polished for it. Also, “Terraform Plan” is an excellent tool that provides more useful information than the Ansible --dry-run command.  Ansible, on the other hand, is optimized for configuration management. It can perform orchestration tasks, but that is just part of what it does. As evidenced by Deploy to AWS with Terraform and Ansible course on Linux Academy, I prefer to use the best tool for the task. You may find that you prefer to use one tool for everything, and that is perfectly acceptable!
