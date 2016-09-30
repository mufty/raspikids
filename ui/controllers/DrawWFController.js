var d3 = require('d3');
var cm = require('d3-context-menu')(d3);

class DrawWFController {
	
	constructor($scope, $rootScope, workflowService, elementService) {
		this.scope = $scope;
		this.rootScope = $rootScope;
		this.workflowService = workflowService;
		this.elementService = elementService;
		
		this.menu = [
			            {
			                title: 'Outputs',
			                action: function(elm, d, i) {
			                    console.log('Item #1 clicked!');
			                    console.log('The data for this circle is: ' + d);
			                },
			                disabled: false // optional, defaults to false
			            },
			            {
			            	divider: true
			            },
			            {
			                title: 'Inputs',
			                action: function(elm, d, i) {
			                    console.log('You have clicked the second item!');
			                    console.log('The data for this circle is: ' + d);
			                }
			            }
			        ];
		
		this.vis = d3.select("#graph");
		this.workflowDir = 'wf/';
		this.circleRadius = 30;
		this.selectedNode;
		this.selectedLink;
		
		this.initEvents();
	}
	
	initEvents() {
		
		this.scope.$on('load_wf', this.loadWF.bind(this));
		
		this.scope.$on('current_data_changed', this.currentDataChanged.bind(this));
		
		this.scope.$watch('loadedWF', this.loadedWF.bind(this));
		
	}
	
	loadWF(response, value) {
		this.scope.loadedWF = value;
	}
	
	currentDataChanged(response, value) {
		if(value)
			this.draw(value);
		
		this.selfLoaded = false;
	}
	
	loadedWF() {
		if(this.scope.loadedWF)
			this.load();
	}
	
	load() {
		var that = this;
		this.vis.on('click', function(){
			//reset selected class
    		if(!d3.event.defaultPrevented && that.selectedNode && that.selectedNode != this){
    			that.selectedNode.selectAll('circle').attr('class', that.determineClass);
    			that.selectedNode = null;
    			that.elementService.setSelectedElement(null);
    		}
    		
    		if(!d3.event.defaultPrevented && that.selectedLink && that.selectedLink != this){
    			that.selectedLink.attr('class', 'link');
    			that.selectedLink = null;
    			that.elementService.setSelectedLink(null);
    		}
			
    		//showData();
		});

		var data = require('../' + this.workflowDir + this.scope.loadedWF);
		
		this.selfLoaded = true;
		
		this.workflowService.setCurrentData(data);
		
		this.draw(data);
	}
	
	determineClass(d) {
		if(d.meta_data.end)
			return 'end';
		else if(d.meta_data.start)
			return 'start';
		return '';
	}
	
	draw(data){
		console.log("draw");
		
		var that = this;
		
		this.vis.html('');
		
		this.vis.append("defs").selectAll("marker")
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
		this.vis.attr("width", w)
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
		
		var linkArc = function(d){
  			var dx = d.target.meta_data.x - d.source.meta_data.x,
			dy = d.target.meta_data.y - d.source.meta_data.y,
			//dr = Math.sqrt(dx * dx + dy * dy);
			dr = 100;
			return "M" + d.source.meta_data.x + "," + d.source.meta_data.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.meta_data.x + "," + d.target.meta_data.y;
	    };
		
		var path = this.vis.append("g").selectAll("path")
    		.data(links)
  			.enter().append("path")
    		.attr("class", function(d) { return "link"; })
    		.attr("marker-end", function(d) { return "url(#suit)"; })
    		.attr("d", linkArc)
    		.on('click', function(d){
	        	d3.event.stopPropagation();
	        	if(!d3.event.defaultPrevented){
	        		if(that.selectedLink){
	        			that.selectedLink.selectAll('path').attr('class', 'link');
		    		}
		    		
		    		var group = d3.select(this);
		    		group.attr('class', 'link linkSelected');
		    		
		    		that.selectedLink = group;
		    		that.elementService.setSelectedLink(d);
	    		}
	        });
		
		var drag = d3.behavior.drag()
	    	.on('dragstart', function(d) {
	    		//reset selected class
	    		if(that.selectedNode){
	    			that.selectedNode.selectAll('circle').attr('class', that.determineClass);
	    		}
	    		
	    		var group = d3.select(this);
	    		group.selectAll('circle').attr('class', 'selected');
	    		
	    		that.selectedNode = group;
	    	})
	    	.on('drag', function(d) {
	    		var group = d3.select(this);
	    		d.meta_data.x = d3.event.x;
	    		d.meta_data.y = d3.event.y;
	    		group.attr('transform', "translate("+d.meta_data.x+","+d.meta_data.y+")");
	    		
	    		that.vis.selectAll(".link")
	    		   .data(links).attr("d", linkArc);
	    	})
	    	.on('dragend', function(d) { 
	    	});
	    	
	    var elem = this.vis.selectAll(".node")
			.data(nodes);
		
		var elemEnter = elem.enter()
	        .append("g")
	        .attr("transform", function(d){return "translate("+d.meta_data.x+","+d.meta_data.y+")"})
	        .attr("class", "node")
	        .call(drag)
	        .on('click', function(d){
	        	d3.event.stopPropagation();
	        	if(!d3.event.defaultPrevented){
	        		if(that.selectedNode){
	        			that.selectedNode.selectAll('circle').attr('class', that.determineClass);
		    		}
		    		
		    		var group = d3.select(this);
		    		group.selectAll('circle').attr('class', 'selected');
		    		
		    		that.selectedNode = group;
		    		that.elementService.setSelectedElement(d);
		    		//showData();
	    		}
	        }).on('contextmenu', d3.contextMenu(this.menu));
		
		var circle = elemEnter.append("circle")
	        .attr("r", this.circleRadius + "px")
	        .attr("class", this.determineClass);
		
		elemEnter.append("text")
	        .attr("dx", function(d){return -10})
	        .text(function(d){return d.id});
	}
	
}

app.controller('DrawWFController', DrawWFController);