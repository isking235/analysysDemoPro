const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const iconv = require('iconv-lite');
const _ = require('lodash');
const { pool } = require('../config/db'); // pool 추가 임포트
const {scheduleStockSiseType, saveSiseGroup} = require('../utils/siseTypeUtil');

require('dotenv').config();

const agent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * 업종 목록을 조회하고 저장
 */
async function saveUpjongList() {

  //업종 URL 호출
  const url = process.env.SISE_UPJONG_URL; //https://finance.naver.com/sise/sise_group.naver?type=upjong
  console.log(url);

  const response = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent });
  const content = iconv.decode(response.data, 'EUC-KR');
  const $ = cheerio.load(content);

  //크롤링 대상 테이블 지정 및 순회 하면서 저장
  const upjongTable = $('.type_1');
  upjongTable.find('a').each((index, element) => {
    const aTag = $(element);
    const upjongName = aTag.text();
    const upjongLink = aTag.attr('href');

    if (upjongLink && upjongLink.includes('type=upjong')) {
      const noMatch = upjongLink.match(/no=(\d+)/);
      const siseGrpDtlNo = noMatch ? noMatch[1] : null;

      console.log(`Upjong Name: ${upjongName}, Link: ${upjongLink}, siseGrpDtlNo: ${siseGrpDtlNo}`);

      //시세 타입에 해당 하는 종목을 입력 한다.
      scheduleStockSiseType(upjongLink, 'upjong', siseGrpDtlNo, index * 1000);

      //시세 타입을 시세타입기준테이블에 입력한다.
      saveSiseGroup('upjong', siseGrpDtlNo, upjongName);

      if(index ==0){
        return false;
      }
    }
  });
}

// 실행
saveUpjongList();