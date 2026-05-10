<template>
  <div class="consultation">
    <div class="consultation-container">
      <div v-if="!currentPatient" class="auth-section">
        <div class="auth-card">
          <div class="auth-header">
            <h1>{{ loginMode === 'verify' ? '患者身份验证' : '密码登录' }}</h1>
            <a-button 
              type="link" 
              @click="toggleLoginMode"
              class="mode-toggle-btn"
            >
              {{ loginMode === 'verify' ? '密码登录' : '身份验证' }}
            </a-button>
          </div>
          
          <!-- 身份验证模式 -->
          <template v-if="loginMode === 'verify'">
            <p>请输入您的姓名和生日以验证身份</p>
            <a-form
              :model="authForm"
              :rules="authRules"
              @finish="verifyPatient"
              layout="vertical"
            >
              <a-form-item label="姓名" name="name">
                <a-input
                  v-model:value="authForm.name"
                  size="large"
                  placeholder="请输入您的姓名"
                >
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="生日" name="birthday">
                <a-date-picker
                  v-model:value="authForm.birthday"
                  size="large"
                  format="YYYY-MM-DD"
                  placeholder="请选择您的生日"
                  style="width: 100%"
                />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block>
                  验证身份
                </a-button>
              </a-form-item>
            </a-form>

            <a-alert
              message="提示"
              description="输入任意姓名和生日即可使用。首次输入会自动创建账户,再次输入相同信息即可登录。"
              type="info"
              show-icon
            />
          </template>

          <!-- 密码登录模式 -->
          <template v-else>
            <p>请输入您的用户名和密码登录</p>
            <a-form
              :model="loginForm"
              :rules="loginRules"
              @finish="handleLogin"
              layout="vertical"
            >
              <a-form-item label="用户名" name="username">
                <a-input
                  v-model:value="loginForm.username"
                  size="large"
                  placeholder="请输入用户名"
                >
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>

              <a-form-item label="密码" name="password">
                <a-input-password
                  v-model:value="loginForm.password"
                  size="large"
                  placeholder="请输入密码"
                >
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>

              <div class="login-options">
                <a-checkbox v-model:checked="loginForm.rememberMe">记住我</a-checkbox>
                <a-button type="link" @click="showForgotPassword = true">忘记密码？</a-button>
              </div>

              <a-form-item>
                <a-button type="primary" html-type="submit" size="large" block>
                  登录
                </a-button>
              </a-form-item>
            </a-form>

            <div class="register-link">
              <span>还没有账号？</span>
              <a-button type="link" @click="showRegister = true">立即注册</a-button>
            </div>
          </template>
        </div>
      </div>

      <div v-else class="patient-portal">
        <div class="portal-header">
          <div class="patient-info">
            <UserOutlined class="patient-icon-large" />
            <div>
              <h1>{{ currentPatient.name }} 的问诊</h1>
              <p>欢迎使用在线问诊服务</p>
            </div>
          </div>
          <div class="portal-actions">
            <a-button @click="logoutPatient">
              <LogoutOutlined />
              切换用户
            </a-button>
          </div>
        </div>

        <div class="selected-doctor" v-if="selectedDoctor">
          <a-alert
            :message="`当前诊室: ${selectedDoctor.name} - ${selectedDoctor.department}`"
            type="success"
            show-icon
            closable
            @close="clearSelectedDoctor"
          />
        </div>

        <div class="questions-section">
          <div class="section-header">
            <h2>我的问题</h2>
            <a-button type="primary" @click="showSubmitModal">
              <PlusOutlined />
              提交问题
            </a-button>
          </div>

          <a-empty v-if="myQuestions.length === 0" description="您还没有提交过问题" />

          <div v-else class="my-questions-list">
            <a-card
              v-for="question in myQuestions"
              :key="question.id"
              class="question-item"
            >
              <template #title>
                <div class="question-title">
                  <span>{{ question.doctorName }}</span>
                  <a-tag :color="question.status === 'answered' ? 'green' : 'orange'">
                    {{ question.status === 'answered' ? '已解答' : '待解答' }}
                  </a-tag>
                </div>
              </template>
              <div class="question-detail">
                <p class="question-text"><strong>问题:</strong> {{ question.question }}</p>
                <p class="submit-time">提交时间: {{ formatTime(question.submitTime) }}</p>
                <div v-if="question.status === 'answered'" class="answer-section">
                  <a-divider />
                  <p class="answer-text"><strong>医生回复:</strong> {{ question.answer }}</p>
                  <p class="answer-time">回复时间: {{ formatTime(question.answerTime!) }}</p>
                </div>
              </div>
            </a-card>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交问题弹窗 -->
    <a-modal
      v-model:open="submitModalVisible"
      title="提交问题"
      @ok="submitQuestion"
      @cancel="closeSubmitModal"
      :confirmLoading="submitting"
      width="600px"
    >
      <a-form layout="vertical">
        <a-form-item label="选择医生" required>
          <a-select
            v-model:value="questionForm.doctorId"
            size="large"
            placeholder="请选择您要咨询的医生"
            :disabled="!!selectedDoctor"
          >
            <a-select-option
              v-for="doctor in availableDoctors"
              :key="doctor.id"
              :value="doctor.id"
            >
              <div class="doctor-option">
                <img :src="doctor.avatar" :alt="doctor.name" class="doctor-option-avatar" />
                <div>
                  <div>{{ doctor.name }}</div>
                  <div style="font-size: 12px; color: #999;">
                    {{ doctor.title }} · {{ doctor.department }}
                  </div>
                </div>
              </div>
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="您的问题" required>
          <a-textarea
            v-model:value="questionForm.question"
            :rows="6"
            placeholder="请详细描述您的症状或问题..."
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 注册弹窗 -->
    <a-modal
      v-model:open="showRegister"
      title="用户注册"
      @ok="handleRegister"
      @cancel="showRegister = false"
      :confirmLoading="registering"
      width="500px"
    >
      <a-form layout="vertical" :model="registerForm" :rules="registerRules">
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="registerForm.username"
            size="large"
            placeholder="请输入用户名（3-20位字母数字下划线）"
          />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="registerForm.password"
            size="large"
            placeholder="请输入密码（至少6位）"
          />
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password
            v-model:value="registerForm.confirmPassword"
            size="large"
            placeholder="请再次输入密码"
          />
        </a-form-item>

        <a-form-item label="姓名" name="name">
          <a-input
            v-model:value="registerForm.name"
            size="large"
            placeholder="请输入您的姓名"
          />
        </a-form-item>

        <a-form-item label="生日" name="birthday">
          <a-date-picker
            v-model:value="registerForm.birthday"
            size="large"
            format="YYYY-MM-DD"
            placeholder="请选择您的生日"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 忘记密码弹窗 -->
    <a-modal
      v-model:open="showForgotPassword"
      title="忘记密码"
      @ok="handleForgotPassword"
      @cancel="showForgotPassword = false"
      :confirmLoading="resettingPassword"
      width="400px"
    >
      <a-form layout="vertical" :model="forgotPasswordForm" :rules="forgotPasswordRules">
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="forgotPasswordForm.username"
            size="large"
            placeholder="请输入用户名"
          />
        </a-form-item>

        <a-form-item label="新密码" name="newPassword">
          <a-input-password
            v-model:value="forgotPasswordForm.newPassword"
            size="large"
            placeholder="请输入新密码（至少6位）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  LockOutlined
} from '@ant-design/icons-vue';
import { store, Doctor } from '../store';

const route = useRoute();

const currentPatient = computed(() => store.state.currentPatient);
const myQuestions = computed(() =>
  currentPatient.value
    ? store.getQuestionsByPatient(currentPatient.value.id)
    : []
);

const selectedDoctor = ref<Doctor | null>(null);

// 登录模式切换
const loginMode = ref<'verify' | 'password'>('verify');
const toggleLoginMode = () => {
  loginMode.value = loginMode.value === 'verify' ? 'password' : 'verify';
};

// 身份验证表单
const authForm = reactive({
  name: '',
  birthday: null as Dayjs | null,
});

const authRules = {
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

// 密码登录表单
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
});

const loginRules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
};

// 注册表单
const showRegister = ref(false);
const registering = ref(false);
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  birthday: null as Dayjs | null,
});

const registerRules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, max: 20, message: '用户名长度为3-20位' },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6位' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    ({ getFieldValue }: any) => ({
      validator(_: any, value: string) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('两次输入的密码不一致'));
      },
    }),
  ],
  name: [{ required: true, message: '请输入姓名' }],
  birthday: [{ required: true, message: '请选择生日' }],
};

// 忘记密码表单
const showForgotPassword = ref(false);
const resettingPassword = ref(false);
const forgotPasswordForm = reactive({
  username: '',
  newPassword: '',
});

const forgotPasswordRules = {
  username: [{ required: true, message: '请输入用户名' }],
  newPassword: [
    { required: true, message: '请输入新密码' },
    { min: 6, message: '密码至少6位' },
  ],
};

// 提交问题表单
const submitModalVisible = ref(false);
const submitting = ref(false);

const questionForm = reactive({
  doctorId: '',
  question: '',
});

const availableDoctors = computed(() => {
  return selectedDoctor.value
    ? [selectedDoctor.value]
    : store.getActiveDoctors();
});

onMounted(() => {
  const doctorUsername = route.params.doctorUsername as string;
  if (doctorUsername) {
    const doctor = store.getDoctorByUsername(doctorUsername);
    if (doctor && doctor.isActive) {
      selectedDoctor.value = doctor;
      questionForm.doctorId = doctor.id;
    }
  }
});

const verifyPatient = async () => {
  const birthday = authForm.birthday?.format('YYYY-MM-DD');
  if (!birthday) {
    message.error('请选择生日');
    return;
  }

  const result = await store.verifyPatientFromAPI(authForm.name, birthday);
  if (result.success) {
    message.success(result.message);
  } else {
    message.error(result.message);
  }
};

const handleLogin = async () => {
  const result = await store.loginPatientFromAPI(loginForm.username, loginForm.password);
  if (result.success) {
    message.success('登录成功!');
  } else {
    message.error(result.message);
  }
};

const handleRegister = async () => {
  if (registerForm.password !== registerForm.confirmPassword) {
    message.error('两次输入的密码不一致');
    return;
  }

  const birthday = registerForm.birthday?.format('YYYY-MM-DD');
  if (!birthday) {
    message.error('请选择生日');
    return;
  }

  registering.value = true;

  const result = await store.registerPatientFromAPI(
    registerForm.username,
    registerForm.password,
    registerForm.name,
    birthday
  );

  registering.value = false;

  if (result.success) {
    message.success('注册成功!');
    showRegister.value = false;
    loginMode.value = 'verify';
  } else {
    message.error(result.message);
  }
};

const handleForgotPassword = async () => {
  resettingPassword.value = true;

  const result = await store.resetPasswordFromAPI(
    forgotPasswordForm.username,
    forgotPasswordForm.newPassword
  );

  resettingPassword.value = false;

  if (result.success) {
    message.success('密码重置成功!');
    showForgotPassword.value = false;
  } else {
    message.error(result.message);
  }
};

const logoutPatient = () => {
  store.logoutPatient();
  selectedDoctor.value = null;
  loginForm.username = '';
  loginForm.password = '';
  message.success('已切换用户');
};

const clearSelectedDoctor = () => {
  selectedDoctor.value = null;
  questionForm.doctorId = '';
};

const showSubmitModal = () => {
  if (selectedDoctor.value) {
    questionForm.doctorId = selectedDoctor.value.id;
  }
  submitModalVisible.value = true;
};

const closeSubmitModal = () => {
  submitModalVisible.value = false;
  if (!selectedDoctor.value) {
    questionForm.doctorId = '';
  }
  questionForm.question = '';
};

const submitQuestion = () => {
  if (!questionForm.doctorId) {
    message.error('请选择医生');
    return;
  }

  if (!questionForm.question.trim()) {
    message.error('请输入问题');
    return;
  }

  submitting.value = true;

  setTimeout(() => {
    const doctor = store.state.doctors.find(d => d.id === questionForm.doctorId);
    if (doctor && currentPatient.value) {
      store.addQuestion({
        patientId: currentPatient.value.id,
        patientName: currentPatient.value.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        question: questionForm.question,
      });

      message.success('问题提交成功');
      closeSubmitModal();
    }

    submitting.value = false;
  }, 500);
};

const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm');
};
</script>

<style scoped>
.consultation {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.consultation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.auth-section {
  min-height: calc(100vh - 112px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.auth-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.mode-toggle-btn {
  font-size: 14px;
  color: #1890ff;
  padding: 0;
}

.auth-card > p {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
}

.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.patient-portal {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.portal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.patient-icon-large {
  font-size: 48px;
  color: #fff;
}

.patient-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.patient-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.selected-doctor {
  padding: 16px 24px;
  background: #f6ffed;
  border-bottom: 1px solid #e8e8e8;
}

.questions-section {
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.my-questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-item {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.question-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.question-detail {
  line-height: 1.6;
}

.question-text,
.answer-text {
  margin-bottom: 12px;
  color: #333;
}

.submit-time,
.answer-time {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.answer-section {
  margin-top: 16px;
}

.doctor-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doctor-option-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .auth-card {
    margin: 24px;
    padding: 32px 24px;
  }

  .portal-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .portal-actions {
    width: 100%;
  }
}
</style>