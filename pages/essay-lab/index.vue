<script setup>
import PageBanner from "@/components/PageBanner.vue";
</script>

<template>
  <div class="essay-page">
    <PageBanner
      titleProps="Essay Lab"
      backgroundProps="#00A155"
      iconProps="/page-icons/tasks.png"
    />

    <div class="essay__body">
      <div class="essay__head">
        <h4 class="essay__title">Essay Lab</h4>

        <NuxtLink to="/essay-lab/create">
          <Icon name="lucide:plus" class="icon" />
          New Essay
        </NuxtLink>
      </div>

      <div class="essay__content">
        <table>
          <thead>
            <tr>
              <th>University</th>
              <th>Teacher name</th>
              <th>Essay</th>
              <th>Payment</th>
              <th>Target achieved</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Harvard University</td>
              <td>John Doe</td>
              <td>
                School students should be allowed to curate their high school
                curriculum.
              </td>
              <td>$50</td>
              <td>Yes</td>
              <td>
                <NuxtLink to="/essay-lab/edit" class="btn btn--secondary">
                  <Icon name="lucide:ellipsis-vertical" class="icon" />
                </NuxtLink>
              </td>
            </tr>
            <tr>
              <td>Stanford University</td>
              <td>Jane Smith</td>
              <td>Should the death sentence be implemented globally?</td>
              <td>$40</td>
              <td>No</td>
              <td>
                <NuxtLink to="/essay-lab/edit" class="btn btn--secondary">
                  <Icon name="lucide:ellipsis-vertical" class="icon" />
                </NuxtLink>
              </td>
            </tr>
            <tr>
              <td>MIT</td>
              <td>Emily Johnson</td>
              <td>
                It should be illegal to use certain types of animals for
                experiments and other research purposes.
              </td>
              <td>$60</td>
              <td>Yes</td>
              <td>
                <NuxtLink to="/essay-lab/edit" class="btn btn--secondary">
                  <Icon name="lucide:ellipsis-vertical" class="icon" />
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.essay-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.essay__body {
  margin-top: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
}
.essay__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.essay__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
}
.essay__head a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--blue);
  border: 1px solid var(--blue);
  padding: 10px 12px;
  border-radius: 8px;
}
</style>
