package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/altradits/bursaryhub/backend/handlers"
	"github.com/altradits/bursaryhub/backend/middleware"
	"github.com/altradits/bursaryhub/backend/repository"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	db, err := repository.InitDB(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	r := mux.NewRouter()

	// CORS middleware
	r.Use(middleware.CORS)

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "ok",
			"service": "BursaryHub API",
			"version": "1.0.0",
		})
	}).Methods("GET")

	// Auth routes (no protection)
	r.HandleFunc("/api/auth/login", handlers.Login).Methods("POST")
	r.HandleFunc("/api/auth/verify-otp", handlers.VerifyOTP).Methods("POST")

	// Protected routes
	api := r.PathPrefix("/api").Subrouter()
	api.Use(middleware.AuthMiddleware)

	// Admin routes
	api.HandleFunc("/admin/users", handlers.GetAllUsers).Methods("GET")
	api.HandleFunc("/admin/users/{id}", handlers.DeleteUser).Methods("DELETE")
	api.HandleFunc("/admin/donors", handlers.GetAllDonors).Methods("GET")
	api.HandleFunc("/admin/schools", handlers.GetAllSchools).Methods("GET")
	api.HandleFunc("/admin/students", handlers.GetAllStudents).Methods("GET")

	// Donor routes
	api.HandleFunc("/donors", handlers.CreateDonor).Methods("POST")
	api.HandleFunc("/donors", handlers.GetDonors).Methods("GET")
	api.HandleFunc("/donors/{id}", handlers.GetDonor).Methods("GET")
	api.HandleFunc("/donors/{id}", handlers.UpdateDonor).Methods("PUT")
	api.HandleFunc("/donors/{id}/contributions", handlers.GetDonorContributions).Methods("GET")

	// School routes
	api.HandleFunc("/schools", handlers.CreateSchool).Methods("POST")
	api.HandleFunc("/schools", handlers.GetSchools).Methods("GET")
	api.HandleFunc("/schools/{id}", handlers.GetSchool).Methods("GET")
	api.HandleFunc("/schools/{id}", handlers.UpdateSchool).Methods("PUT")

	// Student routes
	api.HandleFunc("/students", handlers.CreateStudent).Methods("POST")
	api.HandleFunc("/students", handlers.GetStudents).Methods("GET")
	api.HandleFunc("/students/{id}", handlers.GetStudent).Methods("GET")
	api.HandleFunc("/students/{id}", handlers.UpdateStudent).Methods("PUT")
	api.HandleFunc("/students/{id}/fees", handlers.GetStudentFees).Methods("GET")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}
