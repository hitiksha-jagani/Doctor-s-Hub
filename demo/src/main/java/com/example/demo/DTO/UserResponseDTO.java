package com.example.demo.DTO;

import com.example.demo.Model.User;

import lombok.Setter;

@Setter
public class UserResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String gender;
    private String role;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phone = user.getPhone();
        this.email = user.getEmail();
        this.gender = user.getGender().toString();
        this.role = user.getRole().toString();
    }

    // Getters
    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getGender() { return gender; }
    public String getRole() { return role; }
}
