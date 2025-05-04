/**
 * Copyright 2023 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */
/* eslint-disable no-await-in-loop */
const retry = async (retryCount, method) => {
  for (let i = 1; i <= retryCount; i += 1) {
    try {
      await method();
      return true; // 성공하면 그대로 종료
    } catch (err) {
      console.error({
        message: `Error while retry, retryCount: ${i}`,
        error: err?.message ?? err,
      });
    }
  }
  return false;
};

module.exports = {
  retry,
};
