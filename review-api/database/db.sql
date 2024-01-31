CREATE TABLE authors (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  author_hash VARCHAR2(100),
  file_hash VARCHAR2(100),
  time_stamp timestamp
);

-- insert into authors (author_hash, file_hash, time_stamp) values ('test', 'file_test', CURRENT_TIMESTAMP);


CREATE TYPE string_array AS VARRAY(100) OF VARCHAR2(100);

CREATE TABLE journals (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  journal_hash VARCHAR2(100),
  article_hash VARCHAR2(100),
  review_hash string_array,
  time_stamp timestamp
);

CREATE TABLE reviewers (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  reviewer_hash VARCHAR2(100),
  article_hash VARCHAR2(100),
  time_stamp timestamp
);

CREATE TABLE rewards (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  reviewer_hash VARCHAR2(100),
  review_hash VARCHAR2(100),
  time_stamp timestamp
);

alter table rewards add assigned NUMBER(1) default 0;
alter table rewards add journal_hash VARCHAR2(100);

CREATE TABLE reward_settings (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  journal_hash VARCHAR2(100),
  enable_rrt NUMBER(1) default 0,
  rrt_amount_per_review NUMBER(10) default 0,
  time_stamp timestamp
);