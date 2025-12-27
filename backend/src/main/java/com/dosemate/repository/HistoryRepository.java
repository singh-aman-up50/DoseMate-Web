package com.dosemate.repository;

import com.dosemate.model.History;
import com.dosemate.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
	void deleteAllByReminder(com.dosemate.model.Reminder reminder);
	List<History> findByReminder_Medicine_User(User user);
	List<History> findByReminder_Medicine_UserOrderByRecordedAtDesc(User user);
}
