package com.example.kafka

import com.example.kafka.model.MyMessage
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component

@Component
class MyConsumer {

    @KafkaListener(topics = ["test-topic"], groupId = "test-group-batch", containerFactory = "batchKafkaListenerContainerFactory")
    fun consumeBatch(messages: List<ConsumerRecord<String, MyMessage>>, acknowledgment: Acknowledgment) {
        println("Consumed batch of messages: ${messages.size}")
        messages.forEachIndexed { index, record ->
            val message = record.value()
            println("Message ${index + 1}:")
            println("  Topic: ${record.topic()}")
            println("  Partition: ${record.partition()}")
            println("  Offset: ${record.offset()}")
            println("  Key: ${record.key()}")
            println("  Value:")
            println("    ID: ${message.id}")
            println("    Age: ${message.age}")
            println("    Name: ${message.name}")
            println("    Content: ${message.content}")
            println("-----------------------------")
        }
        println("Batch processing completed")
        acknowledgment.acknowledge() // 수동커밋
    }
}

//import com.example.kafka.model.MyMessage
//import org.apache.kafka.clients.consumer.ConsumerRecord
//import org.springframework.kafka.annotation.KafkaListener
//import org.springframework.stereotype.Component

//@Component
//class MyConsumer {
//    @KafkaListener(topics = ["test-topic"], groupId = "test-group-batch", containerFactory = "batchKafkaListenerContainerFactory")
//    fun consumeBatch(messages: List<ConsumerRecord<String, MyMessage>>) {
//        println("Consumed batch of messages: ${messages.size}")
//        messages.forEachIndexed { index, record ->
//            val message = record.value()
//            println("Message ${index + 1}:")
//            println("  Topic: ${record.topic()}")
//            println("  Partition: ${record.partition()}")
//            println("  Offset: ${record.offset()}")
//            println("  Key: ${record.key()}")
//            println("  Value:")
//            println("    ID: ${message.id}")
//            println("    Age: ${message.age}")
//            println("    Name: ${message.name}")
//            println("    Content: ${message.content}")
//            println("-----------------------------")
//        }
//        println("Batch processing completed")
//    }
//}

