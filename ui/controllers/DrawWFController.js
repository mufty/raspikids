var d3 = require('d3');
var cm = require('d3-context-menu')(d3);

app.controller('DrawWFController', function ($scope, $rootScope, workflowService, elementService) {
	$scope.loadedWF = "";
	
	var menu = [
	            {
	                title: 'Item #1',
	                action: function(elm, d, i) {
	                    console.log('Item #1 clicked!');
	                    console.log('The data for this circle is: ' + d);
	                },
	                disabled: false // optional, defaults to false
	            },
	            {
	                title: 'Item #2',
	                action: function(elm, d, i) {
	                    console.log('You have clicked the second item!');
	                    console.log('The data for this circle is: ' + d);
	                }
	            }
	        ];
	
	var vis = d3.select("#graph");
	var workflowDir = 'wf/';
	var circleRadius = 30;
	var selectedNode;
	var selfLoaded = false;
	
	var determineClass = function(d){
		if(d.meta_data.end)
			return 'end';
		else if(d.meta_data.start)
			return 'start';
		return '';
	};
	
	var draw = function(data){
		console.log("draw");
		
		vis.html('');
		
		vis.append("defs").selectAll("marker")
    			.data(["suit", "licensing", "resolved"])
	  		.enter().append("marker")
	    		.attr("id", function(d) { return d; })
	    		.attr("viewBox", "0 -5 10 10")
			    .attr("refX", 15)
			    .attr("refY", -1.5)
			    .attr("markerWidth", 6)
			    .attr("markerHeight", 6)
			    .attr("orient", "auto")
			.append("path")
			    .attr("d", "M0,-5L10,0L0,5");
		
		var w = '100%', h = '100%';
		vis.attr("width", w)
		   .attr("height", h);
		
		var nodes = [];

		var links = [];

		//make array of WF and links
		for(var k in data){
			var o = data[k];
			o.id = k;
			nodes.push(o);
			
			if(o.data && o.data.out){
				for(var i in o.data.out){
					var outObject = o.data.out[i];
					var link = {
							source: o,
							target: data[outObject.target]
						};
					links.push(link);
				}
			}
		}
		
		var drag = d3.behavior.drag()
	    	.on('dragstart', function(d) {
	    		//reset selected class
	    		if(selectedNode){
	    			selectedNode.selectAll('circle').attr('class', determineClass);
	    		}
	    		
	    		var group = d3.select(this);
	    		group.selectAll('circle').attr('class', 'selected');
	    		
	    		selectedNode = group;
	    	})
	    	.on('drag', function(d) {
	    		var group = d3.select(this);
	    		d.meta_data.x = d3.event.x;
	    		d.meta_data.y = d3.event.y;
	    		group.attr('transform', "translate("+d.meta_data.x+","+d.meta_data.y+")");
	    		
	    		vis.selectAll(".link")
	    		   .data(links).attr("d", linkArc);
	    	})
	    	.on('dragend', function(d) { 
	    	});
	    	
	    var elem = vis.selectAll(".node")
			.data(nodes);
		
		var elemEnter = elem.enter()
	        .append("g")
	        .attr("transform", function(d){return "translate("+d.meta_data.x+","+d.meta_data.y+")"})
	        .attr("class", "node")
	        .call(drag)
	        .on('click', function(d){
	        	d3.event.stopPropagation();
	        	if(!d3.event.defaultPrevented){
	        		if(selectedNode){
		    			selectedNode.selectAll('circle').attr('class', determineClass);
		    		}
		    		
		    		var group = d3.select(this);
		    		group.selectAll('circle').attr('class', 'selected');
		    		
		    		selectedNode = group;
		    		elementService.setSelectedElement(d);
		    		//showData();
	    		}
	        }).on('contextmenu', d3.contextMenu(menu));
		
		var circle = elemEnter.append("circle")
	        .attr("r", circleRadius + "px")
	        .attr("class", determineClass);
		
		elemEnter.append("text")
	        .attr("dx", function(d){return -10})
	        .text(function(d){return d.id});
	    	
	    var linkArc = function(d){
  			var dx = d.target.meta_data.x - d.source.meta_data.x,
			dy = d.target.meta_data.y - d.source.meta_data.y,
			//dr = Math.sqrt(dx * dx + dy * dy);
			dr = 100;
			return "M" + d.source.meta_data.x + "," + d.source.meta_data.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.meta_data.x + "," + d.target.meta_data.y;
	    };
		
		var path = vis.append("g").selectAll("path")
    		.data(links)
  			.enter().append("path")
    		.attr("class", function(d) { return "link"; })
    		.attr("marker-end", function(d) { return "url(#suit)"; })
    		.attr("d", linkArc);
	}; 
	
	var loadWF = function(){
		vis.on('click', function(){
			//reset selected class
    		if(!d3.event.defaultPrevented && selectedNode && selectedNode != this){
    			selectedNode.selectAll('circle').attr('class', determineClass);
    			selectedNode = null;
    			elementService.setSelectedElement(null);
    		}
			
    		//showData();
		});

		var data = require('../' + workflowDir + $scope.loadedWF);
		
		selfLoaded = true;
		
		workflowService.setCurrentData(data);
		
		draw(data);
	}
	
	$scope.$on('load_wf', function(response, value) {
		$scope.loadedWF = value;
	});
	
	$scope.$on('current_data_changed', function(response, value) {
		if(value)
			draw(value);
		
		selfLoaded = false;
	});
	
	$scope.$watch('loadedWF', function() {
		if($scope.loadedWF)
			loadWF();
    });
});