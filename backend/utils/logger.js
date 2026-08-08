const fs = require('fs');
const path = require('path');

// Minimal dependency-free logger: writes to console and appends to logs/app.log.
// Swap for pino/winston later without changing call sites.
const logDir = path.join(__dirname, '..', 'logs');
const logFile = path.join(logDir, 'app.log');

function ensureLogDir() {
  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  } catch {
    // If we can't create the dir, fall back to console-only silently.
  }
}
ensureLogDir();

function write(level, message) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;

  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);

  try {
    fs.appendFileSync(logFile, line + '\n');
  } catch {
    // Ignore file write failures; console already has it.
  }
}

module.exports = {
  info: (msg) => write('info', msg),
  warn: (msg) => write('warn', msg),
  error: (msg) => write('error', msg),
};
