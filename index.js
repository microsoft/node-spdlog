const spdlog = require('bindings')('spdlog');

exports.version = spdlog.version;
exports.Logger = spdlog.Logger;

class BasicLogger extends spdlog.Logger {

	constructor(name, filename, truncate = false) {
		super('basic', name, filename, truncate);
	}
}

exports.BasicLogger = BasicLogger;

class RotatingLogger extends spdlog.Logger {

	constructor(name, filename, maxFileSize, maxFiles) {
		super('rotating', name, filename, maxFileSize, maxFiles);
	}
}

exports.RotatingLogger = BasicLogger;

class DailyLogger extends spdlog.Logger {

	constructor(name, filename, hour = 0, minute = 0) {
		super('daily', name, filename, hour, minute);
	}
}

exports.DailyLogger = BasicLogger;