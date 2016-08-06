#!/bin/sh

sudo forever stopall
sudo forever start bin/www
