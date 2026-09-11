package com.saarthi.backend.repository;

import com.saarthi.backend.entity.ChildGuardian;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChildGuardianRepository extends JpaRepository<ChildGuardian, Long> {

    List<ChildGuardian> findByUserId(Long userId);

    List<ChildGuardian> findByChildId(Long childId);

    Optional<ChildGuardian> findByChildIdAndUserId(Long childId, Long userId);
}