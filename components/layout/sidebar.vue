<script setup>
import PersonalCard from "@/components/cards/PersonalCard.vue";
const links = [
  { name: "Dashboard", link: "/", icon: "lucide:layout-dashboard" },
  { name: "Booking", link: "/booking", icon: "lucide:calendar-days" },
  { name: "Essay Lab", link: "/essay-lab", icon: "lucide:test-tubes" },
  { name: "Students", link: "/students", icon: "lucide:user-round-pen" },
];
</script>

<template>
  <div class="sidebar">
    <div class="slider">
      <div class="top">
        <NuxtImg
          src="/images/brand.svg"
          alt="Brand"
          class="logo"
          width="140"
          height="48"
        />
      </div>
      <div class="bottom">
        <PersonalCard />
        <ul>
          <li v-for="link in links" :key="link.link">
            <NuxtLink :to="link.link">
              <Icon :name="link.icon" class="icon" />
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 264px;
  height: 100%;
  border-right: 1px solid var(--border);
  position: fixed;
  z-index: 3;
  background: white;
}
.slider {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.slider::-webkit-scrollbar {
  display: none;
}
.slider {
  scrollbar-width: none;
}
.slider {
  -ms-overflow-style: none;
}
.top {
  padding: 19px 24px;
  border-bottom: 1px solid var(--border);
}
.bottom {
  padding: 24px 16px 64px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.bottom ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bottom a {
  display: grid;
  grid-template-columns: 20px auto;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: var(--light-grey);
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s;
  position: relative;
}
.bottom a::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -16px;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  border-radius: 0 4px 4px 0;
  transition: all 0.2s;
  background: var(--blue);
  opacity: 0;
  visibility: hidden;
}
.bottom a:hover::after {
  opacity: 1;
  visibility: visible;
}
.bottom a:hover {
  background-color: var(--light-blue);
  color: var(--blue);
}
.bottom a.router-link-active {
  background-color: var(--light-blue);
  color: var(--blue);
}
.bottom a.router-link-active::after {
  opacity: 1;
  visibility: visible;
}
.bottom span {
  width: 20px;
  height: 20px;
}
</style>
