/* eslint-disable node/no-unpublished-require */
const reportConsumer = require('../../libs/kafka/handler/consumer/report');
// const reportConsumer = require('../../');

const extractData = (message) => {
  const data = JSON.parse(message.value.toString());
  console.log(`[Consumed Message] ${JSON.stringify(data, null, 2)}`);
  return data;
};

const processMessageFromKafka = async (messages) => {
  try {
    const dataList = messages.map((message) => {
      try {
        return extractData(message);
      } catch (err) {
        console.log(err, `[Kafka Consume Message Level Error]`);
        return null;
      }
    });
    console.log(`[message batch] ${JSON.stringify(dataList, null, 2)}`);
  } catch (err) {
    console.log(err, `[Kafka Consume Batch Level Error]`);
  }
};

async function init(serverInstanceId) {
  await reportConsumer.init(processMessageFromKafka, 'device-usage', serverInstanceId);
}

module.exports = {
  init,
};
