require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // 최대 연결 수
  queueLimit: 0,       // 대기열 제한 없음
});

/**
 * 데이터베이스 연결 확인 함수
 */
async function checkDBConnection() {
  try {
    const connection = await pool.getConnection(); // 연결 가져오기
    console.log('데이터베이스 연결 성공');
    connection.release(); // 연결 반환
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error.message);
    throw error; // 에러를 호출한 쪽으로 전달
  }
}

module.exports = { pool, checkDBConnection };