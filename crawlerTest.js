/*
history
2022-04-16 이상호 [CSR001]_종목별 최신을 읽어와 이후 종목 의견만 받아온다.
 */

/*
종목 정보 테이블을 읽어서 목표가및 의견 정보를 입력하자
 */
const axios = require('axios');
const mysql = require('mysql');  // mysql 모듈 로드
require('dotenv').config();


const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
};

const runFunction = (resolve,stockCode,t) => {
    console.log("sleep : "+(t/1000)+"초_stockCode : "+stockCode);
    outPutTest(stockCode); //종목코드를 보내준다.
    return resolve;
}

const outPutTest = (stockCode) => {
    console.log("outPutTest : "+stockCode);
}

function sleep(stockCode, t){
    
    return new Promise((resolve)=>setTimeout(runFunction,t,resolve,stockCode,t)); //settimeout(함수명, 시간(인터벌),...(함수의 파라미터) ) https://ko.javascript.info/settimeout-setinterval
}

const crawlerTest  = () => {
    console.log("crawlerTest start");
    /*DB에 입력 해 보자*/
    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    //let testQuery = "SELECT stock_code, cmpny_nm FROM stock_info WHERE stock_code in ('270870','067990','033500','141000');";
    let testQuery = "SELECT stock_code, cmpny_nm FROM stock_info WHERE stock_code  in ('005930') ORDER BY stock_code";
    let intever = 2000;
    let ms = 0;
    let idx = 0;
    let code = 0;

    connection.query(testQuery, function(err, results, field){
        if (err) {
            console.log(err);
        }

        for(key in results) {
            ms = (idx+1)*intever;
            
            (async function(){
                //메인 코드
                await sleep(results[key].stock_code, ms);
            })();
            idx++;
        }


    });

};
crawlerTest();
console.log("end");