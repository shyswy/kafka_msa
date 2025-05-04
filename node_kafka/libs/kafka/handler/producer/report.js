/* eslint-disable indent */
const { KafkaProducer } = require('../../config/producer');
const shutdown = require('../../../shutdown');

let producer = null

const SEND_TIMEOUT = 10000;

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

    console.log("init producer!!@@")
  producer = new KafkaProducer({
    brokerAddresses: bList,
    clientId: 'mb-app',
    authObj,
  });

  await producer.start()

  shutdown.addCallBack('kafkaProducer', producer.shutdown);
}

async function send(topic, message){
  producer.send(topic, message)
}

// async function send(topic, message) {
//   try{
//     return await producer.send({
//       topic: topic,
//       messages: [
//         { value: JSON.stringify(message) }
//       ],
//       timeout: SEND_TIMEOUT,
//     });
//   }catch(err){
//     throw new Error(`[Fail sending Message To Kafka] ${err.message}`);
//   }
// }


module.exports = {
  init,
  send,
};
