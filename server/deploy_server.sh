#!/bin/bash

mv server/ old_server/

rm -r server/

unzip deploy.zip -d server/

cd server/

docker stop smart-hydration-server

make clean

make build

make run