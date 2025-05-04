/* eslint-disable node/no-unsupported-features/es-syntax */
/**
 * Copyright 2023 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */
const _ = require('lodash');
const mysql = require('mysql2');
const { Logger } = require('./logger');
const { Exception } = require('./exception');
const { httpCommonCode } = require('./response_code');

module.exports.RDB = class {
  // Declare private instance member
  #dbConnection = null;

  #logger;

  constructor(event = null, context = null) {
    this.#logger = new Logger({
      ...(!_.isNil(context?.functionName) && { lambdaId: context?.functionName }),
      ...(!_.isNil(event?.headers?.['x-message-id']) && { messageId: event?.headers?.['x-message-id'] }),
      component: 'libRDB',
    });

    try {
      this.#dbConnection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.SCHEMANAME,
        namedPlaceholders: true,
        connectTimeout: 30000, // 타임아웃 시간 (밀리초 단위)
      });
    } catch (err) {
      this.#logger.error('Failed to connect database:', err);
      this.#logger.error('Failed to connect database:', err.message).end();
      throw new Exception(httpCommonCode.INTERNAL_SERVER_ERROR);
    }
  }

  // Must call after completion of use DB
  end() {
    try {
      if (!this.#dbConnection) {
        return;
      }

      this.#dbConnection.end();
      this.#dbConnection = null;

      this.#logger.end();
    } catch (err) {
      this.#logger.error('Failed to clear database connection:', err);
      this.#logger.error('Failed to clear database connection:', err.message).end();
      throw new Exception(httpCommonCode.INTERNAL_SERVER_ERROR);
    }
  }

  // start transaction
  beginTransaction() {
    this.#dbConnection.beginTransaction();
  }

  // commit transaction. Must call after beginTransaction in normal case
  commit() {
    this.#dbConnection.commit();

    return this;
  }

  // rollback transaction. Must call after beginTransaction in error case
  rollback() {
    this.#dbConnection.rollback();

    return this;
  }

  // provide formatted query and params.
  // Especially make to use execute bulk insert queries.
  format(query, params = undefined) {
    return this.#dbConnection.format(query, params);
  }

  // execute a query without transaction using async-await.
  // Recommend to execute with/without transaction select queries or multiple queries carefully.
  async execute(query, params = undefined) {
    this.#logger.debug(`query: ${query}, params: ${JSON.stringify(params)}`);

    try {
      if (!this.#dbConnection) {
        throw new Error('No Connection');
      }
      const [data, fields] = await this.#dbConnection.promise().query(this.format(query, params));

      if (fields) {
        this.#logger.debug('Fields:', fields);
      }
      this.#logger.debug('Result:', data);

      return data;
    } catch (err) {
      this.#logger.error('Failed to execute query:', err);
      this.#logger.error('Failed to execute query:', err.message).end();
      throw new Exception(httpCommonCode.INTERNAL_SERVER_ERROR);
    }
  }

  // execute a query without transaction using Promise.
  // Recommend to execute with/without transaction select queries or multiple queries carefully.
  executePromise(query, params = undefined) {
    this.#logger.debug(`query: ${query}, params: ${params}`);

    return new Promise((resolve, reject) => {
      this.#dbConnection.execute(this.format(query, params), (err, data, fields) => {
        if (err) {
          this.#logger.error('Failed to execute promise query:', err);
          this.#logger.error('Failed to execute promise query:', err.message).end();
          reject(new Exception(httpCommonCode.INTERNAL_SERVER_ERROR));
          return;
        }

        if (fields) {
          this.#logger.debug('Fields:', fields);
        }
        this.#logger.debug('Result:', data);

        resolve(data);
      });
    });
  }

  // execute a query with transaction.
  // Recommend to execute one insert/update/delete query.
  async executeWithTransaction(query, params = undefined) {
    try {
      this.#dbConnection.beginTransaction();
      const data = await this.execute(query, params);
      this.#dbConnection.commit();

      return data;
    } catch (err) {
      this.#dbConnection.rollback();
      this.#logger.error('Failed to execute transaction:', err);
      this.#logger.error('Failed to execute transaction:', err.message).end();
      throw new Exception(httpCommonCode.INTERNAL_SERVER_ERROR);
    }
  }

  // explain a query
  explain(query, params = undefined) {
    return this.execute(`EXPLAIN ${query}`, params);
  }
};
