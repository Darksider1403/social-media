package com.java.social_media.service.impl;

import com.java.social_media.models.User;
import com.java.social_media.repository.UserRepository;
import com.java.social_media.service.OAuth2UserService;
import com.java.social_media.config.OAuth2UserPrincipal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@Service
@AllArgsConstructor
public class OAuth2UserServiceImplementation extends DefaultOAuth2UserService implements OAuth2UserService {

    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract user details
        String email = extractEmail(oAuth2User);
        String name = extractName(oAuth2User);

        // Check if user exists
        User user = userRepository.findByEmail(email);

        if (user == null) {
            // Create new user
            user = new User();
            user.setEmail(email);
            // Parse name into first and last
            String[] nameParts = name.split(" ");
            user.setFirstName(nameParts[0]);
            if (nameParts.length > 1) {
                user.setLastName(nameParts[1]);
            } else {
                user.setLastName("");
            }
            // Set provider as Google
            user.setProvider("google");
            // Generate random secure password
            user.setPassword(UUID.randomUUID().toString());
            userRepository.save(user);
        }

        return new OAuth2UserPrincipal(oAuth2User, user);
    }

    @Override
    public String extractEmail(OAuth2User oAuth2User) {
        return oAuth2User.getAttribute("email");
    }

    @Override
    public String extractName(OAuth2User oAuth2User) {
        return oAuth2User.getAttribute("name");
    }
}