const spdlog = require('bindings')('spdlog');

exports.version = spdlog.version;
exports.Logger = spdlog.Logger;

class RotatingLogger extends spdlog.Logger {
	constructor(name, filename, maxFileSize, maxFiles) {
		super('rotating', name, filename, maxFileSize, maxFiles);
	}
}

exports.RotatingLogger = RotatingLogger;