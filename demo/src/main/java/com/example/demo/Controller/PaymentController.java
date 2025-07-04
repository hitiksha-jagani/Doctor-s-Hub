package com.example.demo.Controller;

// import com.example.demo.DTO.RazorpayPaymentResponse;
// import com.example.demo.Model.Appointment;
// import com.example.demo.Repository.AppointmentRepository;
// import com.example.demo.Repository.DoctorRepository;
// import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.RazorpayService;
// import com.razorpay.RazorpayClient;
// import org.json.JSONObject;
// import com.razorpay.Order;

import java.util.*;
import org.json.JSONObject;


// import java.util.HashMap;
// import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import java.util.Optional;

@RestController
@CrossOrigin // If you're calling from frontend
public class PaymentController {

    @Autowired
    private RazorpayService razorpayService;

    // @PostMapping("/payment/create-order")
    // public Map<String, Object> createOrder(@RequestBody Map<String, Object> data) throws Exception {
    //     int amount = (int) data.get("amount");

    //     RazorpayClient client = new RazorpayClient("RAZORPAY_KEY_ID", "RAZORPAY_SECRET");

    //     JSONObject orderRequest = new JSONObject();
    //     orderRequest.put("amount", amount * 100); // in paise
    //     orderRequest.put("currency", "INR");
    //     orderRequest.put("receipt", "txn_123456");

    //     Order order = client.orders.create(orderRequest);

    //     Map<String, Object> response = new HashMap<>();
    //     response.put("id", order.get("id"));
    //     response.put("amount", order.get("amount"));
    //     return response;
    // }

    // @PostMapping("/doctors/{doctorId}/appointments/create-order")
    // public String createOrder(@RequestParam int amount){
    //     try {
    //         return razorpayService.createOrder(amount);
    //     } catch (Exception e) {
    //         // TODO Auto-generated catch block
    //         e.printStackTrace();
    //         return "Error creating order"; 
    //     }
    // }

    @PostMapping("/doctors/{doctorId}/appointments/create-order")
public ResponseEntity<?> createOrder(
        @PathVariable Long doctorId,
        @RequestParam double amount) {
    try {
        System.out.println("Received amount: " + amount);
        String orderJsonString = razorpayService.createOrder(amount);
        
        JSONObject orderJson = new JSONObject(orderJsonString);

        Map<String, Object> response = new HashMap<>();
        response.put("id", orderJson.getString("id"));
        response.put("amount", orderJson.getInt("amount"));

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace();
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Error creating order");
        return ResponseEntity.badRequest().body(errorResponse);
    }
}



}
