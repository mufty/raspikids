

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

npm install RaspiKids

You need to have gpio-admin installed on the PI as described here:

https://github.com/quick2wire/quick2wire-gpio-admin

### Workflow engine

We use the harmony mode for nodejs for the engine to allow ES6 so to start just do this just pass the process name to be executed as the last parameter:

cd node_modules\RaspiKids

sudo node --harmony start.js <process-name>

If you want to write a new workflow just create a new json file in the wf directory. When adding workflows add them to the wf directory that's where they are being read from.

### UI

You can run the ui for the workflow now:

cd node_modules\RaspiKids

sudo npm start

You can see all the existing workflows there just click them to load and if you want to start them press the start button. You can also drag and drop the nodes to see the connections. There is no save for now that's WIP.  


## Developing



### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
