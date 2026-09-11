package com.saarthi.backend.repository;

import com.saarthi.backend.entity.Child;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildRepository extends JpaRepository<Child, Long> {
}