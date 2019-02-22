'use strict'

function validateWaypoints(waypoints) {
	if (!Array.isArray(waypoints))
		throw new TypeError("Waypoints should contain an array of waypoints");

	if (waypoints.length < 2)
		throw new TypeError("There should be at least 2 waypoints");

	waypoints.forEach((waypoint) => {
		if (typeof waypoint.x !== 'number'
			|| typeof waypoint.y !== 'number'
			|| typeof waypoint.angle !== 'number')
		{
			throw new TypeError("Invalid waypoint schema");
		}
    });
    
    return waypoints;
}

function validateConfig(config) {
	switch(config.splineFitMethod) {
		case "FIT_HERMITE_CUBIC":
		case "FIT_HERMITE_QUINTIC":
			break;
		case undefined:
			config.splineFitMethod = "FIT_HERMITE_CUBIC";
			break;
		default:
			throw new TypeError("Invalid sample count value");
	}

	switch(typeof config.sampleCount) {
		case "string": {
			switch (config.sampleCount) {
				case "PATHFINDER_SAMPLES_FAST":
					config.sampleCount = 1000;
					break;
				case "PATHFINDER_SAMPLES_LOW":
					config.sampleCount = 1000 * 10;
					break;
				case "PATHFINDER_SAMPLES_HIGH":
					config.sampleCount = 1000 * 10 * 10;
					break;
				default:
					throw new TypeError("Invalid sample count value");
			}
			break;
		}
		case "number":
			break;
		case "undefined":
			config.sampleCount = 1000;
			break;
		default:
			throw new TypeError("Invalid sample count");
	}

	switch(typeof config.dt) {
		case "number":
			break;
		case "undefined":
			config.dt = 0.05;
			break;
		default:
			throw new TypeError("Invalid dt value");
	}

	switch(typeof config.velocity) {
		case "number":
			break;
		case "undefined":
			config.velocity = 1.7;
			break;
		default:
			throw new TypeError("Invalid velocity value");
	}

	switch(typeof config.maxAcceleration) {
		case "number":
			break;
		case "undefined":
			config.maxAcceleration = 2.0;
			break;
		default:
			throw new TypeError("Invalid maxAcceleration value");
	}

	switch(typeof config.maxJerk) {
		case "number":
			break;
		case "undefined":
			config.maxJerk = 60.0;
			break;
		default:
			throw new TypeError("Invalid maxJerk value");
    }
    
    return config;
}

module.exports = {
    validateWaypoints: validateWaypoints,
    validateConfig: validateConfig
};