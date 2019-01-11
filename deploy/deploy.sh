#!/usr/bin/env bash
docker-compose build
docker-compose push

scp docker-compose.yml 192.168.1.20:~/
ssh 192.168.1.20 '
docker-compose down
docker-compose pull
docker-compose -p app up -d
'
open -a /Applications/Safari.app https://selector.site