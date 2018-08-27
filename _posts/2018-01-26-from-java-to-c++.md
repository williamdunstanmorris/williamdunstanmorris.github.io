---
layout: post
title:  "From Java to C++"
date:   2018-01-26 12:31:01 +0000
categories: c++
published: false
---

It seems as though people are often making forums about the moving from C++ to Java. In my case, I learned the latter first. I realised early on that using Java to transport myself into C++ would be a great way of moving forward with my learning the syntax of the language, but I soon realised that with the release of C++11, 14 and now 17, there are far more operators and additions to the library itself.

These continual posts are about the updates to the new versions of C++, and C++ similarities with Java and object-orientated design.

So how do classes in C++ work? And what's the difference between a *class* and a *struct* ?

The definition of classes in C++ is somewhat different than in Java. Here is an example: a C++ version of the *Point* class:
```c++
class Point
/*
The class definition .h/.hpp file only contains the declarations of the methods.
The actual implementations of these are listed within a .cpp  are separate.
*/
{
public:
   Point(); /* This is the declaration of the constructor */
   Point(double xval, double yval); /* An overload constructor */
   void move(double dx, double dy);
   double getX() const; /* Get methods return constants */
   double getY() const;
private:
   double x;
   double y;
}; /* Oh! There is also a semi-colon at the end of the class */
```

There are several essential differences.
1. In C++, there are public and private sections, started by the keywords public and private. In Java, each individual item must be tagged with public or private.
3. Accessor methods are tagged with the keyword const
4. There is a semicolon at the end of the class
The implementation of methods follows the class definition. Because the methods are defined outside the classes, each method name is prefixed by the class name. The :: operator separates class and method name. Accessor methods that do not modify the implicit parameter are tagged asconst.
Point::Point() { x = 0; y = 0; }
 
void Point::move(double dx, double dy)
{  x = x + dx;
   y = y + dy;
}
 
double Point::getX() const
{  return x;
}


When you should use a header file in c++

 •	Splitting up code into several files can speed up compilation when changing a line in a 10000 code-line in one file. (except linking time, which is unaffected). It is commonlyused to separate declarations from implementations for better code management,
 •	Code to go in a header usually includes some or all of the following:
 ⁃	class and struct definitions
 ⁃	typedefs
 ⁃	function prototypes
 ⁃	global variables (but see below)
 ⁃	constants
 ⁃	#defined macros
 ⁃	#pragma directives (Additionally, when using C++, templates and inline functions usually need to be in the header file. The reasons for this should become clear later.)
 ⁃

When you should only use a cpp file in c++

Class structure notes in c++

Multiple classes in header files in c++

When the destructor is used in c++

When to use pointers in c++

 •	Replace *p.getX(); just with p->getX(); to illustrate a pointer in c++.
 •	Use reference wherever you can, pointers wherever you must. Pointers make harder to read, and more dangerous manipulations than any other constructs.
