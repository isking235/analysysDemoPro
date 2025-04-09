SELECT * FROM cmmn_code;

INSERT INTO cmmn_code (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code_grp_nm, use_yn,mng_attrb_val_01,
    mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04, mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN021','재정지표02','Y','#divDaechaY > table',
    '','','','');



SELECT * FROM cmmn_code_dtl a ORDER BY a.cmmn_code_grp, a.sort_ordr;
DELETE FROM cmmn_code_dtl a WHERE a.cmmn_code_grp != '';


INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'STK001','upjong','업종','1',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'STK001','group','그룹','2',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'STK001','theme','테마','3',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0010','매출액','1',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0020','영업이익','2',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0030','당기순이익','3',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0040','자산총계','4',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0050','부채총계','5',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0060','자본총계','6',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0070','자본금','7',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0080','부채비율','8',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0090','유보율','9',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0100','영업이익률','10',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0110','지배주주순이익률','11',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0120','ROA','12',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0130','ROE','13',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0140','EPS','14',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0150','BPS','15',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0160','DPS','16',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0170','PER','17',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0180','PBR','18',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0190','발행주식수','19',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN001','0200','당기순이익','20',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN020','0010','기말현금및현금성자산','1',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN021','0010','유동금융자산','1',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN021','0020','매출채권및기타유동채권','2',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN021','0030','단기차입금','3',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN021','0040','매입채무및기타유동채무','4',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN030','0010','EPS','1',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN030','0020','BPS','2',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN030','0030','PER','3',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN030','0040','PBR','4',
    'Y','','','',
    '','','','');
INSERT INTO cmmn_code_dtl (
    reg_dtm, regr_id, mod_dtm, modr_id,
    cmmn_code_grp, cmmn_code, cmmn_code_nm, sort_ordr,
    use_yn,upper_grp_code, upper_cmmn_code, mng_attrb_val_01,   mng_attrb_val_02, mng_attrb_val_03, mng_attrb_val_04,mng_attrb_val_05
) VALUES (now(), 'lsh',now(),'lsh',
    'FNN030','0050','EV/EBITA','5',
    'Y','','','',
    '','','','');