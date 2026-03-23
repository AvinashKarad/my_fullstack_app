import axios from 'axios';

const API_URL = '/api/students/';

export const createStudent = (student) => axios.post(`${API_URL}create/`, student);
export const listStudents = () => axios.get(API_URL);
export const viewStudent = (id) => axios.get(`${API_URL}${id}/`);
export const updateStudent = (id, student) => axios.put(`${API_URL}${id}/update/`, student);
export const deleteStudent = (id) => axios.delete(`${API_URL}${id}/delete/`);
