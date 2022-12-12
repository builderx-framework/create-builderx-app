'use strict';

const https = require('https');
const chalk = require('chalk');
const commander = require('commander');
const envinfo = require('envinfo');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const semver = require('semver');
const spawn = require('cross-spawn');

const packageJson = require('./package.json');

let projectName;

function init() {
	const program = new commander.Command(packageJson.name)
		.version(packageJson.version)
		.arguments('<project-directory>')
		.usage(`${chalk.green('<project-directory>')} [options]`)
		.action((name) => {
			projectName = name;
		})
		.allowUnknownOption()
		.on('--help', () => {
			console.log(
				`    Only ${chalk.green('<project-directory>')} is required.`
			);
			console.log();
		})
		.parse(process.argv);

	if (program.info) {
		console.log(chalk.bold('\nEnvironment Info:'));
		console.log(
			`\n  current version of ${packageJson.name}: ${packageJson.version}`
		);
		console.log(`  running from ${__dirname}`);
		return envinfo
			.run(
				{
					System: ['OS', 'CPU'],
					Binaries: ['Node', 'npm', 'Yarn'],
					Browsers: [
						'Chrome',
						'Edge',
						'Internet Explorer',
						'Firefox',
						'Safari',
					],
					npmGlobalPackages: ['create-builderx-app'],
				},
				{
					duplicates: true,
					showNotFound: true,
				}
			)
			.then(console.log);
	}

	if (typeof projectName === 'undefined') {
		console.error('Please specify the project directory:');
		console.log(
			`  ${chalk.cyan(program.name())} ${chalk.green(
				'<project-directory>'
			)}`
		);
		console.log();
		console.log('For example:');
		console.log(
			`  ${chalk.cyan(program.name())} ${chalk.green('my-bx-app')}`
		);
		console.log();
		console.log(
			`Run ${chalk.cyan(
				`${program.name()} --help`
			)} to see all options.`
		);
		process.exit(1);
	}

	// We first check the registry directly via the API, and if that fails, we try
	// the slower `npm view [package] version` command.
	//
	// This is important for users in environments where direct access to npm is
	// blocked by a firewall, and packages are provided exclusively via a private
	// registry.
	checkForLatestVersion()
		.catch(() => {
			try {
				return execSync('npm view create-builderx-app version')
					.toString()
					.trim();
			} catch (e) {
				return null;
			}
		})
		.then((latest) => {
			if (latest && semver.lt(packageJson.version, latest)) {
				console.log();
				console.error(
					chalk.yellow(
						`You are running \`create-builderx-app\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
							'We recommend always using the latest version of create-builderx-app if possible.'
					)
				);
				console.log();
			} else {
				createApp(projectName, program.template);
			}
		});
}

function createApp(name, template) {
	const root = path.resolve(name);
	const appName = path.basename(root);

	fs.ensureDirSync(name);
	console.log();

	console.log(`Creating a new BX app in ${chalk.green(root)}.`);
	console.log();

	const packageJson = {
		name: appName,
		version: '0.1.0',
		private: true,
	};
	fs.writeFileSync(
		path.join(root, 'package.json'),
		JSON.stringify(packageJson, null, 2) + os.EOL
	);

	const originalDirectory = process.cwd();
	process.chdir(root);
	run(root, appName, originalDirectory, template);
}

function install(dependencies) {
	return new Promise((resolve, reject) => {
		let command;
		let args;

		command = 'npm';
		args = [
			'install',
			'--no-audit', // https://github.com/facebook/create-builderx-app/issues/11174
			'--save',
			'--save-exact',
			'--loglevel',
			'error',
		].concat(dependencies);

		const child = spawn(command, args, { stdio: 'inherit' });
		child.on('close', (code) => {
			if (code !== 0) {
				reject({
					command: `${command} ${args.join(' ')}`,
				});
				return;
			}
			resolve();
		});
	});
}

function run(root, appName, originalDirectory, template) {
	Promise.all([
		getTemplateInstallPackage(template, originalDirectory),
	]).then(([templateToInstall]) => {
		const allDependencies = [templateToInstall];
		return install(allDependencies);
	});
}

function getTemplateInstallPackage(template, originalDirectory) {
	let templateToInstall = 'cra-template';
	if (template) {
		if (template.match(/^file:/)) {
			templateToInstall = `file:${path.resolve(
				originalDirectory,
				template.match(/^file:(.*)?$/)[1]
			)}`;
		} else if (
			template.includes('://') ||
			template.match(/^.+\.(tgz|tar\.gz)$/)
		) {
			// for tar.gz or alternative paths
			templateToInstall = template;
		} else {
			// Add prefix 'cra-template-' to non-prefixed templates, leaving any
			// @scope/ and @version intact.
			const packageMatch = template.match(
				/^(@[^/]+\/)?([^@]+)?(@.+)?$/
			);
			const scope = packageMatch[1] || '';
			const templateName = packageMatch[2] || '';
			const version = packageMatch[3] || '';

			if (
				templateName === templateToInstall ||
				templateName.startsWith(`${templateToInstall}-`)
			) {
				// Covers:
				// - cra-template
				// - @SCOPE/cra-template
				// - cra-template-NAME
				// - @SCOPE/cra-template-NAME
				templateToInstall = `${scope}${templateName}${version}`;
			} else if (version && !scope && !templateName) {
				// Covers using @SCOPE only
				templateToInstall = `${version}/${templateToInstall}`;
			} else {
				// Covers templates without the `cra-template` prefix:
				// - NAME
				// - @SCOPE/NAME
				templateToInstall = `${scope}${templateToInstall}-${templateName}${version}`;
			}
		}
	}

	return Promise.resolve(templateToInstall);
}

function checkForLatestVersion() {
	return new Promise((resolve, reject) => {
		https
			.get(
				'https://registry.npmjs.org/-/package/create-builderx-app/dist-tags',
				(res) => {
					if (res.statusCode === 200) {
						let body = '';
						res.on('data', (data) => (body += data));
						res.on('end', () => {
							resolve(JSON.parse(body).latest);
						});
					} else {
						reject();
					}
				}
			)
			.on('error', () => {
				reject();
			});
	});
}

module.exports = {
	init,
	getTemplateInstallPackage,
};
