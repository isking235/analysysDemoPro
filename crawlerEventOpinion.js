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

const opinionLoad = async(eventCode) => {

    let opinionUrl = `http://m.comp.fnguide.com/m2/data/json/chart/01_02/chart_A${eventCode}.json`;
    console.log("opinionLoad.opinionUrl :"+ opinionUrl);

    const response = await axios.get(opinionUrl);

    if (response.status === 200) {
        const opnions = JSON.stringify(response.data, null, 2); //API를 json으로 받아 온다.
        //console.log(opnions);
        const obj = JSON.parse(opnions); //json을 객체화
        //console.log(obj.CHART);
        const list = obj.CHART;

        var connection = mysql.createConnection(conn); // DB 커넥션 생성
        connection.connect();   // DB 접속

        for(key in list) {
            //console.log(list[key].TRD_DT);
            testQuery = `INSERT INTO stock.opinion_target_price (reg_dtm,regr_id,mod_dtm,modr_id,event_code, opinion_date, investment_opinion, target_price, revised_stock_price) 
            VALUES (NOW(),'LSH',NOW(),'LSH','${eventCode}','${list[key].TRD_DT}','${list[key].VAL1}','${list[key].VAL2}','${list[key].VAL3}');`;
            
            connection.query(testQuery, function (err, results, fields) { // testQuery 실행
                if (err) {
                    console.log(err);
                }
            });
        }

        console.log("종목:"+eventCode)+"완료";
        connection.end();

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

const crawlerEventOpinion  = () => {
    console.log("crawlerEventOpinion start");
    /*DB에 입력 해 보자*/
    var connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    //var testQuery = "SELECT event_code, company_name FROM event_info WHERE event_code in ('270870','067990','033500','141000');";
    var testQuery = "SELECT event_code, company_name FROM event_info ORDER BY event_code;";
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
crawlerEventOpinion();
console.log("end");