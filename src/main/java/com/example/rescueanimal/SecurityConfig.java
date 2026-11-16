package com.example.rescueanimal;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // H2 Console へのアクセスを許可する
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/h2-console/**").permitAll()
                    .anyRequest().authenticated()
            )
            // H2 Console 用のCSRF保護を無効にする（403エラーの解除）
            .csrf(csrf -> csrf
                    .ignoringRequestMatchers("/h2-console/**")
            )
            // H2 Console の画面（iframe）表示を許可する
            .headers(headers -> headers
                    .frameOptions(frame -> frame.sameOrigin())
            )
            // 他の画面用のログインフォームはそのまま維持
            .formLogin(form -> {});

        return http.build();
    }
}
