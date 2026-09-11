package com.saarthi.backend.service;

import com.saarthi.backend.dto.*;
import com.saarthi.backend.entity.*;
import com.saarthi.backend.exception.ForbiddenException;
import com.saarthi.backend.exception.ResourceNotFoundException;
import com.saarthi.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ChildRepository childRepository;
    private final ChildGuardianRepository childGuardianRepository;
    private final ChildNeedsProfileRepository childNeedsProfileRepository;
    private final ProgramRepository programRepository;
    private final ProgressLogRepository progressLogRepository;

    public DashboardService(
            UserRepository userRepository,
            ChildRepository childRepository,
            ChildGuardianRepository childGuardianRepository,
            ChildNeedsProfileRepository childNeedsProfileRepository,
            ProgramRepository programRepository,
            ProgressLogRepository progressLogRepository) {

        this.userRepository = userRepository;
        this.childRepository = childRepository;
        this.childGuardianRepository = childGuardianRepository;
        this.childNeedsProfileRepository = childNeedsProfileRepository;
        this.programRepository = programRepository;
        this.progressLogRepository = progressLogRepository;
    }

    public UserDashboardResponse getUserDashboard(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<ChildGuardian> links = childGuardianRepository.findByUserId(user.getId());

        int totalChildren = links.size();
        int asGuardianCount = (int) links.stream().filter(l -> "GUARDIAN".equalsIgnoreCase(l.getRelationshipType())).count();
        int asCaregiverCount = (int) links.stream().filter(l -> "CAREGIVER".equalsIgnoreCase(l.getRelationshipType())).count();
        int asTherapistCount = (int) links.stream().filter(l -> "THERAPIST".equalsIgnoreCase(l.getRelationshipType())).count();

        List<Long> childIds = links.stream().map(ChildGuardian::getChildId).toList();

        List<UserDashboardResponse.ChildSummaryDto> childSummaries = links.stream()
                .map(link -> {
                    Child child = childRepository.findById(link.getChildId()).orElse(null);
                    if (child == null) return null;

                    Integer age = child.getDateOfBirth() != null ?
                            Period.between(child.getDateOfBirth(), LocalDate.now()).getYears() : null;

                    String primaryDiagnosis = childNeedsProfileRepository.findByChildId(child.getId())
                            .map(ChildNeedsProfile::getPrimaryDiagnosis)
                            .orElse(child.getDisabilityType());

                    int activePrograms = (int) programRepository.findByChildIdAndStatus(child.getId(), "ACTIVE").size();

                    List<ProgressLog> childLogs = progressLogRepository.findByChildId(child.getId());
                    String lastSessionDate = childLogs.stream()
                            .map(ProgressLog::getSessionDate)
                            .max(Comparator.naturalOrder())
                            .map(LocalDate::toString)
                            .orElse(null);

                    return new UserDashboardResponse.ChildSummaryDto(
                            child.getId(),
                            child.getFirstName(),
                            child.getLastName(),
                            age,
                            child.getGender(),
                            link.getRelationshipType(),
                            primaryDiagnosis,
                            activePrograms,
                            lastSessionDate
                    );
                })
                .filter(c -> c != null)
                .toList();

        int totalActivePrograms = childSummaries.stream()
                .mapToInt(UserDashboardResponse.ChildSummaryDto::getActiveProgramsCount)
                .sum();

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        List<ProgressLog> allUserChildLogs = childIds.stream()
                .flatMap(cId -> progressLogRepository.findByChildId(cId).stream())
                .toList();

        int totalSessionsLast7Days = (int) allUserChildLogs.stream()
                .filter(l -> !l.getSessionDate().isBefore(sevenDaysAgo))
                .count();

        List<ProgressLogResponse> recentSessions = allUserChildLogs.stream()
                .sorted(Comparator.comparing(ProgressLog::getSessionDate).reversed()
                        .thenComparing(ProgressLog::getCreatedAt, Comparator.reverseOrder()))
                .limit(5)
                .map(l -> {
                    User logger = userRepository.findById(l.getLoggedByUserId()).orElse(null);
                    Program prog = l.getProgramId() != null ? programRepository.findById(l.getProgramId()).orElse(null) : null;
                    return new ProgressLogResponse(l, logger, prog);
                })
                .toList();

        UserDashboardResponse dashboard = new UserDashboardResponse();
        dashboard.setUserId(user.getId());
        dashboard.setEmail(user.getEmail());
        dashboard.setFullName(user.getFirstName() + (user.getLastName() != null ? " " + user.getLastName() : ""));
        dashboard.setRole(user.getRole());
        dashboard.setTotalChildren(totalChildren);
        dashboard.setAsGuardianCount(asGuardianCount);
        dashboard.setAsCaregiverCount(asCaregiverCount);
        dashboard.setAsTherapistCount(asTherapistCount);
        dashboard.setTotalActivePrograms(totalActivePrograms);
        dashboard.setTotalSessionsLast7Days(totalSessionsLast7Days);
        dashboard.setChildren(childSummaries);
        dashboard.setRecentSessions(recentSessions);

        return dashboard;
    }

    public ChildDashboardResponse getChildDashboard(Long childId, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        boolean isAdmin = "ADMIN".equals(user.getRole());

        if (!isAdmin) {
            childGuardianRepository.findByChildIdAndUserId(childId, user.getId())
                    .orElseThrow(() -> new ForbiddenException("You do not have access to this child"));
        }

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new ResourceNotFoundException("Child not found with ID " + childId));

        Integer age = child.getDateOfBirth() != null ?
                Period.between(child.getDateOfBirth(), LocalDate.now()).getYears() : null;

        ChildNeedsProfileResponse needsProfile = childNeedsProfileRepository.findByChildId(childId)
                .map(ChildNeedsProfileResponse::new)
                .orElse(null);

        List<ChildGuardianResponse> careTeam = childGuardianRepository.findByChildId(childId).stream()
                .map(l -> new ChildGuardianResponse(l, userRepository.findById(l.getUserId()).orElse(null)))
                .toList();

        List<Program> programs = programRepository.findByChildId(childId);
        int totalProgramsCount = programs.size();
        int activeProgramsCount = (int) programs.stream().filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus())).count();
        int completedProgramsCount = (int) programs.stream().filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus())).count();

        List<ProgramResponse> activePrograms = programs.stream()
                .filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()))
                .map(p -> new ProgramResponse(p, userRepository.findById(p.getCreatedByUserId()).orElse(null)))
                .toList();

        List<ProgressLog> logs = progressLogRepository.findByChildId(childId);
        int totalSessionsLogged = logs.size();
        int totalMinutesLogged = logs.stream()
                .mapToInt(l -> l.getDurationMinutes() != null ? l.getDurationMinutes() : 0)
                .sum();

        List<ProgressLogResponse> recentSessions = logs.stream()
                .sorted(Comparator.comparing(ProgressLog::getSessionDate).reversed()
                        .thenComparing(ProgressLog::getCreatedAt, Comparator.reverseOrder()))
                .limit(5)
                .map(l -> {
                    User logger = userRepository.findById(l.getLoggedByUserId()).orElse(null);
                    Program prog = l.getProgramId() != null ? programRepository.findById(l.getProgramId()).orElse(null) : null;
                    return new ProgressLogResponse(l, logger, prog);
                })
                .toList();

        Map<String, Long> moodDistribution = logs.stream()
                .filter(l -> l.getMoodRating() != null && !l.getMoodRating().isBlank())
                .collect(Collectors.groupingBy(ProgressLog::getMoodRating, Collectors.counting()));

        Map<String, Long> performanceDistribution = logs.stream()
                .filter(l -> l.getPerformanceRating() != null && !l.getPerformanceRating().isBlank())
                .collect(Collectors.groupingBy(ProgressLog::getPerformanceRating, Collectors.counting()));

        ChildDashboardResponse response = new ChildDashboardResponse();
        response.setChildId(child.getId());
        response.setFirstName(child.getFirstName());
        response.setLastName(child.getLastName());
        response.setFullName(child.getFirstName() + (child.getLastName() != null ? " " + child.getLastName() : ""));
        response.setAge(age);
        response.setGender(child.getGender());
        response.setDateOfBirth(child.getDateOfBirth() != null ? child.getDateOfBirth().toString() : null);
        response.setDisabilityType(child.getDisabilityType());
        response.setAdditionalNeeds(child.getAdditionalNeeds());
        response.setNeedsProfile(needsProfile);
        response.setCareTeam(careTeam);
        response.setTotalProgramsCount(totalProgramsCount);
        response.setActiveProgramsCount(activeProgramsCount);
        response.setCompletedProgramsCount(completedProgramsCount);
        response.setActivePrograms(activePrograms);
        response.setTotalSessionsLogged(totalSessionsLogged);
        response.setTotalMinutesLogged(totalMinutesLogged);
        response.setRecentSessions(recentSessions);
        response.setMoodDistribution(moodDistribution);
        response.setPerformanceDistribution(performanceDistribution);

        return response;
    }

    public AdminDashboardResponse getAdminDashboard(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (!"ADMIN".equals(user.getRole())) {
            throw new ForbiddenException("Only an ADMIN can view platform analytics");
        }

        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();
        long totalActiveUsers = allUsers.stream().filter(u -> Boolean.TRUE.equals(u.getActive())).count();

        List<Child> allChildren = childRepository.findAll();
        long totalChildren = allChildren.size();
        long totalActiveChildren = allChildren.stream().filter(c -> Boolean.TRUE.equals(c.getActive())).count();

        List<Program> allPrograms = programRepository.findAll();
        long totalPrograms = allPrograms.size();
        long totalActivePrograms = allPrograms.stream().filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus())).count();

        List<ProgressLog> allLogs = progressLogRepository.findAll();
        long totalProgressLogs = allLogs.size();
        long totalMinutesLogged = allLogs.stream().mapToLong(l -> l.getDurationMinutes() != null ? l.getDurationMinutes() : 0).sum();

        Map<String, Long> roleBreakdown = allUsers.stream()
                .collect(Collectors.groupingBy(User::getRole, Collectors.counting()));

        Map<String, Long> relationshipTypeBreakdown = childGuardianRepository.findAll().stream()
                .collect(Collectors.groupingBy(ChildGuardian::getRelationshipType, Collectors.counting()));

        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalUsers(totalUsers);
        response.setTotalActiveUsers(totalActiveUsers);
        response.setTotalChildren(totalChildren);
        response.setTotalActiveChildren(totalActiveChildren);
        response.setTotalPrograms(totalPrograms);
        response.setTotalActivePrograms(totalActivePrograms);
        response.setTotalProgressLogs(totalProgressLogs);
        response.setTotalMinutesLogged(totalMinutesLogged);
        response.setRoleBreakdown(roleBreakdown);
        response.setRelationshipTypeBreakdown(relationshipTypeBreakdown);

        return response;
    }
}
