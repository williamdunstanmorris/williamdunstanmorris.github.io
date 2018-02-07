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
  void processObjectVector (ObjectVector &rVector, SampleType &earlyLevelAdjust, SampleType &preDelayAdjust, SampleType &preDelayAdjustLate, SampleType &latelevelAdjust, SampleType &lateDecayAdjust)
  {
    // Iterate over every object in the ObjectVector rVector.
    for (const auto& rObject: rVector)
    {
      // Use a pointer for reflection index access for fast-loop iteration.
      const int numRef = rObject.numberOfDiscreteReflections();
      const int* ptr = (numRef > 0) ? rObject.numberOfDiscreteReflections() : nullptr;

      for (int i = 0; i < numRef; i++)
      {
        // Set the delay of (in seconds) for the DiscreteReflection
        rObject.discreteReflection(i).setDelay((delay += preDelayAdjust));
        //
      }
      // Iterate through the mDiscreteReflections using the numberOfDiscreteReflections() as the terminating condition for the loop

      for(size_t = rObject::numberOfDiscreteReflections();  )
      {

      }




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
