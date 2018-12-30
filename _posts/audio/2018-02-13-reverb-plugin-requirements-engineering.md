---
layout: navbar-post
title:  "Object-based Reveberation software"
cover: assets/img/git-cover.png
date:   2018-12-10 12:31:01 +0000
categories: speak
published: true
tags:  
    - continuous-integration
    - ci/cd
    - docker
    - git
    - reverb
---

I think the requirements can be split into 3 specific sub-requirements to make things easier to understand . For the sake of time, feel free to propose any modifications of these requirements to make implementation at this stage as easy as possible. I stress the importance of keeping things as simple as possible and make it extensible.

Even though they the scene renderer sits in the reproduction stage and the reverbrenderer sits in the production stage, I feel that the implementation should remain fairly similar.

User Requirements:
* The user should be able to drop one and only one instance of the ReverbRenderer plugin onto the master track. The ReverbRenderer plugin listens to the SoundObjectiser for its PointSource data coordinates.
* The user can modify the source positions using the SoundObjectiser, and the positions are visualised in the ReverbRenderer ( At this stage, I was thinking just to adapt the Scene Renderer, but just with extra parameters that modify the reverb)
* The user can

Plugin Requirements:
* The sound objectiser should have a checkbox to send the point source information to the ReverbRenderer.

Sound Requirements:
* Continue to treat each track as a sound object
* Create a separate track that acts as a container for a plugin where we want to perform the reverb handling and rendering.
* Audio signals of different objects have to be routed independently to the reverb rendering plugin.
*

Data structure requirements:
* When the plugin instance is created, attach some metadata to each soundobject using the MetadataGenerator. (For instance the trackID and the objectID)?
* For every SoundObjectiser, a pml:;ObjectVector should be instantiated with 1 PointSourceWithReverb (1 source per track was what I was thinking for the time being)
* On controlling any of the reverb parameters in the plugin, a declaration of the
* This pml::ObjectVector can be modified by a set of higher level model processing functions that utilise many of the PointSourceWithReverb functions (I have written already).

Demo Requirements: (These are not so important at this stage, but it is worth noting what the overall goal is for the technical meeting.)
* A reaper session is opened on a my 15-inch macbook pro (the same as yours) and contains between 5-10 tracks only. Maybe less.
* Every track contains a sound-objectiser plugin.
* A channel (or the master channel) contains the ReverbRenderer plugin,
* I want to demonstrate live-capabilities, so PERHAPS one of the tracks contains some MIDI-out that goes to an external instrument (I will be using my ARP Odyssey to demonstrate transients (I have to get away from the trumpet demo, so I will be using this) -> http://www.korg.com/uk/products/synthesizers/arpodyssey_module/). The MIDI-out -> ARP-Odyssey MIDI-in -> ARP-Odyssey AudioOut ->



Questions:
//-------------------------------------------------//

You do not need to answer these now, Its questions I want to ask you in Southampton

Questions I have come up with

* VISR_common vs shared/visr_common
* What is the difference between the MetadataExposingRenderer and the SceneRenderer? i can see that the SceneRenderer declares a pointer to the MetadataExposingRenderer.
* What exactly does the ReverbObjectEncoder/Decoder do? Is it communication between the soundobjectiser and the scenerenderer?
* ReverbPluginProcessor::VISRSetup() - see todos.
*

This is a plugin that we have created specifically for this purpose and we've called it "Metadata Generator" (Figure 5, left side).
Then we want to have another separate track which doesn't represent an object but which acts as a container for a plugin where we want to perform the scene handling and rendering. To do so we created a plugin which we called Scene Renderer where we want to receive the metadata of all the objects that we have in the other tracks (Figure5, right side). With this infrastructure the main components of an object base production are placed, the problem is how to exchange the metadata between them. Since we cannot rely on the DAW for this task, we came up with an alternative solution which consists in sending the metadata through the underlying local network of the machine, assigning network ports for that purpose. In this way we are able to completely bypass the DAW with its own limitations (Figure 6).


Takes in PointSource information per track -> Receives 1-n (1 object per track) tracks of PointSource information on the container track.
Concatenates an array of point sources and adds reverb metadata -> encodes the object vector again and sends it to the MasterVST via UDP.


* SoundObjectiser outputs PointSource coordinates with bool isReverbEnabled determining if reverb is to be send to the ReverbRenderer.
*



New *Minimal* Reverb Implementation Requirements:

*Level 1:*

**Add a slider for object level, which will control the dry/wet level**
1. Within PointSourceWithRevWrapper, implement a control for the ID::objLevel, which will grab the current state level of all levels, and set them.
2. If possible, introduce a smoothing gain with the slider. (not high-priority)

**Copy in the JSON library**
1. Copy Room JSON into its own .h file that contains the room library raw JSON data as an std::string.
2. Include this .h file in the PointSourceWithRevWrapper class.
3. Create a function to load room that uses this class - use whatever is currently implemented as its function.
4. Constructor should load a room based on current room chosen in box. Check this works properly.

*Level 2: More challenging requirements:*

**Implement a JUCE Checkbox to determine whether object is PointSource or PointSourceWithReverb in the PluginEditor.cpp/hpp.**
1. Toggle switch state between PointSource or PointSourceWithReverb. Use std:: in each constructor to determine which is being created and/or pointed to.
2. Add if statement to action on Checkbox to perform PluginSetup() again.
3. Add an if condition to the objecthandler.reset(...) using the checkbox to status to determine which object type it should be.

**Integration implementation requirements (integration ReverbObjectMetagen->PointSourceWithReverb)**
1. Add room and object level parameters via parameters.createAndAddParamter(...)
2. Add parameters.addMetadata(...) for room and object level .
3. Do the same for removeParameterListener for room type and object level.
4. Add enableRoomLoading(), addRoomsToComboBox() functions to the PluginEditor
5. Inherit private::Timer and implement timeCallback override();

**Implement a JUCE timer after user has stopped playback before room can be changed to avoid audio spiking**
Add an additional 5 second pause time after playback has stopped which prevents users from loading a room. This will potentially reduce the amount of audio spikes. This does NOT completely remove audio spikes, but may reduce the chance of them from occurring.
1. Add an additional timer clock of 5 seconds as an additional condition of !result.isPlaying clause in timerCallback() function.

*Issue:* When the plugin is first loaded, the parameters of the room being initially loaded are not correct. They are only corrected after changing a room.
*Issue:* When a room is changed, audio spikes can cause a slow linear increase in BOTH late level and late decay, until muted by REAPER.
*Issue* When a room is changed, audio spikes can cause a rapid increase in late level, but with a very short decay.

*This a constant issue I have been going around in circles for a long long time with.*
Potential tryouts to fix.
1. Create a new function called roomChangeCallback() to determine when the room has been changed.
2. *Tried multiple times with this:* When a room is changed, iteratively set the 8ve bands of all late-level and late-decay and object-level to its MINIMUM value (presumably 0, equating to -inf dB. ) BEFORE loading a new room dataset.
3. [optional - Andreas' suggestion] Use the rcl::CrossfadingMatrix to implement switches between filters with crossfading - use that for the mLateReverFilter in reverbobject::ReverbObjectRenderer. (requires someone with DSP understanding for this)
