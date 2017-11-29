const spdlog = require('.');

const console = new spdlog.StdoutColorMt("console");
console.info("Welcome to spdlog!");
console.info("An info message example {}..", 1);

const basic = new spdlog.BasicLoggerMt("basic_logger", "logs/basic.txt");

// turn on async
spdlog.setAsyncMode(8192);


const fileLogger = new spdlog.RotatingLoggerMt("file_logger", "myfilename", 1024 * 1024 * 5, 3);

fileLogger.info("Welcome to spdlog!");
