import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NoPage from '../Frontend/NoPage'
import Dashboard from './Dashboard/Dashboard'
import Students from './Students/Students'
import Courses from './Courses/Courses'
import Attendence from './Attendence/Attendence'

export default function Index() {
    return (
        <>
       

            <Routes>

                <Route path='/' element={<Dashboard />} />
                <Route path='/students' element={<Students />} />
                <Route path='/courses' element={<Courses />} />
                <Route path='/attendence' element={<Attendence />} />
                <Route path='*' element={<NoPage />} />

            </Routes>
   
        </>
    )
}
