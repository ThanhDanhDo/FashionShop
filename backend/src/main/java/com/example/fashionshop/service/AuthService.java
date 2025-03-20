package com.example.fashionshop.service;

import com.example.fashionshop.config.JwtProvider;
import com.example.fashionshop.config.OtpGenerator;
import com.example.fashionshop.enums.Gender;
import com.example.fashionshop.enums.Role;
import com.example.fashionshop.model.User;
import com.example.fashionshop.model.VerificationCode;
import com.example.fashionshop.repository.UserRepository;
import com.example.fashionshop.repository.verificationCodeRepository;
import com.example.fashionshop.request.LogInRequest;
import com.example.fashionshop.request.RegisterRequest;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final verificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public String sendOtp(RegisterRequest req) throws MessagingException {
        if(userRepository.findByEmail(req.getEmail()) !=null ){
            throw new IllegalArgumentException("Email đã được sử dụng!");
        }

        // Tạo OTP
        String otp = OtpGenerator.generateOTP();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);

        // Xóa OTP cũ nếu có
        VerificationCode existingOtp = verificationCodeRepository.findByEmail(req.getEmail());
        if (existingOtp != null) {
            verificationCodeRepository.delete(existingOtp);
        }

        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(req.getEmail());
        verificationCode.setOtp(otp);
        verificationCode.setExpirationTime(expirationTime);
        verificationCodeRepository.save(verificationCode);

        // Gửi email
        String subject = "Login/Signup Otp";
        String text = "your register otp is - ";

        emailService.sendVerificationOtpEmail(req.getEmail(), otp, subject, text);
        return "OTP đã được gửi tới email. Vui lòng xác thực để hoàn tất đăng ký!";
    }

    public String createUser(String otp, RegisterRequest req, HttpServletResponse response) throws MessagingException{
        String email = req.getEmail();

        VerificationCode verificationCode = verificationCodeRepository.findByEmail(email);
        if(verificationCode == null){
            throw new IllegalArgumentException("Không thấy email!");
        }

        //kiem tra otp
        if (!verificationCode.getOtp().equals(otp.trim()) ||
                verificationCode.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP không đúng hoặc đã hết hạn!");
        }

        // Xóa sau khi xác thực thành công
        verificationCodeRepository.delete(verificationCode);

        // Tạo user và lưu vào database
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setGender(Gender.valueOf(req.getGender()));
        user.setRole(Role.USER);
        userRepository.save(user);

        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        // Tạo token cho user
        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);

        // Thêm vào SecurityContext để lưu trạng thái đăng nhập
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Set JWT vào Cookie
        jwtProvider.generateToken(authentication, response);

        return "Đăng ký thành công!";
    }

    public String logIn(LogInRequest req, HttpServletResponse response) {
        User user = userRepository.findByEmail(req.getEmail());

        if(user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Thông tin đăng nhập không đúng!");
        }

        // Lấy role của user
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().toString()));

        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Set JWT vào Cookie
        jwtProvider.generateToken(authentication, response);

        return "Đăng nhập thành công!";
    }

    public String logOut(HttpServletResponse response){
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return "Đăng xuất thành công!";
    }

}
