---
layout: navbar-post-centered
title:  "Gitlab-CI with CMake an Audio C++/Python Framework"
cover: assets/img/git-cover.png
date:   2019-03-29 12:31:01 +0000
categories: speak
published: true
tags: continuous-integration ci/cd git
---

![gitlab-ci]({{ "/assets/img/gitlab-ci.png" | absolute_url }})

Throughout the engineering of my project's object-based audio framework, VISR and VISR Production Suite, there was a point at which continuous integration was discussed as a means to begin streamlining our workflow. At a high level, continuous integration is justified as allowing good code-review, ensuring build quality and stopping code from breaking all the time.

For us, it was really a question of being able to deploy packages on multiple platforms through versioned releases, and because we embedded quite a few 3rd party package dependencies along with Python bindings, we needed to see what was breaking on what OS.

## Initial issues we knew about

* Learning the limits of Gitlab itself. Well, learning the Gitlab API for one.
* Satisfying our version control model: Gitflow. You can read how we adopted that [here](https://)
* Python. This is where Python and I don't get along, especially because there are different python versions and environments. So how to ensure build quality whilst testing as many pythons as possible: Anaconda; a Homebrew'd Python and managing global or local configurations.
* Knowing whether CMake, Git or CI is responsible for some of our tasks. Take linting for instance.
* Making sure the pipeline didn't get too big.

## Deployment for platform-dependency

Alongside scripting and testing CI jobs and stages, it was equally important to understand what commands were available from CMake through vigorous local building. I made an effort to continuously delete or reset the CMake cache and build fresh, which was cumbersome, but also necessary to ensure that our CMakeLists configurations and modules were safe.

If you have software that needs to be packaged for different operating systems, or have different runners setup on different operating systems, chances are that you will run into a lot of redundancy when crafting specific jobs. This is partly to do with scripting, and that bash and windows command line don't share the same language directives.

With respect to CMake, I needed to look at the CMake facilities for running builds, i.e., “cmake –build --target ? In my opinion this sounded like a proper way to abstract from the differences between the different build systems (Make, XCode, MSBuild etc.). There however seemed to be some deficiencies (e.g., parallel builds need platform-specific treatments, some targets (e.g., ‘all’ vs ‘ALL_BUILD’) are named differently. The cmake call (for configuration and to create the project files) remains as it is. The new call is rather a portable way to invoke the build calls itself (e.g, ‘make’ on Linux, ‘MSBuild on Windows, etc.).

As an example of CMake's `-E` option, replaces the two OS directives to move directory i.e. `cd <name>` or `md <name>`. We could exploit this even more for more build options, but this naturally created some nice readability, regardless of what OS you were on. An example of this would be:

```
cmake -E make_directory <directory-name>
```

which will run an internal environment that makes a directory, in whatever operating system the runner is in. This means you don't have to write platform specific jobs for creating a directory on each platform. Kind of neat, but you can go further with this.

One of the biggest issues I had to work around was using a windows machine at Southampton, and passing the successful product.

When we were building VISR, we ended up with a pipeline that starts at linting written code, and

- Simple and clean, but thorough.
- Chronological pipeline, with variable artifacts
- Scripts that are not platform dependent, with more emphasis on cmake to interpret platform dependencies
- Optional, allowed-to-fail linting stage, that could be better done with web-hooks.
- Ends with deployment of installation packages that are deployed sever-side.

An example of stages in your .gitlab-ci.yml file. This file should be global across all branches. I presume it runs some form of 'cherry-pick' to ensure all branches are synchronised. Im not certain about that though.

```
stages:
  - initial
  - config
  - build
  - test
  - package
  - deploy
  # - cleanup
```

Note that this is quite a thorough set of stages - but this was an extensive a C++ framework, with boost dependencies, web and doxygen dependencies, working to maintain source, and binaries and pkg files simultaneously. With that said, at early doors, it was preferable to keep continuous-integration scripting as simple as possible so that as little things can go wrong server-side.

## Configuration Stage

There were multiple BUILD_OPTIONS configured in CMake, we aimed to build two build options. One was for a third party library for QJackCTL/JackPilot support necessary for VISR's binaries and routing output signals, and the other was to create python bindings for python development support.

This is an example of a script for a CMake configuration on Linux, generating Python bindings:

```
linux-arch-config-16:
  stage: config
  dependencies:
    - init-linux-16
  script:
    - cmake -E chdir build_16/ cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DBUILD_PYTHON_BINDINGS=ON -DBUILD_USE_JACK=ON ..
  only:
    - master
    - develop
    # Testing branch for CI development
    - feature/experimental-ci
  tags:
    - linux
  artifacts:
    paths:
      - build_16/
  # cache:
  #   paths:
  #     - build_16/
  allow_failure: true
```
Some worthy things to note here:

* We specify artifact paths that are uploaded at a particular job at a particular stage (config), and then downloaded at the next stage(build). This way, we could easily download artifacts at any stage of the process, and debug where necessary.
* One thing to note from artifact generation is that for large artifact packages being uploaded and downloaded, we often ran into uptime and downtime issues, creating a much slower pipeline. You should consider whether it is always necessary to upload artifacts at every stage, but this is one of the only ways to pass artifacts between stages in your pipeline.
* Because we were creating packages, we were only interested in `-DCMAKE_BUILD_TYPE=Release`, and not `Debug`, (Although Debug configuration was also useful for VISR-Production-Suite, another repo that used VISR as a form of submodule)
* We used the `-E` option and always configured CMake commands from the src root. This is quite good practice IMO, as scripting changes in directories can get super confusing, esp when things start to go wrong.

## Building and Packaging Stage

As noted before, and throughout this blog post, we used specific --build and --config options in the cmake as an abstraction rather than using `make`, a command that doesn't exist with Windows OS for instance. This way, this job became more portable , and could be used as a template definition too.

```
linux-arch-build-18:
  stage: build
  dependencies:
    - linux-arch-config-18
  script:
    - cmake --build build_18/ --target --config Release
  only:
    - master
    - develop
    # Testing branch for CI development
    - feature/experimental-ci
  tags:
    - linux-ubuntu-18
  artifacts:
    paths:
      - build_18/
  # cache:
  #   paths:
  #     - build_18/
  allow_failure: true
```

## Documentation Jobs

* Instead of ‘webapi’, there were two types of documentation (userdoc and apidoc) with coresponding html and pdf generation. CMake targets for autodoc generation were created using a host of technologies: Python, Sphinx, Doxygen and Breathe.
* For each of the documentations, there were specific install_command targets to create HTML and PDF documents: apidoc-html, apidoc-pdf, userdoc-html, userdoc-pdf (the PDF creation used the LaTex builder, look into the PdfDocuBuild() function in doc/CMakeLists.txt if you’re interested in the internals)
* There was a target ‘doc’ which summarises all documentation targets outlined above (plus the legacy Doxygen documentation) into a single one. That is, the ‘doc’ target builds them all.

## Anchoring Jobs

Because all jobs were segregated at every stage to based upon individual OS and different Python versions (Anaconda 3.6 and 3.7), there was ultimately a number of jobs at certain stages that replicated the same amount script, bar `tag` for the respective OS for a runner to pick up. For instance, the `init` stage where making a directory was used, could be narrowed down to a definition as such:

```
.artifacts_template: &artifacts_definition
  allow_failure: true
  only:
    - master
    - develop
    - feature/experimental-ci
  artifacts:
    paths:
      - build

.init_template: &init_definition  # Hidden key that defines an anchor named 'init_definition'
  stage: initial
  script:
    - cmake -E make_directory build

```

As such, an example of a specific job could be reduced to a smaller, and far neater definition, with only tag as the identifier:

```
init-macosx-py36:
  <<: *artifacts_definition
  <<: *init_definition
  tags:
    - macosx
```

## Limitations of Gitlab

This could become a long list, but some of the most fundamental changes and improvements to Gitlab-CI would be:

* Have an option to separate stages based on jobs. Perhaps a new keyword is needed here, but
Stages should be
* Set Gitlab CI stage so sequential stages don't wait for it to finish. Essentially, I wanted to emulate the same behaviour that is done in a relay race in athletics; once a job has finished it should pass it to the next stage. In this way, stages are not really necessary and become more of a formality instead. Really, this becomes more about defining stages based on operating systems instead. I have a few ideas about how this could work, but unfortunately Gitlab CI doesn't seem to support it yet.
* You should be aware that one of the limitations of gitlab-ci is that artefacts generated must be within the working project directory (i.e. not outside from .gitlab-ci.yml). This means we must create a build/ directory structure inside VISR src, as I have been doing. I understand that this is not usually good practice, and build directories should be separated, and the gitlab-community want to resolve this. Just FYI


## .gitlab-ci.yml Generation with a custom CLI

Because we know what we want our script to look like at this point, it was a nice idea and suggested numerous times to use a ruby script to generate this file, using a set of prescribed high level variables and paths to spit out a .gitlab-ci.yml file each time. This tool could be accessed outside, but place the newly created script inside the source file. Then, all you would need to do is commit the script to a feature/ci-experimental before merging the changes to `develop` and `master` branches, adhering to the gitflow approach through temporary `hotfix/0.0.0` and `release/0.0.0` branches.

Because of this, one cool thing would be to generate a CLI with Ruby. I would like to spend a bit more time on creating a CLI with Ruby and parsing a script based on CLI arguments. I'll come back to this at some point.

## What else could we do?

* Should we be trying out different compilers? llvm? gcc? g++?
* Could we install/uninstall provisions throughout the pipeline process. Mind you, that would create huge overhead...
* How could we go about linting? Should we use githooks or CMake for that? Just abandon that idea entirely?

Once we got over the purely stylistic complaints, which we did, linting was something useful to keep in mind. It’s not crucial but I think it is something you should keep in your list for CI. Ideally I would let CMake (or another local tool) do most of the work, and to let the CI run only one command (or target, for that matter). This would enable us to do the same checking also locally rather than committing blindly and waiting for the server to complain. But it appears that this functionality only exists in CMake >=3.9 https://blog.kitware.com/static-checks-with-cmake-cdash-iwyu-clang-tidy-lwyu-cpplint-and-cppcheck/ So at least on platforms where we use the system-provided cmake (i.e., Linux) it might take some time before it is available. · Ubuntu 18.04 LTS is now fully released, at least my Linux box started pestering to upgrade. A

In the end, linting was abandoned, but some things that I experimented with for linting included:


```
   stage: lint
   before_script:
     - brew install --with-toolchain llvm #would also need to echo in bash/zsh:
     - export PATH="/usr/local/opt/llvm/bin:$PATH", export CC=clang ,export CXX=$(CC)++'
   script:
     - if [ -d ../build ] ; then rm -R ../build; fi
     - cd ../ && mkdir build && cd build

     - cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ../VISR
     # Link it to the LLVM source tree so that Clang Tooling is able to use it
     - ln -s $PWD/compile_commands.json ../VISR
     - make
     - clang-tidy --list-checks -checks='*' | grep "modernize"  # List all available checkers out of the box llvm-tools
     - clang-tidy -format-style='{BasedOnStyle: google, IndentWidth: 8}' $(find ./src/mex/gain_matrix -name \*.cpp -or -name \*.hpp)
     - cd ../ && rm -R build
     - #OPTIONAL OTHER cpplint --counting=detailed --filter=-whitespace,-build/include_order,-build/header_guard,-build/references $( find . -name \*.hpp -or -name \*.cpp)
   only:
     - ci_integration_experimental
   allow_failure: true
   tags:
     - Nifty
```

## Other notes/ideas that my brain endured

Here are some of the thoughts and things that travelled through my brain throughout the 6/8month process of CI engineering:

* Using Gitlab-CI with a high-throughput computing system, like Condor. I have proposed something like this before, relating more to artificial intelligence and deep learning methods and training for researchers/academics.
* All build processes need to be done on a specific machine
* Work our how CI works with multiple branches, moving the gitlab-ci file between branches was a pain. This would have to be done manually, and the best way was usually through `git checkout -- path.to.file`, which wasn't always the neatest way of doing things.
* Continuous deployment strategy via a script.
* VISR MacOS Ubuntu14 Ubuntu16 Ubuntu18 Raspberry Windows What other ones?
* For each OS, specifying release and debug builds within these folders - should we have build-debug and build-release for every OS listed?
* Within branch structure, there should ideally be three iterative builds that you cycle through automatically. Consider operating two-three CI branches that support more than one version at any one time, once a user base has been established. * Keep a build that is in use, one that is non-active, therefore you have the last tree-build that worked.
* Have a marker that flags what that works like a commit - just because you are at the HEAD in CI doesn’t mean it is working. If it is failing, we can move back to the marker again, or move to another branch.
* Should we really specify separate runners for separate OS systems
* 3 other options: Kubernetes , Docker or Dedicated Machine with Virtual Box.
* *On using* `gitlab-runner run` to listen for new pipelines, the command $gitlab-runner run must be called and kept as a listener in the background. This is continually running on my linux box here, but I don’t run it on my mac all the time (as i tend to shut it down). This is another reason why I have separated the jobs and tagged them with specific platform-based runners. I would need to write some .plist file or set up a daemon and automatically startup a macbook or something at night.
* With respect to CMake, I need to look at the CMake facilities for running builds, i.e., “cmake –build --target ? In my opinion this sounds like a proper way to abstract from the differences between the different build systems (Make, XCode, MSBuild etc.). There seem to be some deficiencies (e.g., parallel builds need platform-specific treatments, some targets (e.g., ‘all’ vs ‘ALL_BUILD’) are named differently
