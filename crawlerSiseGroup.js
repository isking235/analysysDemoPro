const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');

const agent = new https.Agent({
      rejectUnauthorized: false
    });
/*
    
    1. 페이지를 loof를 수행 하며 그룹 목록을 조회 
    2. 각 목록을 DB에 저장
    */

async function saveGroupList(page) {
  const url = 'https://finance.naver.com/sise/sise_group.naver?type=group';
  console.log(url);
  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);
  const groupTable  = $('.type_1');
    groupTable.find('a').each((index,element) => {
      // 각 <a> 태그에 대한 작업 수행
      const aTag = $(element); // Cheerio 객체로 변환
      const groupName = aTag.text(); // 그룹 이름 가져오기
      const groupLink = aTag.attr('href'); // 그룹 링크 가져오기
       if (groupLink && groupLink.includes('type=group')) {
        
        const noMatch = groupLink.match(/no=(\d+)/);
        const noMatchNumber = noMatch ? noMatch[1] : null;
        console.log(`Group Name: ${groupName}, Link: ${groupLink}, noMatchNumber: ${noMatchNumber}`);
       }
      
  });
  
  
}
/*수정일이 오늘 이전 이면 유효 하지 않다고 수정 한다.*/


  
//그룹 목록을 조회 
saveGroupList()