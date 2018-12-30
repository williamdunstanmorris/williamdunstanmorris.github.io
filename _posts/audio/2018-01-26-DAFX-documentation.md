---
layout: post
title:  "DAFX/RSAO Documentation"
date:   2018-01-26 12:31:01 +0000
categories: reverb audio
published: false
---

The current RSAO editor has been derived from the work on DAFX. The script to run back-end was improved and the UI was overhauled.

This post gives an explanation of the following:

The .sh is made up of the following commands :

1. A description of running the baseline_renderer and the optional config option file

```
./Applications/ISR-0.9.0-Darwin/bin/baseline_renderer --option-file="./c4_components/renderer_option_files/${1:-tb7_reverbdemo_longtail.cfg}" &
```
2. The .cfg option file included in the baseline_renderer.
3. The Metadapter and its arguments
4. oscsend arguments
5. Max/MSP

The Max/MSP patch uses osc-send to send control information to the Metadapter.

The following Max/MSP parameters follow this chain

```
*Predelay* -> [osc-send]/EditReverbTarget/editpredelay $1 -> [metadapter] self.preDelayAdjust = float(valueList[0]) -> [VISR]



    # change the room library
    # OSC example: /EditReverb/editlatelevel 0.0
    if key == "editlatelevel":
      self.lateLevelAdjust = float(valueList[0])
    elif key == "editlatesubbandlevels":
      self.lateSubbandLevelAdjust = valueList[0:]
      print( self.lateSubbandLevelAdjust )
    elif key == "editlatedelay":
      self.lateDelayAdjust = float(valueList[0])
    elif key == "editpredelay":
      print( self.preDelayAdjust )
      if self.preDelayAdjust<0:
        print( "predelay must not be less than zero" )
    elif key == "editpredelaylate":
      self.preDelayAdjustLate = float(valueList[0])
      print( self.preDelayAdjustLate )
      if self.preDelayAdjustLate<0:
        print( "predelay must not be less than zero" )
    elif key == "editearlylevel":
      self.earlyLevelAdjust = float(valueList[0])
    elif key == "editlatedecay":
      self.lateDecayAdjust = float(valueList[0])
    elif key == "objectlist":
      # change the objects to apply distance to, currently requires full object list per message
      editDistanceString = valueList[0]
      if editDistanceString == "all":
        maxObjects=64
        self.editObjectList = []
        for i in range(0,maxObjects):
          self.editObjectList.append(i)
      elif editDistanceString == "none":
        self.editObjectList = []
      elif editDistanceString == "list":
        self.editObjectList =  valueList[1:]
        try:
          0 in self.editObjectList
        except TypeError:
          self.editObjectList = [self.editObjectList]

```        

6. JACK
7. The killscript
