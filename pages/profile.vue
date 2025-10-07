<script setup>
definePageMeta({
  layoutTitle: "Profile",
});

import { ref } from "vue";

const visible = ref(false);
const showModal = () => {
  visible.value = true;
};
const handleOk = (e) => {
  console.log(e);
  visible.value = false;
};

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const countries = [
  { value: "USA", label: "USA" },
  { value: "Canada", label: "Canada" },
  { value: "UK", label: "UK" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "India", label: "India" },
  { value: "China", label: "China" },
  { value: "Japan", label: "Japan" },
  { value: "South Korea", label: "South Korea" },
];

const relationships = [
  { value: "Single", label: "Single" },
  { value: "In a relationship", label: "In a relationship" },
  { value: "Married", label: "Married" },
  { value: "It's complicated", label: "It's complicated" },
];

const gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
  { value: "Helicopter", label: "Helicopter" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];
</script>

<template>
  <div class="profile-page">
    <div class="profile__top">
      <div class="profile__top-left">
        <div class="profile__img">
          <NuxtImg
            src="/images/person.jpg"
            alt="person"
            width="80"
            height="80"
            format="webp"
          />
          <button class="profile__img-edit">
            <Icon name="lucide:pencil" width="16" height="16" />
          </button>
        </div>
        <div>
          <h3 class="profile__name">Yu Jimin</h3>
          <p class="profile__email">aespa@naver.com</p>
          <p class="profile__apply">Apply year: 2023/2024</p>
        </div>
      </div>
      <NuxtLink to="/"> Preview </NuxtLink>
    </div>
    <div class="profile__grid">
      <div class="profile__details">
        <div class="profile__details-head">
          <h4 class="section__title">Personal Details</h4>
          <button class="profile__details-edit" @click="showModal">
            <Icon name="lucide:pencil" />
          </button>
        </div>
        <div class="profile__items">
          <div class="profile__item">
            <Icon name="lucide:mail" />
            <p class="profile__item-text">aespa@naver.com</p>
          </div>
          <div class="profile__item">
            <Icon name="lucide:user" />
            <p class="profile__item-text">Female</p>
          </div>
          <div class="profile__item">
            <Icon name="lucide:calendar-days" />
            <p class="profile__item-text">Apr 6, 2000</p>
          </div>
          <div class="profile__item">
            <Icon name="lucide:map-pin" />
            <p class="profile__item-text">Seoul, South Korea</p>
          </div>
          <div class="profile__item">
            <Icon name="lucide:languages" />
            <p class="profile__item-text">Korean, English</p>
          </div>
          <div class="profile__item">
            <Icon name="lucide:clock" />
            <p class="profile__item-text">Joined Jan 1, 2023</p>
          </div>
          <div class="profile__item">
            <Icon name="lucide:globe" />
            <p class="profile__item-text">Asia</p>
          </div>
        </div>
      </div>

      <div class="profile__about">
        <div class="profile__about-head">
          <h4 class="section__title">About Me</h4>
          <button class="profile__about-edit" @click="showModal">
            <Icon name="lucide:pencil" />
          </button>
        </div>
        <p class="profile__about-text">
          Hello! I'm Yu Jimin, a passionate individual with a love for music,
          dance, and connecting with people. As a member of the global sensation
          aespa, I thrive on creativity and teamwork. When I'm not performing, I
          enjoy exploring new cultures, trying out different cuisines, and
          spending quality time with friends and family. I'm always eager to
          learn and grow, both personally and professionally. Feel free to reach
          out if you'd like to connect or collaborate!
          <br /><br />
          As the leader of aespa, I strive to inspire my members and fans
          through our music and performances. Our group is known for blending
          virtual and real worlds, pushing boundaries in K-pop with innovative
          concepts and technology. I'm proud of our achievements, including
          chart-topping songs and global recognition. Beyond the stage, I value
          kindness, hard work, and staying true to myself. Let's continue to
          make meaningful connections and create unforgettable memories
          together!
        </p>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="visible" title="Edit Profile" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleCancel">Cancel</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk"
        >Save information</a-button
      >
    </template>
    <div class="form__wrapper">
      <a-form :model="form" layout="vertical">
        <a-form-item label="First Name" name="firstName">
          <a-input placeholder="Enter your first name" />
        </a-form-item>
        <a-form-item label="Last Name" name="lastName">
          <a-input placeholder="Enter your last name" />
        </a-form-item>
        <a-form-item label="Phone" name="phone">
          <a-input placeholder="Enter your phone number" />
        </a-form-item>
        <a-form-item label="Country" name="country">
          <a-select
            show-search
            placeholder="Select a country"
            :options="countries"
            :filter-option="filterOption"
          ></a-select>
        </a-form-item>
        <a-form-item label="Email" name="email">
          <a-input placeholder="Enter your email" />
        </a-form-item>
        <a-form-item label="Relationships" name="relationships">
          <a-select
            show-search
            placeholder="Choose wisely"
            :options="relationships"
            :filter-option="filterOption"
          ></a-select>
        </a-form-item>
        <a-form-item label="Date of Birth" name="dob">
          <a-date-picker style="width: 100%" format="DD/MM/YYYY" />
        </a-form-item>
        <a-form-item label="Gender" name="gender">
          <a-select
            show-search
            placeholder="Choose wisely"
            :options="gender"
            :filter-option="filterOption"
          ></a-select>
        </a-form-item>
        <a-form-item label="Language" name="language">
          <a-input placeholder="Enter your Language" />
        </a-form-item>
        <a-form-item label="English Proficiency" name="englishProficiency">
          <a-input placeholder="Enter your English Proficiency" />
        </a-form-item>
        <a-form-item label="About Me" name="about" class="long-form-item">
          <a-textarea
            rows="4"
            placeholder="Tell us about yourself"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<style scoped>
.profile-page {
  padding: 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.profile__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  padding: 40px;
}
.profile__top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.profile__img {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.profile__img img {
  border-radius: 50%;
}
.profile__img-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--border);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}
.profile__img-edit:hover {
  color: var(--blue);
}
.profile__name {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 4px;
}
.profile__email {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
  margin-bottom: 4px;
}
.profile__apply {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.profile__top a {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.profile__top a:hover {
  background: var(--border);
  color: var(--blue);
}
.profile__grid {
  display: grid;
  grid-template-columns: 384px 1fr;
  gap: 24px;
}
.profile__details,
.profile__about {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
}
.section__title {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 16px;
}
.profile__about-head,
.profile__details-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.profile__details-edit span,
.profile__about-edit span {
  width: 18px;
  height: 18px;
}
.profile__items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.profile__item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.profile__item-text {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--dark);
}
.profile__item span {
  width: 20px;
  height: 20px;
  color: var(--light-grey);
}
.profile__about-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
</style>
