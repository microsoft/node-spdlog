const spdlog = require('spdlog');
const mtlogger = spdlog.rotating_logger_mt('loggerName', 'fileName', 1024 * 1024 * 5 /*maxFileSize*/, 3 /*maxFiles*/)
const stlogger = spdlog.rotating_logger_st('loggerName', 'fileName', 1024 * 1024 * 5 /*maxFileSize*/, 3 /*maxFiles*/)

mtlogger.info('multithread logger');
stlogger.info('sibglethread logger');