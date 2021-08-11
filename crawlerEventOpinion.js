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

const opinionLoad = async(opinionUrl) => {
    console.log("opinionLoad.opinionUrl :"+ opinionUrl);

    const response = await axios.get(opinionUrl);
    if (response.status === 200) {
        const opnions = JSON.stringify(response.data, null, 2);
        //console.log(opnions);
        const obj = JSON.parse(opnions);
        console.log(obj.CHART);
        const list = obj.CHART;
        for(key in list) {
            console.log(list[key].TRD_DT);
        }
        


    }
    
};


const crawlerEventOpinion  = async () => {
    console.log("crawlerEventOpinion start");
    /*DB에 입력 해 보자*/
    var connection = mysql.createConnection(conn); // DB 커넥션 생성
    connection.connect();   // DB 접속

    /*쿼리 생성 한다.*/
    var testQuery = "SELECT event_code, company_name FROM event_info WHERE event_code = '009420';;";
    connection.query(testQuery, function(err, results, field){
		let opinionUrl = "";	
        for(key in results) {
            opinionUrl = `http://m.comp.fnguide.com/m2/data/json/chart/01_02/chart_A${results[key].event_code}.json`;
            opinionLoad(opinionUrl);
            



        }
    });

};
crawlerEventOpinion();
console.log("end");