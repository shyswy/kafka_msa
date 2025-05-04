/* eslint-disable indent */
const { KafkaConsumer, CONSUME_TYPE } = require('../../config/consumer');
const shutdown = require('../../../shutdown');

function getBroker() {
  const brokerEnv = process.env.COMMON_MSK_BROKER_ADDRESS;
  if (!brokerEnv) {
    console.warn("Warning: COMMON_MSK_BROKER_ADDRESS is not defined.");
    return ["localhost:9092"];
  }
  return brokerEnv.split(',');
}

function getSASL() {
  if (process?.env?.STAGE === 'local' || !process?.env?.STAGE) {
    return false;
  }
  return true;
}

async function init(processMessageFromKafka, serverName, serverInstanceId) {
  const consumerGroupId = `DEVICE-REPORT-${serverName}-${serverInstanceId}`;
  const topic = 'test-topic';
  const bList = getBroker();
  const auth = getSASL();
  const authObj = auth
    ? {
        mechanism: 'scram-sha-512',
        username: 'admin',
        password: 'msk-admin',
      }
    : false;

  const crashCallback = () => {
    console.log('crashCall Event Occur, ShutDown');
    if (shutdown) {
      shutdown.gracefulShutdown();
    } else {
      console.error('[Kafka Crash Callback Error] shutdownService or fastify not initialize');
    }
  };

  const topicConfigs = {
    topics: [topic, 'device_response'],
    fromBeginning: false,
  };

  const consumer = new KafkaConsumer({
    topicConfigs,
    consumeMethod: processMessageFromKafka,
    brokerAddresses: bList,
    clientId: 'mb-app',
    authObj,
    consumerGroupName: consumerGroupId,
    // kafka에서 non Retriable error 발생 시, handler 등록( 이 상황에서 가끔 consumer disconnect 후 reconnect X 하여 silent하게 consumer만 serve되지 않는 이슈가 있다. )
    // 보통 이 상황에선 consumer가 맛이 간 것이기 때문에 shutdown을 crashCallback으로 등록 권장.
    crashCallback,
    // batch consume에서 consume 정책
    CONSUME_TYPE: CONSUME_TYPE.PRE_COMMIT_BATCH,
  });

  await consumer.init({
    groupId: consumerGroupId,
    heartbeatInterval: 30000,
    sessionTimeout: 90000,

    // batch 사이즈 관련
    maxWaitTimeInMs: 5000, // 브로커가 데이터를 반환하기 전에 대기할 최대 시간 ( min byte 충족 x 여도 이 안에는 반환.)
    maxBytesPerPartition: 1048576, // maximum amount of data per-partition the server will return:1Byte
    minBytes: 1, // 브로커가 클라이언트에게 데이터를 반환하기 전에 수집해야 하는 최소 바이트 수
    maxBytes: 10485760, // Maximum amount accumulate in Response 10MB
    retry: 5,
  });
  shutdown.addCallBack('kafkaConsumer', consumer.shutdown);
}

module.exports = {
  init,
};
