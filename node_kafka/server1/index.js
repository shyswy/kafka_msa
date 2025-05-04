/* eslint-disable node/no-unpublished-require */
const reportConsumer = require('./consumer/report');
const shutdown = require('../libs/shutdown');
const UuidConverter = require('../libs/uuid_converter');

// temp, 추후 request controller로.
const reportProducer = require('../libs/kafka/handler/producer/report');

const serverInstanceId = UuidConverter.createUsageUuid();
require('dotenv').config({ path: '../config/.env' });

console.log('STAGE:', process.env.STAGE);

console.log('REGION:', process.env.REGION);
console.log('COMMON_MSK_BROKER_ADDRESS:', process.env.COMMON_MSK_BROKER_ADDRESS);

async function start() {

  // reportProducer.start();
  console.log("reportProducer start22!");
  await reportProducer.init();
  // await reportProducer.send("test-topic","hi");

  setInterval(async () => {
    try {
      await reportProducer.send("test-topic", "hi");
      console.log("Message sent to test-topic");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, 10000); // 10초 = 10000ms
  

  // await reportConsumer.init(serverInstanceId);
}

shutdown.init();
start();

// setTimeout(() => {
//   console.log("프로세스가 20초 후에 종료됩니다.");
//   process.exit(0); // 정상 종료
// }, 200000); // 20000ms = 20초
