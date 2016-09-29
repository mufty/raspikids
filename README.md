

# Raspi Kids 

The idea of this project is to teach kids programming using raspberry pi (maybe beaglebone or similar generic purpose board later) and GPIO. Our goal is to have everything running on the PI so you don't need anything but the PI, a keyboard and a monitor to start. So we keep it as cheap as possible for schools to be able to afford a simple setup if they want to.

## Dependencies
gpio-admin: https://github.com/quick2wire/quick2wire-gpio-admin

## Why GPIO?

So the kids can actually see that if I do this something happened in real world light a servo motor starts spinning or a led light turns on. We can even have a prepared setup in a nice package of a robot, car, or anything like that ready to connect to the GPIO right away.
 
## How?

We want to have a workflow like engine running in node.js this workflow would represent the programming language. A single task in the workflow would work something like this. Setup a GPIO pin with this number to output and write this value into it. We want to have logic gates as tasks as well as loops etc.

On top of this workflow we should have a "kid friendly" UI that would generate the workflow diagram as a JSON file. Think of this as a simplified BPM modeling tool.

## Usage

This project is still under development but the workflow engine can be mess with if you desire.

For installation just do:

npm install -g RaspiKids

You need to have gpio-admin installed on the PI as described here:

https://github.com/quick2wire/quick2wire-gpio-admin

We have an example workflows that you can checkout at: 

https://github.com/mufty/raspikids-example.git

So if you create a directory you can just clone these to play around with it.

git clone https://github.com/mufty/raspikids-example.git

## Running UI from sources

For running the UI from checked out source code just run: 

npm start

in the project directory.

### Workflow engine

To use just the engine withouth the UI you can execute just some workflow by doing:

sudo raspi-kids-wf lightBlink

The lightBlink is just an example workflow from our repository as described above.

Place any new workflows in the "wf" sub directory that's where the engine is trying to find them.

### UI

You can run the ui for the workflow now:

sudo raspi-kids

You can see all the existing workflows there just click them to load and if you want to start them press the start button. You can also drag and drop the nodes to see the connections. Save button is currently able to just do updates of existing workflows. Creation of new workflows will be available once the UI is able to draw.  


## Developing



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
