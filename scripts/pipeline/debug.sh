#!/bin/bash

echo "Hello World!"
echo "Branch Name - $CI_COMMIT_BRANCH"
echo "Job Name - $CI_JOB_NAME"
echo "Developer Name - $GITLAB_USER_NAME"
echo $HOST_IP

# Network Info
ip a | grep "inet" | grep "/22"

# List Directory Info
pwd
ls -la

cd review-ui
pwd
ls -la