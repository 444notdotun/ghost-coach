package com.coach.ghostcoach.data.repository;

import com.coach.ghostcoach.data.model.Chatlog;
import com.coach.ghostcoach.data.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatLogRepository extends JpaRepository<Chatlog, String> {
    @Query("SELECT c FROM Chatlog c JOIN FETCH c.messages WHERE c.session = :session")
    Optional<Chatlog> findBySessionWithMessages(@Param("session") Session session);
}
