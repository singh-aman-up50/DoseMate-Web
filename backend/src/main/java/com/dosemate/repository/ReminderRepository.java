package com.dosemate.repository;

import com.dosemate.model.Reminder;
import com.dosemate.model.ReminderStatus;
import com.dosemate.model.Medicine;
import com.dosemate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByScheduledAtBetween(LocalDateTime start, LocalDateTime end);
    List<Reminder> findByStatus(ReminderStatus status);
    List<Reminder> findByMedicine(Medicine medicine);
    List<Reminder> findByScheduledAtBeforeAndStatus(LocalDateTime time, ReminderStatus status);
    List<Reminder> findByMedicine_User(User user);
    List<Reminder> findByMedicine_UserAndStatus(User user, ReminderStatus status);
}
