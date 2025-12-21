package com.dosemate.repository;

import com.dosemate.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
	void deleteAllByReminder(com.dosemate.model.Reminder reminder);
}
