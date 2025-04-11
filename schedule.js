const cron = require('node-cron');
const { exec } = require('child_process');

function executeFile(filename) {
  console.log(`${filename} 실행`);
  exec(`node ${filename}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${filename}:`, error);
      return;
    }
    if(stderr){
      console.error(`Output from ${filename}: ${stderr}`);
    }
    console.log(`Output from ${filename}:`, stdout);
    console.log(`${filename} 종료`);
  });
}

//투자의견, 목표 주가 의견을 수집
cron.schedule('00 11 * * *', () => {
 executeFile('./crawlersStock/opinion.js');
});

//시세 수집
cron.schedule('01 11 * * *', () => {
  executeFile('./crawlersStock/sise.js');
});

//주가 종목 수집
cron.schedule('30 11 * * *', () => {
  executeFile('./crawlersStock/stockList.js');
});

//종목당 타입 수집
cron.schedule('35 11 * * *', () => {
  executeFile('./crawlersStock/typeModify.js');
});


console.log('Scheduler is running. ');