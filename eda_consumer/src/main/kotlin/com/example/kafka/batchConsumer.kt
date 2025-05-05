package com.example.kafka

import com.example.kafka.model.MyMessage
import com.example.kafka.model.MyMessage2
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.stereotype.Component

@Component
class MyConsumer {
    @KafkaListener(
        topics = ["test-topic"],
        groupId = "test-group-batch-a",
        containerFactory = "batchFactoryTestTopic"
    )
    fun consumeMyMessageBatch(
        messages: List<ConsumerRecord<String, MyMessage>>,
        acknowledgment: Acknowledgment
    ) {
        println("Consumed MyMessage batch: ${messages.size}")
        messages.forEachIndexed { index, record ->
            val message = record.value()
            println("test-topic consumer ${index + 1}: $message")
        }
        acknowledgment.acknowledge()
    }

    @KafkaListener(
        topics = ["test-topic2"],
        groupId = "test-group-batch-b",
        containerFactory = "batchFactoryTestTopic2"
    )
    fun consumeMyMessage2Batch(
        messages: List<ConsumerRecord<String, MyMessage2>>,
        acknowledgment: Acknowledgment
    ) {
        println("Consumed MyMessage2 batch: ${messages.size}")
        messages.forEachIndexed { index, record ->
            val message = record.value()
            println("test-topic2 consumer ${index + 1}: $message")
        }
        acknowledgment.acknowledge()
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

