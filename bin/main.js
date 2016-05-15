#!/usr/bin/env node

var electron = require( 'electron-prebuilt' )

var proc = require('child_process')

// Adjust the command line arguments: remove the "node <code.js>" part
var args = process.argv.slice( 2 );  
// ... and insert the root path of our application (it's the parent directory)
// as the first argument
args.unshift( __dirname + '/../' );

var child = proc.spawn(electron, args, {stdio: 'inherit'})

child.on('close', function (code) {
  process.exit(code)
})
