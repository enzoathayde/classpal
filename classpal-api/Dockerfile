# ---- build ----
FROM eclipse-temurin:23-jdk-alpine AS build
WORKDIR /workspace

COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew \
	&& ./gradlew dependencies --no-daemon --quiet || true

COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon \
	&& mv build/libs/*.jar /workspace/app.jar

# ---- runtime ----
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

RUN addgroup -S classpal && adduser -S classpal -G classpal
USER classpal

COPY --from=build /workspace/app.jar ./app.jar

# Render injeta PORT; free tier tem ~512 MiB — limita a heap da JVM
ENV JAVA_OPTS="-XX:MaxRAMPercentage=70.0 -XX:+UseContainerSupport"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
