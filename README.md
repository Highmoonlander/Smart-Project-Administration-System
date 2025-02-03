# Smart Project Administration System - Backend

This is the backend for the **Smart Project Administration System**, built with **Spring Boot**. The system is designed to automate and streamline project management tasks, helping project teams track progress, assign tasks, manage resources, and collaborate effectively.

## Features

- **Project Management**: Create, update, and manage projects.
- **Task Management**: Assign tasks, set deadlines, and track progress.
- **Team Collaboration**: Manage and assign team members to projects and tasks.
- **Reporting**: Generate progress reports for various project aspects.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or above
- **Maven** (for managing dependencies)
- **MySQL** (or **PostgreSQL**) database

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Highmoonlander/Smart-Project-Administration-System.git
cd Smart-Project-Administration-System
```
### 2. Configure Database

Ensure that you have MySQL or PostgreSQL running. Create a new database for the application.

```bash
For MySQL, run the following command:
```

### 3. Configure Application Properties

In the src/main/resources/application.properties (or application.yml), configure your database connection:

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/project_management
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

razorpay.key=${RAZORPAY_KEY}
razorpay.secret=${RAZORPAY_SECRET}
```
