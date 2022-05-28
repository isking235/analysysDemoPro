/*
history
2022-05-22 이상호 [CSR002]_종목별 시세를 저장한다.
 */

/*
종목 정보 테이블을 읽어서 목표가및 의견 정보를 입력하자
 */
const axios = require('axios');
const mysql = require('mysql');  // mysql 모듈 로드
const moment = require('moment');
const _ = require('lodash');


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

    return date.getFullYear() + month +  day;
}

const opinionLoad = async (eventCode) => {

    let today = new Date();
    let todayString = dateFormat(today).replace('/', '');

    /*1.시작일을 뽑자
       - DB에 저장된 최대날짜를 조회
       - 최대날짜가 비었으면 19900103
       - 최대날짜가 있으면 1일을 더하자
     */

    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    let startTime;
    let maxStockDateQuery = `SELECT MAX(A.stock_date) AS max_stock_date FROM stock_price_information A WHERE A.event_code = '${eventCode}'`;
    console.log("maxStockDateQuery:" + maxStockDateQuery);


    connection.query(maxStockDateQuery, async function (err, results, field) {
        if (err) {
            console.log(err);
        }
        //날짜값이 있는지 확인 한다.
        if (_.isDate(results[0].max_stock_date)) {
            const maxAftterOneDay = new Date();
            maxAftterOneDay.setDate(results[0].max_stock_date.getDate() + 1);
            startTime = dateFormat(maxAftterOneDay);

        } else {
            startTime = moment("1990-01-01", "YYYY-MM-DD").format("YYYYMMDD");
        }

        console.log("maxStockDate:" + startTime);

        //금일날짜가 최신 날짜와 같거나 미래이면 수행 하지 않고 끝낸다.
        if (todayString == startTime) {
            console.log("수행할게 없습니다.\n");
            return null;
        }

        /*
            2.시세를 조회한다.
         */
        const siseUrl = `https://api.finance.naver.com/siseJson.naver?symbol=${eventCode}&requestType=1&startTime=${startTime}&endTime=${todayString}&timeframe=day`;
        console.log("siseUrl:" + siseUrl);

        const response = await axios.get(siseUrl);

        if (response.status === 200) {

            /*
                3.시세를 입력한다.
             */

            let sise = eval(response.data);
            //sis를 순회한다.
            /* forEach
            sise.forEach((v,i)=> {
                console.log(i+'_'+v+'_'+v[0]);
            });*/

            /* for
            for(let i = 0 ; i < sise.length ; i++) {
                console.log(sise[i]);
            }*/

            //외국인 소진율이 ,만 있으면 배열에서 삭제 되어 Column count doesn't match value count at row 1 오류가 발생한다.
            //head 행의 길이 보다 작으면 행의 마지막 길이 부분에 '0'을 넣자
            sise.forEach((v, i) => {
                if (sise[0].length != sise[i].length) {
                    sise[i].splice(sise[0].length - 1, 0, 0);
                }

            });

            //날짜 항목을 가진 행을 삭제
            let values = sise.filter((v, i) => {
                //console.log(i+'_'+v+'_'+v[0]);
                return v[0] !== '날짜';
            });

            //날짜 항목 입력하기
            let todayDateTime = moment().format('YYYYMMDDHHmmss');
            values.forEach((v, i) => {
                values[i].splice(0, 0, todayDateTime, 'lsh', todayDateTime, 'lsh', eventCode);
            });

            let insertQuery = "INSERT INTO stock.stock_price_information (reg_dtm,regr_id,mod_dtm,modr_id,event_code, stock_date, market_price, high_price, low_price, closing_price, trading_volume,foreign_burnout_rate) values ?;";
            const query_str = connection.query(insertQuery, [values], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            //console.log("query_str.sql:" + query_str.sql); // SQL Query문 출력
            console.log("종목 :" + eventCode + " 시세조회 완료\n");
            connection.end();


        }//if


    });


    return null;
};

const runFunction = (resolve,eventCode,t) => {
    console.log("sleep : "+(t/1000)+"초_eventCode : "+eventCode);
    opinionLoad(eventCode); //종목코드를 보내준다.
    return resolve;
}

function sleep(eventCode, t){
    
    return new Promise((resolve)=>setTimeout(runFunction,t,resolve,eventCode,t)); //settimeout(함수명, 시간(인터벌),...(함수의 파라미터) ) https://ko.javascript.info/settimeout-setinterval
}

const crawlerSise  = () => {
    console.log("crawlerSise start");
    /*DB에 입력 해 보자*/
    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    //let testQuery = "SELECT event_code, company_name FROM event_info WHERE event_code in ('270870','067990','033500','141000');";
    let testQuery = "SELECT event_code, company_name FROM event_info WHERE EVENT_CODE IN ('005930','005380','005490') ORDER BY event_code";
    //let testQuery = "SELECT event_code, company_name FROM event_info WHERE EVENT_CODE IN ('005380') ORDER BY event_code;";
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
                await sleep(results[key].event_code, ms);
            })();
            idx++;
        }


    });

};
crawlerSise();
console.log("end");