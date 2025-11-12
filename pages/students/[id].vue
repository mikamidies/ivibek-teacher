<script setup>
import dayjs from "dayjs";
import { message } from "ant-design-vue";

const infoShow = ref(true);
const tasksShow = ref(false);
const visible = ref(false);
const editVisible = ref(false);
const gradeVisible = ref(false);
const loading = ref(true);
const submitLoading = ref(false);
const assignmentsLoading = ref(false);
const assignmentDetailLoading = ref(false);
const gradeSubmitLoading = ref(false);

const form = ref({
  title: "",
  description: "",
  startDate: null,
  endDate: null,
});

const gradeForm = ref({
  grade: null,
});

const selectedAssignment = ref(null);

const showModal = () => {
  visible.value = true;
};

const handleOk = async () => {
  try {
    submitLoading.value = true;

    if (
      !form.value.title ||
      !form.value.description ||
      !form.value.startDate ||
      !form.value.endDate
    ) {
      message.error("Please fill in all fields");
      return;
    }

    const payload = {
      studentId: studentId,
      title: form.value.title,
      description: form.value.description,
      startDate: dayjs(form.value.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(form.value.endDate).format("YYYY-MM-DD"),
    };

    await assignTask(payload);

    message.success("Task assigned successfully");

    form.value = {
      title: "",
      description: "",
      startDate: null,
      endDate: null,
    };

    visible.value = false;

    await loadAssignments();
  } catch (error) {
    console.error("Error assigning task:", error);
    message.error("Error assigning task");
  } finally {
    submitLoading.value = false;
  }
};

const handleEditOk = () => {
  editVisible.value = false;
};

const openAssignmentModal = async (assignmentId) => {
  try {
    assignmentDetailLoading.value = true;
    gradeVisible.value = true;
    selectedAssignment.value = await fetchAssignmentById(assignmentId);
    gradeForm.value.grade = null;
  } catch (error) {
    console.error("Error loading assignment details:", error);
    message.error("Failed to load assignment details");
  } finally {
    assignmentDetailLoading.value = false;
  }
};

const handleGradeSubmit = async () => {
  try {
    if (
      !gradeForm.value.grade ||
      gradeForm.value.grade < 0 ||
      gradeForm.value.grade > 100
    ) {
      message.error("Please enter a valid grade (0-100)");
      return;
    }

    gradeSubmitLoading.value = true;

    await gradeAssignment(selectedAssignment.value.id, gradeForm.value.grade);

    message.success("Grade submitted successfully");

    const updatedAssignment = await fetchAssignmentById(
      selectedAssignment.value.id
    );

    console.log("Updated assignment:", updatedAssignment);
    console.log("Has grade?", !!updatedAssignment?.grade);

    selectedAssignment.value = { ...updatedAssignment };

    await loadAssignments();

    gradeForm.value.grade = null;

    await nextTick();
  } catch (error) {
    console.error("Error submitting grade:", error);
    message.error("Failed to submit grade");
  } finally {
    gradeSubmitLoading.value = false;
  }
};
const handleGradeOk = () => {
  gradeVisible.value = false;
  selectedAssignment.value = null;
};

const {
  fetchStudentById,
  assignTask,
  fetchStudentAssignments,
  fetchAssignmentById,
  gradeAssignment,
} = useStudents();
const route = useRoute();
const studentId = Number(route.params.id);

const student = ref(null);
const assignments = ref([]);

const loadAssignments = async () => {
  try {
    assignmentsLoading.value = true;
    assignments.value = await fetchStudentAssignments(studentId);
  } catch (error) {
    console.error("Error loading assignments:", error);
  } finally {
    assignmentsLoading.value = false;
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case "GRADED":
      return {
        class: "green status",
        icon: "lucide:check",
        text: "Graded",
      };
    case "ASSIGNED":
      return {
        class: "yellow status",
        icon: "lucide:clock",
        text: "Assigned",
      };
    case "PENDING_REVIEW":
      return {
        class: "blue status",
        icon: "lucide:clock",
        text: "Pending",
      };
    default:
      return {
        class: "yellow status",
        icon: "lucide:clock",
        text: status,
      };
  }
};

onMounted(async () => {
  try {
    student.value = await fetchStudentById(studentId);
    await loadAssignments();
  } catch (error) {
    console.error("Error loading student:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="teacher-page">
    <div class="teacher__card" style="padding: 48px; text-align: center">
      <a-spin size="large" />
      <p style="margin-top: 16px">Loading student data...</p>
    </div>
  </div>
  <div v-else-if="!student" class="teacher-page">
    <div class="teacher__card" style="padding: 48px; text-align: center">
      <h2>Student not found</h2>
      <NuxtLink to="/students" style="margin-top: 16px; display: inline-block"
        >Back to students</NuxtLink
      >
    </div>
  </div>
  <div v-else class="teacher-page">
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
              :src="student?.image || '/images/default-person.jpg'"
              alt="Teacher"
              width="96"
              height="96"
            />
          </div>
          <div class="teacher__top-info">
            <h4 class="teacher__top-name">{{ student?.info.fullName }}</h4>
            <span class="teacher__top-sub"> {{ student?.info.email }} </span>
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
                <p>
                  {{ student?.info.email || "Email not set" }}
                </p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:map-pin" />
                <p>
                  {{ student?.info.country?.name || "Address not set" }}
                </p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:calendar" />
                <p>
                  {{
                    student?.info.dateOfBirth
                      ? dayjs(student?.info.dateOfBirth).format("MMM DD, YYYY")
                      : "Not set"
                  }}
                </p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:user" />
                <p>
                  {{ student?.info.gender || "Gender not set" }}
                </p>
              </div>
              <div class="modal__details-item">
                <Icon name="lucide:clock" />
                <p>
                  {{ student?.info.timezone || "Timezone not set" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="teacher__right">
        <div class="teacher__desc teacher__card">
          <h4 class="section__title">About student</h4>
          <p v-html="student?.about || 'No data'"></p>
        </div>
      </div>
    </div>
    <div class="student__tasks" v-show="tasksShow">
      <div class="empty" v-if="assignments.length === 0">
        <Icon name="lucide:book-template" />
        <p>No tasks assigned to this student yet</p>
      </div>
      <div class="student__grid">
        <div
          class="student__task-item"
          v-for="item in assignments"
          :key="item.id"
          @click="openAssignmentModal(item.id)"
        >
          <div class="student__task-top">
            <span
              class="student__item-status"
              :class="getStatusConfig(item.status).class"
            >
              <span>{{ getStatusConfig(item.status).text }}</span>
            </span>
            <h4 class="student__task-name">{{ item?.title }}</h4>
            <p class="student__task-sub">
              {{ item?.description }}
            </p>
          </div>
          <div class="student__task-bottom">
            <p class="student__task-from">
              <Icon name="lucide:calendar" class="icon" />
              {{ item?.startDate }}
            </p>
            <p class="student__task-to">
              <Icon name="lucide:calendar" class="icon" />
              {{ item?.endDate }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <a-modal
    v-model:visible="visible"
    title="Assign New Task"
    @ok="handleOk"
    :confirm-loading="submitLoading"
    ok-text="Assign"
    cancel-text="Cancel"
  >
    <a-form :model="form" layout="vertical">
      <a-form-item label="Title" name="title" style="grid-column: 1/3">
        <a-input v-model:value="form.title" placeholder="Enter task title" />
      </a-form-item>
      <a-form-item
        label="Description"
        name="description"
        class="long-form-item"
      >
        <a-textarea
          v-model:value="form.description"
          rows="4"
          placeholder="Enter task description"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>
      <a-form-item label="Start Date" name="startDate">
        <a-date-picker
          v-model:value="form.startDate"
          style="width: 100%"
          placeholder="Start Date"
          format="DD.MM.YYYY"
        />
      </a-form-item>
      <a-form-item label="End Date" name="endDate">
        <a-date-picker
          v-model:value="form.endDate"
          style="width: 100%"
          placeholder="End Date"
          format="DD.MM.YYYY"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <!-- <a-modal
    v-model:visible="editVisible"
    title="Memorize 1200 words by tonight"
    @ok="handleEditOk"
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
  </a-modal> -->

  <a-modal
    v-model:visible="gradeVisible"
    :title="selectedAssignment?.title || 'Assignment Details'"
    @ok="handleGradeOk"
    width="600px"
    :key="selectedAssignment?.id"
  >
    <div
      v-if="assignmentDetailLoading"
      style="text-align: center; padding: 48px"
    >
      <a-spin size="large" />
      <p style="margin-top: 16px">Loading assignment details...</p>
    </div>
    <div v-else-if="selectedAssignment">
      <div
        class="status big__status"
        :class="getStatusConfig(selectedAssignment.status).class"
      >
        {{ getStatusConfig(selectedAssignment.status).text }}
      </div>

      <div class="modal__times">
        <div class="modal__start">
          <p>Start Date</p>
          <span>{{
            dayjs(selectedAssignment.startDate).format("DD.MM.YYYY")
          }}</span>
        </div>
        <div class="modal__end">
          <p>End Date</p>
          <span>{{
            dayjs(selectedAssignment.endDate).format("DD.MM.YYYY")
          }}</span>
        </div>
      </div>

      <div class="modal__desc">
        <h4>Task Description</h4>
        <p>{{ selectedAssignment.description }}</p>
      </div>

      <div
        class="modal__bottom"
        v-if="selectedAssignment.submission || selectedAssignment.grade"
      >
        <div class="modal__response" v-if="selectedAssignment.submission">
          <h4>Student's answer</h4>
          <a
            :href="selectedAssignment.submission.submissionUrl"
            target="_blank"
          >
            {{ selectedAssignment.submission.submissionUrl }}
          </a>
          <!-- <p style="color: var(--light-grey); font-size: 12px; margin-top: 8px">
            Submitted:
            {{
              dayjs(selectedAssignment.submission.createdAt).format(
                "DD.MM.YYYY HH:mm"
              )
            }}
          </p> -->
        </div>

        <div class="modal__grade" v-if="selectedAssignment.grade">
          <p style="font-size: 24px; font-weight: 600; color: var(--green)">
            {{ selectedAssignment.grade.grade }}/100
          </p>
          <!-- <p style="color: var(--light-grey); font-size: 12px; margin-top: 8px">
            Graded:
            {{
              dayjs(selectedAssignment.grade.createdAt).format(
                "DD.MM.YYYY HH:mm"
              )
            }}
          </p> -->
        </div>

        <div
          class="modal__grade"
          v-if="selectedAssignment.submission && !selectedAssignment.grade"
        >
          <h4>Submit Grade</h4>
          <form @submit.prevent="handleGradeSubmit">
            <a-input
              v-model:value="gradeForm.grade"
              type="number"
              placeholder="Enter grade (0-100)"
              :min="0"
              :max="100"
            />
            <a-button
              type="primary"
              html-type="submit"
              style="width: 100%"
              :loading="gradeSubmitLoading"
            >
              Submit
            </a-button>
          </form>
        </div>
      </div>

      <div
        v-else
        style="text-align: center; padding: 24px; color: var(--light-grey)"
      >
        <p>Waiting for student submission</p>
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
.teacher__desc :deep(p) {
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
  height: 336px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.student__task-bottom {
  border-top: 1px solid var(--border);
  padding-top: 16px;
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
.modal__grade form {
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 8px;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--light-grey);
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  margin-top: 48px;
  min-height: 300px;
}
.empty span {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}
</style>
