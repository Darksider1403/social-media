package com.java.social_media.repository;

import com.java.social_media.models.Chat;
import com.java.social_media.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    List<Chat> findByUsersId(Integer usersId);

    @Query("SELECT c FROM Chat c JOIN c.users u1 JOIN c.users u2 " +
            "WHERE u1 = :user AND u2 = :reqUser")
    Chat findChatByUsersId(@Param("user") User user,
                           @Param("reqUser") User reqUser);

    Optional<Chat> findByUuid(String uuid);

    @Query("SELECT c FROM Chat c JOIN c.users u WHERE u.uuid = :userUuid")
    List<Chat> findByUserUuid(@Param("userUuid") String userUuid);
}
