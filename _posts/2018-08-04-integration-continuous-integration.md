---
layout: post
title:  "integration of continuous...integration"
cover: assets/img/git-cover.png
date:   2018-02-07 12:31:01 +0000
categories: speak
published: true
tags: continuous-integration ci/cd docker git
---

When we were building VISR, we ended up with a pipeline that starts at linting written code, and

- Simple and clean, but thorough.
- Chronological pipeline, with variable artifacts
- Scripts that are not platform dependent, with more emphasis on cmake to interpret platform dependencies
- Optional, allowed-to-fail linting stage, that could be better done with web-hooks.
- Ends with deployment of installation packages that are deployed sever-side.

An example of stages in your .gitlab-ci.yml file. This file should be global across all branches. I presume it runs some form of 'cherry-pick' to ensure all branches are synchronised. Im not certain about that though.

```
stages:
  - lint
  - documentation
  - build
  - compile
  - test
  - deploy
  - cleanup
```

Note that this is quite a thorough set of stages - but this is a c++ framework, with boost dependencies, web and doxygen dependencies, working to produce both version binaries and source code simultaneously. If I were building static html or something more lightweight, I would use far less.

From my experience, it is preferable to keep continuous-integration scripting as simple as possible so that as little things can go wrong server-side.

-          Instead of ‘webapi’, there are two types of documentation (userdoc and apidoc) with coresponding folders in the doc/ directory. At the moment, the have the same contents, but I’m working on outlines for both of them.
-          For each of the documentations, there are targets to create HTML and PDF documents: apidoc-html, apidoc-pdf, userdoc-html, userdoc-pdf (Will: the PDF creation uses the LaTex builder, look into the PdfDocuBuild() function in doc/CMakeLists.txt if you’re interested in the internals)
-          There is a target ‘doc’ which summarises all documentation targets (plus the legacy Doxygen documentation) into a single one. That is, the ‘doc’ target builds them all.


# Note - please look at remote/origin/ci-integration-experimental for a more detailed outlook on future ci work

# For the time being, pushing should only occur manually, and

########### cmake ###########

# Linux:Freshly:Requirements:
# - To make a fresh build from scratch
# - Build and compile with documentation and sphinx
# - With other options - python bindings too?
# - Only trigger this job via variable
# - package and build binaries
# - Upload binary artifacts for website

# Should have a skip here even if it fails to stop prevent-commits from occuring.

# :
#   stage: lint
#   before_script:
#     # this might be a mistake because it makes such a slow installation. This should only be run by Nifty, or any machine with llvm installed.
#     # - brew install --with-toolchain llvm #would also need to echo in bash/zsh: export PATH="/usr/local/opt/llvm/bin:$PATH", export CC=clang ,export CXX=$(CC)++'
#   script:
#     - if [ -d ../build ] ; then rm -R ../build; fi
#     - cd ../ && mkdir build && cd build
#     - cmake -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_EXPORT_COMPILE_COMMANDS=ON ../VISR
#     # Link it to the LLVM source tree so that Clang Tooling is able to use it
#     - ln -s $PWD/compile_commands.json ../VISR
#     - make
#     - clang-tidy --list-checks -checks='*' | grep "modernize"  # List all available checkers out of the box llvm-tools
#     - clang-tidy -format-style='{BasedOnStyle: google, IndentWidth: 8}' $(find ./src/mex/gain_matrix -name \*.cpp -or -name \*.hpp)
#     - cd ../ && rm -R build
#     - #OPTIONAL OTHER cpplint --counting=detailed --filter=-whitespace,-build/include_order,-build/header_guard,-build/references $( find . -name \*.hpp -or -name \*.cpp)
#   only:
#     - ci_integration_experimental
#   allow_failure: true
#   tags:
#     - Nifty

# lint_summary:
#   stage: lint
#   # Will perform syntax highlighting errors that count all for src.
#   # ! Must have pip install cpplint to work. !
#   script:
#     - cpplint --counting=detailed --filter=-whitespace,-build/include_order,-build/header_guard,-build/references $( find . -name \*.hpp -or -name \*.cpp | grep -vE "^\.\/build\/" ) 2>&1 | grep -e "Category" -e "Total errors"
#   only:
#     - ci_integration_experimental
#   allow_failure: true

# format:
#   stage: format
#   script:
#     - clang-format -style=file .clang-format -verbose $(find ./src -name \*.cpp -or -name \*.hpp)
#   only:
#     - ci_integration_experimental
#  when: on_failure

# http://www.sphinx-doc.org/en/stable/install.html#mac-os-x-install-sphinx-using-macports for installation of Sphinx on the mac.
# Should build sphinx file ready and replace existing index.html on the server somewhere? Perhaps through scp for now from my laptop.
# documentation:
#   stage: documentation
#   # before_script:
#   #  - pip install Sphinx
#   script:
#    - sphinx-build -b html . ../build
#    - make html
#   tags:
#    - nifty

#############################
########### BUILD ###########
#############################

# Should we be trying out different compilers? llvm? gcc? g++?
macOS:
  stage: build
  script:
    # 1. Should I specify a cmake cache entry?
    # 2. What artefacts should we have here?
    # 3. Is this conditional a good way to check if build already exists as a safety?
    - if [ -d ../build ] ; then rm -R ../build; fi
    - cd ../ && mkdir build && cd build
    # !! Document this command for developers!
    - cmake -G Xcode ../VISR
    - cd ../ && rm -R build
  only:
    - ci_integration_experimental
  tags:
    - macOS

macOS_wpython:
  stage: build
  before_script:
    # Downloading macos Package manager - brew
    # /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    # su
    # - su williammorris && brew doctor
    # - brew install pkgconfig
    # - brew install boost -universal
    # - brew install portaudio -universal
    # - brew install libsndfile -universal
    # - brew install python -universal
    # - brew install boost -universal -with-python
    # - brew install boost-python -universal
  script:
    - if [ -d ../build ] ; then rm -R ../build; fi
    - cd ../ && mkdir build && cd build
    # Note here that if you brew boost libraries, you will encounter errors when cmake tries to find it. It is not located in /usr/local/lib when installed via brew.
    - cmake -DBUILD_PYTHON_BINDINGS=ON -DBoost_DIR=/usr/local/Cellar/boost/ -DBoost_PYTHON_LIBRARY_DEBUG=/usr/local/Cellar/boost-python/ ../VISR
    - cd ../ && rm -R build
  # after_script: # Will need to allow this when using Docker - I don't want to uninstall my dev brew right now.
  #   - brew uninstall libsndfile -universal
  #   - brew uninstall portaudio -universal
  #   - brew uninstall boost -universal
  #   - brew uninstall pkgconfig
  #   - /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
  only:
    - ci_integration_experimental
  tags:
    - macOS

# The problem is that it is still trying to find the runner 'kane' here - it should ignore this job altogether if the runner is not active.
# Wait for Ubuntu 16 distro to be installed before registering kane and allowing this to be run
ubuntu:16:
  stage: build
  before_script:
    - if [ -d ../build ] ; then rm -R ../build; fi
#     - apt-get install libboost-all-dev
#     - apt-get install portaudio18-dev
#     - apt-get install libsndfile1-dev
#     # For the latest, stable release of Debian/Ubuntu
#     - apt-get install libboost-system1.54.0
#     - apt-get install libboost-thread1.54.0
#     - apt-get install libboost-filesystem1.54.0
#     - apt-get install git
#     - apt-get doxygen
#     - apt-get install cmake
#     - apt-get install g++
#     - apt-get doxygen
  script:
    - cd ../ && mkdir build && cd build
    - cmake ../VISR
  after_script:
    - cd ../ && rm -R build
#     - apt-get remove --purge libboost-all-dev
#     - apt-get remove --purge portaudio18-dev
#     - apt-get remove --purge libsndfile1-dev
#     - apt-get remove --purge libboost-system1.54.0
#     - apt-get remove --purge libboost-thread1.54.0
#     - apt-get remove --purge libboost-filesystem1.54.0
#     - apt-get remove --purge git
#     - apt-get remove --purge cmake
#     - apt-get remove --purge g++
  only:
    - ci_integration_experimental
  tags:
    - linux
    - ubuntu16


# Test baseline renderer on bin - write own .sh script for this
unit_tests:
  stage: test
  script:
    - if [ -d ../build ] ; then rm -R ../build; fi
    - cd ../ && mkdir build && cd build
    - cmake ../VISR
    - make
    - ctest -C Debug -j8
    # Run a specific test or set of tests:
    - ctest -R rrl_test
    # Run all tests in a suite
    - ctest -j8 -R
    - cd ../ && rm -R build
  # variables:
  artifacts:
    paths:
    - Testing/*.log
    expire_in: 1 week
  only:
    - ci_integration_experimental
  # only deploy if tests pass
  when: on_success

# System should be buildable from fresh environment
# Deployment__ALL__OS:
#   stage: deploy
#   script:
#     - echo production_in_environment


# Runners (currently tagged in jobs):
# - nifty -   MacOS
# - kane -    Linuxgcc4++
# - usain -   Windows

# Changing the key will clear the cache, and you can store it in a different location with a predefined variable.
# Change this by doing $ export CI_PROJECT_NAME='VISR' && export CI_BUILD_REF_NAME="path/of/new/cache"
cache:
  # key: "$CI_PROJECT_NAME/$CI_BUILD_REF_NAME"
  paths:
    - ./build/

# Note - please look at remote/origin/ci-integration-experimental for a more detailed outlook on future ci work

# For the time being, pushing should only occur manually, and

########### cmake ###########

# Linux:Freshly:Requirements:
# - To make a fresh build from scratch
# - Build and compile with documentation and sphinx
# - With other options - python bindings too?
# - Only trigger this job via variable
# - package and build binaries
# - Upload binary artifacts for website




* The runner would submit a job to Condor
* Using a dedicated machine would void using Condor, particularly with Mac
* All build processes need to be done on a specific machine
* Work our how CI works with multiple branches
* You can place the VISR into /vol/vssp/s3a_stream3

VISR
MacOS
Ubuntu14
Ubuntu16
Ubuntu18
Raspberry
Windows
What other ones?

* Within these folders, are we building multiple branches at the same time?
* For each OS, specifying release and debug builds within these folders - should we have build-debug and build-release for every OS listed?
* Within branch structure, there should ideally be three iterative builds that you cycle through automatically. Consider operating two-three CI branches that support more than one version at any one time, once a user base has been established. Keep a build that is in use, one that is non-active, therefore you have the last tree-build that worked.
* Have a marker that flags what that works like a commit - just because you are at the HEAD in CI doesn’t mean it is working. If it is failing, we can move back to the marker again, or move to another branch.
* We need to specify what runs on a different box
* Do we specify separate runners for separate OS systems
* Hostname exists ? execute to prove that we can get a runner up and running
* Because of dylibs , it will need docker OR use a known machine and direct the runner to fire up on a given machine
* Specifying periodic running - kick this off every time someone does a commit, or periodically.
* If using a separate box, use Gitlab to direct a remote process to a dedicated Linux box.
* What version of Linux is being used for VISR

3 options: Kubernetes , Docker or Dedicated Machine with Virtual Box.


I tried setting this up and gitlab extensions package under Settings/integrations/pipelines-emails over 6 days ago. Im confused as to why this doesn’t work. Unfortunately most of IT is on holiday right now, and so I won’t able to address this until start of September.

[AF]: Note that the problem is not about CI or the VISR – emails sending  to Soton people seems completely broken. But I understand that many relevant IT people are not around at the moment. So it’s better to wait until the right person is back rather than being stuck with someone who’s not an expert in this topic:

BTW: I am sure that I corrected the error before (and had a good laugh doing so), but somehow ‘massages’ crept back into the text. But rest assured, we tend not to rely on other people’s IT staff for this kind of services.

o   Where are we with the Windows runner + deployment? As Windows is the system most different from the Unix-style platforms, it is important to get that running early, in order to avoid too much CI code being useless for this platform, leading to code duplication.

Still not started that one yet. I will try to start this very soon ASAP

[AF]: Let me know if you need assistance. This might be a good occasion for me to clean up the Windows build instructions in the manual. Also, if you need a runner I could set up one here.

o   In general we should try to keep platform-specific parts of the CI config to a minimum.

Yes I agree with that. It only confuses what should be stage specific tasks. I think the main reason for this at the moment is a reference to what machine is a quick reference as to which OS is running jobs in the pipeline. But I will try to redesign this .

To listen for new pipelines, the command $gitlab-runner run must be called and kept as a listener in the background. This is continually running on my linux box here, but I don’t run it on my mac all the time (as i tend to shut it down). This is another reason why I have separated the jobs and tagged them with specific platform-based runners.

o   With respect to that, have you looked at the CMake facilities for running builds, i.e., “cmake –build <build_dir> --target <target> ? In my opinion this sounds like a proper way to abstract from the differences between the different build systems (Make, XCode, MSBuild etc.). There seem to be some deficiencies (e.g., parallel builds need platform-specific treatments, some targets (e.g., ‘all’ vs ‘ALL_BUILD’) are named differently

Hmmmmmm. Okay. This looks like a more explicit way of calling cmake to be safe, especially

[AF] Not really. The cmake call (for configuration and to create the project files) remains as it is. The new call is rather a portable way to invoke the build calls itself (e.g, ‘make’ on Linux, ‘MSBuild on Windows, etc.).

Can I just clarify would an example of what you mean be?

cmake --config=Release --target=webapi --build ../VISR

[AF] the correct command would be

cmake --config=Release --target=userdoc --build ./build

would create the target ‘userdoc’ within the build directory. Note that ‘—config=Release’ is not really meaningful here since there is no specific ‘Release mode’ for documentation.

As might have noticed, ‘webapi’ has ceased to be, both as a target and a name. It’s userdoc and apidoc now (as soon as I pushed my changes), most likely with both ‘-html’ and ‘-pdf’ suffixes each.

You should be aware that one of the limitations of gitlab-ci is that artefacts generated must be within the working project directory (i.e. not outside from .gitlab-ci.yml). This means we must create a build/ directory structure inside VISR, as I have been doing. I understand that this is not usually good practice, and build directories should be separated, and the gitlab-community want to resolve this. Just FYI

[AF] I don’t see a build/ directory within VISR as a huge problem, although I don’t do that in my own working copies

o   Im gitlab-ci.yml,  don’t find any notion of the build configuration, i.e., Debug or Release. Note that it is absolutely crucial to deploy release builds (you will remember your experiences with the reverb plugin). In my opinion, this is a further advantage of ‘cmake –build’ as it has a ‘--config <configuration>’ option

Yes, I believe I did do that a few times, but need to write that in.

o   Is ‘compile & test’ one stage? I think there  should be separate ‘unit testing’ stage, for instance to hold notifications about different kinds of failures separate.

Okay

[AF] Good. Note that, depending on the platform, there should be a target ‘test’ which runs all tests. That means we could use the ‘cmake –build <dir> --target test’ facilitie to run all tests (including unit test suites added at a later point) through one platform-independent commands.

Additional comments:
·         I don’t see the static checking/lint stages right now. However, I considered that as quite useful (once we got over the purely stylistic complaints, which we did). It’s not crucial but we should keeping it on our list. But ideally I would let CMake (or another local tool) do most of the work, and to let the CI run only one command (or target, for that matter). This would enable us to do the same checking also locally rather than committing blindly and waiting for the server to complain. But it appears that this functionality only exists in CMake >=3.9 https://blog.kitware.com/static-checks-with-cmake-cdash-iwyu-clang-tidy-lwyu-cpplint-and-cppcheck/ So at least on platforms where we use the system-provided cmake (i.e., Linux) it might take some time before it is available.
·         Ubuntu 18.04 LTS is now fully released, at least my Linux box started pestering to upgrade. Any chance to get a runner up and running anytime soon?



NOtes from Andreas on Gitlab CI

Creating the S3A software page (in the WordPress system of s3a-spatialaudio.org)
Setting up the CI system for the VISR repository (Windows, Mac OS X, Linux, Raspberry maybe later)
Populating the documentations for VISR
Testing the deployment of software installers and documentation to the software page
Setting up the package generation, CI system, and deployment for the visr-production-suite repository
Populating user documentation and API documentation.
Creating production tool suite documentation


I got a first working version of the restructured documentation for the VISR repository.
It’s pushed to the feature/sphinx-ci-integration branch.

The main differences are:
-          Instead of ‘webapi’, there are two types of documentation (userdoc and apidoc) with coresponding folders in the doc/ directory. At the moment, the have the same contents, but I’m working on outlines for both of them.
-          For each of the documentations, there are targets to create HTML and PDF documents: apidoc-html, apidoc-pdf, userdoc-html, userdoc-pdf (Will: the PDF creation uses the LaTex builder, look into the PdfDocuBuild() function in doc/CMakeLists.txt if you’re interested in the internals)
-          There is a target ‘doc’ which summarises all documentation targets (plus the legacy Doxygen documentation) into a single one. That is, the ‘doc’ target builds them all.


// TODO:
* In general we should try to keep platform-specific parts of the CI config to a minimum.
* Windows installation of VISR
* Have you had the chance to check with your IT department whether they can find any reason why we don’t get massages from GitLab (neither CI or issue tracking).
Just tried three times to send myself a verification mail for my Uni address a.franck@soton.ac.uk – None arrived. Note that this is a crucial problem, because it effectively limits my ability to react to merge requests, issue tracking or CI issues.


Linux:WebAPI:
  stage: deploy
  # before_script:
  #   - if [ -d ../build ] ; then rm -R ../build; fi
  script:
    # - mkdir build && cd build
    # - cmake -DBUILD_DOCUMENTATION_SPHINX=ON ..
    # - make doxy
    # - make webapi
    # is this accessing the id_rsa private or public key?
    # -r recursive, -h human-readable, -z compress -v versbose
    # --delete delete extreneous files from dest dirs
    # -e specify the remote shell to use with
    # ssh -i identity file which contains the private key. Teh default is ~/.ssh/id_dsa, ecdsa, id_rsa.
    # Where does wm0014 directory begin ? is this cwd? or goes to $HOME?
    #
    # rsync av --update /loc1 /loc2
    # av --update so only files that are NEWER will be synced from loc1 to loc2. Logic dictates that any files that are NEWER on loc2 will be # untouched. Therefore all the      outdated files on loc2 will be up-to-date thanks to loc1
    # - yes | cp -rf doc/sphinx /vol/vssp/dataweb/data/s3a/public/VISRWeb
    - cd /vol/vssp/dataweb/data/s3a/public/VISRWeb/
    - if [ -d ../build ] ; then rm -R ../build; fi
    - rsync -av --delete ~/builds/cfa3a610/0/s3a/VISR/build/ /vol/vssp/dataweb/data/s3a/public/VISRWeb/build
  # # Each time a job suceeds , a deployment is recorded, remembering the git SHA and environment name.
  # environment:
  #   name: staging
  #   url: ???
  artifacts:
    paths:
      - build/
  cache:
    paths:
      - build/
  dependencies:
    - Documentation-fulldoc
  only:
    - feature/sphinx-ci-integration
  tags:
    - linux
    - ubuntu16
