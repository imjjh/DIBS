# 1. Build Stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon
COPY src src
RUN ./gradlew clean build -x test --no-daemon

# 2. Run Stage
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# UID 1000으로 명시적 사용자 생성 (EC2 기본 사용자 권한과 일치)
RUN addgroup -g 1000 -S spring && \
    adduser -u 1000 -S spring -G spring

# 빌드 스테이지에서 생성된 jar 파일 복사 및 소유권 변경
COPY --from=builder --chown=spring:spring /app/build/libs/*.jar app.jar

USER spring

ENV JAVA_OPTS="-Xms512m -Xmx768m"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
