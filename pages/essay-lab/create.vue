<script setup></script>

<template>
  <div class="essay__create-page">
    <div class="essay__grid">
      <div class="essay__left">
        <NuxtLink to="/essay-lab" class="essay__back">
          <Icon name="lucide:arrow-left" class="icon" />
          Back
        </NuxtLink>
        <h4 class="essay__title">Create New Essay</h4>

        <div class="essay__form">
          <div class="essay__selects">
            <div class="essay__select-item">
              <label for="university">University</label>
              <a-select id="university" placeholder="Select University" />
            </div>
            <div class="essay__select-item">
              <label for="teacher">Teacher</label>
              <a-select id="teacher" placeholder="Select Teacher" />
            </div>
            <div class="essay__select-item">
              <label for="time-limit">Time Limit</label>
              <a-select id="time-limit" placeholder="Select Time Limit" />
            </div>
            <div class="essay__select-item">
              <label for="type">Type</label>
              <a-select id="type" placeholder="Select Type" />
            </div>
          </div>
          <div class="essay__inputs">
            <div class="essay__input-item">
              <a-input
                id="topic"
                placeholder="Enter Essay Topic"
                class="input-full"
              />
            </div>
            <div class="essay__input-item">
              <a-textarea
                id="essay"
                placeholder="Enter your essay"
                class="input-full"
                :autosize="{ minRows: 30, maxRows: 30 }"
              />
            </div>
            <div class="essay__input-item">
              <label for="comments">Comments</label>
              <a-textarea
                id="comments"
                placeholder="Enter your essay"
                class="input-full"
                :autosize="{ minRows: 10, maxRows: 10 }"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="essay__right">
        <h4 class="section__title">Details</h4>
        <div class="details__items">
          <p class="detail__item">
            <Icon name="lucide:check-circle" class="icon icon--success" />
            Ensure your story stands out. Receive honest advice from Ivy League
            consultants.
          </p>
          <p class="detail__item">
            <Icon name="lucide:check-circle" class="icon icon--success" />
            Consultants will leave in-line edits, marginal comments, and a
            thorough final comment.
          </p>
          <p class="detail__item">
            <Icon name="lucide:check-circle" class="icon icon--success" />
            Ensure your story stands out. Receive honest advice from Ivy League
            consultants.
          </p>
        </div>
        <div class="details__pricelist">
          <div class="pricelist__items">
            <div class="pricelist__item">
              <p>Standard</p>
              <p>$40</p>
            </div>
            <div class="pricelist__item">
              <p>Premium</p>
              <p>$60</p>
            </div>
            <div class="pricelist__item">
              <p>Platinum</p>
              <p>$80</p>
            </div>

            <div class="pricelist__total">
              <p>Total</p>
              <p>$60</p>
            </div>
          </div>
        </div>
        <a-checkbox class="details__checkbox">
          I agree to the <a href="#">Terms of Service</a> and have read the
          <a href="#">Privacy Policy</a>.
        </a-checkbox>

        <a-button type="primary" class="btn--full btn--large">
          Proceed to Payment
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.essay__create-page {
  padding: 24px 24px 120px 24px;
  background: var(--border);
  height: 100vh;
  overflow: auto;
}
.essay__grid {
  display: grid;
  grid-template-columns: 1fr 384px;
  gap: 24px;
}
.essay__left {
  background: white;
  padding: 24px;
  border-radius: 16px;
}
.essay__title {
  font-size: 20px;
  line-height: 28px;
  font-weight: 500;
  margin: 8px 0 16px 0;
}
.essay__form {
  margin-top: 16px;
}
.essay__selects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  border-bottom: 1px solid var(--ant-border);
  padding-bottom: 24px;
}
.essay__select-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.essay__inputs {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.essay__select-item:first-child {
  grid-column: span 3;
}
.essay__input-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.essay__back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  padding: 10px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}
label {
  font-weight: 500;
}
.essay__right {
  background: white;
  padding: 24px;
  border-radius: 16px;
  height: fit-content;
}
.details__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}
.detail__item {
  display: grid;
  align-items: baseline;
  grid-template-columns: 20px 1fr;
  gap: 8px;
  font-size: 14px;
}
.detail__item .icon {
  font-size: 20px;
  color: green;
  transform: translateY(8px);
}
.details__pricelist {
  border: 1px solid var(--ant-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}
.pricelist__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pricelist__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  position: relative;
}
.pricelist__item p:first-child {
  color: var(--light-grey);
}
.pricelist__item p:last-child {
  font-size: 16px;
  font-weight: 500;
}
.pricelist__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  border-top: 1px solid var(--ant-border);
  padding-top: 12px;
}
.pricelist__total p:nth-child(2) {
  color: var(--blue);
  font-size: 16px;
}
.details__checkbox {
  margin-bottom: 24px;
}
.btn--full {
  width: 100%;
}
</style>
