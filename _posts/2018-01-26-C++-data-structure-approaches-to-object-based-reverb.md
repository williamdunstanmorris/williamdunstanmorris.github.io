---
layout: post
title:  "C++ data structure approaches to object-based reverb"
date:   2018-01-26 12:31:01 +0000
categories: reverb
published: false
---

Following discussions based on the architecture of the reverb plugin, I finally with a class UML design of the ReverberatorProcessor and the ReverbEditor. They follow a similar approach to an MVC architecture. I think the majority of trouble about designing this falls under the following:

## Breakdown: point_source_with_reverb.hpp

Here is the current PointSourceWithReverb class that sits in the libobjectmodel/ directory in VISR. Lets take this apart.


```c++
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

### NumberOfSubBands and NumDiscreteReflectionBiquads

```c++
    static const std::size_t cNumberOfSubBands = 9;
    /**
     * Number of biquad sections for the IIR filters representing
     * the wall reflection filters of the early (discrete) reflections.
     * @todo Consider making this a systeem-wide configuration option.
     */
    static const std::size_t cNumDiscreteReflectionBiquads = 10;

```

### C++ std:: array vs std::vector for **LateReverbCoeffs**

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

### Nested-class **DiscreteReflection**

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

### SampleType delay for discrete reflections

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
### Biquad return from wall reflection filter

Returns a specific biquad section of the wall reflection filter.
```c++
      /**
       * Return a specific biquad section of the wall reflection filter.
       * @param biquadIdx The index of the biquad to be returned.
       * @throw std::out_of_range If \p biquadIdx exceeds the number of biquads (\p cNumDiscreteReflectionBiquads)
       */
      rbbl::BiquadCoefficient<SampleType> const & reflectionFilter( std::size_t biquadIdx ) const;
```

### Mutator functions for a DiscreteReflection

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

### Other DiscreteReflection members

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

### Nested LateReverb class & constructor

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

### LateReverb onsetDelay

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

### LateReverb decayCoefficients

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

### Attack Time set

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

### PointSouceWithReverb Constructors

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

```c++

    /**
    * Return a reference to the late reverb object (const version).
    */
    LateReverb const & lateReverb() const { return mLateReverb; }

    /**
     * Return a reference to the late reverb object (non-const version).
     */
    LateReverb & lateReverb() { return mLateReverb; }
```

### Late Reverb Onset

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

### LateReverb decay coefficients with fixed subbands

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

### LateReverb levels

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

### LateReverb decay coefficients

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

### DiscreteReflection functionality

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

### PointSouceWithReverb data structure

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
