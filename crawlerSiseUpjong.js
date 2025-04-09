const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const mysql = require('mysql');
const _ = require('lodash');

require('dotenv').config();

const agent = new https.Agent({
      rejectUnauthorized: false
    });

const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
};    
/*
    
    1. 페이지를 loof를 수행 하며 업종 목록을 조회 
    2. 각 목록을 DB에 저장
    */

async function saveUpjongList() {
  const url = 'https://finance.naver.com/sise/sise_group.naver?type=upjong';
  console.log(url);
  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);
  const upjongTable  = $('.type_1');

    upjongTable.find('a').each((index,element) => {
      // 각 <a> 태그에 대한 작업 수행
      const aTag = $(element); // Cheerio 객체로 변환
      const upjongName = aTag.text(); // 업종 이름 가져오기
      const upjongLink = aTag.attr('href'); // 업종 링크 가져오기

      if (upjongLink && upjongLink.includes('type=upjong')) {
        const noMatch = upjongLink.match(/no=(\d+)/); //no= 이후 숫자를 가져온다.
        const noMatchNumber = noMatch ? noMatch[1] : null; //숫자가 있는 경우  noMatchNumber 입력
        console.log(`Upjong Name: ${upjongName}, Link: ${upjongLink}, noMatchNumber: ${noMatchNumber}`);

        scheduleStockSiseType(upjongLink, 'upjong', noMatchNumber , index * 1000); // 업종에 해당하는 종목을 조회한다.
        saveSiseGroup('upjong', noMatchNumber,  upjongName);

        /*if(index == 1) {
          return false;
        }*/

       }
  });
  
}

function saveSiseGroup(siseType, no, upjongName) {

  let connection = mysql.createConnection(conn); // DB 커넥션 생성
  connection.connect();   // DB 접속

  let siseGrpDtlName = `SELECT a.sise_grp_dtl_nm  
                          FROM sise_ty_stdr a 
                        WHERE a.sise_ty_code = '${siseType}' AND a.sise_grp_dtl_no = '${no}'`;


  //console.log(siseGrpDtlName);
  //시세그룹이 존재 하는지 확인
  connection.query(siseGrpDtlName, function(err, results, field) {
    
    if (err) {
        console.log(err);
    }

    if (results.length === 0) { //조회 값이 없다면
        //입력
        let insertQuery = `INSERT INTO sise_ty_stdr (
                              reg_dtm, regr_id, mod_dtm, modr_id,
                              sise_ty_code, sise_grp_dtl_no, sise_grp_dtl_nm
                          ) VALUES (
                              NOW(), 'LSH', NOW(), 'LSH',
                              '${siseType}', '${no}', '${upjongName}'
                          )`;

        connection.query(insertQuery, function (err, results, fields) {
          if (err) {
            console.log(err);
          }
          console.log(`업종 입력 결과 성공 업종:${upjongName}, no${no}`);
          connection.end();

        });
    }
    else { //조회 값이 있다면 
      for(key in results) {
        console.log(`시세 상세명 :${results[key].sise_grp_dtl_nm}`);
        if(results[key].sise_grp_dtl_nm !== null && !_.isEqual(upjongName, results[key].sise_grp_dtl_nm) ) { //sise_grp_dtl_nm이 null이 아니고 이름이 일지 하지 않으면 이름을 수정한다.
          //수정
          let updateQuery = `UPDATE sise_ty_stdr a
                          SET sise_grp_dtl_nm = '${upjongName}',
                              a.mod_dtm = NOW(),
                              a.modr_id = 'LSH'
                        WHERE sise_ty_code = '${siseType}'
                        AND sise_grp_dtl_no = '${no}'`;
          //console.log(updateQuery);
          connection.query(updateQuery, function (err, results, fields) {
            if (err) {
              console.log("update sise_grp_dtl_nm:"+err);
            }
            console.log("update sise_grp_dtl_nm:"+upjongName);

          });
        }
      }
  }

   
  });

  console.log("업종 :"+upjongName+" 저장 완료");
  

}

/**
 * 특정 URL에 대해 일정 시간 후 실행
 * @param {string} url - 업종 URL
 * @param {number} delay - 지연 시간 (ms)
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
 * 종목의 시세 타입을 저장한다.
 * @param {*} url 
 */
async function saveStockSiseType(url, siseType, no) {

   let connection = mysql.createConnection(conn); // DB 커넥션 생성
   connection.connect();   // DB 접속

  
  const stockListUrl = process.env.SISE_DOMAIN + url;
  console.log(stockListUrl);
  const response = await axios.get(stockListUrl, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);
  const stockTable  = $('.type_5');
    stockTable.find('a').each((index,element) => {
      // 각 <a> 태그에 대한 작업 수행
      const aTag = $(element); // Cheerio 객체로 변환
      const stockName = aTag.text(); // 업종 이름 가져오기
      const stockLink = aTag.attr('href'); // 업종 링크 가져오기
       if (stockLink && stockLink.includes('main.naver?code=')) {
        
        const noMatch = stockLink.match(/code=(\d+)/); //no= 이후 숫자를 가져온다.
        const stockCode = noMatch ? noMatch[1] : null; //숫자가 있는 경우  noMatchNumber 입력
        console.log(`stock Name: ${stockName}, Link: ${stockLink}, code: ${stockCode}`);

        //종목의 업종코드를 수정한다.
        //수정
        if(_.isEqual(siseType,'upjong')) {
          let updateQuery = `UPDATE stock_info a
                              SET a.induty_sise_grp_dtl_no = ${no},
                                  a.mod_dtm = NOW(),
                                  a.modr_id = 'LSH'
                            WHERE a.stock_code = ${stockCode}`;

        connection.query(updateQuery, function (err, results, fields) {
          if (err) {
            console.log("saveStockSiseType:"+err);
          }
          console.log("saveStockSiseType:"+results.changedRows);

        });
        
       }
      }
       
      
  });

  console.log(`종목의 업종 저장 완료:${siseType} 번호:${no}`);
  connection.end();

}

  
//업종 목록을 조회 
saveUpjongList()