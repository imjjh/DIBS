package com.imjjh.common.annotation;

import com.imjjh.common.constants.TestTypeConstants;
import org.junit.jupiter.api.Tag;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.lang.annotation.*;

@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Tag(TestTypeConstants.INTEGRATION_TEST)
@ActiveProfiles("test")
@SpringBootTest
public @interface IntegrationTest {

}
