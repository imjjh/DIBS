package com.imjjh.common.annotation;

import com.imjjh.common.constants.TestTypeConstants;
import org.junit.jupiter.api.Tag;

import java.lang.annotation.*;

@Target({ ElementType.METHOD, ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Tag(TestTypeConstants.UNIT_TEST)
public @interface UnitTest {
}
