<template>
  <div class="PersonalCard">
    <NuxtLink to="/profile">
      <NuxtImg
        src="/images/person.jpg"
        alt="person"
        width="80"
        height="80"
        format="webp"
      />
      <div>
        <h3>Yu Jimin</h3>
        <p>aespa@naver.com</p>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.PersonalCard {
  border: 1px solid var(--border);
  border-radius: 12px;
}
.PersonalCard a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 12px;
  padding: 24px 0;
  transition: all 0.2s;
}
.PersonalCard a:hover {
  color: var(--blue);
  background: var(--light-blue);
  background-color: var(--light-blue);
}
.PersonalCard img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.2s;
}
.PersonalCard:hover img {
  transform: scale(0.95);
}
.PersonalCard h3 {
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s;
}
.PersonalCard p {
  font-size: 14px;
  color: var(--light-grey);
}
.PersonalCard div {
  text-align: center;
}
</style>
