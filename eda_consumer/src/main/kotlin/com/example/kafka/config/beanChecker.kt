package com.example.kafka.config

import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.ApplicationContext
import org.springframework.stereotype.Component

@Component
class BeanChecker(private val context: ApplicationContext) : ApplicationRunner {
    override fun run(args: ApplicationArguments?) {
        val beanNames = context.beanDefinitionNames
        if ("messageController" in beanNames) {
            // new, 22 들어가나 확인해보자! 제대로 반영..?
            println("✅ new MessageController22 is registered as a Bean!")
        } else {
            println("❌ MessageController is NOT registered!")
        }
    }
}