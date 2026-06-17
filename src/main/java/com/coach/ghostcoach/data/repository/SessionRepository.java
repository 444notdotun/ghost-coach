package com.coach.ghostcoach.data.repository;

import com.coach.ghostcoach.data.model.Player;
import com.coach.ghostcoach.data.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionRepository  extends JpaRepository<Session, String> {
    Optional<Session> findBySessionId(String sessionId);
    List<Session> findSessionsByPlayer(Player playerId);
    @Query("SELECT s FROM Session s JOIN FETCH s.player JOIN FETCH s.feedback WHERE s.sessionId = :id")
    Optional<Session> findByIdWithPlayerAndFeedback(@Param("id") String id);
}
