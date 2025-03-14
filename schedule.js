const cron = require('node-cron');
const { exec } = require('child_process');

function executeFile(filename) {
  exec(`node ${filename}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${filename}:`, error);
      return;
    }
    console.log(`Output from ${filename}:`, stdout);
  });
}

//투자의견, 목표 주가 의견을 수집
cron.schedule('00 11 * * *', () => {
 executeFile('crawlerOpinion.js');
});

//시세 수집
cron.schedule('01 11 * * *', () => {
  executeFile('crawlerSise.js');
});

//주가 종목 수집
cron.schedule('30 11 * * *', () => {
  executeFile('crawler.js');
});

//종목당 타입 수집
cron.schedule('35 11 * * *', () => {
  executeFile('crawlerTypeModify.js');
});


console.log('Scheduler is running. ');