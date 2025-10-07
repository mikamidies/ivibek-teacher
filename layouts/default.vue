<script setup>
import Sidebar from "@/components/layout/sidebar.vue";
import Header from "../components/layout/header.vue";

import { computed } from "vue";
const route = useRoute();
const pageTitle = computed(() => route.meta?.layoutTitle || "");
</script>

<template>
  <div class="app">
    <Sidebar />
    <main>
      <Header :title="pageTitle" />
      <slot />
    </main>
  </div>
</template>

<style scoped>
main {
  margin-left: 264px;
  height: 100vh;
  overflow: hidden;
}
</style>
