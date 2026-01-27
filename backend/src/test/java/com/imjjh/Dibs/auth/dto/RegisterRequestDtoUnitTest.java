package com.imjjh.Dibs.auth.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import com.imjjh.Dibs.common.dto.ValidationMessage;
import com.imjjh.common.annotation.UnitTest;
import static org.assertj.core.api.Assertions.assertThat;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

@UnitTest
public class RegisterRequestDtoUnitTest {

        private static Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

        @ParameterizedTest(name = "{index} => {4}")
        @CsvSource(delimiter = '|', value = {
                        // 아이디
                        "'user_' | Password123! | 장준호 | user1@github.com | " + ValidationMessage.Auth.USERNAME_FORMAT,
                        "'user!' | Password123! | 장준호 | user1@github.com | " + ValidationMessage.Auth.USERNAME_FORMAT,
                        "abc | Password123! | 장준호 | user1@github.com | " + ValidationMessage.Auth.USERNAME_SIZE,
                        "verylongusernameover20char | Password123! | 장준호 | user1@github.com | "
                                        + ValidationMessage.Auth.USERNAME_SIZE,
                        "' ' | Password123! | 장준호 | user1@github.com | " + ValidationMessage.NOT_BLANK,

                        // 비밀번호
                        "testUser1 | P123! | 장준호 | user1@github.com | " + ValidationMessage.Auth.PASSWORD_SIZE,
                        "testUser1 | verylongpasswordover30charactersissuchanoverkill | 장준호 | user1@github.com | "
                                        + ValidationMessage.Auth.PASSWORD_SIZE,
                        "testUser1 | password123 | 장준호 | user1@github.com | " + ValidationMessage.Auth.PASSWORD_FORMAT,
                        "testUser1 | PASSWORD123 | 장준호 | user1@github.com | " + ValidationMessage.Auth.PASSWORD_FORMAT,
                        "testUser1 | Password!!! | 장준호 | user1@github.com | " + ValidationMessage.Auth.PASSWORD_FORMAT,
                        "testUser1 | Password123 | 장준호 | user1@github.com | " + ValidationMessage.Auth.PASSWORD_FORMAT,
                        "testUser1 | 'Password 123!' | 장준호 | user1@github.com | "
                                        + ValidationMessage.Auth.PASSWORD_FORMAT,

                        // 닉네임 관련
                        "testUser1 | Password123! | '' | user1@github.com | " + ValidationMessage.NOT_BLANK,

                        // 이메일 관련
                        // "test_user1 | Password123! | 장준호 | '' | " + ValidationMessage.NOT_BLANK | //
                        // OAuth2 회원가입시 이메일 null
                        "testUser1 | Password123! | 장준호 | 'user@@github.com' | " + ValidationMessage.INVALID_EMAIL,
                        "testUser1 | Password123! | 장준호 | 'user@github..com' | " + ValidationMessage.INVALID_EMAIL,
        })

        @DisplayName("회원가입 DTO 어노테이션 실패 검증")
        void 회원가입_DTO_실패(String username, String password, String nickname, String email, String expectedMsg) {
                // given
                RegisterRequestDto dto = new RegisterRequestDto(username, password, nickname, email);

                // when
                var violations = validator.validate(dto);

                // then
                assertThat(violations)
                                .anyMatch(v -> v.getMessage().equals(expectedMsg.trim()));
        }

        @ParameterizedTest(name = "{index} => {4}")
        @CsvSource(delimiter = '|', value = {
                        "testUser1 | Password123! | 장 | imjjh@github.com | ",
                        "testUser2 | thisIspassword12! | 준 | user12@google.com | ",
                        "testUser3 | PASSWORd098! | 호 | user@naver.com | ",
                        "testUser4 | pAsSwOrD!!12 | 장준호 | imjjh@kakao.com | ",
        })

        @DisplayName("회원가입 DTO 어노테이션 성공 검증")
        void 회원가입_DTO_성공(String username, String password, String nickname, String email) {
                // given
                RegisterRequestDto dto = new RegisterRequestDto(username, password, nickname, email);

                // when
                var violations = validator.validate(dto);

                // then
                assertThat(violations).isEmpty();
        }
}