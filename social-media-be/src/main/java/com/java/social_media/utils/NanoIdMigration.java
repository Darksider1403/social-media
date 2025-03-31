package com.java.social_media.utils;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class NanoIdMigration implements ApplicationRunner {

    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("Starting NanoId migration for existing records...");

        // List of all entity tables to update
        String[] tables = {"users", "post", "comment", "message", "chat", "story", "reels"};

        for (String table : tables) {
            // Update all records in the table, not just NULL ones
            updateAllTableRecords(table);
        }

        System.out.println("NanoId migration completed successfully.");
    }

    private void updateAllTableRecords(String tableName) {
        try {
            // Count total records
            Query countQuery = entityManager.createNativeQuery(
                    "SELECT COUNT(*) FROM " + tableName);
            Integer totalRecords = ((Number) countQuery.getSingleResult()).intValue();

            System.out.println("Found " + totalRecords + " " + tableName + " records to update");

            if (totalRecords > 0) {
                // Get all record IDs
                Query idQuery = entityManager.createNativeQuery(
                        "SELECT id FROM " + tableName);
                List<Number> ids = idQuery.getResultList();

                // Update each record with a nanoid
                int updated = 0;
                for (Number id : ids) {
                    String nanoId = IdGenerator.generateNanoId(12);
                    Query updateQuery = entityManager.createNativeQuery(
                                    "UPDATE " + tableName + " SET uuid = :nanoId WHERE id = :id")
                            .setParameter("nanoId", nanoId)
                            .setParameter("id", id.intValue());

                    updated += updateQuery.executeUpdate();
                }

                System.out.println("Updated " + updated + " " + tableName + " records with NanoIds");
            }
        } catch (Exception e) {
            System.err.println("Error updating NanoIds for " + tableName + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}