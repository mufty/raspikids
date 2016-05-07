var fs = require('fs');

var gpio = require('rpi-gpio');

BaseComponent = class BaseComponent {
	constructor(initData, done, settings){
		this.done = done;
		this.settings = settings;
		this.initData = initData;
		this.id = this.settings.id;
	}
	unexport(cb){
		if(this.initData && this.initData.gpioPort){
			var pin = this.initData.gpioPort;
			var finished = false;
			
			//TODO fix this to unexport just the port used not all of them
		//	fs.writeFile(this.PATH + '/unexport', pin, cb);
			gpio.destroy(cb);
		}
	}
	startUp(){
		//implement in the child
	}
	next(target, data){
		this.done(this.settings.end, target, data);
	}
	handleOutputs(){
		if(this.settings.end)
			this.next(this.settings.end);
        else {
        	var out = this.initData.out;
			
			for(var i in out){
				var o = out[i];
				var data;
				if(o["export"]){
					data = {};
					for(var k in o['export']){
						var to = o['export'][k];
						var from = k;
						data[to] = this[from];
					}
				}
				this.next(o.target, data);
			}
        }
	}
	handleTimeout(){
		if(this.initData.input && this.initData.input.time){
			var max_sec = new Date().getTime();
			while (new Date() < max_sec + this.initData.input.time) {}
		}
	}
	get PATH() {
        return '/sys/class/gpio';
    }
};