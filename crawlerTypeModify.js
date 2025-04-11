const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const mysql = require('mysql');  // mysql 모듈 로드
require('dotenv').config();
const _ = require('lodash');
const createLogger = require('./config/logger'); // config/logger.js에서 로거 가져
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

2024-11-05 이상호 종목의 타입에 맞춰 수정 한다. 코스닥에서 코스피로 넘어가는 종목 땜시 오류가 자주 남
* */
const crawler  = async (stockKind) => {
    
  logger.info(`crawlerTypeModify.js start :${stockKind}`);
  /**********************************************************
    1. 주식종목 url을 호출한다
    2. 항목을 cheerio로 파싱한다.

    *********************************************************/ 
    /*url을 호출 한다.
      코스피, 코스닥을 호출 했는데 코스피만오네 ...
    */
	let url = "";
	if(stockKind === "KOSPI") {
		url = "https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&orderMode=3&orderStat=D&marketType=stockMkt&searchType=13&fiscalYearEnd=all&location=all"
		
	}else if(stockKind === "KOSDAQ") {
		url = "https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&orderMode=3&orderStat=D&marketType=kosdaqMkt&searchType=13&fiscalYearEnd=all&location=all"
		
	}else if(stockKind === "KONEX") {
		url = "https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&orderMode=3&orderStat=D&marketType=konexMkt&searchType=13&fiscalYearEnd=all&location=all"
		
	}

	
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
         1)목록을 객체 배열로 생성함
          scrapedData[0] = {company : zzzz, comNum : 00112, comKind : 부동산 임대}

         2) DB목록 호출함
         stocksListQuery [0] = {cmpny_nm : zzzz, stock_code : 00112}

        2.종목을 순회 한다.
        1) stockKind 종목이 DB 목록에 있는지 체크
        2) 있으면 stockKind로 수정함
        3) 없으면 지나감

        * */

        logger.debug("scrapedData:"+scrapedData.length);
        logger.debug("results:"+results.length);

        let comNum = "";
        let stockCode = "";
        //종목을 순회 한다.
        let updateCheck = false;
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
              updateCheck = true;
              break;
            }
          }
          //일치한 경우가 있으면 해당 코드의 종류를 변경하자
          if(updateCheck) {
            logger.debug("종목 종류 변경 대상 찾았다.=>"+comNum);
            let updateQuery = `UPDATE stock_info SET stock_knd = '${stockKind}', modr_id = 'LSH', MOD_DTM = NOW() WHERE stock_code = '${stockCode}'`;
            connection.query(updateQuery, function (err, results, fields) { // testQuery 실행
              if (err) {
                logger.error(err);
              }
              logger.debug(results);

            });
          }

          //logger.debug(i+"_"+comNum);
        }


       



      });

      logger.debug("lsh : 수정 종료"+stockKind);
      
      
    }

  
};

crawler("KOSPI");
crawler("KOSDAQ");
crawler("KONEX");
