const path = require('path');
const mkdirp = require('mkdirp');
const spdlog = require('bindings')('spdlog');

exports.version = spdlog.version;
exports.setFlushEvery = spdlog.setFlushEvery;
exports.setLevel = spdlog.setLevel;
exports.shutdown = spdlog.shutdown;
exports.Logger = spdlog.Logger;

function createAsyncRotatingLoggerAsync(name, filepath, maxFileSize, maxFiles) {
	return new Promise((c, e) => {
		const dirname = path.dirname(filepath);
		mkdirp(dirname, err => {
			if (err) {
				e(err);
			} else {
				c(new spdlog.Logger('rotating_async', name, filepath, maxFileSize, maxFiles));
			}
		})
	});
}

exports.createAsyncRotatingLoggerAsync = createAsyncRotatingLoggerAsync;