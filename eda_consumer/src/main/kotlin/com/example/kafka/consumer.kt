//package com.example.kafka
//import com.example.kafka.model.MyMessage
//import org.apache.kafka.clients.consumer.ConsumerRecord
//import org.springframework.kafka.annotation.KafkaListener
//import org.springframework.stereotype.Component
//
//@Component
//class MyConsumer {
//
//    @KafkaListener(topics = ["test-topic"], groupId = "test-group", containerFactory = "kafkaListenerContainerFactory")
//    fun consume(message: ConsumerRecord<String, MyMessage>) {
//        println("Consumed message: ${message.value()}")
//    }
//}