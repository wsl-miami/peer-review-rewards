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