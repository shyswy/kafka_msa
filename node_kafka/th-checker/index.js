/* eslint-disable node/no-unpublished-require */
const reportConsumer = require('./consumer/report');
const shutdown = require('../libs/shutdown');
const UuidConverter = require('../libs/uuid_converter');

const serverInstanceId = UuidConverter.createThcheckerUuid();
require('dotenv').config({ path: '../config/.env' });

console.log('STAGE:', process.env.STAGE);

console.log('REGION:', process.env.REGION);
console.log('COMMON_MSK_BROKER_ADDRESS:', process.env.COMMON_MSK_BROKER_ADDRESS);

async function start() {
  await reportConsumer.init(serverInstanceId);
}

shutdown.init();
start();

// setTimeout(() => {
//   console.log("프로세스가 20초 후에 종료됩니다.");
//   process.exit(0); // 정상 종료
// }, 200000); // 20000ms = 20초
