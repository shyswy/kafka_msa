package com.example.kafka.config

import com.example.kafka.model.MyMessage
import com.example.kafka.model.MyMessage2
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.*
import org.springframework.kafka.listener.ContainerProperties
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
import org.springframework.kafka.support.serializer.JsonDeserializer
import org.springframework.kafka.support.serializer.JsonSerializer

@Configuration
class KafkaConsumerConfig(
    private val kafkaProperties: KafkaProperties
) {

    fun commonProps(valueType: Class<*>): Map<String, Any> = mapOf(
        ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to kafkaProperties.bootstrapServers,

        ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG to ErrorHandlingDeserializer::class.java,
        ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG to ErrorHandlingDeserializer::class.java,

        ErrorHandlingDeserializer.KEY_DESERIALIZER_CLASS to StringDeserializer::class.java,
        ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS to JsonDeserializer::class.java,

        JsonDeserializer.VALUE_DEFAULT_TYPE to valueType.name,
        JsonDeserializer.TRUSTED_PACKAGES to "*",

        ConsumerConfig.AUTO_OFFSET_RESET_CONFIG to "latest",
        ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG to false
    )

    @Bean
    fun consumerFactoryTestTopic(): ConsumerFactory<String, MyMessage> =
        DefaultKafkaConsumerFactory(commonProps(MyMessage::class.java))

    @Bean
    fun consumerFactoryTestTopic2(): ConsumerFactory<String, MyMessage2> =
        DefaultKafkaConsumerFactory(commonProps(MyMessage2::class.java))

    @Bean
    fun batchFactoryTestTopic(): ConcurrentKafkaListenerContainerFactory<String, MyMessage> =
        ConcurrentKafkaListenerContainerFactory<String, MyMessage>().apply {
            consumerFactory = consumerFactoryTestTopic()
            isBatchListener = true
            setConcurrency(2)
            containerProperties.pollTimeout = 5000
            containerProperties.ackMode = ContainerProperties.AckMode.MANUAL
        }

    @Bean
    fun batchFactoryTestTopic2(): ConcurrentKafkaListenerContainerFactory<String, MyMessage2> =
        ConcurrentKafkaListenerContainerFactory<String, MyMessage2>().apply {
            consumerFactory = consumerFactoryTestTopic2()
            isBatchListener = true
            setConcurrency(2)
            containerProperties.pollTimeout = 5000
            containerProperties.ackMode = ContainerProperties.AckMode.MANUAL
        }
}

@Configuration
class KafkaProducerConfig(
    private val kafkaProperties: KafkaProperties
) {
    @Bean
    fun producerFactory(): ProducerFactory<String, MyMessage> {
        val configProps: Map<String, Any> = mapOf(
            ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to kafkaProperties.bootstrapServers,
            ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
            ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java
        )
        return DefaultKafkaProducerFactory(configProps)
    }

    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, MyMessage> {
        return KafkaTemplate(producerFactory())
    }
}