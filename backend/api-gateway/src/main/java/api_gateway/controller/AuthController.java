package api_gateway.controller;

import api_gateway.properties.AuthProperties;
import api_gateway.service.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(@NotBlank String username, @NotBlank String password) { }
    public record LoginResponse(String token, String username, String role, long expiresInSeconds) { }

    private final PasswordEncoder encoder = new BCryptPasswordEncoder();
    private final JwtService jwt;
    /** username -> {bcrypt hash, role} */
    private final Map<String, String[]> users;

    public AuthController(JwtService jwt, AuthProperties props) {
        this.jwt = jwt;
        this.users = Map.of(
                "hr.admin", new String[] {encoder.encode(props.adminPassword()), "HR_ADMIN"},
                "hr.viewer", new String[] {encoder.encode(props.viewerPassword()), "HR_VIEWER"});
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        String[] user = users.get(req.username());
        // Same error for unknown user and wrong password: do not leak which usernames exist.
        if (user == null || !encoder.matches(req.password(), user[0])) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
        return new LoginResponse(jwt.issue(req.username(), user[1]), req.username(), user[1], jwt.ttlSeconds());
    }
}
