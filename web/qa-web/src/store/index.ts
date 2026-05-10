import { reactive } from 'vue';
import patientData from '../data/patient-user.json';
import questionData from '../data/question-list.json';

export interface Doctor {
  id: string;
  username: string;
  password: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  experience: string;
  specialties: string[];
  isActive: boolean;
}

export interface Patient {
  id: string;
  name: string;
  birthday: string;
  phone: string;
  gender: string;
  username?: string;
  password?: string;
}

export interface Question {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  question: string;
  submitTime: string;
  status: 'pending' | 'answered';
  answer: string | null;
  answerTime: string | null;
}

export type Language = 'zh' | 'en';

interface State {
  doctors: Doctor[];
  patients: Patient[];
  questions: Question[];
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  currentLanguage: Language;
}

const state = reactive<State>({
  doctors: [] as Doctor[],
  patients: patientData as Patient[],
  questions: questionData as Question[],
  currentDoctor: null,
  currentPatient: null,
  currentLanguage: 'zh',
});

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: Patient;
}

export const store = {
  state,

  loginDoctor(username: string, password: string): Doctor | null {
    const doctor = state.doctors.find(
      d => d.username === username && d.password === password
    );
    if (doctor) {
      state.currentDoctor = doctor;
      return doctor;
    }
    return null;
  },

  logoutDoctor() {
    state.currentDoctor = null;
  },

  async verifyPatientFromAPI(name: string, birthday: string): Promise<ApiResponse> {
    try {
      const response = await fetch('http://localhost:8081/api/patients/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, birthday }),
      });
      const data: ApiResponse = await response.json();
      if (data.success && data.user) {
        state.currentPatient = data.user;
      }
      return data;
    } catch (error) {
      console.error('Failed to verify patient:', error);
      return { success: false, message: '验证失败，请重试' };
    }
  },

  async loginPatientFromAPI(username: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch('http://localhost:8081/api/patients/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data: ApiResponse = await response.json();
      if (data.success && data.user) {
        state.currentPatient = data.user;
      }
      return data;
    } catch (error) {
      console.error('Failed to login patient:', error);
      return { success: false, message: '登录失败，请重试' };
    }
  },

  async registerPatientFromAPI(username: string, password: string, name: string, birthday: string, phone?: string, gender?: string): Promise<ApiResponse> {
    try {
      const response = await fetch('http://localhost:8081/api/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, birthday, phone, gender }),
      });
      const data: ApiResponse = await response.json();
      if (data.success && data.user) {
        state.currentPatient = data.user;
      }
      return data;
    } catch (error) {
      console.error('Failed to register patient:', error);
      return { success: false, message: '注册失败，请重试' };
    }
  },

  async resetPasswordFromAPI(username: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await fetch('http://localhost:8081/api/patients/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to reset password:', error);
      return { success: false, message: '密码重置失败，请重试' };
    }
  },

  verifyPatient(name: string, birthday: string): Patient {
    let patient = state.patients.find(
      p => p.name === name && p.birthday === birthday
    );

    if (!patient) {
      patient = {
        id: `patient${Date.now()}`,
        name,
        birthday,
        phone: '',
        gender: '',
      };
      state.patients.push(patient);
    }

    state.currentPatient = patient;
    return patient;
  },

  loginPatient(username: string, password: string): Patient | null {
    const patient = state.patients.find(
      p => p.username === username && p.password === password
    );
    if (patient) {
      state.currentPatient = patient;
      return patient;
    }
    return null;
  },

  registerPatient(username: string, password: string, name: string, birthday: string): Patient {
    let patient = state.patients.find(
      p => p.username === username
    );

    if (!patient) {
      patient = {
        id: `patient${Date.now()}`,
        username,
        password,
        name,
        birthday,
        phone: '',
        gender: '',
      };
      state.patients.push(patient);
    }

    state.currentPatient = patient;
    return patient;
  },

  logoutPatient() {
    state.currentPatient = null;
  },

  getQuestionsByDoctor(doctorId: string): Question[] {
    return state.questions.filter(q => q.doctorId === doctorId);
  },

  getQuestionsByPatient(patientId: string): Question[] {
    return state.questions.filter(q => q.patientId === patientId);
  },

  addQuestion(question: Omit<Question, 'id' | 'submitTime' | 'status' | 'answer' | 'answerTime'>): Question {
    const newQuestion: Question = {
      ...question,
      id: `q${Date.now()}`,
      submitTime: new Date().toISOString(),
      status: 'pending',
      answer: null,
      answerTime: null,
    };
    state.questions.push(newQuestion);
    return newQuestion;
  },

  answerQuestion(questionId: string, answer: string) {
    const question = state.questions.find(q => q.id === questionId);
    if (question) {
      question.status = 'answered';
      question.answer = answer;
      question.answerTime = new Date().toISOString();
    }
  },

  markQuestionAsAnswered(questionId: string) {
    const question = state.questions.find(q => q.id === questionId);
    if (question) {
      question.status = 'answered';
      question.answer = '已口述解答';
      question.answerTime = new Date().toISOString();
    }
  },

  getDoctorByUsername(username: string): Doctor | undefined {
    return state.doctors.find(d => d.username === username);
  },

  getActiveDoctors(): Doctor[] {
    return state.doctors.filter(d => d.isActive);
  },

  getStatistics() {
    const totalDoctors = state.doctors.length;
    const totalQuestions = state.questions.length;
    const activeSessions = state.questions.filter(q => q.status === 'pending').length;
    const totalSessions = state.doctors.filter(d => d.isActive).length;

    return {
      totalDoctors,
      totalQuestions,
      activeSessions,
      totalSessions,
    };
  },

  setLanguage(language: Language) {
    state.currentLanguage = language;
  },

  getLanguage(): Language {
    return state.currentLanguage;
  },

  async loadDoctorsFromAPI(): Promise<void> {
        try {
            const response = await fetch('http://localhost:8081/api/doctors');
            const doctors = await response.json();
            state.doctors = doctors.map((doctor: any) => ({
                id: doctor.id,
                name: doctor.name,
                title: doctor.title,
                department: doctor.department,
                avatar: doctor.avatar,
                experience: doctor.experience,
                specialties: typeof doctor.specialties === 'string' ? JSON.parse(doctor.specialties) : doctor.specialties,
                isActive: doctor.isActive
            }));
        } catch (error) {
            console.error('Failed to load doctors from API:', error);
        }
    },

    async loadActiveDoctorsFromAPI(): Promise<void> {
        try {
            const response = await fetch('http://localhost:8081/api/doctors/active');
            const doctors = await response.json();
            state.doctors = doctors.map((doctor: any) => ({
                id: doctor.id,
                name: doctor.name,
                title: doctor.title,
                department: doctor.department,
                avatar: doctor.avatar,
                experience: doctor.experience,
                specialties: typeof doctor.specialties === 'string' ? JSON.parse(doctor.specialties) : doctor.specialties,
                isActive: doctor.isActive
            }));
        } catch (error) {
            console.error('Failed to load active doctors from API:', error);
        }
    },
};
