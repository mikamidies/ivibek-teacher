<template>
  <div class="general-card">
    <div class="general__info">
      <p class="section__title">General information</p>
      <div class="profile__overview-items">
        <div class="profile__overview-item">
          <p class="profile__overview-name">Extracurriculars</p>
          <div class="profile__overview-flex">
            <div class="profile__overview-icon blue">
              <Icon name="lucide:pen-tool" style="transform: rotate(225deg)" />
            </div>
            <p class="profile__overview-number">12</p>
          </div>
        </div>
        <div class="profile__overview-item">
          <p class="profile__overview-name">Summer Programs</p>
          <div class="profile__overview-flex">
            <div class="profile__overview-icon green">
              <Icon name="lucide:backpack" />
            </div>
            <p class="profile__overview-number">8</p>
          </div>
        </div>
      </div>
    </div>
    <div class="active__sessions">
      <p class="section__title">Active sessions</p>
      <div class="active__sessions-items">
        <div class="active__session-item">
          <div>
            <p class="active__session-name">Son Heoung Min</p>
            <p class="active__session-desc">Ux/Ui desing course</p>
            <p class="active__session-platform">
              <span>Online</span><span>Zoom</span>
            </p>
          </div>
          <div class="active__session-right">
            <p class="active__session-date">Avg. 20</p>
            <div class="active__session-time">19:00</div>
          </div>
        </div>
        <div class="active__session-item">
          <div>
            <p class="active__session-name">Son Heoung Min</p>
            <p class="active__session-desc">Ux/Ui desing course</p>
            <p class="active__session-platform">
              <span>Online</span><span>Zoom</span>
            </p>
          </div>
          <div class="active__session-right">
            <p class="active__session-date">Avg. 20</p>
            <div class="active__session-time">19:00</div>
          </div>
        </div>
      </div>
    </div>
    <div class="essay__sent">
      <p class="section__title">Essays sent</p>
      <div class="essay__items">
        <div class="essay__item">
          <div class="essay__info">
            <div class="essay__img">
              <NuxtImg src="/images/person.jpg" alt="Person" />
            </div>
            <div>
              <p class="essay__name">Yu Jimin</p>
              <p class="essay__status green">Sent</p>
            </div>
          </div>
          <button>
            <Icon name="lucide:ellipsis-vertical" />
          </button>
        </div>
        <div class="essay__item">
          <div class="essay__info">
            <div class="essay__img">
              <NuxtImg src="/images/person.jpg" alt="Person" />
            </div>
            <div>
              <p class="essay__name">Yu Jimin</p>
              <p class="essay__status red">Cancelled</p>
            </div>
          </div>
          <button>
            <Icon name="lucide:ellipsis-vertical" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.general-card {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  height: fit-content;
}
.general__info,
.active__sessions {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.profile__overview-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}
.profile__overview-item {
  background: var(--border);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.profile__overview-name {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}
.profile__overview-flex {
  display: flex;
  align-items: center;
  gap: 12px;
}
.profile__overview-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile__overview-icon span {
  width: 24px;
  height: 24px;
}
.profile__overview-number {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
.blue {
  background: #2b7fff1a;
  color: #2b7fff;
}
.green {
  background: #00c8531a;
  color: #00c853;
}
.yellow {
  background: #ffab001a;
  color: #ffab00;
}
.red {
  background: #ff3d001a;
  color: #ff3d00;
}
.active__sessions-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.active__session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--border);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}
.active__session-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--blue);
}
.active__session-name {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--light-grey);
  margin-bottom: 4px;
}
.active__session-desc {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 6px;
}
.active__session-platform {
  display: flex;
  align-items: center;
  gap: 16px;
}
.active__session-platform span:first-child {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--light-grey);
}
.active__session-platform span:last-child {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--blue);
  position: relative;
}
.active__session-platform span:last-child::after {
  content: "";
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: var(--light-grey);
  border-radius: 50%;
}
.active__session-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 10px 16px;
}
.active__session-date {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: var(--light-grey);
  margin-bottom: 4px;
}
.active__session-time {
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: var(--blue);
}
.essay__items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.essay__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.essay__info {
  display: flex;
  align-items: center;
}
.essay__img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
}
.essay__name {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 4px;
}
.essay__status {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  padding: 4px 8px;
  border-radius: 1000px;
  text-align: center;
  display: inline-flex;
}
</style>
