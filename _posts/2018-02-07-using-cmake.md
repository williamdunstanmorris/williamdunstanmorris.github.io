---
layout: post
title:  "Cool tricks with CMake"
date:   2018-02-07 12:31:01 +0000
categories: reverb
published: true
---

* CMake is an open-source system that manages the build process in an operating system and in a compiler-independent manner.
* Simple configuration files are placed in each source directory called CMakeLists.txt files and are used to generate standard build files (e.g., makefiles on Unix and projects/workspaces in Windows MSVC)
* CMake builds in-place and out-of-place builds from a single source tree.
* CMake replaces the job of Makefile


```c++

#include <iostream>

using namespace std;

int main(void) {

     cout << "Hello World" << endl;

     return(0);

}
```

* Create a file called CMakeLists.txt and specify the following :

```

# Specify the minimum version for CMake

cmake_minimum_required(VERSION 2.8)

# Project's name

project(hello)
# Set the output folder where your program will be created
set(CMAKE_BINARY_DIR ${CMAKE_SOURCE_DIR}/bin)
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR})
set(LIBRARY_OUTPUT_PATH ${CMAKE_BINARY_DIR})

# The following folder will be included
include_directories("${PROJECT_SOURCE_DIR}")


```
What is the difference between these two other than the fact one relies on dependencies?

add_custom_target

add_custom_command
