/*
history
2022-04-16 이상호 [CSR001]_종목별 최신을 읽어와 이후 종목 의견만 받아온다.
 */

/*
종목 정보 테이블을 읽어서 목표가및 의견 정보를 입력하자
 */
const axios = require('axios');
const mysql = require('mysql');
const moment = require("moment");  // mysql 모듈 로드
require('dotenv').config();


const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
};

/*
2022-04-16 날짜를 datetime 포멧으로 가져온다.
**/
function datetimeFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

/*
2022-04-16 날짜를 date 포멧으로 가져온다.
**/
function dateFormat(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '/' + month + '/' + day;
}

const opinionLoad = async(stockCode) => {

    let opinionUrl = `http://m.comp.fnguide.com/m2/data/json/chart/01_02/chart_A${stockCode}.json`;
    console.log("opinionLoad.opinionUrl :"+ opinionUrl);



    const response = await axios.get(opinionUrl);

    if (response.status === 200) {

        const opnions = JSON.stringify(response.data, null, 2); //API를 json으로 받아 온다.
        //console.log(opnions);
        const obj = JSON.parse(opnions); //json을 객체화
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

            console.log("results:"+results);

            for(key in results) {
                if(results[key].max_opinion_date !== null) {
                    maxOpinionDate = dateFormat(results[key].max_opinion_date);
                }else {
                    maxOpinionDate = moment("1990-01-01", "YYYY-MM-DD").format("YYYYMMDD");
                }

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
    opinionLoad(stockCode); //종목코드를 보내준다.
    return resolve;
}

function sleep(stockCode, t){
    
    return new Promise((resolve)=>setTimeout(runFunction,t,resolve,stockCode,t)); //settimeout(함수명, 시간(인터벌),...(함수의 파라미터) ) https://ko.javascript.info/settimeout-setinterval
}

const crawlerOpinion  = () => {
    console.log("crawlerOpinion start");
    /*DB에 입력 해 보자*/
    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code in ('089860');";
    let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE DEL_YN='N' ORDER BY stock_code";
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code >  '089860'  ORDER BY stock_code";
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
crawlerOpinion();
console.log("end");