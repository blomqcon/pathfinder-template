var path = require('path');
var fs = require('fs');
const pathfinder = require('pathfinder-node').core;
const pathfinderTemplate = require('../index');

test('Basic Template Generation', () => {

    var waypoints = [{x: -4, y: -1, angle: 0}, {x: -1, y: 2, angle: 0}];
    var config = {};

    // Create baseline
    var trajectory = pathfinder.generateTrajectory(waypoints, config);
    expect(trajectory.length).toBe(1539);

    // TODO: Template stuff

});