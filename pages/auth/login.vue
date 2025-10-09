<script setup>
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div class="login-page">
    <div class="login__wrapper">
      <div class="login__logo">
        <NuxtImg src="images/brand.svg" alt="Logo" width="120" height="40" />
      </div>
      <div class="login__body">
        <div class="login__header">
          <h4 class="login__title">Log in</h4>
          <p class="login__sub">Welcome back please enter your details.</p>
        </div>
        <form class="login__form">
          <a-input
            v-model="email"
            type="email"
            placeholder="Email"
            class="login__input"
          />
          <a-input
            v-model="password"
            type="password"
            placeholder="Password"
            class="login__input"
          />

          <div class="login__flexer">
            <a-checkbox class="login__checkbox">Remember me</a-checkbox>
            <NuxtLink to="/auth/forgot" class="login__forgot"
              >Forgot Password?</NuxtLink
            >
          </div>
          <div class="login__buttons">
            <a-button type="primary" class="login__btn">Log in</a-button>
            <div class="login__link">
              <p>Don't have an account?</p>
              <NuxtLink to="/auth/register" class="login__register"
                >Sign up</NuxtLink
              >
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
