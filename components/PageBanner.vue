<script setup>
defineProps({
  titleProps: {
    type: String,
    default: "Dashboard",
  },
  backgroundProps: {
    type: String,
    default: "#6C63FF",
  },
  iconProps: {
    type: String,
    default: "/page-icons/academics.png",
  },
});
</script>

<template>
  <div class="page-banner" :style="{ background: backgroundProps }">
    <h1 class="title">
      {{ titleProps }}
    </h1>

    <div class="bacteria">
      <NuxtImg
        src="/images/bacteria.png"
        alt="Bacteria"
        width="100%"
        height="100%"
      />
    </div>

    <div class="icon">
      <NuxtImg :src="iconProps" alt="Bacteria" width="100%" height="100%" />
    </div>
  </div>
</template>

<style scoped>
.page-banner {
  padding: 36px 40px;
  border-radius: 16px;
  height: max-content;
  position: relative;
  overflow: hidden;
}
.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
}
.bacteria {
  position: absolute;
  bottom: 0;
  right: 40px;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  z-index: 1;
  pointer-events: none;
}
.bacteria img {
  object-fit: cover;
  object-position: right;
  opacity: 0.4;
  width: 100%;
}
.icon {
  width: 192px;
  height: 192px;
  transform: translateY(-50%) rotate(25deg);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  right: 114px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.icon img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  transform: rotate(-25deg);
}
.icon::after {
  width: 192px;
  height: 192px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left: none;
  border-top: none;
  transform: translate(-46%, -46%) rotate(0deg);
  border-radius: 24px;
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  z-index: -1;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0.4;
}
.icon::before {
  width: 192px;
  height: 192px;
  border-left: none;
  border-top: none;
  transform: translate(-42%, -42%) rotate(0deg);
  border-radius: 24px;
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  z-index: -1;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0.4;
}
.right {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  filter: blur(40px);
}
</style>
