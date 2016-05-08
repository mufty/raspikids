var fs = require('fs');

var gpio = require('rpi-gpio');

const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);

myEmitter = new MyEmitter();

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
			if(this.initData.io && this.initData.io == 'output'){
				gpio.write(pin, false, function(){
					gpio.unexportPin(pin, function(){
						myEmitter.emit('unexported' + pin);
					});
				}.bind(this));
			} else {
				gpio.unexportPin(pin, function(){
					myEmitter.emit('unexported' + pin);
				});
			}
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
	get pinMapping(){
		return {
				"3": 0,
				"5": 1,
				"7": 4,
				"8": 14,
				"10": 15,
				"11": 17,
				"12": 18,
				"13": 21,
				"15": 22,
				"16": 23,
				"18": 24,
				"19": 10,
				"21": 9,
				"22": 25,
				"23": 11,
				"24": 8,
				"26": 7,

				// Model A+ and Model B+ pins
				"29": 5,
				"31": 6,
				"32": 12,
				"33": 13,
				"35": 19,
				"36": 16,
				"37": 26,
				"38": 20,
				"40": 21
		};
	}
};