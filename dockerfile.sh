#!/usr/bin/env bash

docker build --build-arg BUILDPLATFORM=linux/amd64 -t kubile/book-searcher:1.3.0 .