/*
종목 
*/
SELECT *invt_opinion_goal_stkpc FROM stock_info A WHERE A.delete_yn = 'Y';
SELECT stock_code, cmpny_nm FROM stock_info A WHERE A.delete_yn = 'Y';
SELECT COUNT(1) FROM stock_info A WHERE A.delete_yn = 'Y';

delete FROM stock_info WHERE stock_knd = 'KOSPI' AND reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY)   ;

INSERT INTO stock_info (stock_knd, stock_code, cmpny_nm, reg_dtm, regr_id, mod_dtm, modr_id, delete_yn) VALUES('KOSPI','108320','LX세미콘', NOW(),'LSH',NOW(), 'LSH','N');


SELECT * FROM stock_info a WHERE a.stock_knd = 'KOSPI';
SELECT * FROM stock_info a WHERE a.stock_knd = 'KOSDAQ';
SELECT * FROM stock_info a WHERE a.stock_knd = 'KOSPI' ORDER BY a.stock_code;
SELECT COUNT(1) FROM stock_info a WHERE a.stock_knd = 'KOSPI';
SELECT COUNT(1) FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY)   ;
SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.stock_code IN
('417310'
,'373220'
,'404990'
,'396690'
,'402340'
,'400760'
,'377300'
,'381970'
,'329180'
,'395400'
,'271940'
,'377190'
,'139990'
,'089860'
,'372910');

SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.stock_code IN ('108320');

SELECT a.* FROM stock_info a ORDER BY a.reg_dtm DESC;

SELECT a.* FROM stock_info a where a.stock_knd IS NULL;


SELECT a.stock_code, a.cmpny_nm FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.delete_yn = 'N' ORDER BY stock_code;
SELECT COUNT(1) FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.delete_yn = 'N' ORDER BY stock_code;

SELECT * FROM stock_info a WHERE  a.delete_yn = 'N' ORDER BY stock_code;

UPDATE stock_info SET delete_yn = 'N', MOD_DTM = NOW() WHERE stock_code = '000020';

SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.stock_code in ('100090');
SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.delete_yn = 'Y';
SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSPI' AND a.reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);


SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSDAQ' AND a.delete_yn = 'Y';
SELECT a.* FROM stock_info a WHERE a.stock_knd = 'KOSDAQ' AND a.reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);



/****
종목 의견
*/
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('000020');
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('005930');

SELECT COUNT(*) FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('005930') AND a.reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);
SELECT COUNT(*) FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('000120') AND a.reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);
SELECT COUNT(*) FROM invt_opinion_goal_stkpc a;
SELECT * FROM invt_opinion_goal_stkpc WHERE stock_code =  '092200'  ORDER BY stock_code;

SELECT * FROM invt_opinion_goal_stkpc a WHERE a.reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);

SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('000120') ORDER BY a.opinion_de;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('011390') ORDER BY a.opinion_de;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('007630') ORDER BY a.opinion_de;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('094860') ORDER BY a.opinion_de;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('373220') ORDER BY a.opinion_de;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('100090') ORDER BY a.opinion_de;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('030000') ORDER BY a.opinion_de;

:

SELECT MAX(A.opinion_de) AS max_opinion_de
  FROM invt_opinion_goal_stkpc A 
  WHERE A.stock_code = '005930';
  
  SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('005930') ORDER BY a.opinion_de;
  
  SELECT count FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('005930') ORDER BY a.opinion_de;
  
  DELETE FROM invt_opinion_goal_stkpc WHERE stock_code IN ('005930') AND reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);
  
  SELECT * FROM invt_opinion_goal_stkpc WHERE stock_code IN ('005930') AND reg_dtm > DATE_ADD(NOW(), INTERVAL -1 DAY);
  
  
/*
7/7 089860에서정지됨
신규다 보니 최신 날짜를 읽어오니 date가 null로 넘어옴
*/
;
SELECT COUNT(1) AS AA FROM stock_info A WHERE A.stock_code >  '089860' ORDER BY stock_code;
SELECT *  FROM stock_info A WHERE A.stock_code =  '089860' ORDER BY stock_code;
SELECT * FROM invt_opinion_goal_stkpc a WHERE a.stock_code IN ('089860') ORDER BY a.opinion_de;
SELECT *   FROM invt_opinion_goal_stkpc A WHERE A.stock_code = '089860';
SELECT stock_code, cmpny_nm FROM stock_info WHERE stock_code >  '089860'  ORDER BY stock_code;
SELECT COUNT(1) FROM stock_info WHERE stock_code >  '089860' AND delete_yn='N' ORDER BY stock_code;
SELECT stock_code, cmpny_nm FROM stock_info WHERE stock_code >  '089860' AND delete_yn='N' ORDER BY stock_code;


/*
중도에 끊어 지는 경우 이어서 시작할수 있도록 하자
*/

SELECT DATE_FORMAT(NOW(),'%Y/%m/%d');

--금일 수집된 종목
SELECT distinct a.stock_code FROM invt_opinion_goal_stkpc a WHERE  reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d');

--금일 수집된 종목 제외 하고 나머지 종목
SELECT 
      stock_code, cmpny_nm
  FROM stock_info A
 WHERE A.delete_yn='N'
    AND A.stock_code NOT IN (
    SELECT distinct Z.stock_code FROM invt_opinion_goal_stkpc Z WHERE  Z.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
    )
 ORDER BY A.stock_code;
 
SELECT 
      COUNT(1)
  FROM stock_info A
 WHERE A.delete_yn='N'
    AND A.stock_code NOT IN (
    SELECT distinct Z.stock_code FROM invt_opinion_goal_stkpc Z WHERE  Z.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
    ); 
-- 수집 제대로 되는지 보자 
 SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.stock_code = '022220';
  SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.stock_code = '000020';
    SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.stock_code = '000040';
    SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.stock_code = '000860';
        SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.stock_code = '001070';
                SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.invt_opinion IS NOT null;
 
  SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.invt_opinion > 0 AND a.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d');
  

  
  
  SELECT MAX(A.opinion_de) AS max_opinion_de FROM invt_opinion_goal_stkpc A WHERE A.stock_code = '000020';
  
  SELECT STR_TO_DATE(MAX(A.opinion_de),'%Y-%m-%d') AS max_opinion_de FROM invt_opinion_goal_stkpc A WHERE A.stock_code = '000020';
출처: https://leeted.tistory.com/122 [이태원 블로그:티스토리];
 
 /*코스닥에서 코스피로 넘어 간경우 삭제로 처리 해버림*/
-- 030190 9/11

SELECT a.* FROM stock_info a WHERE 1=1 AND a.stock_code IN ('022100');

UPDATE stock_info SET delete_yn = 'N', MOD_DTM = NOW(), stock_knd = 'KOSPI' WHERE stock_code= '034230';

 SELECT *   FROM invt_opinion_goal_stkpc a WHERE a.stock_code = '030190';


SELECT a.* FROM invt_opinion_goal_stkpc  a WHERE stock_code in ('141000');

SELECT a.* FROM stock_info a WHERE 1=1 AND a.stock_code IN ('069110');

SELECT a.* FROM stock_info a WHERE 1=1 AND a.delete_yn = 'Y';

SELECT a.* FROM stock_info a WHERE 1=1 AND a.stock_code IN ('034230');
UPDATE stock_info SET MOD_DTM = NOW(), stock_knd = 'KOSPI',delete_yn = 'N' WHERE stock_code= '034230';

SELECT a.* FROM stock_info a WHERE 1=1 AND a.stock_code IN ('489500');
435570
489500

stock_info