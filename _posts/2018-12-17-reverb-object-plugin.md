---
layout: navbar-post
title:  "VISR Reverb Plugin Infrastructure"
cover: assets/img/visr-reverb-object.png
date:   2018-02-07 12:31:01 +0000
categories: work
published: true
tags: philosophy
---

The VISR Reverb Object is a VST3 software available as part of the VISR Production Suite. It is part of a suite of plugins available within a channel-based, digital-audio workstation (DAW), that easily enables spatial audio production through a newer up and coming format - object-based audio.

This post is spit into a number of differing sections on how this VISR Reverb Object VST3 was built, and how many of the under-the-hood components work. A high level understanding of object-based audio is assumed, along with development practices and digital-signal processing concepts too.

## Requirements specifications


### __Level 1:__ Object IDs & Updating the User Interface

- Copy across the same user-interface that was used in the Object-Editor.
- Update the object-panner to look and feel as a similar look and feel to the Object Editor. You should be able to pan the object just like the Object Editor.

Add room and object level parameters via
```
parameters.createAndAddParamter(...)
```
Add parameters.addMetadata(...) for room and object level .
Do the same for ```removeParameterListener``` for room type and object level.

Add the following functions to the PluginEditor
```
enableRoomLoading()
addRoomsToComboBox()
```

__Optional:__ Inherit ```private::Timer``` and implement ```timerCallback override();```

### __Level 2:__ Integrating Reverb Library

Copy Room JSON into its own ```.hpp``` file that contains the room library raw JSON data as an ```std::string```
Include this .h file in the ```PointSourceWithRevWrapper``` class.
Create a function to load room that uses this class - use whatever is currently implemented as its function.
Constructor should load a room based on current room chosen in box. Check this works properly.

- Move the current Reverb Library which is stored on the ~/Desktop/RoomLibrary.JSON into a formal file inside the plugin. It still needs to be parsed by visr's PointSourceWithReverbParser
*[AF, GC]: Can we store this as some static file inside the file? Andreas, you mentioned a ```Literal String```*
- Changing rooms in real-time is causing audio spikes, and it is not safe. AF told me that this could be prevented by implementing an rcl::CrossfadingFilterMatrix. This is so important to correct.
*[LR, PC] Will need extensive support on how this function is used, and where this function is to be placed exactly. For instance, is it used in the Reverb Editor or is it used in the reverbobjectmodel(DSP). If the latter, then will need much more guidance. Also How do we use this when changing rooms i.e. parsing a JSON dataset rooms.?*
*[GC] Told me once of a way to do asyncronookus updated in the objectwrapper? Still a viable/safe way to do for loading a room object model that will prevent audio hiccups?*

### __Level 3:__ Minimal user parameter design

- Implement some form of dry/wet slider UI. Add a slider for object level, which will control the dry/wet level within PointSourceWithRevWrapper, implement a control for the ID::objLevel, which will grab the current state level of all levels, and set them.
If possible, introduce a smoothing gain with the slider. (not high-priority, requires some DSP knowledge)

- Implement an algorithm for handling the late_levels, late_
- Use control statements to prevent audio-hiccups/pops when dragging the slider.
- Add a room that has default values. The idea is that this will create a dry point source by adjusting the levels to 0.

*[GC] hold audio rendering when slider is being dragged? This MAY be the safest way to stop clicks/pops*

### __Level 4:__ Implement a JUCE timer after user has stopped playback before room can be changed - **to avoid audio spikes**

Add an additional 5 second pause time after playback has stopped which prevents users from loading a room. This will potentially reduce the amount of audio spikes. This does NOT completely remove audio spikes, but may reduce the chance of them from occurring.
Add an additional timer clock of 5 seconds as an additional condition of !result.isPlaying clause in timerCallback() function.

- *Issue:* When the plugin is first loaded, the parameters of the room being initially loaded are not correct. They are only corrected after changing a room.
- *Issue:* When a room is changed, audio spikes can cause a slow linear increase in BOTH late level and late decay, until muted by REAPER.
- *Issue* When a room is changed, audio spikes can cause a rapid increase in late level, but with a very short decay.

*This a constant issue I have been going around in circles for a long long time with.*

Potential tryouts to fix.
Create a new function called roomChangeCallback() to determine when the room has been changed.
*Tried multiple times with this:* When a room is changed, iteratively set the 8ve bands of all late-level and late-decay and object-level to its MINIMUM value (presumably 0, equating to -inf dB. ) BEFORE loading a new room dataset.
[optional - Andreas' suggestion] Use the rcl::CrossfadingMatrix to implement switches between filters with crossfading - use that for the mLateReverFilter in reverbobject::ReverbObjectRenderer. (requires someone from INTERNAL Surrey with DSP understanding for this) I have no idea what this means, but it's probably a golden ticket to this.


## Software Design

### Level 1: JUCE Framework, UI, Channel Processing and Hosting

### Level 2: VISR Integration and Metadata

### Level 3: Digital Signal Processing

## Software implementation I: JUCE Framework

## Software implementation II: VISR Integration

> Breakdown: point_source_with_reverb.hpp

Here is the current PointSourceWithReverb class that sits in the libobjectmodel/ directory in VISR. Lets take this apart.


```cpp
/* Copyright Institute of Sound and Vibration Research - All rights reserved

 Adapted for the S3A room object by Phil Coleman, University of Surrey

 */
#ifndef VISR_OBJECTMODEL_POINT_SOURCE_REVERB_HPP_INCLUDED
#define VISR_OBJECTMODEL_POINT_SOURCE_REVERB_HPP_INCLUDED

#include "point_source.hpp"
#include "export_symbols.hpp"
#include <librbbl/biquad_coefficient.hpp>
#include <libvisr/constants.hpp>
#include <algorithm>
#include <string>
#include <vector>

namespace visr
{
namespace objectmodel
{

/**
 * Audio object representing a monopole point source with corresponding object-based reverberation.
 * Derived from PointSource with coordinates X, Y, Z.
 */
  class VISR_OBJECTMODEL_LIBRARY_SYMBOL PointSourceWithReverb: public PointSource
  {
  public:
    /**
     * Number of sub-bands for the late reverberation levels and decay constants.
     */
```

#### NumberOfSubBands and NumDiscreteReflectionBiquads

```c++
    static const std::size_t cNumberOfSubBands = 9;
    /**
     * Number of biquad sections for the IIR filters representing
     * the wall reflection filters of the early (discrete) reflections.
     * @todo Consider making this a systeem-wide configuration option.
     */
    static const std::size_t cNumDiscreteReflectionBiquads = 10;

```

#### C++ std:: array vs std::vector for **LateReverbCoeffs**

```c++
    /**
     * Data type for holding the subband information (levels and decay coefficients) for the
     * generation of the late reerberation filters.
     */
    using LateReverbCoeffs = std::array<SampleType, cNumberOfSubBands >;

```

using LateReverbCoeffs is an abbreviation for an std::array throughout the remainder of this class. It uses SampleType and cNumberOfSubBands.

/**
 * The data type used for transferring audio samples within the system.
 */
using SampleType = float;


The std::size_t is one of the fundamental unsigned integer types in c++. It is returned by the sizeof operator and is used in the standard library to represent sizes and counts.

*TODO: make a seperate post about static from this website*
https://stackoverflow.com/questions/15235526/the-static-keyword-and-its-various-uses-in-c

*std::array* is a template class that encapsulate a statically-sized array, stored inside the object itself, which means that, if you instantiate the class on the stack, the array itself will be on the stack. Its size has to be known at compile time (it's passed as a template parameter), and it cannot grow or shrink.

It's more limited than std::vector, but it's often more efficient, especially for small sizes, because in practice it's mostly a lightweight wrapper around a C-style array. However, it's more secure, since the implicit conversion to pointer is disabled, and it provides much of the STL-related functionality of std::vector and of the other containers, so you can use it easily with STL algorithms & co. Anyhow, for the very limitation of fixed size it's much less flexible than std::vector.

Have a look at this to make things clearer about the differences between std::array and std::vector.

http://www.devx.com/cplus/Article/42114

#### Nested-class **DiscreteReflection**

The Inner-class that exists within our PointSourceWithReverb.
```c++
    /**
     * Internal class to represent a single discrete reflection (early reflections)
     */
    class VISR_OBJECTMODEL_LIBRARY_SYMBOL DiscreteReflection
    {
    public:
      /**
       * Default constructor, zeros all members.
       */
      DiscreteReflection();

      /**
       * Copy constructor.
       */
      DiscreteReflection( DiscreteReflection const & );

      /** Return the x coordinate of the early reflection. */
      Coordinate positionX() const { return mX; }
      /** Return the y coordinate of the early reflection. */
      Coordinate positionY() const { return mY; }
      /** Return the z coordinate of the early reflection. */
      Coordinate positionZ() const { return mZ; }
```

#### SampleType delay for discrete reflections

```c++
      /** Return the delay (in seconds) for the discrete reflection. */
      SampleType delay() const { return mDelay; }

      /**
       * Return the level (linear gain) of the discrete reflection.
       * The final gain takes the object gain into account.
       */
      LevelType level() const { return mLevel; }

      /**
       * Return the wall reflection coefficients for this discrete reflection.
       */
      rbbl::BiquadCoefficientList<SampleType> const & reflectionFilters() const { return mDiscreteReflectionFilters; }
```
#### Biquad return from wall reflection filter

Returns a specific biquad section of the wall reflection filter.
```c++
      /**
       * Return a specific biquad section of the wall reflection filter.
       * @param biquadIdx The index of the biquad to be returned.
       * @throw std::out_of_range If \p biquadIdx exceeds the number of biquads (\p cNumDiscreteReflectionBiquads)
       */
      rbbl::BiquadCoefficient<SampleType> const & reflectionFilter( std::size_t biquadIdx ) const;
```

#### Mutator functions for a DiscreteReflection

```c++
      /**
       * Set the position of the discrete reflection.
       * @param x Cartesian x coordinate of the position
       * @param y Cartesian y coordinate of the position
       * @param z Cartesian z coordinate of the position
       */
      void setPosition( Coordinate x, Coordinate y, Coordinate z );

      /**
       * Set the delay value for the discrete reflection.
       * @param newDelay New delay value (in seconds)
       */
      void setDelay( SampleType newDelay );

      /**
        * Set the level of the discrete reflection.
        * @param newLevel New level (linear scale)
        */
      void setLevel( LevelType newLevel );

      /**
       * Set the wall reflection biquad filters for this reflections
       * Resets all biquad sections not changed by this message to a default (flat) filter behaviour.
       * @param newFilters a set of biquad parameter coefficients. It must contain at most cNumDiscreteReflectionBiquads entries.
       * @throw std::invalid_argument If the size of \p newFilters exceeds cNumDiscreteReflectionBiquads
       */
      void setReflectionFilters( rbbl::BiquadCoefficientList<SampleType> const & newFilters );

      /**
       * Set a specific biquad of the wall reflection filter for this reflections
       * @param biquadIdx The index (zero-offset) of the biquad to be set.
       * @param newFilter The new biquad parameters
       * @throw std::out_of_range If the index \p biquadIdx exceeds the range of available biquads (\p cNumDiscreteReflectionBiquads)
       */
      void setReflectionFilter( std::size_t biquadIdx, rbbl::BiquadCoefficient<SampleType> const & newFilter );
    private:
      /** Cartesion x coordinate. */
      Coordinate mX;
      /** Cartesion y coordinate. */
      Coordinate mY;
      /** Cartesion z coordinate. */
      Coordinate mZ;

```

#### Other DiscreteReflection members

```c++
      /**
       * Delay value (in seconds)
       */
      SampleType mDelay;

      /**
       * Discrete reflection level (linear scale).
       */
      LevelType mLevel;

      /**
       * A set of biquad IIR filters to model the frequency response of this discrete reflection.
       */
      rbbl::BiquadCoefficientList<SampleType> mDiscreteReflectionFilters;
    };


```

#### Nested LateReverb class & constructor

```c++
    /**
     * Internal class to encapsulate the late reverberation-related parts of the reverb object.
     */
    class VISR_OBJECTMODEL_LIBRARY_SYMBOL LateReverb
    {
    public:
      /**
       * Default constructor
       */
      LateReverb();

      /**
       * Copy constructor, uses default implementation
       */
      LateReverb( LateReverb const & rhs );

      /**
       * Constructor with initial values.
       * @param onsetDelay The inset time delay for the late reverb path (in seconds).
       * @param levels The peak reverberation levels for the subbands.
       * @param decayCoeffs The decay coefficients (time constants) governing the decay after the peak.
       * @param attackTimes The attack (onset) times denoting the amount of time from the onset delay until the envelope reaches the peak value (in seconds).
       */
      explicit LateReverb( SampleType onsetDelay,
                           std::initializer_list<SampleType> const levels = std::initializer_list<SampleType>(),
                           std::initializer_list<SampleType> const decayCoeffs = std::initializer_list<SampleType>(),
                           std::initializer_list<SampleType> const attackTimes = std::initializer_list<SampleType>() );
```

#### LateReverb onsetDelay

```c++
      /**
      * Retrieve the initial delay (closely related to mixing time) for the late reverberation tail in seconds.
      */
      SampleType const onsetDelay() const { return mOnsetDelay; }

      /**
      * Set the onset time for the late reverberation part.
      * @param onset Offset time in seconds.
      */
      void setOnsetDelay( SampleType onset ) { mOnsetDelay = onset; }
```

#### LateReverb decayCoefficients

```c++
      /**
      * Return the late reverberation decay coefficients.
      * Returned as an array of decay coefficients corresponding to the fixed subbands.
      */
      LateReverbCoeffs const & decayCoeffs() const { return mDecayCoeffs; }

      /**
      * Return the late reverberation levels.
      * Returned as an array of linear levels corresponding to the fixed subbands.
      */
      LateReverbCoeffs const & levels() const { return mLevels; }

      /**
       * Return the attack times for the late reverberation envelope.
       * Returned as an array of time values [in seconds].
       */
      LateReverbCoeffs const & attackTimes() const { return mAttackTimes; }

      /**
       * Set the late reverberation levels.
       * @param levels The levels (linear scale) corresponding to the fixed subbands as a fixed-size array.
       */
      void setLevels( LateReverbCoeffs const & levels ) { mLevels = levels; }

      /**
       * Set the late reverberation levels from a vector.
       * @param levels The levels (linear scale) corresponding to the fixed subbands.
       * @param numValues The number of values contained in the \p levels array.
       * @throw std::invalid_argument If numValues does not match the fixed number of subbands.
       */
      void setLevels( SampleType const * levels, std::size_t numValues );

      /**
      * Set the late reverberation decay coefficients.
      * @param decay The decay coefficients corresponding to the fixed subbands as a fixed-size array.
      */
      void setDecayCoeffs( LateReverbCoeffs const & decay ) { mDecayCoeffs = decay; }

      /**
      * Set the late reverberation decay coefficients from a vector.
      * @param decay The decay coefficients corresponding to the fixed subbands.
      * @param numValues The number of values contained in the \p decay array.
      * @throw std::invalid_argument If numValues does not match the fixed number of subbands.
      */
      void setDecayCoeffs( SampleType const * decay, std::size_t numValues );


```

#### Attack Time set

```c++
      /**
       * Set the attack times for the late reverberation decay coefficients.
       * @param attack The attack times [in seconds] corresponding to the fixed subbands as a fixed-size array.
       */
      void setAttackTimes( LateReverbCoeffs const & attack ) { mAttackTimes = attack; }

      /**
       * Set the attack times for the late reverberation decay coefficients.
       * @param attack The attack corresponding to the fixed subbands.
       * @param numValues The number of values contained in the \p decay array.
       * @throw std::invalid_argument If numValues does not match the fixed number of subbands.
       */
      void setAttackTimes( SampleType const * attack, std::size_t numValues );
    private:
      /**
      * Onset delay (closely related to mixing time) for the late reverberation tail.
      */
      SampleType mOnsetDelay;

      /**
      * Attack times for the subbands.
      */
      LateReverbCoeffs mAttackTimes;

      /**
      * Array holding the late reverberation decay coefficients for the fixed subbands.
      */
      LateReverbCoeffs mDecayCoeffs;

      /**
      * Array holding the late reverberation levels (linear scale) for the fixed subbands.
      */
      LateReverbCoeffs mLevels;
    };
```

#### PointSouceWithReverb Constructors

```c++
    /**
     * Default constructor.
     * Construct a PointSourceWithReverb with all data members set to default values.
     */
    PointSourceWithReverb() = delete;

    /**
     * Construct a PointSourceWithReverb with a given object id and all data members set to default values.
     */
    explicit PointSourceWithReverb( ObjectId id );

    /**
     * Destructor.
     */
    virtual ~PointSourceWithReverb();

    /*virtual*/ ObjectTypeId type() const;

    /*virtual*/ std::unique_ptr<Object> clone() const;
```

### References for the LateReverb object

```cpp

    /**
    * Return a reference to the late reverb object (const version).
    */
    LateReverb const & lateReverb() const { return mLateReverb; }

    /**
     * Return a reference to the late reverb object (non-const version).
     */
    LateReverb & lateReverb() { return mLateReverb; }
```

#### Late Reverb Onset

```c++
    /**
     * Retrieve the initial delay (closely related to mixing time) for the late reverberation tail in seconds.
     */
    SampleType const lateReverbOnset() const { return lateReverb().onsetDelay(); }

    /**
     * Set the onset time for the late reverberation part.
     * @param onset Offset time in seconds.
     */
    void setLateReverbOnset( SampleType onset ) { lateReverb().setOnsetDelay( onset ); }
```

#### LateReverb decay coefficients with fixed subbands

```c++
    /**
     * Return the late reverberation decay coefficients.
     * Returned as an array of decay coefficients corresponding to the fixed subbands.
     */
    LateReverbCoeffs const & lateReverbDecayCoeffs() const { return lateReverb().decayCoeffs(); }

    /**
     * Return the late reverberation levels.
     * Returned as an array of linear levels corresponding to the fixed subbands.
     */
    LateReverbCoeffs const & lateReverbLevels() const { return lateReverb().levels(); }

```

### LateReverb attack times

```c++
    /**
    * Return the attack times for the late reverberation envelope.
    * Returned as an array of time values [in seconds].
    */
    LateReverbCoeffs const & attackTimes() const { return lateReverb().attackTimes(); }


```

#### LateReverb levels

```c++
    /**
     * Set the late reverberation levels.
     * @param levels The levels (linear scale) corresponding to the fixed subbands as a fixed-size array.
     */
    void setLateReverbLevels( LateReverbCoeffs const & levels ) { lateReverb().setLevels( levels ); }

    /**
     * Set the late reverberation levels from a vector.
     * @param levels The levels (linear scale) corresponding to the fixed subbands.
     * @param numValues The number of values contained in the \p levels array.
     * @throw std::invalid_argument If numValues does not match the fixed number of subbands.
     */
    void setLateReverbLevels( SampleType const * levels, std::size_t numValues ) { lateReverb().setLevels( levels, numValues ); }

```

#### LateReverb decay coefficients

```c++
    /**
    * Set the late reverberation decay coefficients.
    * @param decay The decay coefficients corresponding to the fixed subbands as a fixed-size array.
    */
    void setLateReverbDecayCoeffs( LateReverbCoeffs const & decay ) { lateReverb().setDecayCoeffs( decay ); }

    /**
    * Set the late reverberation decay coefficients from a vector.
    * @param decay The decay coefficients corresponding to the fixed subbands.
    * @param numValues The number of values contained in the \p decay array.
    * @throw std::invalid_argument If numValues does not match the fixed number of subbands.
    */
    void setLateReverbDecayCoeffs( SampleType const * decay, std::size_t numValues ) { lateReverb().setDecayCoeffs( decay, numValues ); }

    /**
     * Set the attack times for the late reverberation decay coefficients.
     * @param attack The attack times [in seconds] corresponding to the fixed subbands as a fixed-size array.
     */
    void setLateReverbAttackTimes( LateReverbCoeffs const & attack ) { lateReverb().setAttackTimes( attack ); }

    /**
     * Set the attack times for the late reverberation decay coefficients.
     * @param attack The attick times corresponding to the fixed subbands.
     * @param numValues The number of values contained in the \p decay array.
     * @throw std::invalid_argument If numValues does not match the fixed number of subbands.
     */
    void setLateReverbAttackTimes( SampleType const * attack, std::size_t numValues ) { lateReverb().setAttackTimes( attack, numValues ); }

```

#### DiscreteReflection functionality

```c++

  /**
    * Set the number of discrete reflection specifications.
    * This method invalidates all previously set reflections.
    * @param numReflections The new number of dicrete reflection specifications.
    */
  void setNumberOfDiscreteReflections( std::size_t numReflections );

  /**
   * Return the number of discrete reflection specifications.
   */
  std::size_t numberOfDiscreteReflections() const { return mDiscreteReflections.size(); };

  /**
   * Return a discrete reflection specification with the given index (const version)
   * @throw std::out_of_range If \p reflIdx exceeds the number of discrete reflections.
   */
  DiscreteReflection const & discreteReflection( std::size_t reflIdx ) const
  {
    return mDiscreteReflections.at( reflIdx );
  }

  /**
  * Return a discrete reflection specification with the given index.
  * @throw std::out_of_range If \p reflIdx exceeds the number of discrete reflections.
  */
  DiscreteReflection & discreteReflection( std::size_t reflIdx )
  {
    return mDiscreteReflections.at( reflIdx );
  }
```

#### PointSouceWithReverb data structure

```c++
private:
  /**
   * Data structure containing the discrete (early) reflections.
   */
  std::vector<DiscreteReflection> mDiscreteReflections;

  LateReverb mLateReverb;
};

} // namespace objectmodel
} // namespace visr

#endif // VISR_OBJECTMODEL_POINT_SOURCE_WITH_DIFFUSENESS_HPP_INCLUDED
```


## Evaluations

## High-Level Concerns

The framework we operate in – developers in Southampton
Interactive, responsive , requiring realtime-capable software tools, combined with a number of DSP building blocks.
Compares to a number of software projects for audio processing and real-time rendering CSound, Supercollider, MAX/MSP
Advantages of VISR emerge as a : object-orientated, abstracted to be component-based and highly portable across multiple operating systems.
Reusable functionality components that is designed to be extendable for users.
Problem that the project wanted to address – no integration or software can be used – is only available within C++. This is where we began to develop working production tools in December.
To do this, we had to combine VISR’s DSP functionality, with a GUI framework, JUCE.
The combination of these two frameworks enabled us to rapidly develop full-scale software with a working GUI that could work as a standalone software, or as an audio-plugin within a host (i.e. a DAW).
Focused on reverb software.

The software is operational – but there are a number of workarounds that need to be addressed
Reflection editing for any number of reflections up to 20 should be implemented
Catch and hold to stop audio glitches should be prevented to using gesture changes from user-handling
Multiple reverb objects testing – how are we re-engineering multiple sources in a room?

Engineering plans:
How are we re-engineering multiple sources in a room?
Reverse engineering of how VISR and JUCE are met in VISR/dawsupport – this is so important that this works if there are going to be future developers for production tools. (This has not been documented either). A working knowledge of JUCE will be required for this, but making it as easy as possible would be good to prove through documentation
Separate software for panning, reflection handling
Scene rendering for room parameters that exists on the master/auxiliary channel within a DAW
Redesign the reflection storage of data that stem from BiquadCoefficentLists in JSON format into something like EQ bands – BUT should we really invest time in this if we plan to re-engineer multiple sources etc. in a room?


## Verification, Validation and Outstanding Issues

## Testing

<table>
<colgroup>
<col width="20%" />
</colgroup>
  <thead>
    <tr class="header">
      <th>Test Case Description </th>
      <th>Assumption </th>
      <th>Actual </th>
      <th>Decision </th>
      <th>Fixed </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Testing panning through sliders on the UI, Test automation of panning </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Test Loading ALL rooms</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>WB: Test live input capture for source panning and reverb editing TODO: Need a good input capture means – a microphone perhaps or something like a drum machine. </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>WB: Test live input capture for source panning and reverb editing TODO: Need a good input capture means – a microphone perhaps or something like a drum machine. </td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>WB: Test with reflections fully implemented from 1 – 20. Load each room, each rendering only 1 reflection. Test with 0 reflections</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>WB: Test with other DAWs - Ableton Live, Logic Pro, Cubase as more popular DAWs are necessary for delivery</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

Test Case Description
Rationale
Assumption
Actual
Decision TODO
Fixed
WB:
Testing panning through sliders on the UI
Test automation of panning
Real-time panning is currently embedded in the ReverbVST.
Should work fine when panning sources individually
CPU:
Glitches: The greater the late-tail length in seconds set in the LoudSpeakerRenderer/PluginProcessor, the higher the CPU usage when editing late-reverb parameters.
DAFX:
VST: Panning works fine


WB: Test Loading ALL rooms
Loading all reverb parameters through
Causes audio spikes when audio playback is working.
CPU:
Glitches:
DAFX:
VST: There is sometimes a ramp up, usually its from smaller rooms to larger rooms. Not an artefact as such, more a metadata loading issue.
Should find a method to ‘hold’ audio whilst a room is being parsed through some form of sync update that holds a current thread in place. @Giacomo – TriggerASyncUpdate in JUCE? Maybe we should look into that?

WB: Test live input capture for source panning and reverb editing

TODO: Need a good input capture means – a microphone perhaps or something like a drum machine.
This will produce a full-pipeline - from capture to rendering
Expected audio glitches here too, even when panning when input monitoring is turned on.



WB: Real-time manipulation of parameters with automation:
Test automation with panning but now include changes to the reverb in real-time too
Live capture methods for modifying reverb in real-time through automation
This is conventional usage of VSTs within digital audio workstations.  Obviously we need to work out which reverb parameters , if any, will be able to change in real-time or not.
Expected numerous glitches here and crashes here.
I have encountered crashes when modifying late-reverb when there is already automation drawn in REAPER. I believe that these are thread related issues.

Need to implement a holding or freezing rendering function.


WB: Late-reverb tail adjustments:
Modify the attack time  
Modify the late decay bands
Modify the late level bands
Also conventional usage of reverb to be able to change the late tail of rooms for precise room-editing.
Expected glitches due to: Interpolation through the slider values.

Check against DAFX reference to see what step values are

Can either reduce tail-length or implement either of the following:
Freeze the rendering when dragging a slider up and down i.e. render only when user has finished dragging
Increase the step between (not sure if this will eliminate these glitches)

WB: RSAO Python LR code
Profile the CPU usage on this that runs in python



Implement internally in VISR, as a background thread task
Perhaps some form of boundaries should be able to detect this continuous ringing in the future, especially if room-parameter estimation is inaccurate.
WB: Test with reflections fully implemented from 1 – 20
Load each room, each rendering only 1 reflection
Test with 0 reflections

All fine up to St. Patricks room, where a continuous sine wave cannot be heard, but is infinitely present in the VU meter on the Master Channel. Tunnel, Outside Rockface (but only the left channel)

This bug is not consistent. The continuous wave is to do with room previously selected and number of reflections selected.
Try to iterate through all the reflections, and set all the filter to 0, BEFORE I load the room.
Loudspeaker renderer flushing of the buffer.
To go to 0 number of reflections first, then go to the number of reflections it has.
Set the number of reflections to 0,
Then parse the room
Then set the number of reflections according to the audioprocessorparameterstate
25/07/2018 Fixed. This was due to a lack of biquadsos filter information in the AES132 Library that was only given to 2 decimal places, rather than 8-10 places.

Perhaps some form of boundaries should be able to detect this continuous ringing in the future, especially if room-parameter estimation is inaccurate.

Testing DAW: Ableton (note, useful for Giacomo to know about this). A new DAW provides more insight into unexpected issues that occur with VST plugins.
WB stands for White-box testing, (in this case, through UI and DAW only, not through code). This will influence a more vigorous set of black-box/automated unit-tests
Input Capture testing capabilities (run extra tests for PointSourceMetagen too)
All test cases for any movement in sliders resulted in massive CPU spikes. Is this due to parsing such a large amount of data?
Computational overload and glitches may be distinct – identify whether they are independent or related.
