import React, { createContext, useContext, useEffect, useState } from 'react'
import { firestore } from '../config/firebase';
import { collection, doc, getDocs } from 'firebase/firestore/lite';


const FetchCourses = createContext()
export default function FetchCoursesProvider({ children }) {
    const [fetchCourses, setFetchCourses] = useState([])

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



    return (
        <FetchCourses.Provider value={{ fetchCourses, setFetchCourses ,fetchedCourses }}>
            {children}
        </FetchCourses.Provider>
    )
}

export const useFetchCourses = () => useContext(FetchCourses)