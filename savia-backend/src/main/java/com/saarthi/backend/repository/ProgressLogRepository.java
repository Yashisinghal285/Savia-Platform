package com.saarthi.backend.repository;

import com.saarthi.backend.entity.ProgressLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ProgressLogRepository extends JpaRepository<ProgressLog, Long> {

    List<ProgressLog> findByChildId(Long childId);

    List<ProgressLog> findByChildIdAndProgramId(Long childId, Long programId);

    List<ProgressLog> findByChildIdAndSessionDateBetween(Long childId, LocalDate startDate, LocalDate endDate);

    List<ProgressLog> findByProgramId(Long programId);
}
