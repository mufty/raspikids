require('./BaseComponent.js');

components.Sleep = class Pin extends BaseComponent {
	constructor(initData, done, settings){
		super(initData, done, settings);
		console.log("Pin init: " + initData);
		this.clean = false;
		
		this._startUp();
	}
	_startUp(){
		if(initData){
			var max_sec = new Date().getTime();
			while (new Date() < max_sec + initData.time) {}
			
			this.handleOutputs();
		}
	}
};