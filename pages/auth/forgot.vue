<script setup>
import { message } from "ant-design-vue";

definePageMeta({
  layout: "auth",
});

const { forgotPassword } = useAuth();

const email = ref("");
const loading = ref(false);
const sent = ref(false);

const handleForgot = async () => {
  if (!email.value) {
    message.error("Введите email");
    return;
  }

  loading.value = true;

  const result = await forgotPassword(email.value);

  loading.value = false;

  if (result.success) {
    sent.value = true;
    message.success("Письмо для сброса пароля отправлено на ваш email");
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
          <h4 class="login__title">Forgot Password?</h4>
          <p class="login__sub" v-if="!sent">
            Enter your email and we'll send you a reset link.
          </p>
          <p class="login__sub" v-else style="color: var(--primary)">
            Check your email for reset instructions!
          </p>
        </div>
        <form class="login__form" @submit.prevent="handleForgot" v-if="!sent">
          <a-input
            v-model:value="email"
            type="email"
            placeholder="Email"
            class="login__input"
            :disabled="loading"
          />

          <div class="login__buttons">
            <a-button
              type="primary"
              class="login__btn"
              html-type="submit"
              :loading="loading"
            >
              Send Reset Link
            </a-button>
            <div class="login__link">
              <NuxtLink to="/auth/login" class="login__register">
                Back to Login
              </NuxtLink>
            </div>
          </div>
        </form>
        <div v-else class="login__buttons">
          <NuxtLink to="/auth/login">
            <a-button type="primary" class="login__btn">
              Back to Login
            </a-button>
          </NuxtLink>
        </div>
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
