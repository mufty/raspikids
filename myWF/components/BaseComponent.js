BaseComponent = class BaseComponent {
	constructor(initData, done, settings){
		this.done = done;
		this.settings = settings;
		this.initData = initData;
	}
	next(target){
		this.done(this.settings.end, target);
	}
	handleOutputs(){
		if(this.settings.end)
			this.next(this.settings.end);
        else {
        	var out = this.initData.out;
			
			for(var i in out){
				this.next(out[i].target);
			}
        }
	}
	handleTimeout(){
		if(this.initData.time){
			var max_sec = new Date().getTime();
			while (new Date() < max_sec + this.initData.time) {}
		}
	}
};