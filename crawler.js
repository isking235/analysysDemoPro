const axios = require('axios');
const cheerio = require('cheerio');
var iconv = require('iconv-lite');
const mysql = require('mysql');  // mysql 모듈 로드
require('dotenv').config();


const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
};

const crawler  = async (eventKind) => {
    
  /**********************************************************
    1. 주식종목 url을 호출한다
    2. 항목을 cheerio로 파싱한다.
    *********************************************************/ 
    /*url을 호출 한다.
      코스피, 코스닥을 호출 했는데 코스피만오네 ...
    */
	let url = "";
	if(eventKind === "KOSPI") {
		url = "https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&orderMode=3&orderStat=D&marketType=stockMkt&searchType=13&fiscalYearEnd=all&location=all"
		
	}else if(eventKind === "KOSDAQ") {
		url = "https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&orderMode=3&orderStat=D&marketType=kosdaqMkt&searchType=13&fiscalYearEnd=all&location=all"
		
	}
	
    const response = await axios.get(url,{responseEncoding : 'binary', responseType : 'arraybuffer'});
	
    if (response.status === 200) {
      
      /*html을 읽어 한글을 읽을수 있도록 한다.*/
      const html = iconv.decode(new Buffer(response.data), 'EUC-KR').toString();
      const $ = cheerio.load(html); //jquery로 읽을수 있도록 한다.
      
     
      const scrapedData = [];
      $("body > table > tbody > tr").each((index, element) => {
        //console.log($(element).find("td")[0]); // 이상하게 긴 내용이 출력됨
        //console.log($($(element).find("td")[0]).text());

        const tds = $(element).find("td");
        const company = $(tds[0]).text().trim();
        const comNum = $(tds[1]).text().trim();
        const comkind = $(tds[2]).text().trim();
        const tableRow = { company, comNum, comkind };
        scrapedData.push(tableRow);
      });

      /*DB에 입력 해 보자*/
      var connection = mysql.createConnection(conn); // DB 커넥션 생성
      connection.connect();   // DB 접속

      /*쿼리 생성 한다.*/
      var testQuery = "";
      for(var key in scrapedData) {

        //console.log(scrapedData[key].company);
        testQuery = `INSERT INTO event_info (event_kind, event_code, company_name, reg_dtm, regr_id, mod_dtm, modr_id) VALUES('${eventKind}','${scrapedData[key].comNum}','${scrapedData[key].company}', NOW(),'LSH',NOW(), 'LSH');`;
		connection.query(testQuery, function (err, results, fields) { // testQuery 실행
			if (err) {
				console.log(err);
			}
			console.log(results);
		  });

        
      }

      console.log("lsh : 입력 종료"+eventKind);
      
      
    }

  
};

crawler("KOSPI");
crawler("KOSDAQ");