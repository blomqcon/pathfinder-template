'use strict'

function validateWaypoints(waypoints) {
	if (!Array.isArray(waypoints))
		throw new TemplateError("Waypoints should contain an array of waypoints");

	if (waypoints.length < 2)
		throw new TemplateError("There should be at least 2 waypoints");

	waypoints.forEach((waypoint) => {
		if (typeof waypoint.x !== 'number'
			|| typeof waypoint.y !== 'number'
			|| typeof waypoint.angle !== 'number')
		{
			throw new TemplateError("Invalid waypoint schema");
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
			throw new TemplateError("Invalid sample count value");
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
					throw new TemplateError("Invalid sample count value");
			}
			break;
		}
		case "number":
			break;
		case "undefined":
			config.sampleCount = 1000;
			break;
		default:
			throw new TemplateError("Invalid sample count");
	}

	switch(typeof config.dt) {
		case "number":
			break;
		case "undefined":
			config.dt = 0.05;
			break;
		default:
			throw new TemplateError("Invalid dt value");
	}

	switch(typeof config.velocity) {
		case "number":
			break;
		case "undefined":
			config.velocity = 1.7;
			break;
		default:
			throw new TemplateError("Invalid velocity value");
	}

	switch(typeof config.maxAcceleration) {
		case "number":
			break;
		case "undefined":
			config.maxAcceleration = 2.0;
			break;
		default:
			throw new TemplateError("Invalid maxAcceleration value");
	}

	switch(typeof config.maxJerk) {
		case "number":
			break;
		case "undefined":
			config.maxJerk = 60.0;
			break;
		default:
			throw new TemplateError("Invalid maxJerk value");
    }
    
    return config;
}

class TemplateError extends Error {
	constructor(message) {
		super(message);
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace.
		// It's not absolutely essential, but it does make the stack trace a little nicer.
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = {
    validateWaypoints: validateWaypoints,
	validateConfig: validateConfig,
	TemplateError: TemplateError
};