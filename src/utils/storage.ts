import { UserProgressState } from '../types';

const STORAGE_KEY = 'backend_launch_lab_v1_state';

export const getInitialState = (): UserProgressState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved state from localStorage', e);
    }
  }

  // Sensible default state:
  const today = new Date().toISOString().split('T')[0];
  return {
    startDate: today,
    currentDay: 1,
    completedDays: [],
    bookmarks: [],
    selectedTrack: 'undecided',
    dailyNotes: {},
    quizScores: {},
    completedExercises: [],
    completedDeliverables: {},
    projectChecklist: {
      'p-1': false,
      'p-2': false,
      'p-3': false,
      'p-4': false,
      'p-5': false,
      'p-6': false,
      'p-7': false,
      'p-8': false,
      'p-9': false,
      'p-10': false
    },
    jobApplications: [
      {
        id: "demo-1",
        company: "Infosys (Specialist Programmer)",
        role: "Associate Backend Developer",
        jobUrl: "https://career.infosys.com",
        applicationDate: today,
        followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: "Applied",
        notes: "Applied with Java + Spring Boot Capstone project repository link included in resume."
      },
      {
        id: "demo-2",
        company: "Swiggy / Zomato Growth Partner",
        role: "Junior Python Engineer",
        jobUrl: "https://careers.swiggy.com",
        applicationDate: today,
        followUpDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        status: "Screening",
        notes: "Recruiter screened for REST API knowledge and SQL joins. Scheduled technical round next Tuesday."
      }
    ],
    rubricScores: {
      fundamentals: 3,
      problemSolving: 3,
      languageSpecific: 3,
      sqlDatabases: 3,
      apiDesign: 3,
      testingValidation: 3,
      gitArchitecture: 3,
      capstoneQuality: 3,
      designTradeoffs: 3,
      interviewCommunication: 3
    }
  };
};

export const saveState = (state: UserProgressState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
};
