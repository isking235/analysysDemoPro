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

const opinionLoad = async (stockCode) => {

    let todayString = moment().format("YYYYMMDD");

    /*1.시작일을 뽑자
       - DB에 저장된 최대날짜를 조회
       - 최대날짜가 비었으면 19900103
       - 최대날짜가 있으면 1일을 더하자
     */

    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    let startTime;
    let maxStockDateQuery = `SELECT MAX(A.stock_date) AS max_stock_date FROM stock_price_information A WHERE A.stock_code = '${stockCode}'`;
    console.log("maxStockDateQuery:" + maxStockDateQuery);


    connection.query(maxStockDateQuery, async function (err, results, field) {
        if (err) {
            console.log(err);
        }
        //날짜값이 있는지 확인 한다.
        if (_.isDate(results[0].max_stock_date)) {
            let maxAftterOneDay = results[0].max_stock_date;
            maxAftterOneDay.setDate(results[0].max_stock_date.getDate() + 1);
            startTime = moment(maxAftterOneDay).format("YYYYMMDD");

        } else {
            startTime = moment("1990-01-01", "YYYY-MM-DD").format("YYYYMMDD");
        }

        console.log("maxStockDate:" + startTime);

        //금일날짜가 최신 날짜와 같거나 미래이면 수행 하지 않고 끝낸다.
        if (todayString == startTime) {
            console.log("수행할게 없습니다.\n");
            connection.end();
            return null;
        }

        /*
            2.시세를 조회한다.
         */
        const siseUrl = `https://api.finance.naver.com/siseJson.naver?symbol=${stockCode}&requestType=1&startTime=${startTime}&endTime=${todayString}&timeframe=day`;
        console.log("siseUrl:" + siseUrl);

        const response = await axios.get(siseUrl);

        if (response.status === 200) {

            /*
                3.시세를 입력한다.
             */


            let sise = eval(response.data);
            if(sise.length <= 1 ){
                console.log("헤더만 들어오는 경우 처리 하지 않습니다.");
                return null;
            }
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
            //console.log("values"+values);

            //날짜 항목 입력하기
            let todayDateTime = moment().format('YYYYMMDDHHmmss');
            values.forEach((v, i) => {
                values[i].splice(0, 0, todayDateTime, 'lsh', todayDateTime, 'lsh', stockCode);
            });

            let insertQuery = "INSERT INTO stock.stock_price_information (reg_dtm,regr_id,mod_dtm,modr_id,stock_code, stock_date, market_price, high_price, low_price, closing_price, trading_volume,foreign_burnout_rate) values ?;";
            const query_str = connection.query(insertQuery, [values], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            //console.log("query_str.sql:" + query_str.sql); // SQL Query문 출력
            console.log("종목 :" + stockCode + " 시세조회 완료\n");



        }//if
        connection.end();

    });


    return null;
};

const runFunction = (resolve,stockCode,t) => {
    console.log("sleep : "+(t/1000)+"초_stockCode : "+stockCode);
    opinionLoad(stockCode); //종목코드를 보내준다.
    return resolve;
}

function sleep(stockCode, t){
    
    return new Promise((resolve)=>setTimeout(runFunction,t,resolve,stockCode,t)); //settimeout(함수명, 시간(인터벌),...(함수의 파라미터) ) https://ko.javascript.info/settimeout-setinterval
}

const crawlerSise  = () => {
    console.log("crawlerSise start");
    /*DB에 입력 해 보자*/
    let connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code in ('270870','067990','033500','141000');";
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code IN ('005930','005380','005490') ORDER BY stock_code";
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE stock_code IN ('000040') ORDER BY stock_code";
    //let testQuery = "SELECT stock_code, company_name FROM stocks_info WHERE DEL_YN='N' AND stock_code >= '343510' ORDER BY stock_code";
    let testQuery = "SELECT \n" +
        "      stock_code, company_name\n" +
        "  FROM stocks_info A\n" +
        " WHERE A.DEL_YN='N'\n" +
        "    AND A.stock_code NOT IN (\n" +
        "    SELECT distinct z.stock_code FROM stock_price_information z WHERE  reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')\n" +
        "    )\n" +
        " ORDER BY A.stock_code";

    let intever = 2000;
    let ms = 0;
    let idx = 0;
    let code = 0;

    connection.query(testQuery, function(err, results, field){
        if (err) {
            console.log(err);
        }
        console.log("종목시세 수집대상 갯수: " + results.length);

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
crawlerSise();
console.log("end");