FROM maven:3.9-eclipse-temurin-21 AS build

# Set working directory in the container
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download all required dependencies into one layer
RUN mvn dependency:go-offline -B

# Copy your source code
COPY src ./src

# Copy any other necessary files (if they exist)
COPY .mvn ./.mvn
COPY mvnw ./
COPY mvnw.cmd ./

# Package the application
RUN mvn package -DskipTests

# Use Eclipse Temurin JDK 21 for the final image
FROM eclipse-temurin:21-jdk-jammy

# Set working directory
WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set the startup command
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

# Expose the port the app runs on
EXPOSE 8080