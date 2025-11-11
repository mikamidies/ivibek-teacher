<script setup>
const infoShow = ref(true);
const tasksShow = ref(false);
const visible = ref(false);
const showModal = () => {
  visible.value = true;
};
const handleOk = (e) => {
  visible.value = false;
};
</script>

<template>
  <div class="teacher-page">
    <div class="teacher__top teacher__card">
      <img src="/images/bacteria-blue.png" alt="Banner" class="bacteria" />
      <div class="teacher__top-top">
        <NuxtLink to="/students" class="teacher__top-back">
          <Icon name="lucide:arrow-left" class="icon" />
          Back
        </NuxtLink>
      </div>
      <div class="teacher__top-flexer">
        <div class="teacher__top-left">
          <div class="teacher__top-img">
            <img
              src="/images/person.jpg"
              alt="Teacher"
              width="96"
              height="96"
            />
          </div>
          <div class="teacher__top-info">
            <h4 class="teacher__top-name">Yu Jimin</h4>
            <span class="teacher__top-sub"> Computer Science </span>
          </div>
        </div>
      </div>
    </div>
    <div class="student__header">
      <div class="teacher__tabs">
        <div
          class="teacher__tabs-btn"
          :class="{ active: infoShow }"
          @click="(infoShow = true), (tasksShow = false)"
        >
          Student info
        </div>
        <div
          class="teacher__tabs-btn"
          :class="{ active: tasksShow }"
          @click="(infoShow = false), (tasksShow = true)"
        >
          Student tasks
        </div>
      </div>
      <a-button class="add__btn" v-show="tasksShow" @click="showModal"
        >Assign New Task</a-button
      >
    </div>
    <div class="teacher__grid" v-show="infoShow">
      <div class="teacher__left">
        <div class="teacher__general teacher__card">
          <div class="modal__details">
            <h4 class="section__title">Contact Information</h4>
            <div class="modal__details-items">
              <div class="modal__details-item">
                <Icon name="lucide:mail" />
                <p>yujimin@naever.com</p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:phone" />
                <p>+1 234 567 8901</p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:map-pin" />
                <p>Seoul, South Korea</p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:calendar" />
                <p>Feb 2, 2000</p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:languages" />
                <p>English, Korean</p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:clock" />
                <p>Available: Mon - Fri, 9 AM - 5 PM</p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:globe" />
                <p>Asia, South Korea</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="teacher__right">
        <div class="teacher__desc teacher__card">
          <h4 class="section__title">About student</h4>
          <p>
            Yu Jimin is a dedicated Computer Science teacher with over 10 years
            of experience in both academic and industry settings. She holds a
            Bachelor's Degree in Computer Science from the University of
            Cambridge and has worked as a Software Engineer at leading tech
            companies. Her teaching philosophy centers around making complex
            concepts accessible and engaging for students of all levels. Yujimin
            specializes in software development, algorithms, and data
            structures, and is passionate about helping students achieve their
            academic and career goals. academic and career goals. She is
            committed to fostering a supportive learning environment and
            encourages students to pursue research, internships, and real-world
            projects. Yu Jimin regularly mentors students for coding
            competitions and guides them in preparing for university admissions
            and tech careers. Her approachable teaching style and dedication to
            student success have made her a respected mentor among her peers and
            students alike.
          </p>
        </div>
      </div>
    </div>
    <div class="student__grid" v-show="tasksShow">
      <div class="student__task-item">
        <div class="student__item-status">
          <Icon name="lucide:check" class="icon" />
          Done
        </div>
        <h4 class="student__task-name">Memorize 1200 words by tonight.</h4>
        <p class="student__task-sub">
          Agar 1200 ta so‘zni bir kunda yodlashni nazarda tutsang, bu juda katta
          yuklama bo‘ladi. Odatda inson bir kunda samarali tarzda 50–100 ta
          so‘zni yodlashi mumkin (mantiqan foydalanish bilan). Shuning uchun
          1200 ta so‘z bir kunda emas, balki qismlarga bo‘lib, samarali
          metodlarda yodlash kerak
        </p>
        <div class="student__task-bottom">
          <p class="student__task-from">
            <Icon name="lucide:calendar" class="icon" />
            22.05.2025
          </p>
          <p class="student__task-to">
            <Icon name="lucide:calendar" class="icon" />
            25.05.2025
          </p>
        </div>
      </div>
      <div class="student__task-item">
        <div class="student__item-status yellow status">
          <Icon name="lucide:clock" class="icon" />
          Waiting
        </div>
        <h4 class="student__task-name">Memorize 1200 words by tonight</h4>
        <p class="student__task-sub">
          Agar 1200 ta so‘zni bir kunda yodlashni nazarda tutsang, bu juda katta
          yuklama bo‘ladi. Odatda inson bir kunda samarali tarzda 50–100 ta
          so‘zni yodlashi mumkin (mantiqan foydalanish bilan). Shuning uchun
          1200 ta so‘z bir kunda emas, balki qismlarga bo‘lib, samarali
          metodlarda yodlash kerak
        </p>
        <div class="student__task-bottom">
          <p class="student__task-from">
            <Icon name="lucide:calendar" class="icon" />
            22.05.2025
          </p>
          <p class="student__task-to">
            <Icon name="lucide:calendar" class="icon" />
            25.05.2025
          </p>
        </div>
      </div>
    </div>
  </div>

  <a-modal v-model:visible="visible" title="Assign New Task" @ok="handleOk">
    <a-form :model="form" layout="vertical">
      <a-form-item label="Title" name="title" style="grid-column: 1/3">
        <a-input placeholder="Enter task title" />
      </a-form-item>
      <a-form-item label="Description" name="about" class="long-form-item">
        <a-textarea
          rows="4"
          placeholder="Describe the task"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="Title" name="title">
        <a-date-picker style="width: 100%" placeholder="Start Date" />
      </a-form-item>
      <a-form-item label="Title" name="title">
        <a-date-picker style="width: 100%" placeholder="End Date" />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="visible"
    title="Memorize 1200 words by tonight"
    @ok="handleOk"
  >
    <div class="status yellow big__status">
      <Icon name="lucide:clock" class="icon" />
      Waiting
    </div>

    <div class="modal__times">
      <div class="modal__start">
        <p>Start Date</p>
        <span>22.05.2025</span>
      </div>
      <div class="modal__end">
        <p>End Date</p>
        <span>25.05.2025</span>
      </div>
    </div>

    <div class="modal__desc">
      <h4>Task Description</h4>
      <p>
        Agar 1200 ta so‘zni bir kunda yodlashni nazarda tutsang, bu juda katta
        yuklama bo‘ladi. Odatda inson bir kunda samarali tarzda 50–100 ta so‘zni
        yodlashi mumkin (mantiqan foydalanish bilan). Shuning uchun 1200 ta so‘z
        bir kunda emas, balki qismlarga bo‘lib, samarali metodlarda yodlash
        kerak
      </p>
    </div>
  </a-modal>

  <a-modal
    v-model:visible="visible"
    title="Memorize 1200 words by tonight"
    @ok="handleOk"
  >
    <div class="status big__status">
      <Icon name="lucide:check" class="icon" />
      Done
    </div>

    <div class="modal__times">
      <div class="modal__start">
        <p>Start Date</p>
        <span>22.05.2025</span>
      </div>
      <div class="modal__end">
        <p>End Date</p>
        <span>25.05.2025</span>
      </div>
    </div>

    <div class="modal__desc">
      <h4>Task Description</h4>
      <p>
        Agar 1200 ta so‘zni bir kunda yodlashni nazarda tutsang, bu juda katta
        yuklama bo‘ladi. Odatda inson bir kunda samarali tarzda 50–100 ta so‘zni
        yodlashi mumkin (mantiqan foydalanish bilan). Shuning uchun 1200 ta so‘z
        bir kunda emas, balki qismlarga bo‘lib, samarali metodlarda yodlash
        kerak
      </p>
    </div>

    <div class="modal__bottom">
      <h4>Student’s answer</h4>
      <a href="#">https://miro.com/app/board/uXjVJYESWh4=/</a>
      <div class="modal__buttons">
        <a-button>Bad</a-button>
        <a-button>Normal</a-button>
        <a-button>Good</a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.teacher-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.teacher__card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
}
.teacher__grid {
  display: grid;
  grid-template-columns: 384px 1fr;
  gap: 24px;
  margin-top: 24px;
}
.teacher__left,
.teacher__right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.teacher__top {
  padding: 24px 32px;
  position: relative;
}
.teacher__top a {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.teacher__top-flexer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.teacher__top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.teacher__top-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}
.teacher__top-img img {
  object-fit: cover;
}
.teacher__top-name {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 4px;
}
.teacher__top-sub {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.modal__price {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.modal__price-hourly,
.modal__price-essay {
  padding: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.modal__price-hourly p,
.modal__price-essay p {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
}
.modal__price-hourly span,
.modal__price-essay span {
  font-size: 14px;
  line-height: 20px;
}
.modal__price-hourly {
  background: var(--light-blue);
  color: var(--blue);
}
.modal__price-essay {
  background: var(--light-green);
  color: var(--green);
}
.teacher__university-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.teacher__university-logo {
  width: 58px;
  height: 58px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.teacher__university-logo img {
  object-fit: cover;
}
.teacher__university-name {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 4px;
}
.teacher__university-sub {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--light-grey);
}
.teacher__university-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.teacher__university-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.teacher__university-item span {
  font-size: 18px;
  color: var(--light-grey);
}
.modal__details-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}
.modal__details-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.modal__details-item span {
  font-size: 18px;
  color: var(--light-grey);
}
.section__title {
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 16px;
}
.teacher__desc p {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
}
.teacher__top-back {
  background: var(--border);
  display: inline-flex !important;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
}
.teacher__top-back span {
  font-size: 16px;
}
.student__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
}
.teacher__tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 384px;
  background: white;
  border-radius: 12px;
  padding: 4px;
}
.teacher__tabs-btn {
  text-align: center;
  padding: 8px 0;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
  color: var(--light-grey);
}
.teacher__tabs-btn.active {
  background: var(--light-blue);
  color: var(--blue);
}
.add__btn {
  background: transparent;
}
.student__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
}
.student__task-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
}
.student__item-status {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  background: var(--light-green);
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--green);
  padding: 4px 8px;
  border-radius: 8px;
  margin-bottom: 12px;
}
.student__item-status span {
  font-size: 18px;
}
.student__task-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;
}
.student__task-sub {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.student__task-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.student__task-from,
.student__task-to {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.student__task-from span {
  font-size: 20px;
  color: var(--blue);
}
.student__task-to span {
  font-size: 20px;
  color: var(--green);
}
.bacteria {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.4;
  width: 80%;
}
.big__status {
  font-size: 14px;
  padding: 8px 16px;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.big__status span {
  font-size: 18px;
}
.modal__times {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.modal__start,
.modal__end {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
}
.modal__start p,
.modal__end p {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
  color: var(--light-grey);
}
.modal__start span,
.modal__end span {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}
.modal__desc h4,
.modal__bottom h4 {
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  margin-bottom: 12px;
}
.modal__desc p {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.modal__bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  margin-top: 24px;
}
.modal__buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.modal__bottom a {
  color: var(--blue);
  margin-bottom: 16px;
  text-decoration: underline;
  display: block;
}
.modal__buttons button {
  border-radius: 0;
}
.modal__buttons button:first-child {
  border-radius: 8px 0 0 8px;
}
.modal__buttons button:last-child {
  border-radius: 0 8px 8px 0;
}
</style>
