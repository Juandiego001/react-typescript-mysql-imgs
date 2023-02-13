-- Creación de la base de datos
CREATE DATABASE users_db;

-- Usar la base de datos
USE users_db;

-- Creación de la tabla de usuarios
CREATE TABLE users(
    email VARCHAR(100) NOT NULL PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    user_photo INTEGER NOT NULL DEFAULT 0,
    suffix_photo VARCHAR(10) NULL
);