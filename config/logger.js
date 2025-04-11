const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// logs 디렉토리가 없으면 생성
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 현재 실행 중인 파일명을 기반으로 로그 파일 이름 생성
function createLogger(currentFile) {
  const baseName = path.basename(currentFile, '.js'); // 현재 파일명에서 확장자 제거
  const logFileName = `${baseName}.log`; // 로그 파일명 생성

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
      new winston.transports.File({ filename: path.join(logDir, logFileName) }), // 동적 로그 파일 경로
      new winston.transports.Console(), // 콘솔 출력 (선택 사항)
    ],
  });
}

module.exports = createLogger;