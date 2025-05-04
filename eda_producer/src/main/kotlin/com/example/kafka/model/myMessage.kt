package com.example.kafka.model

data class MyMessage(
    val id: Int = 0,
    val age: Int = 0,
    val name: String = "",
    val content: String = ""
)