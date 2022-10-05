
/*
종목 정보 테이블을 읽어서 목표가및 의견 정보를 입력하자
이건 사용 안함

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

const stockPriceLoad = async(stockCode) => {

    let stockPriceUrl = `http://m.comp.fnguide.com/m2/data/json/chart/01_02/chart_A${stockCode}.json`;
    console.log("stockPriceLoad.stockPriceUrl :"+ stockPriceUrl);

    const response = await axios.get(stockPriceUrl);

    if (response.status === 200) {

        const stockPrice = JSON.stringify(response.data, null, 2); //API를 json으로 받아 온다.
        //console.log(stockPrice);
        const obj = JSON.parse(stockPrice); //json을 객체화
        //console.log(obj.CHART);
        const list = obj.CHART;

        let connection = mysql.createConnection(conn); // DB 커넥션 생성
        connection.connect();   // DB 접속

        /*[CSR001]_종목별 최신을 읽어와 이후 종목 의견만 받아온다*/
        let maxOpinionDate = '';
        let maxOpinionDateQuery = `SELECT MAX(A.opinion_date) AS max_opinion_date FROM opinion_target_price A WHERE A.stock_code = '${stockCode}'`;

        connection.query(maxOpinionDateQuery, function(err, results, field) {
            if (err) {
                console.log(err);
            }

            for(key in results) {
                maxOpinionDate = dateFormat(results[key].max_opinion_date);
            }

            let insertQuery = '';

            for(key in list) {
                if(list[key].TRD_DT > maxOpinionDate) {
                    //console.log(list[key].TRD_DT);
                    insertQuery = `INSERT INTO stock.opinion_target_price (reg_dtm,regr_id,mod_dtm,modr_id,stock_code, opinion_date, investment_opinion, target_price, revised_stock_price)
                                    VALUES (NOW(),'LSH',NOW(),'LSH','${stockCode}','${list[key].TRD_DT}','${list[key].VAL1}','${list[key].VAL2}','${list[key].VAL3}');`;

                    connection.query(insertQuery, function (err, results, fields) { // insertQuery 실행
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            console.log("종목 :"+stockCode+" 입력 완료");
            connection.end();

        });
    }
};

const runFunction = (resolve,stockCode,t) => {
    console.log("sleep : "+(t/1000)+"초_stockCode : "+stockCode);
    stockPriceLoadTest(stockCode); //종목코드를 보내준다.
    return resolve;
}

function sleep(stockCode, t){

    return new Promise((resolve)=>setTimeout(runFunction,t,resolve,stockCode,t)); //settimeout(함수명, 시간(인터벌),...(함수의 파라미터) ) https://ko.javascript.info/settimeout-setinterval
}

const stockPriceLoadTest = async(stockCode) => {

    let stockPriceUrl = `https://api.finance.naver.com/siseJson.naver?symbol=${stockCode}&requestType=1&startTime=20220401&endTime=20220417&timeframe=day`;
    console.log("stockPriceLoad.stockPriceUrl :"+ stockPriceUrl);

    const response = await axios.get(stockPriceUrl);

    if (response.status === 200) {

        const stockPrice = JSON.stringify(response.data, null, 2); //API를 json으로 받아 온다.
		
        console.log(stockPrice);
        const obj = JSON.parse('{'+stockPrice+'}'); //json을 객체화
        console.log(obj);
        //console.log(obj.CHART);
    }

};

const crawlerStockPrice  = () => {
    console.log("crawlerEventOpinion start");
    /*DB에 입력 해 보자*/
    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code in ('270870','067990','033500','141000');";
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code in ('005930') ORDER BY stock_code";
    let testQuery = "SELECT stock_code, company_name FROM stocks_info ORDER BY stock_code";
    let intever = 2000;
    let ms = 0;
    let idx = 0;

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

crawlerStockPrice();
console.log("crawlerStockPrice end");