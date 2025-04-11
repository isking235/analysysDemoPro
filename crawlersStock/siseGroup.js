const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');

const createLogger = require('../config/logger'); // config/logger.js에서 로거 가져
const {scheduleStockSiseType, saveSiseGroup} = require('../utils/siseTypeUtil'); 

const agent = new https.Agent({
      rejectUnauthorized: false
    });

const logger = createLogger(__filename);    
/*
    
    1. 페이지를 loof를 수행 하며 그룹 목록을 조회 
    2. 각 목록을 DB에 저장
    */

async function saveGroupList(page) {
  logger.info(`saveGroupList()`);
  const url = process.env.SISE_GROUP_URL;
  logger.info(`Target URL: ${url}`);

  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);

  //크롤링 대상 테이블 지정 및 순회 하면서 저장
  const groupTable  = $('.type_1');

    groupTable.find('a').each((index,element) => {
      
      const aTag = $(element); // Cheerio 객체로 변환
      const groupName = aTag.text(); // 그룹 이름 가져오기
      const groupLink = aTag.attr('href'); // 그룹 링크 가져오기

      if (groupLink && groupLink.includes('type=group')) {
        const noMatch = groupLink.match(/no=(\d+)/);
        const siseGrpDtlNo = noMatch ? noMatch[1] : null;

        logger.debug(`Group Name: ${groupName}, Link: ${groupLink}, siseGrpDtlNo: ${siseGrpDtlNo}`);

        //시세 타입에 해당 하는 종목을 입력 한다.
        scheduleStockSiseType(logger, groupLink, 'group', siseGrpDtlNo, index * 1000);

        //시세 타입을 시세타입기준테이블에 입력한다.
        saveSiseGroup(logger,'group', siseGrpDtlNo, groupName);
       }
      
  });
  
  
}
/*수정일이 오늘 이전 이면 유효 하지 않다고 수정 한다.*/


  
//그룹 목록을 조회 
saveGroupList()