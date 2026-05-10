package com.leansofx.qaserviceuser.repository;

import com.leansofx.qaserviceuser.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {

    Optional<Patient> findByUsername(String username);

    Optional<Patient> findByNameAndBirthday(String name, String birthday);

    boolean existsByUsername(String username);

    boolean existsByPhone(String phone);
}
