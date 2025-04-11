const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const mysql = require('mysql');  // mysql 모듈 로드
require('dotenv').config();
const _ = require('lodash');
const createLogger = require('../config/logger'); // config/logger.js에서 로거 가져
const logger = createLogger(__filename);

const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
};
/*
1. 코스닥에서 코스피로 가는 경우 어떻게 하지?
2. 회사가 합병 하면 어떻게 하지?


2024-11-05 이상호 종목의 타입에 상관없이 입력 및 삭제 하도록 한다. 수정용 파일을 복사하였음. crawlerTypeModify.js
45
* */
const crawler  = async (stockKind) => {
    logger.info("stockList.js stock start");
    
  /**********************************************************

  1. 주식종목 url을 호출한다
    2. 항목을 cheerio로 파싱한다.

    *********************************************************/ 
    /*url을 호출 한다.
      코스피, 코스닥을 호출 했는데 코스피만오네 ...
    */
	let url = "https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&orderMode=3&orderStat=D&searchType=13&fiscalYearEnd=all&location=all";
	
	
    const response = await axios.get(url,{responseEncoding : 'binary', responseType : 'arraybuffer'});
	
    if (response.status === 200) {
      
      /*html을 읽어 한글을 읽을수 있도록 한다.*/
      const html = iconv.decode(new Buffer.from(response.data), 'EUC-KR').toString();
      const $ = cheerio.load(html); //jquery로 읽을수 있도록 한다.
      
     
      const scrapedData = [];
      $("body > table > tbody > tr").each((index, element) => {
        //logger.debug($(element).find("td")[0]); // 이상하게 긴 내용이 출력됨
        //logger.debug($($(element).find("td")[0]).text());

        const tds = $(element).find("td");
        const company = $(tds[0]).text().trim();
        const comNum = $(tds[1]).text().trim();
        const comkind = $(tds[2]).text().trim();
        const tableRow = { company, comNum, comkind };
        scrapedData.push(tableRow);
      });

      /*DB 호출*/
      let connection = mysql.createConnection(conn); // DB 커넥션 생성
      connection.connect();   // DB 접속

      /*전체 */

      let stocksListQuery = `SELECT a.stock_code, a.cmpny_nm FROM stock_info a WHERE a.delete_yn = 'N' ORDER BY stock_code`;

      connection.query(stocksListQuery, function (err, results, field) {
        if (err) {
          logger.error(err);
        }

        /*
        1. 새로운 종목 리스트와 DB에서 종목을 호출 한다.
         1)kospi 목록을 객체 배열로 생성함
          scrapedData[0] = {company : zzzz, comNum : 00112, comKind : 부동산 임대}

         2) DB목록 호출함
         stocksListQuery [0] = {cmpny_nm : zzzz, stock_code : 00112}

        2.KOSPI 종목을 순회 한다.
         1) KOSPI 종목이 DB 목록에 있는지 체크
         2) 있으면 지나감
         3) 없으면 입력함

        3.DB 목록을 순회한다.
          1) DB종목이 KOSPI 종목에 있는지 체크
          2) 있으면 지나감
          3) 없으면 delete_yn = 'Y'로 변경
        * */

        logger.debug("scrapedData:"+scrapedData.length);
        logger.debug("results:"+results.length);

        let comNum = "";
        let stockCode = "";
        //새로운 종목을 순회 한다.
        let insertCheck = false;
        for(let i=0 ; i < scrapedData.length ; i++ ) {

          comNum = scrapedData[i].comNum;
          if(_.isEmpty(comNum)) {
            continue;
          }

          //db 목록을 순회하면서 일치 한게 없으면 해당 코드는 입력 한다.
          for(let j=0; j < results.length ; j ++ ) {
            stockCode =results[j].stock_code;
            if(stockCode === comNum){
              //logger.debug("일치 찾았다=>"+stockCode);
              insertCheck = true;
              break;
            }
          }
          //일치한 경우가 없었다면 해당 코드는 db입력하자.
          if(!insertCheck) {
            logger.debug("입력대상 찾았다.=>"+comNum);
            let insertQuery = `INSERT INTO stock_info (stock_knd, stock_code, cmpny_nm, reg_dtm, regr_id, mod_dtm, modr_id, delete_yn) VALUES('${stockKind}','${scrapedData[i].comNum}','${scrapedData[i].company}', NOW(),'LSH',NOW(), 'LSH','N')`;
            connection.query(insertQuery, function (err, results, fields) { // testQuery 실행
              if (err) {
                logger.error(err);
              }
              logger.debug(results);

            });
          }

          insertCheck = false;
          //logger.debug(i+"_"+comNum);
        }


        //DB종목을 순회 한다.
        let updateCheck = false;
        for(let i=0 ; i < results.length ; i++ ) {
          stockCode =results[i].stock_code;

          //db 목록을 순회하면서 일치 한게 없으면 해당 코드는 'Y'로 수정 한다.
          for(let j=0; j < scrapedData.length ; j ++ ) {
            comNum = scrapedData[j].comNum;
            if(stockCode === comNum){
              //logger.debug("삭제 안할 놈 찾았다=>"+comNum);
              updateCheck = true;
              break;
            }
          }

          //일치한 경우가 없었다면 delete_yn을 'Y'로 수정하자.
          if(!updateCheck) {
            logger.debug("삭제 대상=>"+stockCode);
            let updateQuery = `UPDATE stock_info SET delete_yn = 'Y', MOD_DTM = NOW() WHERE stock_code = '${stockCode}'`;
            connection.query(updateQuery, function (err, results, fields) { // testQuery 실행
              if (err) {
                logger.error(err);
              }
              logger.debug(results);

            });
          }
          updateCheck = false;
        }



      });

      logger.debug("lsh : 입력 종료"+stockKind);
      
      
    }

  
};

crawler();