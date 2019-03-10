'use strict'

var path = require('path');
var fs = require('fs');
var pathfinder = require('pathfinder-node').core;
var pathfinderIO = require('pathfinder-node').io;
var templateValidation = require('./template-validation');

function processTemplate(template, outputDir, silentMode = false) {
	// Validate template and populate default values
	var waypoints = templateValidation.validateWaypoints(template.waypoints);
	var config = templateValidation.validateConfig(template.config);

	// Create the trajectory
	var trajectory = pathfinder.generateTrajectory(waypoints, config);

	// Write the trajectory to a file
	var outputName = assignTemplateName(template);
	serializeTrajectoryCsv(outputDir, outputName,  trajectory, silentMode);

	// Generate tank offset trajectories, write them to a file
	processTankModifier(template.tankModifier, trajectory, outputDir, silentMode);
}

function assignTemplateName(template, templateName) {
	if (typeof template.templateConfig !== 'object')
		template.templateConfig = {};

	if (typeof template.templateConfig.nameOverride !== "string")
		template.templateConfig.nameOverride = templateName;

	return template.templateConfig.nameOverride;
}

function assignTankModifierParameters(tankModifier, templateName) {
	if (typeof tankModifier !== 'undefined')
	{
		if (!tankModifier.hasOwnProperty('wheelbaseWidth'))
			throw new templateValidation.TemplateError("Tank modifiers require a wheelbase width value")

		if (!tankModifier.hasOwnProperty('leftNameOverride'))
			tankModifier.leftNameOverride = `${templateName}-left`

		if (!tankModifier.hasOwnProperty('rightNameOverride'))
			tankModifier.rightNameOverride = `${templateName}-right`
	}
}

function processTankModifier(tankModifier, trajectory, outputDir, silentMode) {
	if (typeof tankModifier !== 'undefined')
	{
		var wheelbaseWidth = tankModifier.wheelbaseWidth;
		var tankTrajectories = pathfinder.generateTankTrajectories(trajectory, wheelbaseWidth);
		
		var leftOutputName = tankModifier.leftNameOverride;
		serializeTrajectoryCsv(outputDir, leftOutputName,  tankTrajectories.leftTrajectory, silentMode);

		var rightOutputName = tankModifier.rightNameOverride;
		serializeTrajectoryCsv(outputDir, rightOutputName,  tankTrajectories.rightTrajectory, silentMode);
	}
}

function serializeTrajectoryCsv(dirname, filename, trajectory, silentMode) {
	if (!fs.existsSync(dirname))
		fs.mkdirSync(dirname);
		
	const file = path.resolve(dirname, `${filename}.trajectory.csv`);
	pathfinderIO.serializeTrajectoryCsv(file, trajectory);

	if (!silentMode)
		console.log(`Created pathfinder template: ${file}`)
}

module.exports = {
	processTemplate: processTemplate,
	assignTemplateName: assignTemplateName,
	assignTankModifierParameters: assignTankModifierParameters
};