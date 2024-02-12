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


alter table reviewers add deadline DATE;
alter table reward_settings add rrt_within_deadline NUMBER(10) default 0;
alter table reward_settings add rrt_after_deadline NUMBER(10) default 0;
alter table journals add deadline DATE;

-- select to_char(cast(time_stamp as date),'DD-MM-YYYY') from rewards;



-- Final database layout
-- Add MANUSCRIPTS table with id, article_hash, author_hash, journal_hash, review_hashes, deadline, timestamp
-- keep REWARD_SETTINGS as it is
-- Add REVIEWS table with id, MANUSCRIPTS.id, reviewer_hash, timestamp, deadline, review_hash
-- REWARD_ALLOCATION table with id, reviewer_hash, journal_hash, timestamp, REVIEWS.id as reviews_id, sbt_assigned, rrt_assigned

CREATE TABLE MANUSCRIPTS (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  article_hash VARCHAR2(100),
  author_hash VARCHAR2(100),
  journal_hash VARCHAR2(100),
  deadline DATE,
  review_hashes string_array,
  time_stamp timestamp,
  CONSTRAINT manuscripts_pk PRIMARY KEY (id)
);

CREATE TABLE REVIEWS (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  reviewer_hash VARCHAR2(100),
  review_hash VARCHAR2(100),
  deadline DATE,
  time_stamp timestamp,
  manuscripts_id NUMBER,
  CONSTRAINT reviews_pk PRIMARY KEY (id),
  CONSTRAINT fk_manuscripts
    FOREIGN KEY (manuscripts_id)
    REFERENCES manuscripts(id)
);

alter table REVIEWS add article_hash VARCHAR2(100);


CREATE TABLE REWARD_ALLOCATION (
  id NUMBER GENERATED ALWAYS AS IDENTITY,
  reviewer_hash VARCHAR2(100),
  journal_hash VARCHAR2(100),
  sbt_assigned NUMBER(1) default 0,
  rrt_assigned NUMBER(1) default 0,
  time_stamp timestamp,
  reviews_id NUMBER,
  CONSTRAINT reward_allocation_pk PRIMARY KEY (id),
  CONSTRAINT fk_reviews
    FOREIGN KEY (reviews_id)
    REFERENCES reviews(id)
);