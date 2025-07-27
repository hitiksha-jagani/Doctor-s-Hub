package com.example.demo.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults()) 
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs
            .authorizeHttpRequests(auth -> auth
                //.requestMatchers("/register", "/login", "/doctors", "/error").permitAll() // Open endpoints
                //.requestMatchers("/admin/**").authenticated()
                .requestMatchers("/**").permitAll()
                .requestMatchers("/admin").hasAnyRole("ADMIN")
                .requestMatchers("/admin/**").hasAuthority("ADMIN")
                .anyRequest().permitAll() // Protect other endpoints
            )
            // .formLogin(form -> form
            //     .loginPage("/login") // Your custom login endpoint (handled by frontend)
            //     //.defaultSuccessUrl("/admin/dashboard", true) // Where to redirect after successful login
            //     .permitAll()
            // )
            .formLogin(form -> form.disable()) // Disable Spring's default login form
            .httpBasic(httpBasic -> httpBasic.disable()) // Disable basic auth (optional)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
