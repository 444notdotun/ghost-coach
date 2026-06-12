package com.coach.ghostcoach.data.repository;

import com.coach.ghostcoach.data.model.Chatlog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatLogRepository extends JpaRepository<Chatlog, UUID> {
}
