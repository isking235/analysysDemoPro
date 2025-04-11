SELECT * FROM stock_info a
WHERE a.stock_code = '208850';

SELECT COUNT(*) FROM stock_info a
WHERE a.induty_sise_grp_dtl_no IS NULL and a.delete_yn = 'N';

SELECT * FROM stock_info a
WHERE a.induty_sise_grp_dtl_no IS NULL and a.delete_yn = 'N';

SELECT a.* FROM stock_info a
WHERE a.mod_dtm >= DATE_ADD(NOW(), INTERVAL-2 MINUTE);

SELECT * FROM invt_opinion_goal_stkpc a
WHERE a.stock_code = '000020';



SELECT *
FROM invt_opinion_goal_stkpc a
WHERE a.stock_code = '005930' AND a.opinion_de >= DATE_ADD(NOW(), INTERVAL-12 MONTH);

SELECT *
FROM stkpc_info a
WHERE a.stock_code = '224810' AND a.delng_de >= DATE_ADD(NOW(), INTERVAL-12 MONTH);


SELECT 
              stock_code, cmpny_nm
          FROM stock_info A
         WHERE A.delete_yn='N'
            AND A.stock_code NOT IN (
            SELECT distinct Z.stock_code FROM invt_opinion_goal_stkpc Z WHERE  Z.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
            )
         ORDER BY A.stock_code;
         
         
SELECT 
          stock_code, cmpny_nm
      FROM stock_info A
     WHERE A.delete_yn='N'
        AND A.stock_code NOT IN (
        SELECT distinct Z.stock_code FROM invt_opinion_goal_stkpc Z WHERE  Z.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
        )
     ORDER BY A.stock_code;         
     

SELECT * FROM stock_info a
WHERE a.stock_code = '224810';

SELECT * FROM invt_opinion_goal_stkpc a
WHERE a.stock_code = '000020';

SELECT COUNT(*) FROM stock_info a
WHERE a.delete_yn = 'N';

SELECT *
FROM invt_opinion_goal_stkpc a
WHERE a.stock_code = '005930' AND a.opinion_de >= DATE_ADD(NOW(), INTERVAL-12 MONTH);

SELECT *
FROM stkpc_info a
WHERE a.stock_code = '224810' AND a.delng_de >= DATE_ADD(NOW(), INTERVAL-12 MONTH);


SELECT 
              stock_code, cmpny_nm
          FROM stock_info A
         WHERE A.delete_yn='N'
            AND A.stock_code NOT IN (
            SELECT distinct Z.stock_code FROM invt_opinion_goal_stkpc Z WHERE  Z.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
            )
         ORDER BY A.stock_code;
         
         
SELECT 
          stock_code, cmpny_nm
      FROM stock_info A
     WHERE A.delete_yn='N'
        AND A.stock_code NOT IN (
        SELECT distinct Z.stock_code FROM invt_opinion_goal_stkpc Z WHERE  Z.reg_dtm > DATE_FORMAT(NOW(),'%Y/%m/%d')
        )
     ORDER BY A.stock_code;         
     
          
     
     