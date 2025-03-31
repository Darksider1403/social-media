package com.java.social_media.controller;

import com.java.social_media.config.JwtProvider;
import com.java.social_media.models.User;
import com.java.social_media.repository.UserRepository;
import com.java.social_media.request.LoginRequest;
import com.java.social_media.response.AuthResponse;
import com.java.social_media.service.impl.CustomerUserDetailService;
import com.java.social_media.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {
    private UserService userService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private CustomerUserDetailService customerUserDetail;

    // /auth/signup
    @PostMapping("/signup")
    public AuthResponse createUser(@RequestBody User user) throws Exception {
        User isExist = userRepository.findByEmail(user.getEmail());

        if (isExist != null) {
            throw new Exception("This email already used by another user");
        }

        User newUser = new User();

        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setGender(user.getGender());

        User savedUser = userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());
        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse(token, "Register success");

        return authResponse;
    }

    // /auth/signin
    @PostMapping("/signin")
    public AuthResponse signIn(@RequestBody LoginRequest loginRequest) {
        Authentication authentication =
                authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        String token = JwtProvider.generateToken(authentication);
        AuthResponse authResponse = new AuthResponse(token, "Login success");

        return authResponse;
    }

    private Authentication authenticate(String email, String password) {
        UserDetails userDetails = customerUserDetail.loadUserByUsername(email);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
