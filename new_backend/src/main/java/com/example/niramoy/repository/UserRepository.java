package com.example.niramoy.repository;

import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long>
{

    @Query("SELECT u FROM User u")
    List<User> getAll();

    // Add pagination support to prevent loading all users at once
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    Page<User> getAllWithPagination(Pageable pageable);



    User findByUsername(@Param("username") String username);
    User findByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.username = :useremail OR u.email = :useremail")
    User findByUsernameOrEmail(String useremail );


    User findUserByUsernameOrEmail(String username, String email);

}


