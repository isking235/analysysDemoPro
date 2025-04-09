/**테이블명 변경*/
-- rename table invt_opinion_goal_stkpc TO INVT_OPINION_GOAL_STKPC stkpc_info TO STKPC_INFO; 
             
alter table invt_opinion_goal_stkpc rename TO INVT_OPINION_GOAL_STKPC;


/*칼럼명변경*/
ALTER TABLE stock_info
RENAME COLUMN STOCK_KND to stock_knd,
RENAME COLUMN CMPNY_NM to cmpny_nm,
RENAME COLUMN DELETE_YN to delete_yn;

/*칼럼 추가*/
ALTER TABLE stock_info ADD COLUMN induty_sise_grp_dtl_no int COMMENT '업종시세그룹상세번호';
ALTER TABLE stock_info ADD COLUMN grp_sise_grp_dtl_no int COMMENT '그룹시세그룹상세번호';
ALTER TABLE stock_info ADD COLUMN stock_mng_trget_yn VARCHAR(1) COMMENT '종목관리대상여부';

/*신규 테이블 추가*/
CREATE TABLE stock_by_thema_info (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    stock_code VARCHAR(8) NOT NULL COMMENT '종목코드',
    sise_ty_code VARCHAR(20) NOT NULL COMMENT '시세타입코드',
    ty_dtl_no INT NOT NULL COMMENT '타입상세번호',
    PRIMARY KEY (stock_code, sise_ty_code, ty_dtl_no)
);

CREATE TABLE fnnr_info (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    stock_code VARCHAR(8) NOT NULL COMMENT '종목코드',
    ix_ty_code VARCHAR(20) NOT NULL COMMENT '지표타입코드',
    itm_code VARCHAR(20) NOT NULL COMMENT '항목코드',
    year VARCHAR(4) NOT NULL COMMENT '년도',
    itm_val INT COMMENT '항목값',
    PRIMARY KEY (stock_code, ix_ty_code, itm_code, year)
);

CREATE TABLE cmmn_code (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    cmmn_code_grp VARCHAR(8) NOT NULL COMMENT '공통코드그룹',
    cmmn_code_grp_nm VARCHAR(100) COMMENT '공통코드그룹명',
    use_yn VARCHAR(1) COMMENT '사용여부',
    mng_attrb_val_01 VARCHAR(400) COMMENT '관리속성값01',
    mng_attrb_val_02 VARCHAR(400) COMMENT '관리속성값02',
    mng_attrb_val_03 VARCHAR(5000) COMMENT '관리속성값03',
    mng_attrb_val_04 VARCHAR(5000) COMMENT '관리속성값04',
    mng_attrb_val_05 VARCHAR(5000) COMMENT '관리속성값05',
    PRIMARY KEY (cmmn_code_grp)
);

CREATE TABLE cmmn_code_dtl (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    cmmn_code_grp VARCHAR(8) NOT NULL COMMENT '공통코드그룹',
    cmmn_code VARCHAR(20) NOT NULL COMMENT '공통코드',
    cmmn_code_nm VARCHAR(100) COMMENT '공통코드명',
    sort_ordr INT COMMENT '정렬순서',
    use_yn VARCHAR(1) COMMENT '사용여부',
    upper_grp_code VARCHAR(8) COMMENT '상위그룹코드',
    upper_cmmn_code VARCHAR(20) COMMENT '상위공통코드',
    mng_attrb_val_01 VARCHAR(400) COMMENT '관리속성값01',
    mng_attrb_val_02 VARCHAR(400) COMMENT '관리속성값02',
    mng_attrb_val_03 VARCHAR(5000) COMMENT '관리속성값03',
    mng_attrb_val_04 VARCHAR(5000) COMMENT '관리속성값04',
    mng_attrb_val_05 VARCHAR(5000) COMMENT '관리속성값05',
    PRIMARY KEY (cmmn_code_grp, cmmn_code)
);

CREATE TABLE sise_ty_stdr (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    sise_ty_code VARCHAR(20) NOT NULL COMMENT '시세타입코드',
    sise_grp_dtl_no INT NOT NULL COMMENT '시세그룹상세번호',
    sise_grp_dtl_nm VARCHAR(200) COMMENT '시세그룹상세명',
    PRIMARY KEY (sise_ty_code, sise_grp_dtl_no)
);

CREATE TABLE colct_trget_info (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    site_seq INT NOT NULL COMMENT '사이트순번',
    site_nm VARCHAR(100) COMMENT '사이트명',
    colct_trget VARCHAR(200) COMMENT '수집대상',
    site_url VARCHAR(500) COMMENT '사이트URL',
    PRIMARY KEY (site_seq)
);

CREATE TABLE stock_mng_info (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    stock_code VARCHAR(8) NOT NULL COMMENT '종목코드',
    applc_de DATE NOT NULL COMMENT '적용일',
    calc_begin_de DATE COMMENT '산정시작일',
    calc_end_de DATE COMMENT '산정종료일',
    goal_pc_avrg_rt FLOAT COMMENT '목표가평균율',
    goal_pc_mxmm_rt FLOAT COMMENT '목표가최대율',
    goal_pc_mumm_rt FLOAT COMMENT '목표가최소율',
    mvl_achiv_goal INT COMMENT '최대치 달성 목표',
    mnvl_achiv_co INT COMMENT '최소치 달성 횟수',
    sale_boxpatn_rt FLOAT COMMENT '매도박스권율',
    prchas_boxpatn_rt FLOAT COMMENT '매수박스권율',
    sale_goal_pc INT COMMENT '매도목표가',
    prchas_goal_pc INT COMMENT '매수목표가',
    expect_ern BIGINT COMMENT '예상수익',
    expect_dmage BIGINT COMMENT '예상손해',
    sale_rt FLOAT COMMENT '매도율',
    prchas_rt FLOAT COMMENT '매수율',
    PRIMARY KEY (stock_code, applc_de)
);



CREATE TABLE sise_by_gnrlz_info (
    reg_dtm DATETIME NOT NULL COMMENT '등록일',
    regr_id VARCHAR(20) NOT NULL COMMENT '등록자',
    mod_dtm DATETIME NOT NULL COMMENT '수정일',
    modr_id VARCHAR(20) NOT NULL COMMENT '수정자',
    sise_ty_code VARCHAR(20) NOT NULL COMMENT '시세타입코드',
    sise_grp_dtl_no INT NOT NULL COMMENT '시세그룹상세번호',
    applc_pd DATE NOT NULL COMMENT '적용일',
    delng_am BIGINT COMMENT '거래액',
    PRIMARY KEY (sise_ty_code, sise_grp_dtl_no, applc_pd)
);
