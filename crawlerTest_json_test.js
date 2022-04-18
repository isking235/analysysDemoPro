/*
history
2022-04-18 이상호 [[ ]] 형식의 json을 파싱해보자
 */

const axios = require('axios');

const crawlerTest_json_test  = async() => {
    console.log("crawlerTest_json_test start");
	/*1.임의의 배열을 선언하여 순회 해 보자*/
    const strBacktic = eval(`[['날짜', '시가', '고가', '저가', '종가', '거래량', '외국인소진율'],["20020422", 55509, 63815, 55509, 62936, 8151792, 24.19]]`);
	console.log(strBacktic.length);
	//strBacktic.forEach(element => console.log(element[0]+","+element[1]));
	
	/*2. 시세를 웹으로 호출하여 순회 해 보자*/	
	let stockPriceUrl = `https://api.finance.naver.com/siseJson.naver?symbol=005930&requestType=1&startTime=20220401&endTime=20220417&timeframe=day`;
    console.log("crawlerTest_json_test start.stockPriceUrl :"+ stockPriceUrl);

    const response = await axios.get(stockPriceUrl);

    if (response.status === 200) {
		const sise = eval(response.data);
		//console.log("sise[0]:"+sise[0]);
		//sise.forEach(element => console.log(element[0]+","+element[1]));
		
		sise.forEach(function(item,index,arr2){
			console.log(item,index,arr2[index]); 
			
			//item.forEach(element => console.log(element)); //이걸 사용하던지 아랫걸 사용하던지 한다.
			for(var i = 0 ; i < item.length ; i++ ){
				console.log(item[i]);
			}
			
		});
		
	}//if

};
crawlerTest_json_test();
console.log("end");