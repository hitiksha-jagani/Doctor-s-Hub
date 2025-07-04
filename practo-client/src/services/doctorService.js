// src/services/doctorService.js
const BASE_URL = "http://localhost:8080"; // Your Spring Boot backend URL

export async function fetchAllDoctors() {
  const response = await fetch(`${BASE_URL}/doctors`);
  return response.json();
}

export async function fetchDoctorById(doctorId) {
  const response = await fetch(`${BASE_URL}/doctors/${doctorId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch doctor with ID ${doctorId}`);
  }
  return response.json();
}


// src/services/doctorService.js
export const addReview = async ({ doctorId, userId, rating, review }) => {
    const res = await fetch(`/review/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ doctorId, userId, rating, review }),
    });
  
    if (!res.ok) throw new Error("Failed to post review");
    return res.json();
  };
 

export async function getDoctorReviews(doctorId) {
    const response = await fetch(`http://localhost:8080/doctors/${doctorId}/reviews`);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    return response.json();
  }
  
