import { message } from 'antd'
import React from 'react'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { firestore } from '../../../config/firebase'
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { useEffect } from 'react'
import { PiTrashLight } from 'react-icons/pi';
import { AiOutlineEdit } from 'react-icons/ai';

const initialState = { studentName: '', studentID: '', studentEmail: '', phoneNumber: '', studentAddress: '', courseEnrolled: '' }
export default function Students() {
  const [isLoading, setIsLoading] = useState(false)
  const [studentData, setStudentData] = useState(initialState)
  const [fetchCourses, setFetchCourses] = useState([])
  const [editCourse, setEditCourse] = useState({})
  const [fetchStudents, setFetchStudents] = useState([])

  //________________________________________________________________________________________________________________________________

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value })
  }
  //________________________________________________________________________________________________________________________________

  const handleChangeForEdit = (e) => {

    setEditCourse({ ...editCourse, [e.target.name]: e.target.value })

  }
  //________________________________________________________________________________________________________________________________

  // FetchDocs (For fething document from firestore )
  const fetchedCourses = async () => {

    let allCourses = [];

    const querySnapshot = await getDocs(collection(firestore, "courses"));

    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      const data = doc.data()
      allCourses.push(data)
    });
    setFetchCourses(allCourses)

  }

  useEffect(() => {
    fetchedCourses()
  }, [])

  //________________________________________________________________________________________________________________________________

  const fetchedStudents = async () => {

    let allStudents = [];

    const querySnapshot = await getDocs(collection(firestore, "students"));

    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      const data = doc.data()
      allStudents.push(data)
    });
    setFetchStudents(allStudents)

  }

  useEffect(() => {
    fetchedStudents()
  }, [])

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
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      status: "active",

    }

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

  const handleEditCourse = (courseInfo) => {
    setEditCourse(courseInfo)
  }
  //________________________________________________________________________________________________________________________________

  const handleUpdateCourse = async (courseForEdit) => {

    setIsLoading(true)
    await setDoc(doc(firestore, "courses", courseForEdit.id), courseForEdit, { merge: true });


    let courseAfterEdit = fetchCourses.map((oldCourse) => {

      if (oldCourse.id === courseForEdit.id) {
        return courseForEdit
      } else {
        return oldCourse
      }
    })

    setFetchCourses(courseAfterEdit)
    setIsLoading(false)
    message.success('Course Edited Successfully')
    setEditCourse(initialState)



  }




  //________________________________________________________________________________________________________________________________


  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <h3 className='mb-3'>Students</h3>

            <div className='bg-light p-3'>

              <div className="row">
                <div className="col-12 col-md-4 mt-2 mb-sm-3 mb-md-0">
                  <p className='fw-bold ms-2'>Student Table</p>
                </div>

                <div className="col-12 col-md-4 text-center mb-sm-3 mb-md-0">
                  <input type="text" placeholder='Search Student...' className='form-control ' />
                </div>


                <div className="col-12 col-md-4 d-flex justify-content-end mb-sm-3 mb-md-0">
                  <div className="col-12 col-md-3 ">

                    <button className='btn btn-outline-primary rounded-2 w-100' data-bs-target="#newTodoModal" data-bs-toggle="modal"><AiOutlinePlus size={20} /></button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">


                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Student Name</th>
                      <th scope="col">Student ID</th>
                      <th scope="col">Course Email</th>
                      <th scope="col">Course Enrolled</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchStudents.map((student, i) => {
                      return (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{student.studentName}</td>
                          <td>{student.studentID}</td>
                          <td>{student.studentEmail}</td>
                          <td>{student.courseEnrolled}</td>




                          <td>

                            <button className='btn  btn-sm  me-2' data-bs-toggle="modal" data-bs-target="#editCourseModal" ><AiOutlineEdit className='text-primary' size={20} /></button>
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

                <div className="row mb-3">

                  <div className="col-12 col-md-8 mb-3 mb-md-0">
                    <input type="text" required name='studentName' value={studentData.studentName} onChange={handleChange} className='form-control' placeholder='Student Name' />
                  </div>

                  <div className="col-12 col-md-4 mb-3 mb-md-0 ">
                    <input type="number" name='studentID' value={studentData.studentID} onChange={handleChange} placeholder='Student ID ' required className='form-control form-control' />
                  </div>

                </div>
                <div className="row mb-3">

                  <div className="col-12  mb-3 mb-md-0">
                    <input type="email" required name='studentEmail' value={studentData.studentEmail} onChange={handleChange} className='form-control' placeholder='Student Email' />
                  </div>

                </div>

                <div className="row mb-3">

                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <input type="number" required name='phoneNumber' value={studentData.phoneNumber} onChange={handleChange} className='form-control' placeholder='Phone Number' />
                  </div>

                  <div className="col-12 col-md-6 mb-md-0 ">


                    <select class="form-select form-select-md mb-3" name='courseEnrolled' aria-label=".form-select-lg example" onChange={handleChange}>
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

                  <div className="col">
                    <textarea required className='form-control' onChange={handleChange} value={studentData.studentAddress} name='studentAddress' cols="10" rows="3" placeholder='Student Address' />
                  </div>

                </div>

                <div className="modal-footer mb-0">

                  {!isLoading
                    ? <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={handleAddStudent}>Add Student</button>
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Course Information</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              {/* Edit (Modal) */}
              <form >

                <div className="row mb-3">

                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <input type="text" required name='courseName' value={editCourse.courseName} onChange={handleChangeForEdit} className='form-control' placeholder='Course Name' />
                  </div>

                  <div className="col-12 col-md-6 mb-3 mb-md-0 ">
                    <input type="number" name='courseCode' value={editCourse.courseCode} onChange={handleChangeForEdit} placeholder='Course Code' required className='form-control form-control' />
                  </div>

                </div>

                <div className="row">

                  <div className="col">
                    <textarea required className='form-control' value={editCourse.description} onChange={handleChangeForEdit} name='description' cols="10" rows="3" placeholder='Description' />
                  </div>

                </div>

                <div className="modal-footer mb-0">

                  {!isLoading
                    ? <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={() => handleUpdateCourse(editCourse)}>Update Course</button>
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
