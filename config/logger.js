const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
require('winston-daily-rotate-file'); // 날짜별 로그 회전을 위한 모듈

// logs 디렉토리가 없으면 생성
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 현재 실행 중인 파일명을 기반으로 로그 파일 이름 생성
function createLogger(currentFile, screenOut = true) {
  const baseName = path.basename(currentFile, '.js'); // 현재 파일명에서 확장자 제거

  // 공통 파일 트랜스포트
  const fileTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDir, `${baseName}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

  // 트랜스포트 배열 구성
  const transports = [fileTransport];
  if (screenOut) {
    transports.push(new winston.transports.Console());
  }


  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // 로그 레벨 설정 (환경 변수 또는 기본값)
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 타임스탬프 추가
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`) // 출력 포맷 설정
    ),
    transports: transports,
  });
}

module.exports = createLogger;