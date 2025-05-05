package com.example.kafka.config

import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class StartupLogger {

    @Bean
    fun logOnStartup(): ApplicationRunner {
        return ApplicationRunner {
            println("✅ 서버 실행 완료: 이 로그가 찍히면 서버 반영 완료됨")
            // 또는 로깅 사용
            // logger.info("✅ 서버 실행 완료: 최신 코드 반영됨")
        }
    }
}