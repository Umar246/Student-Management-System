import React from 'react'
import {BsFillPersonFill, BsListColumnsReverse} from 'react-icons/bs';
import {AiFillCheckCircle} from 'react-icons/ai'


export default function Dashboard() {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h3 className='mb-3'>Dashboard</h3>

          <div className="row">
            <div className=" col-12 col-md-4   ">
              <div className="dashboard-card p-3 text-white rounded-3 mb-3">
                <h6 >Students <BsFillPersonFill/></h6>
                <h4 className='fw-bold '>4 </h4> 
              </div>
            </div>

            <div className="col-12 col-md-4  ">
              <div className="dashboard-card p-3 text-white rounded-3 mb-3">
                <h6>Courses <BsListColumnsReverse/></h6>
                <h4 className='fw-bold' >6 </h4>
              </div>
            </div>

            <div className="col-12 col-md-4  ">
              <div className="dashboard-card p-3 text-white rounded-3 mb-3">

                <h6>Attendencce <AiFillCheckCircle/> </h6>
                <h4 className='fw-bold'>0 </h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
