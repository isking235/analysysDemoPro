const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const _ = require('lodash');
const { pool, checkDBConnection } = require('../config/db'); // ✅ pool 추가 임포트

require('dotenv').config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * 업종 목록을 조회하고 저장
 */
async function saveUpjongList() {
  const url = 'https://finance.naver.com/sise/sise_group.naver?type=upjong';
  console.log(url);

  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);
  const upjongTable = $('.type_1');

  upjongTable.find('a').each((index, element) => {
    const aTag = $(element);
    const upjongName = aTag.text();
    const upjongLink = aTag.attr('href');

    if (upjongLink && upjongLink.includes('type=upjong')) {
      const noMatch = upjongLink.match(/no=(\d+)/);
      const noMatchNumber = noMatch ? noMatch[1] : null;

      console.log(`Upjong Name: ${upjongName}, Link: ${upjongLink}, noMatchNumber: ${noMatchNumber}`);

      scheduleStockSiseType(upjongLink, 'upjong', noMatchNumber, index * 1000);
      saveSiseGroup('upjong', noMatchNumber, upjongName);      
    }
  });
}

/**
 * 업종 정보를 DB에 저장
 */
async function saveSiseGroup(siseType, no, upjongName) {
  try {
    const [results] = await pool.query(
      `SELECT a.sise_grp_dtl_nm  
       FROM sise_ty_stdr a 
       WHERE a.sise_ty_code = ? AND a.sise_grp_dtl_no = ?`,
      [siseType, no]
    );

    if (results.length === 0) {
      await pool.query(
        `INSERT INTO sise_ty_stdr (
           reg_dtm, regr_id, mod_dtm, modr_id,
           sise_ty_code, sise_grp_dtl_no, sise_grp_dtl_nm
         ) VALUES (
           NOW(), 'LSH', NOW(), 'LSH',
           ?, ?, ?
         )`,
        [siseType, no, upjongName]
      );
      console.log(`업종 입력 성공: 업종=${upjongName}, 번호=${no}`);
    } else {
      for (const key in results) {
        if (
          results[key].sise_grp_dtl_nm !== null &&
          !_.isEqual(upjongName, results[key].sise_grp_dtl_nm)
        ) {
          await pool.query(
            `UPDATE sise_ty_stdr 
             SET sise_grp_dtl_nm = ?, mod_dtm = NOW(), modr_id = 'LSH'
             WHERE sise_ty_code = ? AND sise_grp_dtl_no = ?`,
            [upjongName, siseType, no]
          );
          console.log(`업종 이름 업데이트 성공: 업종=${upjongName}`);
        }
      }
    }
    console.log(`업종 저장 완료: ${upjongName}`);
  } catch (error) {
    console.error('saveSiseGroup Error:', error);
  }
}

/**
 * 특정 URL에 대해 일정 시간 후 실행
 */
function scheduleStockSiseType(url, sisteType, no, delay) {
  setTimeout(async () => {
    try {
      await saveStockSiseType(url, sisteType, no);
    } catch (error) {
      console.error(`Error processing URL ${url}:`, error);
    }
  }, delay);
}

/**
 * 종목의 시세 타입을 저장
 */
async function saveStockSiseType(url, siseType, no) {
  try {
    const stockListUrl = process.env.SISE_DOMAIN + url;
    console.log(stockListUrl);

    const response = await axios.get(stockListUrl, { responseType: 'arraybuffer', httpsAgent: agent });
    const content = iconv.decode(response.data, 'EUC-KR');
    const $ = cheerio.load(content);
    const stockTable = $('.type_5');

    stockTable.find('a').each(async (index, element) => {
      const aTag = $(element);
      const stockName = aTag.text();
      const stockLink = aTag.attr('href');

      if (stockLink && stockLink.includes('main.naver?code=')) {
        const noMatch = stockLink.match(/code=(\d+)/);
        const stockCode = noMatch ? noMatch[1] : null;

        console.log(`Stock Name: ${stockName}, Link: ${stockLink}, Code: ${stockCode}`);

        if (_.isEqual(siseType, 'upjong')) {
          await pool.query(
            `UPDATE stock_info 
             SET induty_sise_grp_dtl_no = ?, mod_dtm = NOW(), modr_id = 'LSH'
             WHERE stock_code = ?`,
            [no, stockCode]
          );
          console.log(`종목 업데이트 성공: ${stockName} (${stockCode})`);
        }
      }
    });

    console.log(`종목 저장 완료: 업종=${siseType}, 번호=${no}`);
  } catch (error) {
    console.error('saveStockSiseType Error:', error);
  }
}

// 실행
saveUpjongList();