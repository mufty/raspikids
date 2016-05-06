require('./BaseComponent.js');

components.Sleep = class Sleep extends BaseComponent {
	constructor(initData, done, settings){
		super(initData, done, settings);
		console.log("Pin init: " + initData);
		this.clean = false;
		
		//this.startUp();
	}
	startUp(){
		if(this.initData){
			var max_sec = new Date().getTime();
			while (new Date() < max_sec + this.initData.time) {}
			
			this.handleOutputs();
		}
	}
};