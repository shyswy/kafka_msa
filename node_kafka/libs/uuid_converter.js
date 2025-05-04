/**
 * Copyright 2023 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */
const uuidBase62 = require('uuid-base62');

const Uuid = {
  USAGE: {
    prefix: 'USG',
  },
  TH_CHECKER: {
    prefix: 'TH',
  },
};
class UuidConverter {
  static createUuid() {
    return uuidBase62.v4();
  }

  static decode(encodedUuid) {
    return uuidBase62.decode(encodedUuid);
  }

  static encode(originalUuid) {
    return uuidBase62.encode(originalUuid);
  }

  static createThcheckerUuid() {
    // encoded uuid generate
    const uuid = this.createUuid();
    return Uuid.TH_CHECKER.prefix.concat(uuid);
  }

  static createUsageUuid() {
    const uuid = this.createUuid();
    return Uuid.USAGE.prefix.concat(uuid);
  }
}
module.exports = UuidConverter;
