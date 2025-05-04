#!/bin/bash

/home/sanghyunyoon/kafka/kafka_2.12-2.5.0/bin/kafka-topics.sh --delete --bootstrap-server localhost:9092  --topic $1
