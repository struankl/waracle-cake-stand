package com.grangesoftware.cakestand.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories("com.grangesoftware.cakestand.repos")
@EnableSpringDataWebSupport
@EnableAspectJAutoProxy
public class CakeStandServerConfig {
    @Bean
    public DataSource dataSource() {
        EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
        EmbeddedDatabase db = builder
                .setType(EmbeddedDatabaseType.DERBY)
//                .addScript("db/create-cake-base.sql")
                .build();
        return db;
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
