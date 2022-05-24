/*
history
2022-05-22 이상호 [CSR002]_종목별 시세를 저장한다.
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

const opinionLoad = async(eventCode) => {

    let today = new Date();
    let todayString  = dateFormat(today).replace('/','');


    let siseUrl = `https://api.finance.naver.com/siseJson.naver?symbol=${eventCode}&requestType=1&startTime=20220511&endTime=${todayString}&timeframe=day`;
    const response = await axios.get(siseUrl);

    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    if (response.status === 200) {
        let sise = eval(response.data);
        //console.log("sise[0]:"+sise[0]);
        //sise.forEach(element => console.log(element[0]+","+element[1]));
        let values = "";

        for(let i = 1 ; i < sise.length ; i++) {
            console.log(sise[i]);
        }

        let insertQuery = '';

    }//if

    console.log("종목 :"+eventCode+" 시세조회 완료");
    connection.end();


    return null;







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
        let maxOpinionDateQuery = `SELECT MAX(A.opinion_date) AS max_opinion_date FROM opinion_target_price A WHERE A.event_code = '${eventCode}'`;

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
                    insertQuery = `INSERT INTO stock.opinion_target_price (reg_dtm,regr_id,mod_dtm,modr_id,event_code, opinion_date, investment_opinion, target_price, revised_stock_price)
                                    VALUES (NOW(),'LSH',NOW(),'LSH','${eventCode}','${list[key].TRD_DT}','${list[key].VAL1}','${list[key].VAL2}','${list[key].VAL3}');`;

                    connection.query(insertQuery, function (err, results, fields) { // insertQuery 실행
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
            console.log("종목 :"+eventCode+" 입력 완료");
            connection.end();

        });
    }
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
    //let testQuery = "SELECT event_code, company_name FROM event_info WHERE EVENT_CODE IN ('005930','005380','005490') ORDER BY event_code";
    let testQuery = "SELECT event_code, company_name FROM event_info WHERE EVENT_CODE IN ('005930') ORDER BY event_code";
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