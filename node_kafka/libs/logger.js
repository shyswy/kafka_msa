/**
 * Copyright 2023 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */

const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/utc'));
const uuidBase62 = require('uuid-base62');

const DebugLevel = {
  debug: { name: 'DEBUG', level: 0 },
  info: { name: 'INFO', level: 1 },
  warning: { name: 'WARN', level: 2 },
  error: { name: 'ERROR', level: 3 },
  critical: { name: 'CRITICAL', level: 4 },
};
Object.freeze(DebugLevel);

function isAllowedLevel(logLevel) {
  const stage = process.env?.STAGE;

  let threshold;
  switch (stage) {
    case 'predev':
    case 'dev':
    case 'qa':
    case 'stg':
      threshold = DebugLevel.debug;
      break;
    case 'op':
    default:
      threshold = DebugLevel.info;
      break;
  }

  return threshold.level <= DebugLevel[logLevel].level;
}

module.exports.Logger = class {
  // Declare private instance member
  #lambdaID;

  #messageID;

  #component;

  #startTime;

  // assign -1(negative integer) to prevent calling the end method repeatedly.
  #endTime = -1;

  constructor({ lambdaId = null, messageId = null, component = null } = {}) {
    this.#lambdaID = lambdaId ?? '-';
    this.#messageID = messageId ?? uuidBase62.v4();
    this.#component = component ?? '-';
    this.#start();
  }

  lambdaID() {
    return this.#lambdaID;
  }

  messageID() {
    return this.#messageID;
  }

  component() {
    return this.#component;
  }

  config() {
    return {
      lambdaID: this.#lambdaID,
      messageID: this.#messageID,
      component: this.#component,
    };
  }

  #time() {
    return dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSS');
  }

  #timestamp() {
    return dayjs().utc().valueOf();
  }

  #prefix(level = 'info') {
    return `[${this.#time()}][${this.#lambdaID}][${this.#messageID}][${DebugLevel[level].name}][${this.#component}]`;
  }

  // Set start time and print start log
  #start() {
    this.#startTime = this.#timestamp();
    const startMsg = `[STARTED] MessageID: ${this.#messageID}`;
    this.log(startMsg);
  }

  cleanUp() {
    // destroy logger
    this.#lambdaID = null;
    this.#messageID = null;
    this.#component = null;
    this.#startTime = null;
    this.#endTime = null;
  }

  // Print end log. Must call before return responses
  end() {
    if (this.#endTime > -1) {
      return;
    }

    this.#endTime = this.#timestamp() - this.#startTime;
    const endMsg = `[END][Elapsed Time: ${this.#endTime} ms]`;
    this.log(endMsg);
  }

  // Print log as debug level
  debug(...msgs) {
    const dbgLevel = 'debug';

    if (!isAllowedLevel(dbgLevel)) {
      return;
    }

    console.debug(this.#prefix(dbgLevel), ...msgs); // Noncompliant
  }

  // Print log as info level
  info(...msgs) {
    const dbgLevel = 'info';

    if (!isAllowedLevel(dbgLevel)) {
      return;
    }

    console.log(this.#prefix(dbgLevel), ...msgs); // Noncompliant
  }

  // Print log as log level(same as info level)
  log(...msgs) {
    const dbgLevel = 'info';

    if (!isAllowedLevel(dbgLevel)) {
      return;
    }

    console.log(this.#prefix(dbgLevel), ...msgs); // Noncompliant
  }

  // Print log as warning level
  warn(...msgs) {
    const dbgLevel = 'warning';

    if (!isAllowedLevel(dbgLevel)) {
      return this;
    }

    console.warn(this.#prefix(dbgLevel), ...msgs); // Noncompliant

    return this;
  }

  // Print log as error level
  error(...msgs) {
    const dbgLevel = 'error';

    if (!isAllowedLevel(dbgLevel)) {
      return this;
    }

    console.error(this.#prefix(dbgLevel), ...msgs); // Noncompliant

    return this;
  }

  // Print log as critical level. ALWAYS print to deal with critical
  critical(...msgs) {
    const dbgLevel = 'critical';

    console.error(this.#prefix(dbgLevel), ...msgs); // Noncompliant

    // TODO: Consider and implement what critical does
    return this;
  }
};
