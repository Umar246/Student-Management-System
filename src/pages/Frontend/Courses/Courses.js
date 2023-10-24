import { message } from 'antd'
import React from 'react'
import { useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { firestore } from '../../../config/firebase'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore/lite'
import { PiTrashLight } from 'react-icons/pi';
import { AiOutlineEdit } from 'react-icons/ai';
import { useFetchCourses } from '../../../contexts/FetchCourses'

const initialState = { courseName: '', courseCode: '', description: '' }
export default function Courses() {
  const [isLoading, setIsLoading] = useState(false)
  const [courseData, setCourseData] = useState(initialState)
  const { fetchCourses, setFetchCourses, fetchedCourses } = useFetchCourses()
  const [editCourse, setEditCourse] = useState({})
  const [searchedWords, setSearchedWords] = useState('')


  //________________________________________________________________________________________________________________________________

  let afterSearchCourses = [];

  if (searchedWords === '') {
    afterSearchCourses = fetchCourses
  } else {
    afterSearchCourses = fetchCourses.filter((course) => course.courseName.toLowerCase().includes(searchedWords.toLowerCase())
      ||
      course.description.toLowerCase().includes(searchedWords.toLowerCase())
    )
  }
  console.log(afterSearchCourses)

  //Sorted Courses
  const sortedCourse = [...afterSearchCourses].sort((firstCourse, SecondCourse) => firstCourse.courseCode - SecondCourse.courseCode)
  console.log(sortedCourse)

  //________________________________________________________________________________________________________________________________

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value })
  }
  //________________________________________________________________________________________________________________________________

  const handleChangeForEdit = (e) => {

    setEditCourse({ ...editCourse, [e.target.name]: e.target.value })

  }
  //________________________________________________________________________________________________________________________________

  const handleAddCourse = async (e) => {

    e.preventDefault();

    let { courseName, courseCode, description } = courseData
    courseName = courseName.trim()
    courseCode = Number(courseCode)
    description = description.trim()

    if (courseName.length < 3) {
      message.error('Enter title correctly')
      return
    }
    if (description.length < 10) {
      message.error('Enter description correctly')
      return
    }



    let courseInformation = {
      courseName,
      description,
      courseCode,
      dateCreated: serverTimestamp(),
      id: Math.random().toString(36).slice(2),
      status: "active",

    }

    setIsLoading(true)
    try {
      await setDoc(doc(firestore, "courses", courseInformation.id), courseInformation);
      console.log('Course Added Successfully')
      message.success('A new course added successfully')
      fetchedCourses();

      setCourseData(initialState)
    }

    catch (e) {
      console.error('There is an error while adding a course ', e)
      message.error('There is an error while adding a course')
    }
    setIsLoading(false)


  }
  //________________________________________________________________________________________________________________________________
  const handleDelete = async (courseInfo) => { // is ma nichy button say course ki information aa rahi h jis ko hm parameters () ma recieve kar rhy h 

    await deleteDoc(doc(firestore, "courses", courseInfo.id));
    let afterDeleteCourses = fetchCourses.filter((deleteCourse) => {


      // Jis deleteTodo ki id brabar nai ha toodID.id k us lo waps bhej jo (return) . Jis ki brabar ha us par function chlao mtlb delete kar do
      return deleteCourse.id !== courseInfo.id
    })
    setFetchCourses(afterDeleteCourses)
    message.success("Course Deleted Successfully")

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
      <div className="container p-3">
        <div className="row">
          <div className="col">
            <h3 className='mb-3'>Courses</h3>

            <div className='bg-light p-3'>

              <div className="row">
                <div className="col-12 col-md-4 mt-2 mb-sm-3 mb-md-0">
                  <p className='fw-bold ms-2'>Course Table</p>
                </div>

                <div className="col-12 col-md-4 text-center mb-sm-3 mb-md-0">
                  <div className="input-shadow">
                    <input type="text" placeholder='Search Course...' onChange={(e) => { setSearchedWords(e.target.value) }} className='form-control shadow-none rounded-5' />
                  </div>
                </div>


                <div className="col-12 col-md-4 d-flex justify-content-end mb-sm-3 mb-md-0">
                  <div className="col-12 col-md-3 ">

                    <button className='btn btn-dark text-light rounded-2 w-100' data-bs-target="#newTodoModal" data-bs-toggle="modal"><AiOutlinePlus size={20} /></button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">


                <table className="table mt-3">
                  <thead className='text-center'>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Course Name</th>
                      <th scope="col">Course Code</th>
                      <th scope="col">Description</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className='text-center'>
                    {sortedCourse.map((course, i) => {
                      return (
                        <tr key={i}>
                          <th scope="row">{i + 1}</th>
                          <td>{course.courseName}</td>
                          <td >{course.courseCode}</td>
                          <td>{course.description}</td>

                          <td>

                            <button className='btn  btn-sm' data-bs-toggle="modal" data-bs-target="#editCourseModal" onClick={() => handleEditCourse(course)}><AiOutlineEdit className='text-dark' size={20} /></button>
                            <button className='btn  btn-sm' onClick={() => handleDelete(course)}><PiTrashLight size={20} className='text-danger' /></button>

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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Course Information</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">


              {/* Form (Modal) */}
              <form >

                <div className="row mb-3">

                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                    <input type="text" required name='courseName' value={courseData.courseName} onChange={handleChange} className='form-control' placeholder='Course Name' />
                  </div>

                  <div className="col-12 col-md-6 mb-3 mb-md-0 ">
                    <input type="number" name='courseCode' value={courseData.courseCode} onChange={handleChange} placeholder='Course Code' required className='form-control form-control' />
                  </div>

                </div>

                <div className="row">

                  <div className="col">
                    <textarea required className='form-control' value={courseData.description} onChange={handleChange} name='description' cols="10" rows="3" placeholder='Description' />
                  </div>

                </div>

                <div className="modal-footer mb-0">

                  {!isLoading
                    ? <button type="button" className="btn btn-outline-primary mb-0 w-100" onClick={handleAddCourse}>Add Course</button>
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
