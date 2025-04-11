/*시세 관련 쿼리*/
SELECT *
FROM sise_ty_stdr a;

SELECT *
FROM sise_ty_stdr a
WHERE a.sise_ty_code = 'group';
stock_by_thema_info
SELECT *
  FROM stock_info a
WHERE a.grp_sise_grp_dtl_no = '96';



/*시세타입기준 중복조회*/


SELECT a.sise_grp_dtl_nm
FROM sise_ty_stdr a
WHRE a.sise_ty_code = 'upjong' AND a.sise_grp_dtl_no = '200';


SELECT COUNT(*) FROM stock_info A WHERE A.grp_sise_grp_dtl_no IS not NULL;




-- 상세명이 변경된경우 수정
UPDATE sise_ty_stdr a
SET sise_grp_dtl_nm = '수정된 상세명',
    a.mod_dtm = NOW(),
    a.modr_id = 'LSH'
WHERE sise_ty_code = 'upjong' 
  AND sise_grp_dtl_no = '200';

-- 상세명이 없으면 입력
INSERT INTO sise_ty_stdr (
    reg_dtm, regr_id, mod_dtm, modr_id,
    sise_ty_code, sise_grp_dtl_no, sise_grp_dtl_nm
) VALUES (
    NOW(), 'LSH', NOW(), 'LSH',
    'upjong', 1, '시세그룹상세명'
);

-- 종목에 업종을 수정한다.
UPDATE stock_info a
  SET a.induty_sise_grp_dtl_no = '200',
      a.mod_dtm = NOW(),
      a.modr_id = 'LSH'
WHERE a.stock_code = '2'; 

-- 종목에 그룹을 수정한다.
UPDATE stock_info a
  SET a.grp_sise_grp_dtl_no = '200',
      a.mod_dtm = NOW(),
      a.modr_id = 'LSH'
WHERE a.stock_code = '2'; 

-- 테마를 저장한다.


-- 저장 결과를 조회
SELECT a.sise_grp_dtl_nm
  FROM sise_ty_stdr a
 WHERE a.sise_ty_code = 'upjong' AND a.sise_grp_dtl_no = '312';
 
 SELECT a.sise_grp_dtl_nm  
                          FROM sise_ty_stdr a
                        WHERE a.sise_ty_code = 'upjong' AND a.sise_grp_dtl_no = '334';
     
      