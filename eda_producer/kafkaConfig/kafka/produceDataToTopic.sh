#!/bin/bash

echo "Enter data to produce to topic $1:"
read data

/home/sanghyunyoon/kafka/kafka_2.12-2.5.0/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic $1 <<< "$data"
