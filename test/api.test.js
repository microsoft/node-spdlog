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
	var testObject;

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
	});

	setup(() => {
		testObject = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);
	});

	teardown(() => {
		testObject.drop();
	});

	suiteTeardown(() => {
		if (fs.existsSync(logFile)) {
			fs.unlinkSync(logFile);
		}
	});

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
		assert.ok(fs.existsSync(logFile));
	});

	test('Log critical message', function () {

		testObject.critical('Hello World');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [critical] Hello World' + EOL));
	});

	test('Log error', function () {

		testObject.error('Hello World');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [error] Hello World' + EOL));
	});

	test('Log warning', function () {

		testObject.warn('Hello World');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [warning] Hello World' + EOL));
	});

	test('Log info', function () {

		testObject.info('Hello World');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [info] Hello World' + EOL));
	});

	test('Log debug', function () {

		testObject.setLevel(1);
		testObject.debug('Hello World');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [debug] Hello World' + EOL));
	});

	test('Log trace', function () {

		testObject.setLevel(0);
		testObject.trace('Hello World');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [trace] Hello World' + EOL));
	});


	test('set level', function () {

		testObject.setLevel(0);
		assert.equal(testObject.getLevel(), 0);

		testObject.setLevel(1);
		assert.equal(testObject.getLevel(), 1);

		testObject.setLevel(2);
		assert.equal(testObject.getLevel(), 2);

		testObject.setLevel(3);
		assert.equal(testObject.getLevel(), 3);

		testObject.setLevel(4);
		assert.equal(testObject.getLevel(), 4);

		testObject.setLevel(5);
		assert.equal(testObject.getLevel(), 5);

		testObject.setLevel(6);
		assert.equal(testObject.getLevel(), 6);
	});

	test('Off Log', function () {

		testObject.setLevel(6);
		testObject.critical('This message should not be written');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [critical] This message should not be written' + EOL));
	});

	test('set log level to trace', function () {

		testObject.setLevel(0);
		testObject.trace('This trace message should be written');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [trace] This trace message should be written' + EOL));
	});

	test('set log level to debug', function () {

		testObject.setLevel(1);
		testObject.trace('This trace message should not be written');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));
	});

	test('set log level to info', function () {

		testObject.setLevel(2);
		testObject.trace('This trace message should not be written');
		testObject.flush();

		let actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));

		testObject.debug('This debug message should not be written');
		testObject.flush();

		actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [debug] This debug message should not be written' + EOL));
	});

	test('set global log level to trace', function () {
		spdlog.setLevel(0);

		testObject.trace('This trace message should be written');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(actual.endsWith('[test] [trace] This trace message should be written' + EOL));
	});

	test('set global log level to debug', function () {
		spdlog.setLevel(1);

		testObject.trace('This trace message should not be written');
		testObject.flush();

		const actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));
	});

	test('set global log level to info', function () {
		spdlog.setLevel(2);

		testObject.trace('This trace message should not be written');
		testObject.flush();

		let actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [trace] This trace message should not be written' + EOL));

		testObject.debug('This debug message should not be written');
		testObject.flush();

		actual = fs.readFileSync(logFile).toString();
		assert.ok(!actual.endsWith('[test] [debug] This debug message should not be written' + EOL));
	});

	test('drop logger and create logger with same name and same file', function () {
		testObject.drop();

		testObject = new spdlog.RotatingLogger('test', logFile, 1048576 * 5, 2);
	});

	test('set async mode', function () {
		spdlog.setAsyncMode(8192, 2000);
	});
});