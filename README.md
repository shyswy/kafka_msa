# Event-Driven MSA Project with Node.js & Kotlin Spring

## 📌 프로젝트 개요

이 프로젝트는 **Apache Kafka**를 기반으로 구성된 **Event-Driven Microservices Architecture (MSA)**입니다.  
**Node.js**와 **Kotlin + Spring Boot**로 구성된 각각의 MSA 서버는 Kafka를 통해 이벤트를 주고받으며 느슨하게 결합된 구조를 가집니다.

## 🛠️ 사용 기술 및 역할

- **Node.js**  
  - 비동기 이벤트 처리에 최적화된 경량 서버
  - Kafka **Producer** 역할로 이벤트 생성 및 발행

- **Kotlin + Spring Boot**  
  - 백엔드 비즈니스 로직 및 데이터 처리 담당
  - Kafka **Consumer** 역할로 이벤트 수신 및 처리

- **Apache Kafka**  
  - 서비스 간 메시지를 중계하는 이벤트 브로커
  - 각 MSA 간의 통신을 비동기 이벤트 기반으로 관리

## 🔗 아키텍처 구성

```plaintext
[Node.js Service] --(이벤트 전송)--> Kafka --(이벤트 수신)--> [Kotlin + Spring Service]
