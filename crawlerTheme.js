const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const agent = new https.Agent({
      rejectUnauthorized: false
    });
/*
    1. 마지막 페이지를 불러와 페이지 갯수를 안다.
    2. 페이지 갯수를 리턴한다.
    3. 마지막 페이지를 loof를 수행 하며 테마 목록을 조회 
    4. 각 목록을 DB에 저장
    */
//테마 페이지 수를 알아 낸다.
async function getThemePageCnt() {
  try {
    const url = 'https://finance.naver.com/sise/theme.naver';
    const response = await axios.get(url, { httpsAgent: agent });
    const $ = cheerio.load(response.data);
    // Select the last page link
    const lastPageLink = $('.pgRR a').attr('href');
    // Extract the page number using regex
    const pageMatch = lastPageLink.match(/page=(\d+)/);
    const lastPageNumber = pageMatch ? pageMatch[1] : null;
    return lastPageNumber;
  } catch (error) {
    console.error('Error ThemePage:', error);
  }
}
/*
테마의 목록을 읽어서 DB에 저장 한다.
insert 오류가 나면 유효 하다고 저장 한다.
2초 쉬었다가 시작 하자
*/
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function saveThemeList(page) {
  const url = 'https://finance.naver.com/sise/theme.naver?&page='+page;
  console.log(url);
  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);
  const themeTable  = $('.type_1.theme');
    themeTable.find('a').each((index,element) => {
      // 각 <a> 태그에 대한 작업 수행
      const aTag = $(element); // Cheerio 객체로 변환
      const themeName = aTag.text(); // 테마 이름 가져오기
      const themeLink = aTag.attr('href'); // 테마 링크 가져오기
       if (themeLink && themeLink.includes('type=theme')) {
        
        const noMatch = themeLink.match(/no=(\d+)/);
        const noMatchNumber = noMatch ? noMatch[1] : null;
        console.log(`Theme Name: ${themeName}, Link: ${themeLink}, noMatchNumber: ${noMatchNumber}`);
       }
      
  });
  
  
}
/*수정일이 오늘 이전 이면 유효 하지 않다고 수정 한다.*/

async function main() {
  const lastPage = await getThemePageCnt();
  for(let cnt = 1 ; cnt <= lastPage ; cnt ++ ) {
    //테마 목록을 조회 
    await saveThemeList(cnt);
    await delay(1000);
  }
  
}
main();