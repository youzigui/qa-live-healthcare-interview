package com.leansofx.qaserviceuser.controller;

import com.leansofx.qaserviceuser.entity.Patient;
import com.leansofx.qaserviceuser.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        Optional<Patient> patientOpt = patientRepository.findByUsername(username);

        Map<String, Object> response = new HashMap<>();

        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            if (patient.getPassword().equals(password) && patient.getStatus() == 1) {
                response.put("success", true);
                response.put("message", "登录成功");
                response.put("user", buildPatientResponse(patient));
                return ResponseEntity.ok(response);
            }
        }

        response.put("success", false);
        response.put("message", "用户名或密码错误");
        response.put("user", null);
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String name = request.get("name");
        String birthday = request.get("birthday");
        String phone = request.get("phone");
        String gender = request.get("gender");

        Map<String, Object> response = new HashMap<>();

        if (patientRepository.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "用户名已存在");
            return ResponseEntity.badRequest().body(response);
        }

        if (phone != null && !phone.isEmpty() && patientRepository.existsByPhone(phone)) {
            response.put("success", false);
            response.put("message", "手机号已被注册");
            return ResponseEntity.badRequest().body(response);
        }

        Patient patient = new Patient();
        patient.setId("patient" + System.currentTimeMillis());
        patient.setUsername(username);
        patient.setPassword(password);
        patient.setName(name);
        patient.setBirthday(birthday);
        patient.setPhone(phone);
        patient.setGender(gender);
        patient.setStatus(1);

        patientRepository.save(patient);

        response.put("success", true);
        response.put("message", "注册成功");
        response.put("user", buildPatientResponse(patient));
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String birthday = request.get("birthday");

        Map<String, Object> response = new HashMap<>();

        Optional<Patient> patientOpt = patientRepository.findByNameAndBirthday(name, birthday);

        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            response.put("success", true);
            response.put("message", "验证成功");
            response.put("user", buildPatientResponse(patient));
            return ResponseEntity.ok(response);
        }

        Patient newPatient = new Patient();
        newPatient.setId("patient" + System.currentTimeMillis());
        newPatient.setName(name);
        newPatient.setBirthday(birthday);
        newPatient.setStatus(1);

        patientRepository.save(newPatient);

        response.put("success", true);
        response.put("message", "首次登录，已为您创建账户");
        response.put("user", buildPatientResponse(newPatient));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        Map<String, Object> response = new HashMap<>();

        Optional<Patient> patientOpt = patientRepository.findByUsername(username);

        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            patient.setPassword(newPassword);
            patientRepository.save(patient);

            response.put("success", true);
            response.put("message", "密码重置成功");
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "用户不存在");
        return ResponseEntity.badRequest().body(response);
    }

    private Map<String, Object> buildPatientResponse(Patient patient) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", patient.getId());
        user.put("username", patient.getUsername());
        user.put("name", patient.getName());
        user.put("birthday", patient.getBirthday());
        user.put("phone", patient.getPhone());
        user.put("gender", patient.getGender());
        user.put("avatar", patient.getAvatar());
        return user;
    }
}
