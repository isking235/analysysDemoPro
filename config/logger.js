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
function createLogger(currentFile) {
  const baseName = path.basename(currentFile, '.js'); // 현재 파일명에서 확장자 제거

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // 로그 레벨 설정 (환경 변수 또는 기본값)
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 타임스탬프 추가
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`) // 출력 포맷 설정
    ),
    transports: [
      // Daily Rotate File Transport 설정
      new winston.transports.DailyRotateFile({
        filename: path.join(logDir, `${baseName}-%DATE%.log`), // 날짜별 로그 파일 이름 생성
        datePattern: 'YYYY-MM-DD', // 일별로 회전
        zippedArchive: true, // 압축 저장
        maxSize: '20m', // 최대 파일 크기 (20MB)
        maxFiles: '14d', // 14일 이상된 파일 삭제
      }),
      new winston.transports.Console(), // 콘솔 출력 (선택 사항)
    ],
  });
}

module.exports = createLogger;