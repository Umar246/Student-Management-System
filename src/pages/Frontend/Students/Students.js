import { message } from 'antd'
import React from 'react'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { firestore } from '../../../config/firebase'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { PiTrashLight } from 'react-icons/pi';
import { AiOutlineEdit } from 'react-icons/ai';
import { useFetchCourses } from '../../../contexts/FetchCourses'
import { useFetchStudents } from '../../../contexts/FetchStudents'

const initialState = { studentName: '', studentID: '', studentEmail: '', phoneNumber: '', studentAddress: '', courseEnrolled: '' }
export default function Students() {
  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState(initialState)
  const [searchedWords, setSearchedWords] = useState('')

  const { fetchCourses } = useFetchCourses()
  const [editStudent, setEditStudent] = useState({})
  const { fetchStudents, setFetchStudents, fetchedStudents } = useFetchStudents()

  //________________________________________________________________________________________________________________________________
  // Students Search Bar

  let afterSearchStudents = []

  if (searchedWords === '') {
    afterSearchStudents = fetchStudents
  } else {
    //For Email Search
    afterSearchStudents = fetchStudents.filter(
      (student) => student.studentEmail.toLowerCase().includes(searchedWords.toLowerCase())
        ||
        //For name search
        student.studentName.toLowerCase().includes(searchedWords.toLowerCase())
        ||
        //For course search
        student.courseEnrolled.toLowerCase().includes(searchedWords.toLowerCase())
    )

  }
  console.log(afterSearchStudents)

  //Sorted Students
  const sortedStudents = [...afterSearchStudents].sort((firstStudent, secondStudent) => firstStudent.studentID - secondStudent.studentID)




  //________________________________________________________________________________________________________________________________

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value })
  }
  //________________________________________________________________________________________________________________________________

  const handleChangeForEdit = (e) => {

    setEditStudent({ ...editStudent, [e.target.name]: e.target.value })

  }
  //________________________________________________________________________________________________________________________________

  const handleAddStudent = async (e) => {

    e.preventDefault();

    let { studentName, studentID, studentEmail, phoneNumber, studentAddress, courseEnrolled } = studentData
    studentName = studentName.trim()
    studentID = Number(studentID)
    studentEmail = studentEmail.trim()
    phoneNumber = Number(phoneNumber)
    studentAddress = studentAddress.trim()


    if (studentName.length < 3) {
      return message.error('Enter name correctly')

    }
    if (studentAddress.length < 10) {
      return message.error('Enter address correctly')

    }



    let studentInformation = {
      studentName, studentID, studentEmail, phoneNumber, studentAddress, courseEnrolled,
      courseID: '',
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      status: "active",

    }

    const selectedCourse = fetchCourses.find((course) => course.courseName === courseEnrolled)
    // console.log('selectedCourse',selectedCourse)
    studentInformation.courseID = selectedCourse.id;

    setIsLoading(true)
    try {
      await setDoc(doc(firestore, "students", studentInformation.id), studentInformation);
      console.log('A new student added successfully')
      message.success('A new student added successfully')
      fetchedStudents();

      setStudentData(initialState)
    }

    catch (e) {
      console.error('There is an error while adding a course ', e)
      message.error('There is an error while adding a course')
    }
    setIsLoading(false)


  }
  //________________________________________________________________________________________________________________________________
  const handleDelete = async (studentInfo) => { // is ma nichy button say course ki information aa rahi h jis ko hm parameters () ma recieve kar rhy h 

    await deleteDoc(doc(firestore, "students", studentInfo.id));
    let afterDeleteStudents = fetchStudents.filter((deleteStudent) => {


      // Jis deleteTodo ki id brabar nai ha toodID.id k us lo waps bhej jo (return) . Jis ki brabar ha us par function chlao mtlb delete kar do
      return deleteStudent.id !== studentInfo.id
    })
    setFetchStudents(afterDeleteStudents)
    message.success("Studebt Deleted Successfully")


  }


  //________________________________________________________________________________________________________________________________

  const handleEditStudent = (studentInfo) => {
    setEditStudent(studentInfo)
  }
  //________________________________________________________________________________________________________________________________

  const handleUpdateStudent = async (studentForEdit) => {

    setIsLoading(true)
    await setDoc(doc(firestore, "students", studentForEdit.id), studentForEdit, { merge: true });


    let studentAfterEdit = fetchStudents.map((oldStudent) => {

      if (oldStudent.id === studentForEdit.id) {
        return studentForEdit
      } else {
        return oldStudent
      }
    })

    setFetchStudents(studentAfterEdit)
    setIsLoading(false)
    message.success('Course Edited Successfully')
    setEditStudent(initialState)



  }




  //________________________________________________________________________________________________________________________________


  return (
    <>
      <div className="container p-3">
        <div className="row">
          <div className="col">
            <h3 className='mb-3'>Students</h3>

            <div className=' p-3 bg-light'>

              <div className="row">
                <div className="col-12 col-md-4 mt-2 mb-sm-3 mb-md-0">
                  <p className='fw-bold ms-2'>Student Table</p>
                </div>

                <div className="col-12 col-md-4 text-center mb-sm-3 mb-md-0">
                  <div className="input-shadow">
                    <input type="text" placeholder='Search Student...' onChange={(e) => { setSearchedWords(e.target.value) }} className='form-control shadow-none rounded-5  ' />
                  </div>
                </div>


                <div className="col-12 col-md-4 d-flex justify-content-end mb-sm-3 mb-md-0">
                  <div className="col-12 col-md-3 ">

                    <button className='btn btn-dark text-light  rounded-2 w-100' data-bs-target="#newTodoModal" data-bs-toggle="modal"><AiOutlinePlus size={20} /></button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">


                <table className="table mt-3 ">
                  <thead className='text-center'>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Student Name</th>
                      <th scope="col">Student ID</th>
                      <th scope="col">Student Email</th>
                      <th scope="col">Course Enrolled</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className='text-center'>
                    {sortedStudents.map((student, i) => {
                      return (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{student.studentName}</td>
                          <td>{student.studentID}</td>
                          <td>{student.studentEmail}</td>
                          <td>{student.courseEnrolled}</td>




                          <td>

                            <button className='btn  btn-sm  ' data-bs-toggle="modal" data-bs-target="#editCourseModal" ><AiOutlineEdit className='text-dark' size={20} onClick={() => handleEditStudent(student)} /></button>
                            <button className='btn  btn-sm'><PiTrashLight size={20} className='text-danger'
                              onClick={() => handleDelete(student)} /></button>

                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>


            </div>

          </div>
        </div>
      </div>


      {/* ____________________________________________________________________________________________________________________________________ */}

      {/* <!-- Modal --> */}
      <div className="modal fade" id="newTodoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Student Information</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              {/* Form (Modal) */}
              <form >

                <div className="row ">

                  <div className="col-12 col-md-8 mb-3">
                    <input type="text" required name='studentName' value={studentData.studentName} onChange={handleChange} className='form-control' placeholder='Student Name' />
                  </div>

                  <div className="col-12 col-md-4 mb-3 ">
                    <input type="number" name='studentID' value={studentData.studentID} onChange={handleChange} placeholder='Student ID ' required className='form-control form-control' />
                  </div>

                </div>
                <div className="row ">

                  <div className="col-12  mb-3 ">
                    <input type="email" required name='studentEmail' value={studentData.studentEmail} onChange={handleChange} className='form-control' placeholder='Student Email' />
                  </div>

                </div>

                <div className="row ">

                  <div className="col-12 col-md-6 mb-3 ">
                    <input type="number" required name='phoneNumber' value={studentData.phoneNumber} onChange={handleChange} className='form-control' placeholder='Phone Number' />
                  </div>

                  <div className="col-12 col-md-6  mb-3">


                    <select class="form-select form-select-md " name='courseEnrolled' aria-label=".form-select-lg example" onChange={handleChange}>
                      <option value="" defaultChecked>Select</option>
                      {
                        fetchCourses.map((course, i) => {
                          return (

                            <option key={i}>{course.courseName} </option>

                          )
                        })
                      }
                    </select>
                  </div>
                </div>

                <div className="row">

                  <div className="col mb-3">
                    <textarea required className='form-control' onChange={handleChange} value={studentData.studentAddress} name='studentAddress' cols="10" rows="3" placeholder='Student Address' />
                  </div>

                </div>



                <div className="modal-footer mb-0">

                  {!isLoading
                    ?


                    <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={handleAddStudent}>Add Student</button>


                    : <button type="button" className="btn btn-outline-primary mb-0 w-100" disabled={isLoading}><div className='spinner-border spinner-border-sm'></div></button>
                  }

                </div>


              </form>
            </div>

          </div>
        </div>
      </div>




      {/* _________________________________________________________________________________________________________________________________ */}

      {/* <!-- Modal --> */}
      <div className="modal fade" id="editCourseModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Student Information</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              {/* Edit (Modal) */}
              <form >

                <div className="row ">

                  <div className="col-12 col-md-8 mb-3">
                    <input type="text" required name='studentName' value={editStudent.studentName} onChange={handleChangeForEdit} className='form-control' placeholder='Student Name' />
                  </div>

                  <div className="col-12 col-md-4 mb-3 ">
                    <input type="number" name='studentID' value={editStudent.studentID} onChange={handleChangeForEdit} placeholder='Student ID ' required className='form-control form-control' />
                  </div>

                </div>
                <div className="row ">

                  <div className="col-12  mb-3 ">
                    <input type="email" required name='studentEmail' value={editStudent.studentEmail} onChange={handleChangeForEdit} className='form-control' placeholder='Student Email' />
                  </div>

                </div>

                <div className="row ">

                  <div className="col-12 col-md-6 mb-3 ">
                    <input type="number" required name='phoneNumber' value={editStudent.phoneNumber} onChange={handleChangeForEdit} className='form-control' placeholder='Phone Number' />
                  </div>

                  <div className="col-12 col-md-6  mb-3">


                    <select class="form-select form-select-md " value={editStudent.courseEnrolled} name='courseEnrolled' aria-label=".form-select-lg example" onChange={handleChangeForEdit}>
                      <option value="" >Select</option>
                      {
                        fetchCourses.map((course, i) => {
                          return (

                            <option key={i}>{course.courseName} </option>

                          )
                        })
                      }
                    </select>
                  </div>
                </div>

                <div className="row">

                  <div className="col mb-3">
                    <textarea required className='form-control' onChange={handleChangeForEdit} value={editStudent.studentAddress} name='studentAddress' cols="10" rows="3" placeholder='Student Address' />
                  </div>

                </div>



                <div className="modal-footer mb-0">

                  {!isLoading
                    ?


                    <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={() => handleUpdateStudent(editStudent)}>Update Student</button>


                    : <button type="button" className="btn btn-outline-primary mb-0 w-100" disabled={isLoading}><div className='spinner-border spinner-border-sm'></div></button>
                  }

                </div>


              </form>
            </div>

          </div>
        </div>
      </div>


    </>
  )
}