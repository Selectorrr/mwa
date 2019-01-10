#!/usr/bin/env bash
docker build -t app .
docker tag app:latest 192.168.1.20:5000/app:latest
docker push 192.168.1.20:5000/app:latest
ssh 192.168.1.20 '
docker pull 192.168.1.20:5000/app:latest
docker stop app
docker rm app
docker run -d -p 3000:3000 --name=app --restart=always 192.168.1.20:5000/app:latest
'
open -a /Applications/Safari.app http://192.168.1.20:3000