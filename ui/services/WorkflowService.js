class WorkflowService {
	
	constructor($rootScope) {
		this.rootScope = $rootScope;
		this.loadedWF = {data:null};
		this.currentData = null;
	}
	
	setLoadedWF(newObj) {
		this.loadedWF.data = newObj;
		this.rootScope.$broadcast('load_wf', newObj);
	}

	getLoadedWF(){
		return this.loadedWF.data;
	}
	  
	setCurrentData(newObj){
		this.currentData = newObj;
		this.rootScope.$broadcast('current_data_changed', newObj);
	}
	  
	updateCurrentData(updateObj, removeId){
		if(updateObj){
			if(removeId){
				delete this.currentData[removeId];
			}
			  
			if(updateObj && updateObj.id){
				this.currentData[updateObj.id] = updateObj;
			}
			  
			this.rootScope.$broadcast('current_data_changed', this.currentData);
		}
	}
	  
	getCurrentData(){
		return this.currentData;
	}
	  
	updateStart(newStartId){
		if(!this.currentData)
			return;
		  
		for(var k in this.currentData){
			if(k != newStartId){
				this.currentData[k].meta_data.start = false;
			}
		}
		  
		this.rootScope.$broadcast('current_data_changed', this.currentData);
	}
	  
	updateEnd(newEndId){
		if(!this.currentData)
			return;
		  
		for(var k in this.currentData){
			if(k != newEndId){
				this.currentData[k].meta_data.end = false;
			}
		}
		  
		this.rootScope.$broadcast('current_data_changed', this.currentData);
	}
	  
	getCurrentIds(){
		if(!this.currentData)
			return null;
		  
		var ret = null;
		for(var k in this.currentData){
			if(!ret)
				ret = [];
			  
			ret.push(k);
		}
		  
		return ret;
	}
	
}

app.service('workflowService', WorkflowService);