<script setup>
const { user } = useAuth();
</script>

<template>
  <div class="info__card">
    <div class="header">
      <h4 class="title">My profile</h4>
      <NuxtLink to="/profile" class="header__link">
        <Icon name="lucide:pencil" />
      </NuxtLink>
    </div>
    <div class="info">
      <div class="person">
        <NuxtImg src="/images/person.jpg" alt="" class="person__img" />
        <div class="person__info">
          <h4 class="person__name">{{ user.info?.fullName || "N/A" }}</h4>
          <p class="person__role">{{ user.info?.email || "N/A" }}</p>
        </div>
      </div>
      <div class="items">
        <div class="item">
          <p class="answer">Application Year</p>
          <h4 class="value">2023</h4>
        </div>
        <div class="item">
          <p class="answer">Target Countries</p>
          <h4 class="value">United States</h4>
        </div>
        <div class="item">
          <p class="answer">Intended Majors</p>
          <h4 class="value">Business Administration</h4>
        </div>
        <div class="item">
          <p class="answer">Hook Statement</p>
          <h4 class="value">NaN</h4>
        </div>
      </div>
    </div>
    <div class="cards">
      <div class="card">
        <p class="card__name">Essays</p>
        <div class="card__flexer">
          <div class="card__icon">
            <Icon name="lucide:pen-tool" />
          </div>
          <p class="card__num">8</p>
        </div>
      </div>
      <div class="card">
        <p class="card__name">Courses</p>
        <div class="card__flexer">
          <div class="card__icon">
            <Icon name="lucide:backpack" />
          </div>
          <p class="card__num">10</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info__card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: max-content;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.title {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.person {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.person__img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.person__name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 4px;
}
.person__role {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.answer {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
  margin-bottom: 4px;
}
.value {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card__name {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
}
.card__flexer {
  display: flex;
  align-items: center;
  gap: 12px;
}
.card__icon {
  width: 48px;
  height: 48px;
  font-size: 20px;
  background: var(--light-blue);
  color: var(--blue);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card:last-child .card__icon {
  background: var(--light-green);
  color: var(--green);
}
.card__num {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.header__link span {
  width: 16px;
  height: 16px;
  color: var(--light-grey);
}
</style>
