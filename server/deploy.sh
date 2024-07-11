#!/bin/bash

SSH_USER="ec2-user"
SSH_SERVER="ec2-18-133-247-202.eu-west-2.compute.amazonaws.com"

file=$1

zip -r deploy.zip app/ Dockerfile Makefile requirements.txt .env

scp -i "$file" deploy.zip ${SSH_USER}@${SSH_SERVER}:~

ssh -i "$file" ${SSH_USER}@${SSH_SERVER} '/home/ec2-user/server_deploy.sh' | tee /dev/tty

rm deploy.zip
