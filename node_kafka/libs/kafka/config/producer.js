/**
 * Copyright 2023 LG Electronics Inc.
 * SPDX-License-Identifier: LicenseRef-LGE-Proprietary
 */
/* eslint-disable no-restricted-syntax */
/* eslint-disable node/no-unsupported-features/es-syntax */

// const { createKafka } = require('./utils/kafka');
const { Kafka } = require('./utils/kafka');
const { retry } = require('../../retry');

const defaultErrorCallback = () => {
  console.log('[Producer Error]');
};

class KafkaProducer extends Kafka {
  // #kafka;

  #reconnectInterval = 1000 * 10;

  #reconnectCount = 5;

  #sendTimeout = 10000;

  #kafkaTimeOut = 60000;

  #boundTime = 60000;

  #maxfastReconnectCount = 10;

  #producer = null;

  #lastConnectedTime = new Date().getTime();

  #fastReconnectCount = 0;

  #shutdownTimers = [];

  #errorCallback = defaultErrorCallback;
  // kafka send control

  constructor(initObj) {
    super(initObj.brokerAddresses, initObj.clientId, initObj.authObj);
    // this.#kafka = this.getKafka();
    this.#errorCallback = initObj.errorCallback;
  }

  #registerProducerEventHandler = async () => {
    // 끊어졌을 때 재연결.
    // await this.#producer.on(this.#producer.events.DISCONNECT, async () => {
    //   console.warn('Producer Disconnected');
    //   // if(global.CURRENT_STATUS === global.SERVER_STATUS.SHUTDOWNING){
    //   //   this.#producer = null;
    //   //   return;
    //   // }
    //   if (this.#shutdownTimers?.length > 0) {
    //     this.#removeShutdownTimers();
    //   }
    //   const reconnectResult = await this.producerReconnect();
    //   if (reconnectResult) {
    //     return;
    //   }
    //   this.#addShutdownTimer(this.#kafkaTimeOut);
    // });

    await this.#producer.on(this.#producer.events.CONNECT, (payload) => {
      console.log('Producer connected');
      console.log({
        message: 'Producer Conntected',
        context: { ...payload },
      });
      // TBD: 이미 Shutdown 중이라면, 중복 수행하지 않도록
      if (this.#shutdownTimers?.length > 0) {
        console.log('Producer Reconnect before time, cancel shutdown');
        this.#removeShutdownTimers();
      }
      const connectedTime = new Date().getTime();
      this.#periodicReconnectionChecker(connectedTime);
      this.#lastConnectedTime = connectedTime;
    });

    await this.#producer.on(this.#producer.events.REQUEST_TIMEOUT, async (payload) => {
      console.log({
        message: 'Producer Request Timeout',
        context: { ...payload },
      });
    });
  };

  #addShutdownTimer = (timeout) => {
    const timer = setTimeout(() => {
      // throw new Exception('[Producer Disconnected for long while]', httpKafkaCode.CONNECTION_FAILED);
      throw new Error('[Producer Disconnected for long while]');
    }, this.#kafkaTimeOut);
    this.#shutdownTimers.push(timer);
  };

  #removeShutdownTimers = () => {
    for (const timer of this.#shutdownTimers) {
      clearTimeout(timer);
    }
  };

  #periodicReconnectionChecker = (connectedTime) => {
    // eslint-disable-next-line no-restricted-syntax
    if (connectedTime - this.#lastConnectedTime <= this.#boundTime) {
      this.#fastReconnectCount += 1;
      if (this.#fastReconnectCount >= this.#maxfastReconnectCount) {
        // TBD: 이미 shutdown 중이면 중복 실행 하지 않도록
        console.error('[Consumer Continuously Reconnection Detected]');
        this.#errorCallback();
      }
    } else {
      this.#fastReconnectCount = 0;
    }
  };

  start = async (allowAutoTopicCreation = true) => {
    // 이런식으로 말고, 내부적으로 TYPE.AUTH, TYPE.COMMON 이런식으로  enum 유사하게 고정 값 주입 받아서, 내부적으로만 auth 하던지, non auth 하던지..?
    console.log('kafka start called');
    try {
      // this.kafkaCreateMethod = kafkaCreateMethod;
      // console.log(`brokerAddresses: ${this.brokerAddresses}, clientId: ${this.clientId}`);
      // const kafkaInstance = createKafka(this.brokerAddresses, this.clientId, this.authObj);
      this.#producer = this._kafka.producer({
        allowAutoTopicCreation,
      });
      console.log(this.#producer, 'this.#producer');
      await this.#registerProducerEventHandler();
      if (this.#producer) {
        await this.#producer.connect();
      }
    } catch (err) {
      console.log('Kafka start Error');
      throw err;
    }
  };

  producerReconnect = async () => {
    return retry(
      this.#reconnectCount,
      async () => {
        await this.shutdown();
        await this.start();
      },
      this.#reconnectInterval,
    );
  };

  send = async (topic, message) => {
    try {
      console.log(`shyswy topic: ${topic}, message: ${message}`)
      return await this.#producer.send({
        topic: topic,
        messages: [
          { value: JSON.stringify(message) }
        ],
        timeout: this.#sendTimeout,
      });
    } catch (err) {
      console.log('Error While sending Message To Kafka');
      throw err;
    }
  };

  shutdown = async () => {
    // TBD: shutdown 중이면, 중복 수행 X하도록s
    if (this.#producer) {
      await this.#producer.disconnect();
      this.#producer = null;
    }
  };
}

module.exports = {
  KafkaProducer,
};
