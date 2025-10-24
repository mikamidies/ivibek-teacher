<script setup>
import { message } from "ant-design-vue";

definePageMeta({
  layout: "auth",
});

const { login } = useAuth();

const username = ref("");
const password = ref("");
const remember = ref(false);
const loading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    message.error("Заполните все поля");
    return;
  }

  loading.value = true;

  const result = await login(username.value, password.value, remember.value);

  loading.value = false;

  if (result.success) {
    message.success("Вход выполнен успешно!");
    navigateTo("/");
  } else {
    message.error(result.error);
  }
};
</script>

<template>
  <div class="login-page auth">
    <div class="login__wrapper">
      <div class="login__img">
        <NuxtImg
          src="/images/login.svg"
          alt="Register Illustration"
          width="500"
          height="500"
        />
        <p class="login__type">Platform for Teachers</p>
      </div>

      <div class="login__body">
        <div class="login__logo">
          <NuxtImg src="images/brand.svg" alt="Logo" width="120" height="40" />
        </div>
        <div class="login__somewhat">
          <div class="login__header">
            <h4 class="login__title">Log in</h4>
            <p class="login__sub">Welcome back please enter your details.</p>
          </div>
          <form class="login__form" @submit.prevent="handleLogin">
            <a-input
              v-model:value="username"
              placeholder="Username"
              class="login__input"
              :disabled="loading"
            />
            <a-input-password
              v-model:value="password"
              placeholder="Password"
              class="login__input"
              :disabled="loading"
            />

            <!-- <div class="login__flexer">
            <a-checkbox v-model:checked="remember" class="login__checkbox">
              Remember me
            </a-checkbox>
            <NuxtLink to="/auth/forgot" class="login__forgot">
              Forgot Password?
            </NuxtLink>
          </div> -->
            <div class="login__buttons">
              <a-button
                type="primary"
                class="login__btn"
                html-type="submit"
                :loading="loading"
              >
                Log in
              </a-button>
              <div class="login__link">
                <p>Don't have an account?</p>
                <NuxtLink to="/auth/register" class="login__register">
                  Sign up
                </NuxtLink>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  height: 100vh;
  background: #f3f4f6;
}
.login__wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  padding: 40px;
  width: 100%;
}
.login__img {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 140px;
  background: var(--blue);
  border-radius: 24px;
  box-shadow: 0px 0px 34.8px 10px #ffffff8f inset;
}
.login__type {
  font-weight: 500;
  font-style: Medium;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  text-transform: uppercase;
  color: white;
  letter-spacing: 1px;
}
.login__img img {
  width: 480px;
  height: auto;
  object-fit: contain;
  object-position: center;
  mix-blend-mode: luminosity;
}
.login__body {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}
.login__logo img {
  width: 292px;
  height: 98px;
  object-fit: contain;
  object-position: center;
}
.login__somewhat {
  min-width: 480px;
  max-width: 90%;
  margin: 0 auto;
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
  line-height: 24px;
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
