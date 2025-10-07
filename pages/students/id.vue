<script setup></script>

<template>
  <div class="teacher-page">
    <div class="teacher__top teacher__card">
      <div class="teacher__top-top">
        <NuxtLink to="/teachers">
          <Icon name="lucide:arrow-left" class="icon" />
          Back
        </NuxtLink>
      </div>
      <div class="teacher__top-flexer">
        <div class="teacher__top-left">
          <div class="teacher__top-img">
            <NuxtImg
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
        <div class="teacher__top-right">
          <div class="modal__price">
            <div class="modal__price-hourly">
              <p>$50</p>
              <span>Hourly Rate</span>
            </div>
            <div class="modal__price-essay">
              <p>$24</p>
              <span>Essay Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="teacher__grid">
      <div class="teacher__left">
        <div class="teacher__university teacher__card">
          <div class="teacher__university-top">
            <div class="teacher__university-logo">
              <NuxtImg
                src="/images/cumbridge.png"
                alt="University Logo"
                width="48"
                height="48"
              />
            </div>
            <div class="teacher__university-info">
              <h5 class="teacher__university-name">University of Cambridge</h5>
              <span class="teacher__university-sub"> United Kingdom </span>
            </div>
          </div>
          <div class="teacher__university-bottom">
            <div class="teacher__university-item">
              <Icon name="lucide:book-open" class="icon" />
              <p>Bachelor's Degree in Computer Science</p>
            </div>
            <div class="teacher__university-item">
              <Icon name="lucide:book-open" class="icon" />
              <p>Bachelor's Degree in Computer Science</p>
            </div>
            <div class="teacher__university-item">
              <Icon name="lucide:book-open" class="icon" />
              <p>Bachelor's Degree in Computer Science</p>
            </div>
            <div class="teacher__university-item">
              <Icon name="lucide:book-open" class="icon" />
              <p>Bachelor's Degree in Computer Science</p>
            </div>
          </div>
        </div>

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
          <h4 class="section__title">About teacher</h4>
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
        <div class="teacher__calendar teacher__card">
          <h4 class="section__title">Calenndar</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.teacher-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  min-height: 100vh;
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
</style>
