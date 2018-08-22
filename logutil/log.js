const timestamp = require('console-timestamp');
const timeFormat = '[YYYY-MM-DD hh:mm:ss:iii]';

function log(message) {
    console.log(formatLine('INFO', message));
}

function warn(message) {
    console.log(formatLine('WARN', message));
}

function error(message) {
    console.log(formatLine('ERROR', message));
}

function formatLine(level, msg) {
    return (timestamp(timeFormat)) + " - " + msg;
}

module.exports.log = log;
module.exports.warn = warn;
module.exports.error = error;