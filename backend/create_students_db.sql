CREATE DATABASE students_db;

\c students_db;

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    year INTEGER CHECK (year BETWEEN 1 AND 4) NOT NULL,
    gpa NUMERIC(3,2) CHECK (gpa BETWEEN 0.00 AND 4.00)
);