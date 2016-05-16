var fs = require('fs');

exports.save = function(data, filename){
	var foundStart = false;
	for(var k in data){
		//find start node
		if(data[k].meta_data && data[k].meta_data.start){
			foundStart = true;
		}
	}
	
	if(!foundStart){
		console.log("No start node!");
		return;
	}
		
	
	fs.writeFile("wf/" + filename, JSON.stringify(data), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 
};