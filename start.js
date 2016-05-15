var init = require("./wf_engine.js");

var startprocess = "";

process.argv.forEach(function (val, index, array) {
  if(index == 2)
	  startprocess = val;
});

init.startWF(startprocess);