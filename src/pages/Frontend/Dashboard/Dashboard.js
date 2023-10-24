import React from 'react'
import { BsFillPersonFill } from 'react-icons/bs';
import { AiFillCheckCircle } from 'react-icons/ai'
import { useFetchCourses } from '../../../contexts/FetchCourses';
import { useFetchStudents } from '../../../contexts/FetchStudents';
import { useFetchAttendence } from '../../../contexts/FetchAttendence';
import { MdOutlineSubject } from 'react-icons/md'


export default function Dashboard() {
  const { fetchCourses } = useFetchCourses()
  const { fetchStudents } = useFetchStudents()
  const { fetchAttendence } = useFetchAttendence()
  return (
    <div className="container p-3 p-3">
      <div className="row">
        <div className="col">
          <h3 className='mb-3'>Dashboard  </h3> 

          <div className="row">
            <div className=" col-12 col-md-4   ">
              <div className="dashboard-card p-3 text-white rounded-3 mb-3">
                <h6 >Students <BsFillPersonFill /></h6>
                <h4 className='fw-bold '>{fetchStudents.length} </h4>
              </div>
            </div>

            <div className="col-12 col-md-4  ">
              <div className="dashboard-card p-3 text-white rounded-3 mb-3">
                <h6>Courses <MdOutlineSubject /></h6>
                <h4 className='fw-bold' >{fetchCourses.length} </h4>
              </div>
            </div>

            <div className="col-12 col-md-4  ">
              <div className="dashboard-card p-3 text-white rounded-3 mb-3">

                <h6>Attendencce <AiFillCheckCircle /> </h6>
                <h4 className='fw-bold'>{fetchAttendence.length} </h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
