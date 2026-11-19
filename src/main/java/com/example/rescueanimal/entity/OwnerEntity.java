package com.example.rescueanimal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

    @Getter
    @Entity
    @Table(name = "Owners")
    public class OwnerEntity {

        @Id
        private Integer owner_id;

        @Column(nullable = false, unique = true)
        private String username;

        @Column(nullable = false)
        private String password;

        protected OwnerEntity() {
        }

        public OwnerEntity(Integer owner_id, String username, String password) {
            this.owner_id = owner_id;
            this.username = username;
            this.password = password;
        }

    }
