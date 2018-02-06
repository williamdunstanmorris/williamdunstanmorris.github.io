---
layout: post
title:  "C++ data structure approaches to object-based reverb part 2"
date:   2018-02-06 12:31:01 +0000
categories: reverb
published: false
---

The following may be useful as a rough template for how to design the ReverbManager class.

```c++

class ReverbProcessor {

  // Is db2lin and lin2dB necessary as opposed to SampleType?
  void processObjectVector ( SampleType &earlyLevelAdjust, SampleType &preDelayAdjust, SampleType &preDelayAdjustLate, SampleType &latelevelAdjust, SampleType &lateDecayAdjust)
  {
    // Iterate over every object in the ObjectVector rVector.
    for (vector<PointSouceWithReverb>::iterator i = rVector.begin(); i != rVector.end(); ++i)
    {
      if (ob.ObjectTypeId.getString.equals("point_source"))
      {
        if(isInEditObjectList)
        {
          //Create an iterator of the object you are iterating through
          std::list<ob.mDis>::iterator it;

        // Iterate through each index of the discrete reflection object. vector with a reference?
          for (vector<DiscreteReflection>::iterator it = mDiscreteReflections.begin() ; it != mDiscreteReflections.end() ; ++mDiscreteReflections)
          {
            if(preDelayAdjust > 0)
            {
              it.onsetDelay += preDelayAdjust;
              // it.mLateReverb.onsetDelay += preDelayAdjustLate;
              // Instantiate newLate reverb??
            }
          }
        }
      }
    }
  }

```
