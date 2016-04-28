BaseComponent = class BaseComponent {
	constructor(initData, done, settings){
		this.done = done;
		this.settings = settings;
		this.initData = initData;
	}
	next(target){
		this.done(this.settings.end, target);
	}
};