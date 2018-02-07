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



  // Should this function return an object vector, or change the existing vector in this class?

  void ReverbProcessor::processObjectVector (SampleType &levelAdjust, SampleType &delayAdjust, SampleType &lateDelayAdjust, SampleType &lateLevelAdjust, SampleType &lateDecayAdjust)
  {
    // Iterate over every object in the ObjectVector rVector.
    for (const auto& rObject: rVector)
    {
      // Use a pointer for reflection index access for fast-loop iteration.
      const int numRef = rObject.numberOfDiscreteReflections();
      const int* ptr = (numRef > 0) ? rObject.numberOfDiscreteReflections() : nullptr;

      for (int i = 0; i < numRef; i++)
      {
        // todo: level delay so that it is always more than 0.
        if(delay < 0)
        {
          // Set the level (linear gain) of the DiscreteReflection
          rObject.discreteReflection(i).setLevel((level += levelAdjust));
          // Set the delay (in seconds) for the DiscreteReflection
          rObject.discreteReflection(i).setDelay((delay += delayAdjust));
        }
      }
      // Onset delay in the late reverb should match the first early reflection delay
      //todo: the first reflection's level or delay?
      //todo: set this within the reflections or outside?
      rObject.setOnsetDelay(rObject.discreteReflection(1));

      const int numSubBands = rObject.cNumberOfSubBands();
      const int* ptr = (numSubBands > 0) ? rObject.cNumberOfSubBands() : nullptr;

      // Iterate over the LateReverbCoeffs and adjust the mLevels, mDecayCoeffs and mAttackTimes
      for(int i = 0; i < numSubBands; i++ )
      {

        // todo: What are the number of values contained in the /p array as a second parameter?
        // The accessor method only returns an array, so you cannot just add the adjust parameter to this. Perhaps we need more iterations?
        // Set the level for every LateReverbCoefficient (an std::array)
        // rObject.lateReverb().setLevels((rObject.lateReverb().levels() += lateLevelAdjust), numSubBands);

        rObject.setLateReverbLevels( lateLevelAdjust, numSubBands);

        // Set the decay for every LateReverbCoefficient (an std::array)
        // rObject.lateReverb().setDecayCoeffs((rObject.lateReverb().decayCoeffs() += lateDecayAdjust), numSubBands));

        rObject.setLateReverbDecayCoeffs( lateDecayAdjust, numSubBands);

        //late delay
        //currDelay=float(lateDelaysList.split(",")[lateBand])
        //newDelay=currDelay+self.lateDelayAdjust
        // Add 0.001 to the lateReverb onsetDelay for late onset ramp.
        //minDelay=float(obj['room']['lreverb']['delay'])+0.001 #ensure at least 1~ms of late onset ramp
        //newlateDelaysList.append(max(minDelay,newDelay))

        rObject.setOnsetDelay((onsetDelay += lateDelayAdjust) += 0.001);

        // Should we set the attack times at some point in this algorithm? At which point?
        rObject.lateReverb().setAttackTimes((rObject.lateReverb().attackTimes() += lateDecayAdjust), numSubBands);
      }

            }
          }


  }

```
