/**
 * Copyright 2023 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */

const { httpCommonCode } = require('./response_code');

module.exports.Exception = class extends Error {
  constructor(message, status, ...params) {
    super(message, ...params);

    this.status = status ?? httpCommonCode.INTERNAL_SERVER_ERROR;
    this.message = message ?? 'server error';
    this.params = params ?? [];
  }
};
