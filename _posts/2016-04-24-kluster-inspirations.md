---
title:  Motivations behind audiovisual software - Kluster
cover: assets/img/piano-me.jpg
date:   2018-02-07 12:31:01 +0000
published: true
tags: max-msp opengl midi graphics research
---

## introduction

New software potential for visual-interactive systems exist, which explore the human processing capabilities in regards to improvisation in music. This is by no means the first project that is researching music improvisation as a human processing capability for a visual-interactive system, but this review attempts to expose pertinent new potentials or alterations for these types of systems. The review highlights the importance of hybrid environments for real-time visual interactive systems, notable technologies in visual-interactive systems, and the importance of abstraction in visual-interactive systems and user-interfaces. To demonstrate relevancy, the following literature review continually attempts to expose these potentials, as the acting foundation behind the project’s motivations and engineering requirements.

Because of the scientific nature of this report and the immediate relevancy in regards to the engineering carried out in this project, it is important to note at this stage that the literature review does not provide research into music improvisation as a musical construct, but Improvisation: Its Nature and Practice in Music by Derek Bailey (Bailey, 1993) serves as valuable reading for the nature of improvisation in all its forms. Briefly however, music improvisation can be defined as to allow the creative activity of immediate musical composition, to which it combines the communication of emotions and instrumental techniques along with an immediate reaction to other musicians.

## hybrid environments for real-time visual-interactive systems


Historically, many have interpreted the ‘visualisation’ aspect in common interactive systems as the subsequent means to view the results from data analysis, but as Stalling et al. observes in the introduction to his report on Amira: a Highly Interactive System for Visual Data Analysis, ‘while in such integrated systems visualization is usually just an add-on, there are also many specialized systems whose primary focus is upon visualization itself.’ (Stalling, Westerhoff, & Hege). This is especially the case for those who are involved in live-coding, sometimes referred to as on-the-fly programming - a performing arts form centred upon the writing of source code and the use of interactive programming in an improvised way.

It is evident that there is a dedicated need for a live-coder to be able to make modifications to a program without halting its on-going execution. It would not be convenient for an audience if a visualisation had to be re-executed so the performer could add another graphical element or sound to his/her code. The optimal solution to this is a hybrid-interactive development environment for visual- interactive systems. Whilst there are many solutions that have been embraced in the performance of music for live-coding such as SuperCollider1, there have been fewer contributions to this for the live- coding of visual-interactive systems for computer graphics. With that said, there are academically recognised environments centred on building visual-interactive systems that operate in real-time.

These include openFrameworks, Cinder and Max. The most distinguishable in regards to its large community size and development methodology is Max, a visual-programming language.


## the Max interactive development environment

As software that has been around for over three decades, Max (formally Max/MSP) informally descends from the language MUSIC-n to house live-coders not familiar to certain design principles like scoping, name-spacing or object-orientated programming. Max is a visual-programming language written for music and multimedia, is modular by design, and encompasses routines that exist as shared libraries. It encompasses interaction with MIDI and audio, providing several high-level objects, as well as many OpenGL objects within the Jitter portion of Max that provide real-time video and matrix processing for 2D and 3D graphics.

Most regard Max as a visual programming language, working at high level, but there are low-level operations that schedule the real-time management of communications between objects5 in the modular fashion of outlet-to-inlet or output-to-input.

On their paper on Interactive Systems for Visual Data Analysis, Stalling et al. makes some pertinent points on visual programming languages in visual-interactive system – more specifically on the benefits of modular approaches to interactive systems in that ‘these systems (interactive systems) are not targeted to a particular application area, but provide many different modules which can be combined in numerous ways, often adhering to the data-flow principle and providing means for visual programming’ (Stalling, Westerhoff, & Hege). They subsequently mention that ‘in these ways, custom pipelines can be built to solve specific visualization problems.

Although these visualization environments are very flexible and powerful, they are usually more difficult to use than special-purpose software. In addition, a major drawback induced by the data-flow principle or pipelining approach is the lack of sophisticated user interaction.’ (Stalling, Westerhoff, & Hege)
Max is modular, and end-users can draw learning parallels with physical modular systems such as Buchla Series or the Korg MS20 to gain an overview of how modular patching works in Max. In addition, as long as the components are readily available, modular patching is instant, flexible and highly customizable – to accommodate the necessary features of musical improvisation. However, although Max may be a viable solution for catering towards improvisation and supports real-time hybrid development for on-the-fly programming, deploying a visual-interactive system in this environment invites a series of engineering complexities – complexities that should be solved through abstraction paradigms.


> The implementation blog discusses the relevant Max syntax in more detail.

## abstraction in visual-interactive systems

The use of abstraction in visual-interactive systems is so higher level programming can be adopted. As Gomes and Velho note in their paper titled Abstraction paradigms for computer graphics, ‘This abstraction step becomes very important when we are working on a very interdisciplinary area such as computer-graphics that uses methods from geometry, algebraic geometry, analysis, discrete mathematics, and so on.’ (Gomes & Velho, 1995) Furthermore, in his book on

> Computation Visualization: Graphics, Abstraction and Interactivity, Strothotte

notes that the importance of abstraction within visualization is being able to ‘separate out important features from less important ones, and to make this choice evident for the viewer.’ (Strothotte). For visual-interactive systems, especially in gaming, many mathematical models are used to simulate real-world objects and ‘in order to understand these models and pose relevant problems in each particular field of this area, it is important to create levels of abstraction to encapsulate common properties of the different models and allow us to have a global conceptual view of the methods and techniques in each field.’ (Gomes & Velho, 1995) Since then, there have been continual attempts to solve the issue of abstraction, through the development of new technologies – frameworks, languages and softwares. Nonetheless, ‘The creation of adequate abstraction levels allow us to search for better mathematical tools to tackle the problems in an objective way in each level.’ (Gomes & Velho, 1995)

## abstraction for user-interface design

On their article on Visual Interactive Systems for End-User Development: A Model-Based Design Methodology, Constabile et al. observes that ‘On the whole, there is a communication gap between designers and end-users, originated by their different cultural backgrounds.’ They go on to mention that the designers and end-users ‘adopt different approaches to abstraction since, for instance, they may have different notions about the detail that can be abridged. Moreover, end-users heuristically reason rather than algorithmically, using example and analogies rather than deductive abstract tools; they document activities ... End users retain distinct types of knowledge and follow different approach and reasoning strategies to modelling, performing and documenting the tasks to be carried out in a given application domain.’ (Costabile, Fogli, Mussio, & Piccinno, 2007).

It is important when considering abstraction as a technique for user interface design into what end- users desire. In this project, this was achieved through continuous research by observation and prototyping, though a more rigid approach would be a user-centred design approach, where heuristic evaluation is centred as a means of justifying low and high fidelity prototypes. Identifying the most fitting users for heuristic evaluation would be crucial, as these types of systems are niche and open to a lot of artistic objectivity, but nonetheless be inclusive of graphic designers, musicians and developers with expertise in visual-interactive systems.

A small but noteworthy software potential to be aware of when designing interactive systems is related to the mapping of parameters to hardware interfaces, commonly referred to in music technology as parameterization. This becomes an ever more pertinent in regards to these systems when they operate in real-time environments for on-the-fly live programming.

## alternative visual-interactive technologies

In 2000, The Khronos Group focused on the creation of open standard, royalty-free application
programming interfaces as graphic-based technologies to provide developers with the means to
developing computer-graphics. These include OpenGL, standing as one of the major graphic APIs to
date, WebGL supporting web-based technologies and OpenCL, a framework for programs that execute
across heterogeneous platforms. However, these APIs were frameworks that required substantial low-
level engineering and maintenance.

In response to this, in 2005, Zachary Lieberman and a group of members of the openFrameworks
‘assist the creative process by providing a simple and intuitive framework for experimentation.’ It was written in C++, and built on top of OpenGL. This provided higher-level abstraction that concealed some of the low-level function definitions that exist in OpenGL’s API, and provided a community in which end-users could begin to develop visual-interactive systems. Although popular and was effective for building complex visual-interactive systems, openFramework’s API documentation is poorly written with many of its functions not described (openFrameworks, 2017), which can cause slow the engineering process. The alternative was to consult the online-community, which is fairly popular, but there was no clear support I could discover directly related to building visual-interactive systems using music improvisation as a
data source.

Another recognise visual-interactive technology is Cinder, a C++ library. This language supports domains for graphics, audio, video, and computational geometry. Cinder is cross-platform, with official support for macOS, Windows, Linux, iOS, and Windows UWP. Cinder is production-proven, powerful enough to be the primary tool for professionals, but suitable for learning and experimentation. With that said, Cinder API documentation is also vague and needs contributions from the open-source community.
For a performance with a visual-interactive system, one of the more effective means to sourcing data for live-coding or on-the-fly programming is through the analysis of music from operations on one or more audio signals.

Whilst using audio analysis for visual-interactive systems has on the whole been well received, its
disadvantages should not be overlooked. More ambitious use of data-analysis like Fast-Fourier Transform (FFT) is CPU expensive, and in concurrence with any graphical processing can result in a system that could likely cause lag or crash throughout a performance. This often means that the use of


## Installation

You can install Kluster in Max's package manager for free.

## Contribution

You can also contribute to Kluster on the Github page
