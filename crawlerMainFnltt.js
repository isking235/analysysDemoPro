const axios = require('axios');
const cheerio = require('cheerio');

async function getFinancialStatement(code) {
  try {
    // URL 생성
    const url = `https://finance.naver.com/item/main.nhn?code=${code}`;

    // 데이터 가져오기
    const response = await axios.get(url);
    const html = response.data;

    // HTML 파싱
    const $ = cheerio.load(html);

    // 재무상태표 데이터 선택 (일반적으로 5번째 테이블)
    const table = $('table.tb_type1.tb_num').eq(4);
    
    // 데이터 추출 및 정리
    const financialStatement = {};
    table.find('tr').each((index, element) => {
      const title = $(element).find('th').text().trim();
       console.log(title);
      if (title) {
        const values = $(element).find('td').map((i, el) => $(el).text().trim()).get();
        financialStatement[title] = values;
      }
    });

    return financialStatement;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// 사용 예시
const code = '005930'; // 삼성전자
getFinancialStatement(code).then(result => {
  if (result) {
    console.log('재무상태표:');
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('데이터를 가져오는데 실패했습니다.');
  }
});