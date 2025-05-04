const callbackMap = new Map();

const TYPE = {
  INTENTIONAL: 'INTENTIONAL',
  UNHANDLED: 'UNHANDLED',
  NORMAL: 'NORMAL',
  ABNORMAL: 'ABNORMAL',
};

const SERVER_STATUS = {
  SHUTDOWN: 'SHUTDOWN',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

let STATUS = SERVER_STATUS.INACTIVE;

// 등록한 리소스들에 대한 shutdown Callback 수행
async function gracefulShutdown(type = TYPE.NORMAL) {
  if (STATUS === SERVER_STATUS.SHUTDOWN || STATUS === SERVER_STATUS.INACTIVE) {
    return;
  }
  STATUS = SERVER_STATUS.SHUTDOWN;
  const tag = `[${type}]`;
  console.log(tag, 'Start Shutdown');
  await Promise.all(
    Array.from(callbackMap.entries()).map(async ([key, callback]) => {
      console.log(tag, `Running shutdown ${key}`);
      try {
        await callback();
      } catch (err) {
        console.log(tag, `Error While gracefulShutdown: ${key}`, err);
      }
    }),
  );
  callbackMap.clear();
  console.log(tag, 'End Shutdown');
}

// 종료 명령에 대한 handling
const intentionalShutdownHandler = () => {
  const signalTraps = ['SIGTERM'];
  signalTraps.forEach((type) => {
    process.once(type, async (exitCode) => {
      console.log(`[Shutdown] exitCode: ${exitCode}`);
      if (exitCode || exitCode === 0) {
        console.log(`[Shutdown] Called: ${exitCode}`);
        await gracefulShutdown(TYPE.INTENTIONAL);
      }
    });
  });
};

// 비정상 종료 명령에 대한 handling
const abnormalSignalTrapHandler = () => {
  const abnormalSignalTraps = ['SIGINT', 'SIGUSR1', 'SIGUSR2'];
  abnormalSignalTraps.forEach((type) => {
    process.once(type, async (exitCode) => {
      console.log(`signalTraps, exitCode: ${exitCode}`);
      if (exitCode || exitCode === 0) {
        console.log(`[ABNORMAL SHUTDOWN] Called: ${exitCode}`);
        await gracefulShutdown(TYPE.ABNORMAL);
      }
    });
  });
};

// handle되지 않은 에러에 대한 handling
const unexpectedErrorHandler = () => {
  const unexpectedErrorTypes = ['unhandledRejection', 'uncaughtException'];
  unexpectedErrorTypes.forEach((type) => {
    process.on(type, async (err) => {
      console.log(`[${type}]`, err);
      await gracefulShutdown(TYPE.UNHANDLED);
    });
  });
};

// 리소스명, shutdown callback
const addCallBack = (name, callback) => {
  if (!callbackMap.has(name)) {
    callbackMap.set(name, callback);
  }
};

const init = () => {
  STATUS = SERVER_STATUS.ACTIVE;
  intentionalShutdownHandler();
  abnormalSignalTrapHandler();
  unexpectedErrorHandler();
};

module.exports = {
  gracefulShutdown,
  addCallBack,
  init,
};
