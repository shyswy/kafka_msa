package com.example.kafka

import com.example.kafka.model.MyMessage
import org.springframework.http.ResponseEntity
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController

@RequestMapping("/api/messages")
class MessageController(private val kafkaTemplate: KafkaTemplate<String, MyMessage>) {
    @PostMapping()
    fun sendMessage(@RequestBody message: MyMessage): ResponseEntity<String> {
        kafkaTemplate.send("test-topic", message)
        return ResponseEntity.ok("Message sent to Kafka")
    }
}