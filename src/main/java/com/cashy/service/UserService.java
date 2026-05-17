package com.cashy.service;

import com.cashy.entity.User;
import com.cashy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String USER_NOT_FOUND = "User not found: %s";
    private static final String EMAIL_ALREADY_IN_USE = "Email already in use: %s";
    private static final String USERNAME_ALREADY_TAKEN = "Username already taken: %s";
    private static final String PASSWORD_INCORRECT = "Current password is incorrect";
    private static final String ROLE_PREFIX = "ROLE_";

    // Used by Spring Security to load user by email during authentication
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND, email)));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(ROLE_PREFIX + user.getRole().name()))
        );
    }

    // ФИ2 – Registration
    public User register(String email, String username, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(String.format(EMAIL_ALREADY_IN_USE, email));
        }
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException(String.format(USERNAME_ALREADY_TAKEN, username));
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.USER);

        return userRepository.save(user);
    }

    // ФИ3 – Find by email (used after authentication)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(String.format(USER_NOT_FOUND, email)));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(String.format(USER_NOT_FOUND, id)));
    }

    // Profile management
    public User updateUsername(Long id, String newUsername) {
        if (userRepository.existsByUsername(newUsername)) {
            throw new IllegalArgumentException(String.format(USERNAME_ALREADY_TAKEN, newUsername));
        }
        User user = findById(id);
        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    public User updatePassword(Long id, String currentPassword, String newPassword) {
        User user = findById(id);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException(PASSWORD_INCORRECT);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    // ФИ15 – Admin: delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException(String.format(USER_NOT_FOUND, id));
        }
        userRepository.deleteById(id);
    }

    // ФИ16 – Admin: manage roles
    public User updateRole(Long id, User.Role role) {
        User user = findById(id);
        user.setRole(role);
        return userRepository.save(user);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return findByEmail(email);
    }

    // Admin: list all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }
}
