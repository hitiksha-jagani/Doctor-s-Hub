package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.example.demo.Model.*;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    @Query("SELECT FUNCTION('DATE', u.createdAt) AS date, COUNT(u) AS count " +
       "FROM User u " +
       "GROUP BY FUNCTION('DATE', u.createdAt) " +
       "ORDER BY date ASC")
    List<Object[]> countUsersByDate();
}
