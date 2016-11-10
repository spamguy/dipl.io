#!/bin/bash
apt-get install nginx
cp nginx.travis.conf /etc/nginx/nginx.conf
/etc/init.d/nginx restart
