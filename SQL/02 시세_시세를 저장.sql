
/*stock price 조회*/
SELECT COUNT(*)  FROM stkpc_info a ;
SELECT * FROM stkpc_info a ;



SELECT * FROM  stkpc_info a WHERE a.stock_code = '005930' ORDER BY a.delng_de desc;
SELECT COUNT(*)  FROM stkpc_info a WHERE a.stock_code = '005930';
SELECT stock_code, cmpny_nm FROM stock_info WHERE delete_yn='N' ORDER BY stock_code;

DELETE FROM  stkpc_info  WHERE stock_code = '005930';

SELECT * FROM  stkpc_info a WHERE a.stock_code = '005380' ORDER BY a.delng_de;
SELECT COUNT(*)  FROM stkpc_info a WHERE a.stock_code = '005380';
DELETE FROM  stkpc_info  WHERE stock_code = '005380';

SELECT COUNT(*)  FROM stkpc_info a WHERE a.stock_code = '005490';

SELECT * FROM  stkpc_info  WHERE delng_de = 0;
SELECT * FROM  stkpc_info  WHERE delng_de = 0 AND stock_code IN ('005380','005490','005930');
DELETE FROM  stkpc_info  WHERE delng_de = 0 AND stock_code IN ('005380','005490','005930');

/*stock price 입력*/

INSERT INTO stock.stkpc_info 
(reg_dtm,regr_id,mod_dtm,modr_id,stock_code, delng_de, mktc, hghpc, lprc, clsrc, delng_qy,frgnr_exhs_rt)
VALUES (NOW(),'LSH', NOW(),'LSH','000005','20220501',10,11,12,13,14,0.5);


SELECT * FROM  stkpc_info a WHERE a.stock_code = '000720' ORDER BY a.delng_de;

SELECT MAX(A.delng_de) AS max_delng_de FROM stkpc_info A WHERE A.stock_code = '005930';

SELECT * FROM  stkpc_info a WHERE a.stock_code = '000060' ORDER BY a.delng_de;

SELECT MAX(A.delng_de) AS max_delng_de FROM stkpc_info A WHERE A.stock_code = '000020';
SELECT * FROM stkpc_info A WHERE A.stock_code = '950190';

https://api.finance.naver.com/siseJson.naver?symbol=247540&requestType=1&startTime=20180528&endTime=20220707&timeframe=DAY
;
SELECT * FROM stock_info a WHERE a.stock_code = '247540';

/*?? 왜 더 많이 안나오지? 099750 에서 멈춤 */
--099520
-- 099750
-- 100030

;
030000
SELECT * FROM stkpc_info A WHERE A.stock_code = '030000';


SELECT stock_code, cmpny_nm FROM stock_info WHERE delete_yn='N' ORDER BY stock_code;

/*
중도에 끊어 지는 경우 이어서 시작할수 있도록 하자
*/
SELECT * FROM stkpc_info A WHERE A.stock_code = '049480';

SELECT * FROM stkpc_info a WHERE  reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d');

SELECT distinct z.stock_code FROM stkpc_info z WHERE  reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d');
--금일 수집된 종목 제외 하고 나머지 종목

SELECT 
      stock_code, cmpny_nm
  FROM stock_info A
 WHERE A.delete_yn='N'
    AND A.stock_code NOT IN (
    SELECT distinct z.stock_code FROM stkpc_info z WHERE  reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
    )
 ORDER BY A.stock_code;
 
 SELECT 
      COUNT(1)
  FROM stock_info A
 WHERE A.delete_yn='N'
    AND A.stock_code NOT IN (
    SELECT distinct z.stock_code FROM stkpc_info z WHERE  reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
    );
    
    
--  
SELECT * FROM  stkpc_info a WHERE a.stock_code = '035720' ORDER BY a.delng_de DESC;  

ALTER TABLE stkpc_info DROP INDEX idx_stock_price_reg_dtm;


CREATE INDEX idx_spi_01 ON stkpc_info (reg_dtm); 
CREATE INDEX idx_spi_02 ON stkpc_info (stock_code, reg_dtm); 
/*퍼플렉시티 pro 튜닝2 0.156
 idx01 을 지웠더니 2.8
*/
SELECT DISTINCT A.stock_code, A.cmpny_nm
FROM stock_info A
LEFT JOIN (
    SELECT DISTINCT stock_code 
    FROM stkpc_info 
    WHERE reg_dtm > CURDATE()
) z ON A.stock_code = z.stock_code
WHERE A.delete_yn = 'N' AND z.stock_code IS NULL
ORDER BY A.stock_code;

/*퍼블렉시티 일반 튜닝3 2.8*/
SELECT DISTINCT A.stock_code, A.cmpny_nm
FROM stock_info A
LEFT JOIN stkpc_info B ON A.stock_code = B.stock_code 
  AND B.reg_dtm > CURDATE()
WHERE A.delete_yn = 'N'
  AND B.stock_code IS NULL
ORDER BY A.stock_code;


/*퍼블렉시티 일반 튜닝3 2.8*/
SELECT 
	COUNT(*) AS cnt 
FROM (
SELECT DISTINCT A.stock_code, A.cmpny_nm
FROM stock_info A
LEFT JOIN stkpc_info B ON A.stock_code = B.stock_code 
  AND B.reg_dtm > CURDATE()
WHERE A.delete_yn = 'N'
  AND B.stock_code IS NULL) a;
  
/*진행여부 확인*/  
/*퍼블렉시티 일반 튜닝3 2.8*/
SELECT DISTINCT A.stock_code, A.cmpny_nm
FROM stock_info A
WHERE A.delete_yn = 'N'
ORDER BY A.stock_code DESC;

SELECT * FROM  stkpc_info a WHERE a.stock_code = '950220' ORDER BY a.delng_de desc;

