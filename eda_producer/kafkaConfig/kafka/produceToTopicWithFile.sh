#!/bin/bash

# 첫 번째 인자로 토픽명을 받습니다.
TOPIC=$1

# 두 번째 인자로 JSON 파일 경로를 받습니다.
JSON_FILE=$2

# JSON 파일이 존재하는지 확인합니다.
if [ ! -f "$JSON_FILE" ]; then
    echo "Error: JSON file '$JSON_FILE' not found!"
    exit 1
fi

# JSON 파일의 내용을 한 줄로 변환하여 Kafka 토픽에 전송합니다.
jq -c . "$JSON_FILE" | /Users/yunsanghyeon/Desktop/project/kopringProject/kafkaConfig/kafka/kafka_2.12-2.5.0/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic "$TOPIC"
