package com.saarthi.backend.repository;

import com.saarthi.backend.entity.ChildNeedsProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChildNeedsProfileRepository extends JpaRepository<ChildNeedsProfile, Long> {

    Optional<ChildNeedsProfile> findByChildId(Long childId);

    boolean existsByChildId(Long childId);
}
