const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');

const createLogger = require('../config/logger'); // config/logger.js에서 로거 가져
const {scheduleStockSiseType, saveSiseGroup} = require('../utils/siseTypeUtil'); 

require('dotenv').config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const logger = createLogger(__filename);
/**
 * 업종 목록을 조회하고 저장
 */
async function saveUpjongList() {
  logger.info(`saveUpjongList()`);
  
    const url = process.env.SISE_UPJONG_URL;
    logger.info(`Target URL: ${url}`);

    const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
    const content = iconv.decode(response.data, 'EUC-KR');
    const $ = cheerio.load(content);

    //크롤링 대상 테이블 지정 및 순회 하면서 저장
    const upjongTable = $('.type_1');
    const promises = []; // 프로미스를 저장할 배열 생성


    upjongTable.find('a').each((index, element) => {
      const aTag = $(element);
      const upjongName = aTag.text();
      const upjongLink = aTag.attr('href');

      if (upjongLink && upjongLink.includes('type=upjong')) {
        const noMatch = upjongLink.match(/no=(\d+)/);
        const siseGrpDtlNo = noMatch ? noMatch[1] : null;

        logger.info(`Upjong Name: ${upjongName}, Link: ${upjongLink}, siseGrpDtlNo: ${siseGrpDtlNo}`);

        //시세 타입에 해당 하는 종목을 입력 한다.
        scheduleStockSiseType(logger, upjongLink, 'upjong', siseGrpDtlNo, index * 1000);

        //시세 타입을 시세타입기준테이블에 입력한다.
        saveSiseGroup(logger,'upjong', siseGrpDtlNo, upjongName);
        
      }
    });
    logger.info('saveUpjongList completed successfully.');
}
saveUpjongList(); // 비동기 함수 실행
