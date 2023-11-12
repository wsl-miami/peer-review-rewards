@echo off
set BUCKET_NAME=decentralized-peer-review

aws s3 rm s3://%BUCKET_NAME% --recursive
