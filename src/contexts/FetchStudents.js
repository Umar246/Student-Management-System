import React, { createContext, useContext, useEffect, useState } from 'react'
import { firestore } from '../config/firebase';
import { collection, doc, getDocs } from 'firebase/firestore/lite';

const FetchStudents = createContext()
export default function FetchStudentsProvider({ children }) {
    const [fetchStudents, setFetchStudents] = useState([])

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

    return (
        <FetchStudents.Provider value={{ fetchStudents, setFetchStudents, fetchedStudents }}>
            {children}
        </FetchStudents.Provider>
    )
}
export const useFetchStudents = () => useContext(FetchStudents)
