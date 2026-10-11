# Multi-stage build shared by every backend module:  docker build --build-arg MODULE=employee-service .
FROM maven:3.9-eclipse-temurin-21 AS build
ARG MODULE
WORKDIR /src
COPY pom.xml .
COPY . .
# -am builds the "common" module too; tests run in CI, not in the image build.
RUN mvn -B -q -pl ${MODULE} -am package -DskipTests

FROM eclipse-temurin:21-jre-alpine
ARG MODULE
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /src/${MODULE}/target/${MODULE}-*.jar app.jar
USER app
# Container-aware heap sizing; virtual threads for blocking I/O (JDBC, REST) under load.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75" SPRING_THREADS_VIRTUAL_ENABLED=true
ENTRYPOINT ["java", "-jar", "app.jar"]
