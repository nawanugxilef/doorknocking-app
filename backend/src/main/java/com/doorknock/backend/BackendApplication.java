package com.doorknock.backend;

import com.doorknock.backend.config.AdminBootstrapProperties;
import com.doorknock.backend.config.MailProperties;
import java.net.URI;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({AdminBootstrapProperties.class, MailProperties.class})
public class BackendApplication {

	public static void main(String[] args) {
		normalizeCloudDatabaseUrl();
		SpringApplication.run(BackendApplication.class, args);
	}

	private static void normalizeCloudDatabaseUrl() {
		String databaseUrl = System.getenv("DATABASE_URL");
		if (databaseUrl == null || databaseUrl.isBlank() || databaseUrl.startsWith("jdbc:postgresql://")) {
			return;
		}
		if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
			return;
		}

		URI uri = URI.create(databaseUrl);
		String[] userInfo = uri.getUserInfo() == null ? new String[]{"", ""} : uri.getUserInfo().split(":", 2);
		String username = userInfo.length > 0 ? userInfo[0] : "";
		String password = userInfo.length > 1 ? userInfo[1] : "";
		int port = uri.getPort() == -1 ? 5432 : uri.getPort();
		String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath();

		System.setProperty("spring.datasource.url", jdbcUrl);
		System.setProperty("spring.datasource.username", username);
		System.setProperty("spring.datasource.password", password);
	}

}
