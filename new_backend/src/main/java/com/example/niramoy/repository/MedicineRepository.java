package com.example.niramoy.repository;

import com.example.niramoy.entity.Medicine;
import com.example.niramoy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findMedicineByVisit_User(User visitUser);

}
