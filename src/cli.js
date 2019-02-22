'use strict'

var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var fs = require('fs');
var pathfinderTemplate = require('./index');

(async function () {
    if (typeof argv["mp"] === 'undefined')
    {
        console.log("mp (motion profile) not specified");
		process.exit();
    }
    let templateFile = argv["mp"];

    let outputDir = path.resolve('./');
    if (typeof argv["o"] !== 'undefined')
    {
        if(path.isAbsolute(argv["o"]))
            outputDir = argv["o"];
        else
            outputDir = path.resolve(outputDir, argv["o"]);
    }

    let silentMode = argv["silent"] === true;
    

	try {
        var data = await readFileAsync(templateFile);
        var template = JSON.parse(data);
        
        var defaultTemplateName = path.basename(templateFile, '.motionprofile.json');
        pathfinderTemplate.assignTemplateName(template, defaultTemplateName);
        pathfinderTemplate.assignTankModifierParameters(template.tankModifier, defaultTemplateName);

        pathfinderTemplate.processTemplate(template, outputDir, silentMode);
	} catch (e) {
		// TODO: Handle errors
		console.log(e);
	}
 })();

function readFileAsync(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err)
				reject(err);
			else
				resolve(data);
		  });
	});
}
