---
title:  "My first ever software - a Supercollider Standalone"
cover: assets/img/supercollider-vst.png
date:   2018-02-07 12:31:01 +0000
categories: speak
published: true
tags: audio
---

The SuperCollider is a music-based language that combines the object oriented structure of Smalltalk and features from functional programming languages with a C family syntax.

This plugin uses cross-fading to fade between waveforms, with cut-off and resonance implemented in the filter section. I followed a traditional approach to what other monophonic synth audio software's use.

![supercollider-vst]({{ "/assets/img/supercollider-vst.png" | absolute_url }})

You can download the code for this on my Github [here](https://github.com/williamdunstanmorris/vst_gui).


## A Graphical User Interface for Subtractive Synthesis

My Graphical User Interface (GUI) demonstrates the very basic use of subtractive synthesis within digital format. My aim was to build a two-oscillator synthesizer that gives the user some basic variable parameters. The GUI incorporates 2 oscillators,

Some of my inspirations for the GUI came from the Aturia collection, and I was particularly inspired by the MiniMoog V’s design layout, and the monophonic-quality sound it produces. Because of this, I wanted to base the key design of the Moog on mine: have the oscillators on the left, the filter in the middle and the output on the right. It was also ideal for me to use the MoogFF Class for my GUI.

While we understand that additive synthesis works by the addition of time-varying sinusoidal components to produce a desired waveform, subtractive synthesis basis itself on the idea of passing one or more signals through a time-varying filter in hope to sculpture differing timbres that consist of one or more sonic textures. The most basic formation of subtractive synthesis would consist of the source + filter.

Oscillator generation This is where the sound is born. Usually the process of subtractive synthesis starts with a complex waveform or wavetable, which is incredibly raw, and usually not suitable to be used directly as an instrument. In my Supercollider GUI, I use two oscillators, each with differing oscillator waveshapes, that can be cross-faded between each other. The advantage of this is that up to four differing waves can be heard at once, instead of two.

Waves are not just the basis of subtractive synthesis, they are the basis of the signal in an electronic circuit. Sound, light, video and radio all produce signals that alternate over a period of time, by alternating values above or below a specific value. Periodic signal waves induce a particular pattern that is repetitive, but it is vital to understand that many complex signal waves are essentially made up of a series of pure sine waves, which is the default; the purest and most basic waveshape.

The Pre Filter Mix This process is not common, and only really used if and when there is more than one filter in the filtering process. This process includes specifying the source/s level, its balance, and how much each oscillator goes into each filter.

Filter Arguably the most crucial process in subtractive synthesis. Nick Collins describes in the Introduction to Computer Music that the filter to be like the body of an acoustic instrument, like a guitar, or a violin against the colour of raw string vibrations. (Collins, 2010, p. 22) From there we can understand that sound changes, based on the application of shape.

In order to bring sonic textures you have in mind for composition, you will sometimes want to dampen certain harmonics, or boost others, by injecting or attenuating energy at different points across the spectrum. Altering its frequency content does this.

The most common variable of a filter is the cutoff frequency. This creates a boundary system for harmonics moving across the spectrum. If sound wishes to travel beyond this boundary, energy flowing through the system becomes reduced (attenuated or reflected), rather than just being passed through. Determining how much boost is given to harmonics across the cutoff frequency would be determining the cutoff frequency’s gain, but is actually known more commonly to be the resonance parameter. In the Supercollider GUI, I use the MoogFF Class, which is a digital implementation of the Moog VoltageControlledFilter (VCF). Both the cutoff and resonance parameters have a large presence as a fixed entity and shape within the four most basic filter types: low pass; high pass; band pass and band stop.

-	A low pass filter allows the low frequencies to pass through, whilst the higher frequencies are attenuated or reflected. The same applies with a high pass filter, but filters low frequencies instead.
-	A band pass, and band reject filter are two other common filter shapes that also attenuate frequencies outside of their range:
     Post Filter Mix Within the post-filter mix, the most common variable is the envelope generation. Envelope generation is needed to represent the different stages the sound will go through over the life of the note.

From the onset to offset of triggering any note, the application of the envelope determines the overall starting shape of the note from nil to peak (attack), to the subsequent run down from the attack level peak to the designated sustain level (decay), as well as the level during the main sequence of the sound’s duration (sustain), and finally the time taken for the level to decay from the sustain level to zero after the key is released (release).

The most common envelope generator type is the ADSR envelope. The earliest implementation of ADSR can be found on the Hammond Novachord in 1938, as well as early notations of the parameter ( specified by Moog and developed into their current form (A,D,S,R) by ARP. Within Supercollider, there is also the ability to determine the peak level of the envelope and the curvature within the .adsr method, and other envelope methods like the .dadsr follow the same principle as .adsr, but allow the possibility to create its onset delayed by delayTime in seconds too.

Nowadays, most synthesizers, additive or subtractive, consist of an envelope generator to encourage different resonant frequencies not just for the amplitude, but for the filter itself too. This allows for two layers of shaping, providing much more sound sculpturing possibilities. What is also interesting to me is that there is a constant attempt to digitally imitate the sound of acoustic instrumentation, like the clarinet for instance. The ‘peaks’ with amplitude are called ‘formants’, because resonances occur between the larynx and the mouth. Whilst this can be implemented digitally, it can be very difficult to imitate the natural acoustic sound digitally. With that said, digital subtractive synthesizers over the past few years have become incredibly powerful at imitating acoustic instrumentation, through sampling the competent granular synthesis. It has arguably become the reason why people have stopped buying analog synthesis.
