const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const { pool } = require('../config/db'); //pool 추가 임포트
const _ = require('lodash');

require('dotenv').config();
const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * 특정 URL에 대해 일정 시간 후 실행
 */
async function scheduleStockSiseType(logger, url, sisteType, siseGrpDtlNo, delay) {
  logger.info(`saveUpjongList() url:${url}, sisteType:${sisteType}, siseGrpDtlNo:${siseGrpDtlNo}`);  
  setTimeout(async () => {    
      await saveStockSiseType(logger, url, sisteType, siseGrpDtlNo);
  }, delay);
}

/**
 * 종목의 시세 타입을 저장
 * @param {*} url 
 * @param {*} siseTyCode 
 * @param {*} siseGrpDtlNo 
 */
async function saveStockSiseType(logger, url, siseTyCode, siseGrpDtlNo) {
  logger.info(`saveStockSiseType() url:${url}, siseTyCode:${siseTyCode}, siseGrpDtlNo:${siseGrpDtlNo}`);  
  const stockListUrl = process.env.SISE_DOMAIN + url;
  logger.debug(stockListUrl);
  /*if(siseGrpDtlNo ==='314'){
    throw new Error('error test');
  }*/

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

      logger.debug(`Stock Name: ${stockName}, Link: ${stockLink}, Code: ${stockCode}`);

      if (_.isEqual(siseTyCode, 'upjong')) {
        await pool.query(
          `UPDATE stock_info 
            SET induty_sise_grp_dtl_no = ?, mod_dtm = NOW(), modr_id = 'LSH'
            WHERE stock_code = ?`,
          [siseGrpDtlNo, stockCode]
        );
        logger.debug(`종목 업종 업데이트 성공: ${stockName} (${stockCode})`);
      } 
      else if (_.isEqual(siseTyCode, 'group')) {
        await pool.query(
          `UPDATE stock_info 
            SET grp_sise_grp_dtl_no = ?, mod_dtm = NOW(), modr_id = 'LSH'
            WHERE stock_code = ?`,
          [siseGrpDtlNo, stockCode]
        );
        logger.debug(`종목 그룹 업데이트 성공: ${stockName} (${stockCode})`);
      }
      else if (_.isEqual(siseTyCode, 'theme')) { //테마인경우 insert 한다.
        try{
          await pool.query(
            `INSERT INTO stock_by_thema_info (
                reg_dtm, regr_id, mod_dtm, modr_id,
                stock_code, sise_ty_code, ty_dtl_no
            ) VALUES (
                NOW(), 'LSH', NOW(), 'LSH',
                ?, ?, ?
            )`,
            [stockCode, 'theme', siseGrpDtlNo]
          );
        }catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.warn('Duplicate entry detected. Skipping...');
          } else {
            console.error('Error during insert:', err.message);
            throw err; // 다른 오류는 재발생시킴
          }
        }
        logger.debug(`종목 테마 입력 성공: ${stockName} (${stockCode})`);
      }
    }
  });

  logger.debug(`종목 저장 완료: 업종=${siseTyCode}, 번호=${siseGrpDtlNo}`);
  
}

/**
 * 시세 정보를 시세타입기준 테이블에 저장
 * @param {*} siseTyCode 
 * @param {*} siseGrpDtlNo 
 * @param {*} siseGrpDtlNm 
 */
async function saveSiseGroup(logger, siseTyCode, siseGrpDtlNo, siseGrpDtlNm) {
  logger.info(`saveSiseGroup() siseTyCode:${siseTyCode}, siseGrpDtlNo:${siseGrpDtlNo}, siseGrpDtlNm:${siseGrpDtlNm}`);  

  const [results] = await pool.query(
    `SELECT a.sise_grp_dtl_nm  
      FROM sise_ty_stdr a 
      WHERE a.sise_ty_code = ? AND a.sise_grp_dtl_no = ?`,
    [siseTyCode, siseGrpDtlNo]
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
      [siseTyCode, siseGrpDtlNo, siseGrpDtlNm]
    );
    logger.debug(`시세 입력 성공: 시세타입=${siseTyCode}, 시세=${siseGrpDtlNm}, 번호=${siseGrpDtlNo}`);
  } else {
    for (const key in results) {
      if (
        results[key].sise_grp_dtl_nm !== null &&
        !_.isEqual(siseGrpDtlNm, results[key].sise_grp_dtl_nm)
      ) {
        await pool.query(
          `UPDATE sise_ty_stdr 
            SET sise_grp_dtl_nm = ?, mod_dtm = NOW(), modr_id = 'LSH'
            WHERE sise_ty_code = ? AND sise_grp_dtl_no = ?`,
          [siseGrpDtlNm, siseTyCode, siseGrpDtlNo]
        );
        logger.debug(`시세 이름 업데이트 성공: 시세타입=${siseTyCode}, 시세=${siseGrpDtlNm}, 번호=${siseGrpDtlNo}`);
      }
    }
  }
}

module.exports = {
    scheduleStockSiseType,
    saveSiseGroup
}