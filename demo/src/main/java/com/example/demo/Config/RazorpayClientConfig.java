package com.example.demo.Config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayClientConfig {

    private final RazorpayConfig razorpayConfig;

    public RazorpayClientConfig(RazorpayConfig razorpayConfig) {
        this.razorpayConfig = razorpayConfig;
    }

    @Bean
    public RazorpayClient razorpayClient() {
        try {
            return new RazorpayClient(razorpayConfig.getKey(), razorpayConfig.getSecret());
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create Razorpay client", e);
        }
    }
}
