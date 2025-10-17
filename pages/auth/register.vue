<script setup>
import { message } from "ant-design-vue";

definePageMeta({
  layout: "auth",
});

const { register } = useAuth();

const username = ref("");
const email = ref("");
const fullName = ref("");
const password = ref("");
const confirmPassword = ref("");
const gender = ref("MALE");
const dateOfBirth = ref("");
const countryId = ref(1);
const meetingHourPrice = ref(null);
const universityId = ref(null);
const majorId = ref(null);
const agree = ref(false);
const loading = ref(false);

const handleRegister = async () => {
  if (
    !username.value ||
    !email.value ||
    !fullName.value ||
    !password.value ||
    !confirmPassword.value ||
    !dateOfBirth.value
  ) {
    message.error("Заполните все поля");
    return;
  }

  if (password.value !== confirmPassword.value) {
    message.error("Пароли не совпадают");
    return;
  }

  if (password.value.length < 6) {
    message.error("Пароль должен быть не менее 6 символов");
    return;
  }

  if (!agree.value) {
    message.error("Примите условия использования");
    return;
  }

  loading.value = true;

  const result = await register({
    username: username.value,
    password: password.value,
    passwordConfirm: confirmPassword.value,
    fullName: fullName.value,
    gender: gender.value,
    dateOfBirth: dateOfBirth.value,
    email: email.value,
    countryId: countryId.value,
    meetingHourPrice: meetingHourPrice.value,
    universityId: universityId.value,
    majorId: majorId.value,
  });

  loading.value = false;

  if (result.success) {
    message.success("Регистрация успешна!");
    navigateTo("/");
  } else {
    message.error(result.error);
  }
};
</script>

<template>
  <div class="login-page auth">
    <div class="login__wrapper">
      <div class="login__logo">
        <NuxtImg src="images/brand.svg" alt="Logo" width="120" height="40" />
      </div>
      <div class="login__body">
        <div class="login__header">
          <h4 class="login__title">Register</h4>
          <p class="login__sub">
            Create your account. It's free and only takes a minute.
          </p>
        </div>
        <form class="login__form" @submit.prevent="handleRegister">
          <a-input
            v-model:value="username"
            placeholder="Username"
            class="login__input"
            :disabled="loading"
          />
          <a-input
            v-model:value="fullName"
            placeholder="Full Name"
            class="login__input"
            :disabled="loading"
          />
          <a-input
            v-model:value="email"
            type="email"
            placeholder="Email"
            class="login__input"
            :disabled="loading"
          />
          <a-select
            v-model:value="gender"
            placeholder="Gender"
            class="login__input"
            :disabled="loading"
          >
            <a-select-option value="MALE">Male</a-select-option>
            <a-select-option value="FEMALE">Female</a-select-option>
          </a-select>
          <a-date-picker
            v-model:value="dateOfBirth"
            placeholder="Date of Birth"
            class="login__input"
            :disabled="loading"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
          <a-input-number
            v-model:value="meetingHourPrice"
            placeholder="Meeting Hour Price (optional)"
            class="login__input"
            :disabled="loading"
            :min="0"
            style="width: 100%"
          />
          <a-input-number
            v-model:value="universityId"
            placeholder="University ID (optional)"
            class="login__input"
            :disabled="loading"
            :min="1"
            style="width: 100%"
          />
          <a-input-number
            v-model:value="majorId"
            placeholder="Major ID (optional)"
            class="login__input"
            :disabled="loading"
            :min="1"
            style="width: 100%"
          />
          <a-input-password
            v-model:value="password"
            placeholder="Password"
            class="login__input"
            :disabled="loading"
          />
          <a-input-password
            v-model:value="confirmPassword"
            placeholder="Confirm Password"
            class="login__input"
            :disabled="loading"
          />

          <div class="login__flexer">
            <a-checkbox v-model:checked="agree" class="login__checkbox">
              I agree to terms
            </a-checkbox>
          </div>
          <div class="login__buttons">
            <a-button
              type="primary"
              class="login__btn"
              html-type="submit"
              :loading="loading"
            >
              Register
            </a-button>
            <div class="login__link">
              <p>Already have an account?</p>
              <NuxtLink to="/auth/login" class="login__register">
                Sign in
              </NuxtLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f3f4f6;
}
.login__wrapper {
  width: 100%;
  max-width: 465px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
}
.login__body {
  width: 100%;
  background: #ffffff;
  border-radius: 24px;
  padding: 40px;
}
.login__logo img {
  width: 292px;
  height: 98px;
  object-fit: contain;
  object-position: center;
  margin-top: -100px;
}
.login__header {
  margin-bottom: 16px;
}
.login__title {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 8px;
}
.login__sub {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.login__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login__input {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--border);
}
.login__flexer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.login__checkbox .ant-checkbox-inner {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
.login__forgot {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--primary);
}
.login__buttons {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.login__btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
}
.login__link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--light-grey);
}
.login__register {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
}
</style>
