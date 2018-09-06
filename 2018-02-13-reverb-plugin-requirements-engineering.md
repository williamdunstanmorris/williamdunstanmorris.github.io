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
