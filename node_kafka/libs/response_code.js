/**
 * Copyright 2023-2024 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */

// HTTP response code for device provision service
module.exports.httpCommonCode = {
  SUCCESS: {
    httpStatusCode: 200,
    status: { code: '00-000', message: 'Success' },
  },
  DEVICE_ALREADY_EXIST: {
    httpStatusCode: 205,
    status: { code: '00-000', message: 'Device Already Exist' },
  },
  PARTIAL_SUCCESS: {
    httpStatusCode: 206,
    status: { code: '00-001', message: 'Partial Success' },
  },
  BAD_REQUEST: {
    httpStatusCode: 400,
    status: { code: '00-002', message: 'Bad Request Error' },
  },
  UNAUTHORIZED: {
    httpStatusCode: 401,
    status: { code: '00-003', message: 'Unauthorized Permission Error' },
  },
  FORBIDDEN: {
    httpStatusCode: 403,
    status: { code: '00-004', message: 'Resource Permission Error' },
  },
  NOT_FOUND: {
    httpStatusCode: 404,
    status: { code: '00-005', message: 'Resource Not Found Error' },
  },
  INTERNAL_SERVER_ERROR: {
    httpStatusCode: 500,
    status: { code: '00-006', message: 'Internal Server Error' },
  },
  INVALID_PARAMETERS: {
    httpStatusCode: 400,
    status: { code: '00-007', message: 'Invalid Parameter Value Error' },
  },
  DM_REQUEST_ERROR: {
    httpStatusCode: 405,
    status: { code: '00-008', message: 'Device Management Request Error' },
  },
  PCC_REQUEST_ERROR: {
    httpStatusCode: 500,
    status: { code: '00-009', message: 'ProCloud Request Error' },
  },
  NO_ROLE_USER_FORBIDDEN: {
    httpStatusCode: 403,
    status: { code: '00-010', message: 'User has no role. Contact your administrator.' },
  },
};
// HTTP response code for business service
module.exports.businessExceptionCode = Object.freeze({
  DUPLICATED_NAME: {
    httpStatusCode: 400,
    status: { code: '02-001', message: 'Duplicate Name Exception' },
  },
  LIMIT_GROUP_LEVEL: {
    httpStatusCode: 401,
    status: { code: '02-002', message: 'Limited level reached Exception' },
  },
  PROPAGATION_FAILED: {
    httpStatusCode: 202,
    status: { code: '02-003', message: 'Request is accepted. but Propagation is Failed' },
  },
  PROPERTY_SYNC_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-004', message: 'Property Sync Failed Exception' },
  },
});

// HTTP response code for license service
module.exports.licenseExceptionCode = Object.freeze({
  NOT_FOUND_LICENSE: {
    httpStatusCode: 401,
    status: { code: '03-001', message: 'The business site does not currently have a license that can be assigned.' },
  },
  NOT_ASSIGN_LICENSE: {
    httpStatusCode: 401,
    status: { code: '03-002', message: 'This is a subscription license for this business.' },
  },
  NOT_WITHDRAW_LICENSE: {
    httpStatusCode: 401,
    status: { code: '03-003', message: 'This is a subscription license for this business.' },
  },
  LICENSE_LIMIT_EXCEEDED: {
    httpStatusCode: 401,
    status: { code: '03-004', message: 'The number of licenses is exceeded.' },
  },
  NOT_ENOUGH_LICENSE: {
    httpStatusCode: 401,
    status: { code: '03-005', message: 'Not enough license' },
  },
  ABNORMAL_LICENSE: {
    httpStatusCode: 401,
    status: { code: '03-006', message: 'Action result is abnormal' },
  },
  PROPAGATION_FAILED: {
    httpStatusCode: 202,
    status: { code: '03-007', message: 'Request is accepted. but Propagation is Failed' },
  },
  INVALID_DATE_FORMAT: {
    httpStatusCode: 400,
    status: { code: '03-008', message: 'Invalid date format' },
  },
});

// TODO: Construct specific HTTP response codes for each service if necessary

// HTTP response code for device provision service
module.exports.httpDeviceProvisionCode = Object.freeze({
  DB_CONNECTION_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-010', message: 'Failed to connect database' },
  },
  FAILED_TO_EXECUTE_QUERY: {
    httpStatusCode: 500,
    status: { code: '02-011', message: 'Failed to execute query' },
  },
  PROVISION_ENDPOINT_EXPIRED: {
    httpStatusCode: 400,
    status: { code: '02-012', message: 'Provision endpoint expired' },
  },
  REGISTER_DEVICE_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-013', message: 'Failed to register device' },
  },
  CREATE_X509_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-014', message: 'Failed to create X509' },
  },
  ATTACH_POLICY_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-015', message: 'Failed to attach policy to cert' },
  },
  CREATE_THING_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-016', message: 'Failed to create Thing' },
  },
  ATTACH_CERT_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-017', message: 'Failed to attach cert to thing' },
  },
  GET_IOT_ENDPOINT_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-018', message: 'Failed to get iot endpoint' },
  },
  ENCRYPTION_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-019', message: 'Failed to encrypt' },
  },
  INIT_IOTCLIENT_FAILED: {
    httpStatusCode: 500,
    status: { code: '02-020', message: 'Failed to initiate iotClient' },
  },
});

// HTTP response code for security service
module.exports.httpSecurityCode = Object.freeze({
  INVALID_SECURITY_LOG: {
    httpStatusCode: 400,
    status: { code: '09-010', message: 'Uploaded security log is invalid' },
  },
  ROUTING_SERVICE_ERROR: {
    httpStatusCode: 500,
    status: { code: '09-020', message: 'Routing Service Error' },
  },
  NOT_IMPLEMENTED: {
    httpStatusCode: 501,
    status: { code: '09-021', message: 'Not Implemented' },
  },
});

// HTTP response code for device service
module.exports.httpDeviceCode = Object.freeze({
  POLICY_ALREADY_EXIST: {
    httpStatusCode: 404,
    status: { code: '13-010', message: 'Device ID Not Found' },
  },
});
