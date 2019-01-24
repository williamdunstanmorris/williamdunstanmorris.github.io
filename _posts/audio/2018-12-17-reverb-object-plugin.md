---
layout: navbar-post
title:  "VISR Reverb Plugin Infrastructure"
cover: assets/img/visr-reverb-object.png
date: 2018-02-07 12:31:01 +0000
categories: work
published: true
tags: audio c/c++ object-orientation reverb
---

The VISR Reverb Object is a VST3 software available as part of the VISR Production Suite. It is part of a suite of plugins available within a channel-based, digital-audio workstation (DAW), that easily enables spatial audio production through a newer up and coming format - object-based audio. This post is spit into a number of differing sections on how this VISR Reverb Object VST3 was built, and how many of the under-the-hood components work. A high level understanding of object-based audio is assumed, along with development practices and digital-signal processing concepts too.

In order to understand the concept of the S3A ecosystem and software in action, perhaps it is best to describe the software from a digital-audio-workstation perspective - the perspective of a creative individual.

> For creatives wanting to have a go at creating a object-based session in a DAW, a full tutorial is available on the website, [here](https://cvssp.org/data/s3a/public/VISRPluginSuite/html/index.html)

It’s a DAW session/project that contains all the fundamental elements of an object-based production, as described in the Object-based audio section, are:

Those are usual DAW audio tracks, containing audio items. As soon as they are equipped with the Object Editor plugin they become audio objects (Objects category) and start to be part of the object-based scene. Everything that is done on a per-object-track level can be seen in real time in the following plugin, which collects all the positional information of the Object Editor plugins.

Your first two items, requirements and software design, seem to be the one most relevant for any discussions to specify what are are aiming to achieve, as least as a starting point. I would assume that the GUI wireframe captures user requirements in terms of the interface and expected behaviour. Does the algorithm that defines how RSAO parameters respond to values on a slider, for example, come under the software design?

In what we've discussed, there are the flows for each group of metadata. We need to show the top-level abstraction (diagram from Coleman et al. 2017), the logical signal flow (diagram that Phil circulate last week) and the physical signal flow (VISR components). We also need a way to define separately the static behaviour and the real-time behaviour. Perhaps you can recommend a way to visualise that for us to talk about it.

In the structure you have, I'm not that clear about the differences between evaluation, verification, validation and testing. Can you clarify?

Related to that, there is a need for a debug view of the RSAO parameters at various points along the signal flow between plugins. We need to verify that parameters get set and flow thru undamaged, and that the renderer is responding how we expect. This is more of a display than a user interface, which will enable us to confirm behaviour of a GUI while we're testing and then hide it from the user once testing is complete.

It would be good also to add cross-references to other relevant documentation, e.g., on the wiki or in VISR/prod tools documentation. We need to have things that can work as the input to a discussion (where we can all see what we recognize and understand) and also as an output (where we've added detail or reviewed/revised).

For example, we there exists a wireframe or data structure description, those should be accessible and discoverable ideally.


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
* [AF, GC]: Can we store this as some static file inside the file? Andreas, you mentioned a ```Literal String```.
* [GC]: A better way to do this would be to use JUCE's Binary Builder - a console app that can dump out a .cpp/.h file with JSON in a `const char* RoomRIRs_json` variable.
* Now this needs to be parsed in the simplest way possible. Need to go from `const char*` -> `property_tree::ptree &tree`

- Changing rooms in real-time is causing audio spikes, and it is not safe. AF told me that this could be prevented by implementing an rcl::CrossfadingFilterMatrix. This is so important to correct.
* [LR, PC] Will need extensive support on how this function is used, and where this function is to be placed exactly. For instance, is it used in the Reverb Editor or is it used in the reverbobjectmodel(DSP). If the latter, then will need much more guidance. Also How do we use this when changing rooms i.e. parsing a JSON dataset rooms.?*
* [GC] Told me once of a way to do asyncronookus updated in the objectwrapper? Still a viable/safe way to do for loading a room object model that will prevent audio hiccups?*



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
