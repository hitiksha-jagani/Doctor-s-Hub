package com.example.demo.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import org.springframework.beans.factory.annotation.Value;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    private RazorpayClient client;

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    // public String createOrder(double totalAmount) throws Exception {
    //     RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
    //     JSONObject orderRequest = new JSONObject();
    //     int amountInPaise = (int) (totalAmount * 100); 
    //     orderRequest.put("amount", amountInPaise);
    //     // orderRequest.put("currency", currency);
    //     orderRequest.put("receipt", "txn_123456");

    //     Order order = razorpayClient.orders.create(orderRequest);
    //     return order.toString();        
    // }

    public String createOrder(double totalAmount) throws Exception {
        try {
            // Convert amount to paise (1 INR = 100 paise)
            int amountInPaise = (int) (totalAmount * 100);
            System.out.println("Amount in Paise: " + amountInPaise); // Log amount for debugging
    
            RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise); // Use amount in paise
            orderRequest.put("currency", "INR"); // Make sure currency is specified
            orderRequest.put("receipt", "txn_123456");
    
            // Log the request for debugging
            System.out.println("Sending request to Razorpay: " + orderRequest.toString());
    
            // Create the order with Razorpay
            Order order = razorpayClient.orders.create(orderRequest);
    
            // Log the successful response
            System.out.println("Razorpay order response: " + order.toString());
    
            return order.toString(); // Return the Razorpay order response
        } catch (Exception e) {
            // Log the exception for more details
            System.err.println("Error while creating order: " + e.getMessage());
            e.printStackTrace();
            throw new Exception("Error creating order");
        }
    }
    
       
}
