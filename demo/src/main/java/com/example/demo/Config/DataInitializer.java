// package com.example.demo.Config;

// import com.example.demo.Model.User;
// import com.example.demo.Model.Role;
// import com.example.demo.Model.Gender;
// import com.example.demo.Repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// public class DataInitializer implements CommandLineRunner {

//     @Autowired
//     private UserRepository userRepository;

//     @Autowired
//     private PasswordEncoder passwordEncoder;

//     @Override
//     // public void run(String... args) throws Exception {
//     //     if (!userRepository.existsByEmail("admin@example.com")) {
//     //         User admin = new User();
//     //         admin.setFirstName("Admin");
//     //         admin.setLastName("User");
//     //         admin.setEmail("admin@example.com");
//     //         admin.setPhone("9999999999");
//     //         admin.setGender(Gender.MALE);
//     //         admin.setPassword(passwordEncoder.encode("admin123")); // Password is encrypted
//     //         admin.setRole(Role.ROLE_ADMIN);
//     //         userRepository.save(admin);
//     //         System.out.println("✅ Default admin created: admin@example.com / admin123");
//     //     }
//     // }
// }
