package com.saarthi.backend.repository;

import com.saarthi.backend.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgramRepository extends JpaRepository<Program, Long> {

    List<Program> findByChildId(Long childId);

    List<Program> findByChildIdAndStatus(Long childId, String status);

    List<Program> findByChildIdAndCategory(Long childId, String category);
}
