package com.leansofx.qaserviceuser.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping
    public List<Map<String, Object>> getAllDoctors() {
        List<Map<String, Object>> doctors = jdbcTemplate.queryForList(
            "SELECT id, name, title, department, avatar, experience, specialties, is_active FROM doctors"
        );
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> doctor : doctors) {
            Map<String, Object> transformed = new HashMap<>();
            transformed.put("id", doctor.get("id"));
            transformed.put("name", doctor.get("name"));
            transformed.put("title", doctor.get("title"));
            transformed.put("department", doctor.get("department"));
            transformed.put("avatar", doctor.get("avatar"));
            transformed.put("experience", doctor.get("experience"));
            transformed.put("specialties", doctor.get("specialties"));
            transformed.put("isActive", doctor.get("is_active"));
            result.add(transformed);
        }
        return result;
    }

    @GetMapping("/active")
    public List<Map<String, Object>> getActiveDoctors() {
        List<Map<String, Object>> doctors = jdbcTemplate.queryForList(
            "SELECT id, name, title, department, avatar, experience, specialties, is_active FROM doctors WHERE is_active = 1"
        );
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> doctor : doctors) {
            Map<String, Object> transformed = new HashMap<>();
            transformed.put("id", doctor.get("id"));
            transformed.put("name", doctor.get("name"));
            transformed.put("title", doctor.get("title"));
            transformed.put("department", doctor.get("department"));
            transformed.put("avatar", doctor.get("avatar"));
            transformed.put("experience", doctor.get("experience"));
            transformed.put("specialties", doctor.get("specialties"));
            transformed.put("isActive", doctor.get("is_active"));
            result.add(transformed);
        }
        return result;
    }
}
