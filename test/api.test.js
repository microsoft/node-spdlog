/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// @ts-check

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const spdlog = require('..');

suite('API', function () {

	var tempDirectory;
	var logFile;
	var EOL = '\n';

	suiteSetup(() => {
		tempDirectory = path.join(__dirname, 'logs');
		if (!fs.existsSync(tempDirectory)) {
			fs.mkdirSync(tempDirectory);
		}
		logFile = path.join(tempDirectory, 'test.log');
		if (fs.existsSync(logFile)) {
			fs.unlinkSync(logFile);
		}

		if (typeof process === 'object') {
			if (process.platform === 'win32') {
				EOL = '\r\n';
			}
		} else if (typeof navigator === 'object') {
			let userAgent = navigator.userAgent;
			if (navigator.userAgent.indexOf('Windows') >= 0) {
				EOL = '\r\n'
			}
		}
	})

	suiteTeardown(() => {
		if (fs.existsSync(logFile)) {
			fs.unlinkSync(logFile);
		}
	})

	test('is loaded', function () {
		const spdloghPath = path.join(__dirname, '..', 'deps', 'spdlog', 'include', 'spdlog', 'spdlog.h');
		const contents = fs.readFileSync(spdloghPath, 'utf8');
		const version = /SPDLOG_VERSION "([\d\.]+)"/.exec(contents)[1];

		assert.equal(spdlog.version, version);
	});

	test('Logger is present', function () {
		assert(typeof spdlog.Logger === 'function');
	});

	test('Create rotating logger', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		assert.ok(fs.existsSync(logFile));
	});

	test('Log critical message', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.critical('Hello World');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [critical] Hello World' + EOL));
	});

	test('Log error', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.error('Hello World');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [error] Hello World' + EOL));
	});

	test('Log warning', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.warn('Hello World');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [warning] Hello World' + EOL));
	});

	test('Log info', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.info('Hello World');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [info] Hello World' + EOL));
	});

	test('Log debug', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(1);
		rotatingLogger.debug('Hello World');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [debug] Hello World' + EOL));
	});

	test('Log trace', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(0);
		rotatingLogger.trace('Hello World');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [trace] Hello World' + EOL));
	});


	test('set level', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(0);
		assert.equal(rotatingLogger.getLevel(), 0);

		rotatingLogger.setLevel(1);
		assert.equal(rotatingLogger.getLevel(), 1);

		rotatingLogger.setLevel(2);
		assert.equal(rotatingLogger.getLevel(), 2);

		rotatingLogger.setLevel(3);
		assert.equal(rotatingLogger.getLevel(), 3);

		rotatingLogger.setLevel(4);
		assert.equal(rotatingLogger.getLevel(), 4);

		rotatingLogger.setLevel(5);
		assert.equal(rotatingLogger.getLevel(), 5);

		rotatingLogger.setLevel(6);
		assert.equal(rotatingLogger.getLevel(), 6);
	});

	test('Off Log', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(6);
		rotatingLogger.critical('This message should not be written');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [critical] This message should not be written' + EOL));
	});

	test('set log level to trace', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(0);
		rotatingLogger.trace('This trace message should be written');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [trace] This trace message should be written' + EOL));
	});

	test('set log level to debug', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(1);
		rotatingLogger.trace('This trace message should not be written');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));
	});

	test('set log level to info', function () {
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.setLevel(2);
		rotatingLogger.trace('This trace message should not be written');
		rotatingLogger.flush();

		let actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));

		rotatingLogger.debug('This debug message should not be written');
		rotatingLogger.flush();

		actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [debug] This debug message should not be written' + EOL));
	});

	test('set global log level to trace', function () {
		spdlog.setLevel(0);
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.trace('This trace message should be written');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [trace] This trace message should be written' + EOL));
	});

	test('set global log level to debug', function () {
		spdlog.setLevel(1);
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.trace('This trace message should not be written');
		rotatingLogger.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));
	});

	test('set global log level to info', function () {
		spdlog.setLevel(2);
		const rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.trace('This trace message should not be written');
		rotatingLogger.flush();

		let actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));

		rotatingLogger.debug('This debug message should not be written');
		rotatingLogger.flush();

		actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [debug] This debug message should not be written' + EOL));
	});

	test('drop logger and create logger with same name and same file', function () {
		let rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);

		rotatingLogger.drop();

		rotatingLogger = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);
	});

	test('set async mode', function () {
		spdlog.setAsyncMode(8192, 2000);
	});
});