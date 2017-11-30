const path = require('path');
const mkdirp = require('mkdirp');
const spdlog = require('bindings')('spdlog');

exports.version = spdlog.version;
exports.setAsyncMode = spdlog.setAsyncMode;
exports.setLevel = spdlog.setLevel;
exports.Logger = spdlog.Logger;

class RotatingLogger extends spdlog.Logger {
	constructor(name, filename, maxFileSize, maxFiles) {
		if (path.isAbsolute(filename)) {
			mkdirp.sync(path.dirname(filename));
		}

		super('rotating', name, filename, maxFileSize, maxFiles);
	}
}

exports.RotatingLogger = RotatingLogger;