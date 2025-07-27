package com.example.demo.Controller;

import com.example.demo.DTO.DoctorRequestDTO;
// import com.example.demo.DTO.DoctorResponseDTO;
// import com.example.demo.DTO.DoctorResponseDTO;
import com.example.demo.DTO.LoginRequestDTO;
import com.example.demo.DTO.UserRegistrationDTO;
import com.example.demo.DTO.UserResponseDTO;
import com.example.demo.Model.Doctor;
import com.example.demo.Model.Role;
import com.example.demo.Model.User;
import com.example.demo.Service.AdminService;
import com.example.demo.Service.DoctorService;
import com.example.demo.Exception.DoctorAlreadyExistsException;
import com.example.demo.DTO.AppointmentResponseDTO;
import org.jfree.data.category.DefaultCategoryDataset;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

// For charting
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.CategoryLabelPositions;
import org.jfree.chart.axis.NumberAxis;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.axis.CategoryLabelPositions;

import org.jfree.data.category.DefaultCategoryDataset;

// For IO and file handling
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;

// For web responses
import org.springframework.http.MediaType;

import java.util.Calendar;
import java.util.List;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/add-admin")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDTO dto) {
        try {
            adminService.registerAdmin(dto);
            return ResponseEntity.ok("Admin registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Check if logged-in user is admin
    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdmin(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || user.getRole() != Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        return ResponseEntity.ok()
                .header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                .body("Verified");
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest, HttpSession session) {
        try {
            User user = adminService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            // Save user in session if needed
            session.setAttribute("user", user);

            // Return full user data to frontend
            UserResponseDTO userResponseDTO = new UserResponseDTO(user);
            return ResponseEntity.ok(userResponseDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                            @RequestBody Map<String, String> passwordMap,
                                            HttpServletRequest request) {
        String oldPassword = passwordMap.get("oldPassword");
        String newPassword = passwordMap.get("newPassword");

        try {
            adminService.changePassword(id, oldPassword, newPassword);

            // ✅ Invalidate session (log user out)
            request.getSession().invalidate();

            // ✅ Inform frontend to redirect to login
            return ResponseEntity.ok("Password changed successfully. Please log in again.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/admin-list")
    public ResponseEntity<List<User>> getAllAdmins() {
        List<User> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // @GetMapping("/doctor-list")
    // public ResponseEntity<List<Doctor>> getAllDoctors() {
    //     List<Doctor> doctors = doctorService.getAllDoctors();
    //     return ResponseEntity.ok(doctors);
    // }

    @GetMapping("/doctor-list")
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateAdmin(@PathVariable Long id, @RequestBody User updatedUser) {
        return ResponseEntity.ok(adminService.updateAdmin(id, updatedUser));
    }

    @PutMapping("/doctor/{id}")
     public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor updateDoctor) {
        return ResponseEntity.ok(adminService.updateDoctor(id, updateDoctor));
    }
 
     // Delete a doctor
     @DeleteMapping("/{id}")
     public void deleteAdmin(@PathVariable Long id) {
         adminService.deleteAdmin(id);
     }

    @DeleteMapping("/doctor/{id}")
    public void deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
    }

    // ✅ Admin: Add doctor
    @PostMapping("/add")
    public ResponseEntity<?> addDoctor(@Valid @RequestBody DoctorRequestDTO dto, HttpSession session) {
        User user = (User) session.getAttribute("user");

        // Check if user is logged in and is admin
        if (user == null || user.getRole() != Role.ROLE_ADMIN) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized"));
        }

        try {
            doctorService.addDoctor(dto);  // Note: Make sure you're passing dto here (you had doctorDTO by mistake)
            return ResponseEntity.ok(Map.of("message", "Doctor added successfully"));
        } catch (DoctorAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Doctor with this email already exists"));
        } catch (Exception e) {
            e.printStackTrace(); // Log the error on backend
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An error occurred while adding the doctor"));
        }
    }

    @GetMapping("/user-list")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsersWithRoleUser());
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUserById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
        }
    }

    @GetMapping("/appointment-list")
    public ResponseEntity<List<AppointmentResponseDTO>> getAllAppointments() {
        return ResponseEntity.ok(adminService.getAllAppointmentsForAdmin());
    }

    // @GetMapping(value = "/generate-report", produces = MediaType.IMAGE_PNG_VALUE)
    // public ResponseEntity<byte[]> generateUserReport() {
    //     try {
    //         List<Object[]> data = adminService.getUserCountPerDay();

    //         // Prepare a dataset to hold all dates in the current month
    //         DefaultCategoryDataset dataset = new DefaultCategoryDataset();

    //         // Get the current date and month
    //         Calendar calendar = Calendar.getInstance();
    //         int currentMonth = calendar.get(Calendar.MONTH); // 0-based index (January = 0)
    //         int currentYear = calendar.get(Calendar.YEAR);

    //         // Create a list of all dates for the current month (1st to last day)
    //         SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    //         int daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);

    //         // Initialize all days of the current month with 0 users
    //         for (int day = 1; day <= daysInMonth; day++) {
    //             String date = String.format("%d-%02d-%02d", currentYear, currentMonth + 1, day); // Format: yyyy-MM-dd
    //             dataset.addValue(0, "Users", date); // Initially add 0 users for each date
    //         }

    //         // Add data to the dataset
    //         for (Object[] entry : data) {
    //             if (entry[0] != null) {
    //                 String date = entry[0].toString(); // Date as String
    //                 Long count = ((Number) entry[1]).longValue(); // Count

    //                 // Make sure the count is an integer, as user count should always be a whole number
    //                 dataset.addValue(count.intValue(), "Users", date);
    //             }
    //         }

    //         // Create the chart
    //         JFreeChart chart = ChartFactory.createLineChart(
    //                 "User Registrations Per Day",
    //                 "Date",
    //                 "Number of Users",
    //                 dataset,
    //                 PlotOrientation.VERTICAL,
    //                 true, // Show legend
    //                 true, // Show tooltips
    //                 false // No URLs
    //         );

    //         // Customize the chart to show integers on the Y-axis (not in scientific notation)
    //         CategoryPlot plot = chart.getCategoryPlot();
    //         NumberAxis yAxis = (NumberAxis) plot.getRangeAxis();
    //         yAxis.setStandardTickUnits(NumberAxis.createIntegerTickUnits()); // Ensure integer tick units

    //         // Adjust the date format on the X-axis for better display
    //         CategoryAxis xAxis = plot.getDomainAxis();
    //         xAxis.setLabelAngle(Math.PI / 4); // Rotate the X-axis labels for better readability

    //         // Adjust the number of labels shown (this can be modified based on your needs)
    //         // Use CategoryLabelPositions to control label display
    //         xAxis.setCategoryLabelPositions(CategoryLabelPositions.createUpRotationLabelPositions(0.5f));

    //         // Output chart to byte array
    //         ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    //         ChartUtils.writeChartAsPNG(outputStream, chart, 1200, 800); // Increase chart size for better display

    //         return ResponseEntity
    //                 .ok()
    //                 .contentType(MediaType.IMAGE_PNG)
    //                 .body(outputStream.toByteArray());

    //     } catch (IOException e) {
    //         e.printStackTrace();
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }

    // @GetMapping(value = "/generate-appointment-report", produces = MediaType.IMAGE_PNG_VALUE)
    // public ResponseEntity<byte[]> generateAppointmentReport() {
    //     try {
    //         List<Object[]> data = adminService.getAppointmentCountPerDay(); // Get appointment count per day

    //         // Prepare the dataset for the chart
    //         DefaultCategoryDataset dataset = new DefaultCategoryDataset();

    //         // Add data to the dataset
    //         for (Object[] entry : data) {
    //             if (entry[0] != null && entry[1] != null) {
    //                 String date = entry[0].toString(); // Date as String
    //                 Long count = ((Number) entry[1]).longValue(); // Appointment count

    //                 // Add the count to the dataset for each date
    //                 dataset.addValue(count.intValue(), "Appointments", date);
    //             }
    //         }

    //         // Create the chart
    //         JFreeChart chart = ChartFactory.createLineChart(
    //                 "Appointments Per Day",
    //                 "Date",
    //                 "Number of Appointments",
    //                 dataset,
    //                 PlotOrientation.VERTICAL,
    //                 true, // Show legend
    //                 true, // Show tooltips
    //                 false // No URLs
    //         );

    //         // Customize the chart
    //         CategoryPlot plot = chart.getCategoryPlot();
    //         NumberAxis yAxis = (NumberAxis) plot.getRangeAxis();
    //         yAxis.setStandardTickUnits(NumberAxis.createIntegerTickUnits()); // Ensure integer tick units

    //         CategoryAxis xAxis = plot.getDomainAxis();
    //         xAxis.setLabelAngle(Math.PI / 4); // Rotate the X-axis labels for better readability
    //         xAxis.setCategoryLabelPositions(CategoryLabelPositions.createUpRotationLabelPositions(0.5f));

    //         // Output chart to byte array
    //         ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    //         ChartUtils.writeChartAsPNG(outputStream, chart, 1200, 800); // Increase chart size for better display

    //         return ResponseEntity
    //                 .ok()
    //                 .contentType(MediaType.IMAGE_PNG)
    //                 .body(outputStream.toByteArray());

    //     } catch (IOException e) {
    //         e.printStackTrace();
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }

    @GetMapping(value = "/generate-report", produces = MediaType.IMAGE_PNG_VALUE)
public ResponseEntity<byte[]> generateReport(@RequestParam("type") String type) {
    try {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();

        if ("user".equals(type)) {
            // Generate User Report
            List<Object[]> data = adminService.getUserCountPerDay();

            // Get the current date and month
            Calendar calendar = Calendar.getInstance();
            int currentMonth = calendar.get(Calendar.MONTH); // 0-based index (January = 0)
            int currentYear = calendar.get(Calendar.YEAR);

            // Create a list of all dates for the current month (1st to last day)
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            int daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);

            // Initialize all days of the current month with 0 users
            for (int day = 1; day <= daysInMonth; day++) {
                String date = String.format("%d-%02d-%02d", currentYear, currentMonth + 1, day); // Format: yyyy-MM-dd
                dataset.addValue(0, "Users", date); // Initially add 0 users for each date
            }

            // Add user data to the dataset
            for (Object[] entry : data) {
                if (entry[0] != null) {
                    String date = entry[0].toString(); // Date as String
                    Long count = ((Number) entry[1]).longValue(); // Count

                    dataset.addValue(count.intValue(), "Users", date);
                }
            }

        } else if ("appointment".equals(type)) {
            // Generate Appointment Report
            List<Object[]> data = adminService.getAppointmentCountPerDay(); // Get appointment count per day

            // Add appointment data to the dataset
            for (Object[] entry : data) {
                if (entry[0] != null && entry[1] != null) {
                    String date = entry[0].toString(); // Date as String
                    Long count = ((Number) entry[1]).longValue(); // Appointment count

                    dataset.addValue(count.intValue(), "Appointments", date);
                }
            }
        } else {
            return ResponseEntity.badRequest().build(); // Invalid 'type' parameter
        }

        // Create the chart
        JFreeChart chart = ChartFactory.createLineChart(
                "Report Per Day", // Generalized chart title
                "Date",
                "Count",
                dataset,
                PlotOrientation.VERTICAL,
                true, // Show legend
                true, // Show tooltips
                false // No URLs
        );

        // Customize the chart
        CategoryPlot plot = chart.getCategoryPlot();
        NumberAxis yAxis = (NumberAxis) plot.getRangeAxis();
        yAxis.setStandardTickUnits(NumberAxis.createIntegerTickUnits()); // Ensure integer tick units

        CategoryAxis xAxis = plot.getDomainAxis();
        xAxis.setLabelAngle(Math.PI / 4); // Rotate the X-axis labels for better readability
        xAxis.setCategoryLabelPositions(CategoryLabelPositions.createUpRotationLabelPositions(0.5f));

        // Output chart to byte array
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(outputStream, chart, 1200, 800); // Increase chart size for better display

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(outputStream.toByteArray());

    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


}
