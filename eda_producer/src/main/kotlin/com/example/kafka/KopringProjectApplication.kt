package com.example.kafka

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication


//https://dodop-blog.tistory.com/427
//https://blogger903.tistory.com/42
@SpringBootApplication
//@ComponentScan("com.example")  // 컨트롤러 패키지 지정
//@EnableJpaAuditing
//@EnableJpaRepositories(basePackages = ["com.example.clubsite.repository"]) //@Import(TraceAspect.class)
class KopringProjectApplication
fun main(args: Array<String>) {
	runApplication<KopringProjectApplication>(*args)
}


