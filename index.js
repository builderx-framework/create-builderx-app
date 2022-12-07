#!/usr/bin/env node
const shell = require('shelljs');

//Check if git is enable
if (!shell.which('git')) {
	shell.echo('@builderx-framework/create-builderx-app requires git');
	shell.exit(1);
}

const targetRepo =
	'https://github.com/builderx-framework/template.git';

const targetFolder = process.argv[2] || 'template';

shell.exec(`git clone ${targetRepo} ${targetFolder}`);