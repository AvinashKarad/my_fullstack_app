import { useEffect, useState } from 'react'
import { createStudent, listStudents, viewStudent, updateStudent, deleteStudent } from './api'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [message, setMessage] = useState('')
  const [newStudent, setNewStudent] = useState({ name: '', contact_no: '', school_name: '' })
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name: '', contact_no: '', school_name: '' })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await listStudents()
      setStudents(response.data)
      setMessage('Students loaded successfully')
    } catch (error) {
      setMessage('Error fetching students')
      console.error(error)
    }
  }

  const handleCreateStudent = async () => {
    if (!newStudent.name || !newStudent.contact_no || !newStudent.school_name) {
      setMessage('Please fill all fields')
      return
    }
    try {
      await createStudent(newStudent)
      setMessage('Student created successfully')
      setNewStudent({ name: '', contact_no: '', school_name: '' })
      fetchStudents()
    } catch (error) {
      setMessage('Error creating student')
      console.error(error)
    }
  }

  const handleViewStudent = async (id) => {
    try {
      const response = await viewStudent(id)
      setSelectedStudent(response.data)
      setEditData(response.data)
      setIsEditing(false)
      setMessage(`Viewing student: ${response.data.name}`)
    } catch (error) {
      setMessage('Error viewing student')
      console.error(error)
    }
  }

  const handleUpdateStudent = async () => {
    if (!editData.name || !editData.contact_no || !editData.school_name) {
      setMessage('Please fill all fields')
      return
    }
    try {
      await updateStudent(selectedStudent.id, editData)
      setMessage('Student updated successfully')
      setIsEditing(false)
      setSelectedStudent(editData)
      fetchStudents()
    } catch (error) {
      setMessage('Error updating student')
      console.error(error)
    }
  }

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id)
        setMessage('Student deleted successfully')
        setSelectedStudent(null)
        setIsEditing(false)
        fetchStudents()
      } catch (error) {
        setMessage('Error deleting student')
        console.error(error)
      }
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Student Management System</h1>
      <p style={{ color: message.includes('Error') ? '#d32f2f' : '#388e3c', fontWeight: 'bold', textAlign: 'center', fontSize: '16px' }}>{message}</p>

      <div style={{ marginBottom: '30px', padding: '20px', border: '2px solid #2196F3', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h2 style={{ color: '#2196F3' }}>Add New Student</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
          />
          <input
            type="text"
            placeholder="Contact No"
            value={newStudent.contact_no}
            onChange={(e) => setNewStudent({ ...newStudent, contact_no: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
          />
          <input
            type="text"
            placeholder="School Name"
            value={newStudent.school_name}
            onChange={(e) => setNewStudent({ ...newStudent, school_name: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
          />
          <button
            onClick={handleCreateStudent}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Add Student
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Student List ({students.length})</h2>
          {students.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>No students found. Add one to get started!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {students.map((student) => (
                <li
                  key={student.id}
                  style={{
                    padding: '12px',
                    marginBottom: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: selectedStudent?.id === student.id ? '#e3f2fd' : '#f9f9f9',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#333' }}>{student.name}</strong>
                    <span style={{ color: '#666', marginLeft: '10px', fontSize: '14px' }}>ID: {student.id}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                    📞 {student.contact_no} | 🏫 {student.school_name}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleViewStudent(student.id)}
                      style={{
                        flex: '1',
                        padding: '6px 10px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      style={{
                        flex: '1',
                        padding: '6px 10px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Student Details</h2>
          {selectedStudent ? (
            <div>
              {!isEditing ? (
                <div style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '4px', backgroundColor: '#f9f9f9', marginBottom: '15px' }}>
                  <p>
                    <strong>ID:</strong> <span style={{ color: '#666' }}>{selectedStudent.id}</span>
                  </p>
                  <p>
                    <strong>Name:</strong> <span style={{ color: '#666' }}>{selectedStudent.name}</span>
                  </p>
                  <p>
                    <strong>Contact No:</strong> <span style={{ color: '#666' }}>{selectedStudent.contact_no}</span>
                  </p>
                  <p>
                    <strong>School Name:</strong> <span style={{ color: '#666' }}>{selectedStudent.school_name}</span>
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      width: '100%',
                    }}
                  >
                    Edit Student
                  </button>
                </div>
              ) : (
                <div style={{ padding: '15px', border: '2px solid #FF9800', borderRadius: '4px', backgroundColor: '#fff8f3', marginBottom: '15px' }}>
                  <h3 style={{ color: '#FF9800', marginBottom: '15px' }}>Edit Student Information</h3>
                  <input
                    type="text"
                    placeholder="Name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="Contact No"
                    value={editData.contact_no}
                    onChange={(e) => setEditData({ ...editData, contact_no: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="School Name"
                    value={editData.school_name}
                    onChange={(e) => setEditData({ ...editData, school_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleUpdateStudent}
                      style={{
                        flex: '1',
                        padding: '10px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        flex: '1',
                        padding: '10px',
                        backgroundColor: '#9e9e9e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', paddingTop: '20px' }}>Select a student from the list to view or edit details</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App