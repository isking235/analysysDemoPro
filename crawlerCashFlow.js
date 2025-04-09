const axios = require('axios');
const cheerio = require('cheerio');
async function scrapeCashFlowStatement() {
  try {
    const url = 'http://comp.fnguide.com/SVO2/ASP/SVD_Finance.asp?pGB=1&gicode=A028100&cID=&MenuYn=Y&ReportGB=&NewMenuID=103&stkGb=701'; //제무제표 동아지질
    //const url = 'http://comp.fnguide.com/SVO2/ASP/SVD_Invest.asp?pGB=1&gicode=A028100&cID=&MenuYn=Y&ReportGB=&NewMenuID=105&stkGb=701'; //투자지표동아지질

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const cashFlowMap = new Map();

    // 테이블 선택
    //const cashFlowTable = $('#divSonikY table.us_table_ty1.h_fix.zigbg_no'); /* 제무제표 Jquery 선택자  */
    const cashFlowTable = $('#divCashY > table'); /* 제무제표 크롬에서 선택자  */    
    //const cashFlowTable = $('#compBody > div.section.ul_de > div.ul_col2wrap.pd_t25 > div.um_table > table');  /* 투자지표 크롬에서 선택자  */

    // 각 행을 순회하며 항목과 값 추출
    cashFlowTable.find('tr').each((index, element) => {
      const item = $(element).find('th').text().trim();
      const values = $(element).find('td').map((i, el) => $(el).text().trim()).get();
      if (item && values.length > 0) {
        cashFlowMap.set(item, values);
      }
    });
    return cashFlowMap;
  } catch (error) {
    console.error('Error scraping cash flow statement:', error);
    throw error;
  }
}
async function main() {
  try {
    const cashFlowMap = await scrapeCashFlowStatement(); //1.크롤링대상의 주소와 테이블을 Map 에 담는다.
    // 특정 항목의 값 출력
    //console.log('영업이익:', cashFlowMap.get('영업이익'));
    // 모든 항목 순회 및 출력
    for (let [item, values] of cashFlowMap) {
      console.log(`${item}: ${values.join(', ')}`);
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
}
main();