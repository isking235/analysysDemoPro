const axios = require('axios');
const cheerio = require('cheerio');
var iconv = require('iconv-lite');

const crawler  = async () => {
    /*
    1. 주식종목 url을 호출한다
    2. 항목을 cheerio로 파싱한다.
    */ 
    //const response = await axios.get("https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&comAbbrv=&beginIndex=&orderMode=3&orderStat=D&isurCd=&repIsuSrtCd=&searchCodeType=&marketType=stockMkt&searchType=13&industry=&fiscalYearEnd=all&comAbbrvTmp=&location=all");
    const response = await axios.get("https://kind.krx.co.kr/corpgeneral/corpList.do?method=download&pageIndex=1&currentPageSize=5000&comAbbrv=&beginIndex=&orderMode=3&orderStat=D&isurCd=&repIsuSrtCd=&searchCodeType=&marketType=stockMkt&searchType=13&industry=&fiscalYearEnd=all&comAbbrvTmp=&location=all",{responseEncoding : 'binary', responseType : 'arraybuffer'});
    if (response.status === 200) {
      
      const html = iconv.decode(new Buffer(response.data), 'EUC-KR').toString();
      //const html = response.data;
      //console.log(html);
      const $ = cheerio.load(html);
      
      const tableText = $(".bbs_tb").text();
      const tableTrList = $(".bbs_tb").children().children();

      console.log(tableTrList);



      /*const scrapedData = [];
      $("body > table   > tr").each((index, element) => {
        //console.log($(element).find("td")[0]); // 이상하게 긴 내용이 출력됨
        //console.log($($(element).find("td")[0]).text());

        const tds = $(element).find("td");
        const company = $(tds[0]).text().trim();
        const comNum = $(tds[1]).text().trim();
        const comkind = $(tds[2]).text().trim();
        const tableRow = { company, comNum, comkind };
        scrapedData.push(tableRow);
      });
      //console.log(scrapedData);
      console.log(scrapedData.length);*/

    }

  
};

crawler();
