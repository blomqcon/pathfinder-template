'use strict'
var path = require('path');
var fs = require('fs');
var pathfinder = require('pathfinder-node').core;
var pathfinderIO = require('pathfinder-node').io;

var waypoints = [{x: -4, y: -1, angle: 0}, {x: -1, y: 2, angle: 0}];
var config = {};

var trajectory = pathfinder.generateTrajectory(waypoints, config);	

const testTrajectoryDir = path.resolve(__dirname, "temp/");
const testTrajectoryFile = path.resolve(testTrajectoryDir, "test_trajectory.csv");
if (!fs.existsSync(testTrajectoryDir))
	fs.mkdirSync(testTrajectoryDir);
  
pathfinderIO.serializeTrajectoryCsv(testTrajectoryFile, trajectory);