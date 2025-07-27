# DoctorsHub – Concepts for Doctor Context

**Project Summary:**
DoctorsHub is a web-based healthcare platform designed to simplify the process of finding doctors based on location and specialization. The system enhances accessibility to healthcare providers, ensuring that users can efficiently connect with the right medical professionals.

## Context: Patient

### Object: User  
**Context**: Patient  
**Important Info**: 

  * First name, 
  * last name
  * date of birth 
  * email
  * phone number
  * password
  * role = PATIENT

### Object: Doctor  
**Context**: Browsing and booking  
**Important Info**: 
	* Name,
	* specialization
	* experience
	* consultation fee
	* availability
	* rating

### Object: Appointment  
**Context**: Booking and tracking appointments  
**Important Info**: 
	* Appointment ID
	* patient ID
	* doctor ID
	* date/time
	* status (BOOKED, CANCELLED, COMPLETED)

### Object: Payment  
**Context**: Paying for appointments  
**Important Info**: 
	* Razorpay Order ID
	* payment ID
	* invoice ID
	* amount
	* status (PENDING, SUCCESS, FAILED)
	* appointment ID

### Object: Razorpay Gateway  
**Context**: Online transaction processing  
**Important Info**: 
	* API keys
	* verification status
	* callback URL
	* linked invoice ID

### Object: Patient Dashboard  
**Context**: Viewing patient-specific data  
**Important Info**: 
	* List of appointments
	* payment status
	* profile info
	* option to update profile

### Object: Auth System  
**Context**: Login and security  
**Important Info**: 
	* JWT token
	* expiration
	* refresh token
	* role-based redirect (to patient or admin or doctor)

### Object: Review  
**Context**: Feedback after appointment  
**Important Info**: 
	* Doctor ID
	* patient ID
	* rating (1-5)
	* review text
	* date

### Object: Notification   
**Context**: Reminders and alerts  
**Important Info**: 
	* Appointment reminders
	* payment confirmation
	* doctor schedule changes

## Context: Doctor 

Doctors in *DoctorsHub* are registered healthcare professionals whose profiles are accessible to users (patients). The platform enables doctors to manage their availability, appointments, and profile details.

### Object: Doctor Profile

* **Context**: A patient is viewing doctor details before booking.
* **Information Important**:

  * Full Name
  * Gender
  * Specialization (e.g., Dermatologist, Cardiologist)
  * Qualifications (e.g., MBBS, MD)
  * Years of Experience
  * Consultation Fees
  * Clinic/Hospital Address
  * Available Time Slots
  * Languages Spoken
  * Profile Photo

### Object: Doctor Availability

* **Context**: A patient filters doctors based on their available time.
* **Information Important**:

  * Days and time slots (e.g., Mon–Fri, 10 AM – 2 PM)
  * Current availability status
  * Booking capacity per slot

### Object: Doctor Appointment Management

* **Context**: A doctor manages their appointments.
* **Information Important**:

  * List of upcoming/past appointments
  * Patient details (name, reason, time)
  * Appointment status (Confirmed / Cancelled / Completed)
  * Rescheduling options

### Object: Reviews & Ratings

* **Context**: A patient assesses a doctor before booking or provides feedback after consultation.
* **Information Important**:

  * Average Rating (e.g., 4.5/5)
  * Individual Review Comments
  * Reviewer's name (optional)
  * Review Date
  * Total number of reviews

### Object: Doctor Account

* **Context**: A doctor registers or logs in to manage their presence.
* **Information Important**:

  * Email / Phone (for login)
  * Password (secured)
  * Profile Management (edit specialization, bio, timings)
  * Notification Preferences (email/SMS alerts)
