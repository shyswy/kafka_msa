# Kotlin Spring Kafka Docker Template

이 프로젝트는 **Kotlin Spring Boot** 애플리케이션을 **Docker**를 활용하여 **Kafka, Zookeeper, 앱 서버**와 함께 컨테이너화하는 템플릿입니다.

## 📌 주요 기능
- **Kafka & Zookeeper 컨테이너화**: Docker Compose를 사용하여 Kafka와 Zookeeper, 그에 연동됨 app 서버(producer & consumer)를 간편하게 실행
- **Spring Boot 앱 서버 컨테이너화**: Kotlin 기반 Spring Boot 애플리케이션을 Docker에서 실행
- **Kafka와의 연동**: Spring Kafka 설정을 포함하여 Kafka 프로듀서 및 컨슈머 구현
- **Kafka 테스트 도구 제공**: Kafka 토픽 생성, 토픽 목록 조회, 파일 기반 메시지 전송, 모의 컨슈머 연결, 토픽 삭제, 컨슈머 그룹 정보 조회 등을 위한 `.sh` 스크립트 제공

## 🚀 실행 방법
### 1. 프로젝트 클론
```sh
git clone https://github.com/your-repo/kotlin-spring-kafka-docker.git](https://github.com/shyswy/kotlinMsaTemplate.git
```

### 2. Docker Compose 실행
```sh
docker-compose up -d
```

## 📂 프로젝트 구조
```
📁 kotlinMsaTemplate
├── 📂 src
│   ├── 📄 docker-compose.yml         # Kafka, App 서버 통합 docker-compose
│   ├── 📄 Dockerfile.yml             # app 서버 Dockerfile
│   └── 📂 /main/kotlin/com/example/kafka
│       ├── 📄 createTopic.sh                # Kafka 토픽 생성
│       ├── 📄 batchConsumer.kt              # Kafka 메시지 batch consumer
│       ├── 📄 consumer.kt                   # Kafka 메시지 consumer
│       ├── 📄 producer.kt                   # Kafka 메시지 producer
│       ├── 📄 KopringProjectApplication.kt  # Spring Boot 메인 애플리케이션
├── 📂 kafkaConfig
│   ├── 📄 docker-compose.yml         # Kafka only docker-compose
│   └── 📂 kafka
│       ├── 📄 createTopic.sh               # Kafka 토픽 생성
│       ├── 📄 deleteTopic.sh               # Kafka 토픽 삭제
│       ├── 📄 getTopicList.sh              # 토픽 목록 조회
│       ├── 📄 getTopicData.sh              # 토픽 데이터 조회
│       ├── 📄 produceDataToTopic.sh        # 데이터 전송
│       ├── 📄 produceToTopicWithFile.sh    # 파일 기반 메시지 전송
│       ├── 📄 produceTopicData.sh          # 토픽 데이터 전송
│       ├── 📄 getConsumerGroup.sh          # 컨슈머 그룹 조회
│       ├── 📄 getConsumerGroupInfo.sh      # 컨슈머 그룹 상세 정보 조회
│       ├── 📂 kafka_2.12-2.5.0             # Kafka 바이너리 폴더
│       ├── 📂 message                      # 메시지 샘플 파일
├── 📄 build.gradle.kts              # Gradle 빌드 스크립트
└── 📄 README.md
```
