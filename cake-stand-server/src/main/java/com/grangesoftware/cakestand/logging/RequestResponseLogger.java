package com.grangesoftware.cakestand.logging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Around;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;

import static java.lang.String.format;
import static java.util.stream.Collectors.joining;

@Aspect
@Component
public class RequestResponseLogger {

    private final ObjectMapper objectMapper;

    public RequestResponseLogger(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public Object logRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass());
        logger.info("---> {}({})",
                joinPoint.getSignature().getName(),
                Arrays.stream(joinPoint.getArgs())
                        .map(this::stringify)
                        .collect(joining(", ")));

        Object value = joinPoint.proceed();
        logger.info("<--- {}", stringify(value));
        return value;

    }

    String stringify(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return format("Error converting value: %s", e.getMessage());
        }
    }
}
