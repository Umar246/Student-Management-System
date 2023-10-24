import React, { useState } from 'react'
import { useFetchCourses } from '../../../contexts/FetchCourses'
import { useFetchStudents } from '../../../contexts/FetchStudents'
import { doc, setDoc } from 'firebase/firestore/lite'
import { firestore } from '../../../config/firebase'
import { message } from 'antd'
import { useFetchAttendence } from '../../../contexts/FetchAttendence'



export default function Attendence() {

  const [selectedCourse, setSelectedCourse] = useState('')
  const { fetchCourses } = useFetchCourses()
  const { fetchStudents } = useFetchStudents()
  const { fetchAttendence, fetchedAttendence } = useFetchAttendence()

  //____________________________________________________________________________________________________________________________________________________________________

  const afterSelectStudents = fetchStudents.filter((student) => student.courseEnrolled === selectedCourse)

  //____________________________________________________________________________________________________________________________________________________________________

  const handlePresent = async (student) => {

    let data = student
    data.date = new Date().toLocaleDateString();
    data.attendence = 'present'
    console.log(data)


    try {
      await setDoc(doc(firestore, 'attendence', data.id), data)
      message.success('Marked as present')
      fetchedAttendence()
      console.log('Marked as present')
    } catch (e) {
      message.error('There is an error while marking attendence')
      console.error('There is an error while marking attendence', e)
    }
  }

  //____________________________________________________________________________________________________________________________________________________________________

  const handleAbsent = async (student) => {

    let data = student
    data.date = new Date().toLocaleDateString();
    data.attendence = 'absent'
    console.log(data)


    try {
      await setDoc(doc(firestore, 'attendence', data.id), data)
      message.success('Marked as absent')
      fetchedAttendence();
      console.log('Marked as absent')
    } catch (e) {
      message.error('There is an error while marking attendence')
      console.error('There is an error while marking attendence', e)
    }
  }

  //____________________________________________________________________________________________________________________________________________________________________

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col">
          <h3>Attendence</h3>

          <div className="bg-light p-3">
            <div className="row mb-3">
              <div className="col-12 col-md-6 m-auto ">
                <div className="input-shadow">

                <select className='  form-select form-select-md shadow-none rounded-5' onChange={(e) => setSelectedCourse(e.target.value)}>
                  <option>Select Course</option>

                  {
                    fetchCourses.map((course, i) => {
                      <option >Select Course</option>
                      return (
                        <option key={i}>{course.courseName}</option>
                      )
                    })
                  }

                </select>
                  </div>
              </div>
            </div>

            <hr />

            {
              !selectedCourse 
              ?  <h6 className='text-center text-dark'>Select a course from above input !</h6>

                :
                <div className="table-responsive">


                  <table className="table mt-3">
                    <thead className='text-center'>
                      <tr>
                        <th scope="col">Sr No</th>
                        <th scope="col">Student Name</th>
                        <th scope="col">Course Name</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody className='text-center'>
                      {afterSelectStudents.map((student, i) => {
                        const studentAttendence = fetchAttendence.find((attendence) => attendence.id === student.id)
                        console.log("studentAttendence", studentAttendence)
                        return (
                          <tr key={i}>
                            <th scope="row">{i + 1}</th>
                            <td>{student.studentName}</td>
                            <td >{student.courseEnrolled}</td>

                            <td >

                              <button className={`btn  btn-sm btn-dark text-light me-sm-0 me-md-2 mb-sm-2 mb-md-0 ${studentAttendence && studentAttendence.attendence === 'present' ? 'disabled' : ''}`} onClick={() => handlePresent(student)}  >Present</button>

                              <button className={`btn  btn-sm btn-danger text-light ${studentAttendence && studentAttendence.attendence === 'absent' ? 'disabled' : ''}`} onClick={() => handleAbsent(student)}>Absent</button>

                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

            }

          </div>

        </div>
      </div>
    </div>
  )
}
