const BASE_URL =  "https://school-erp-backend-dvh0.onrender.com";
// const BASE_URL =  "http://10.97.117.238:5000";

// Saare endpoints ek object me
export const API_URLS = {
  BASE_URL:`${BASE_URL}`,
  LOGIN: `${BASE_URL}/api/user`,
  GET_STUDENTS: `${BASE_URL}/api/analytics`,
  APPLICATION: `${BASE_URL}/api/leave`,
  PAYMENT: `${BASE_URL}/api/payments`,
  ASSIGN:`${BASE_URL}/api/assign`,
  ATTENDANCE:`${BASE_URL}/api/attendance`,
  TEACHER:`${BASE_URL}/api/teachers`,
    COMPLAINT:`${BASE_URL}/api/complaint`,
    NOTIFICATION:`${BASE_URL}/api/notification`,
    SOCKET_BASE:`${BASE_URL}`,
      NOTICE:`${BASE_URL}/api/notice`,
    REMAINDER:`${BASE_URL}/api/fee`,
    SUBJECT:`${BASE_URL}/api/subject`,
      HOMEWORK:`${BASE_URL}/api/homework`,
EVENT: `${BASE_URL}/api/event`,
SCHOOL: `${BASE_URL}/api/school`,
SECURE: `${BASE_URL}/api/secure`,
};

export default API_URLS;
