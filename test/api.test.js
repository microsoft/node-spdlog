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
	test('is loaded', function () {
		const spdloghPath = path.join(__dirname, '..', 'deps', 'spdlog', 'include', 'spdlog', 'spdlog.h');
		const contents = fs.readFileSync(spdloghPath, 'utf8');
		const version = /SPDLOG_VERSION "([\d\.]+)"/.exec(contents)[1];

		assert.equal(spdlog.version, version);
	});

	test('Logger is present', function () {
		assert(typeof spdlog.Logger === 'function');
	});
});