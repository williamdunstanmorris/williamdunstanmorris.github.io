---
layout: post
title:  "C++ data structure approaches to object-based reverb part 3"
date:   2018-02-07 12:31:01 +0000
categories: reverb
published: false
---

/**
* Singleton class used as a reference by the PluginProcessor. A facade that makes reference to other lower-level classes, generating the base ObjectVector with a PointSourceWithReverb.
*/


```c++
class ReverbProcessor {

  public:

    using ObjectVector = visr::libobjectmodel::ObjectVector<PointSourceWithReverb>;

    ReverbProcessor();

    ~ReverbProcessor();

    ObjectVector const & reverbVector() { return rVector; }

    ObjectVector const & processObjectVector();

    ObjectVector const & initObjectVector();

  private:

    ObjectVector<PointSouceWithReverb> rVector;

}
```
