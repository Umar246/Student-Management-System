import React, { createContext, useContext, useEffect, useState } from 'react'
import { firestore } from '../config/firebase';
import { collection, doc, getDocs } from 'firebase/firestore/lite';

const FetchAttendence = createContext()
export default function FetchAttendenceProvider({ children }) {
    const [fetchAttendence, setFetchAttendence] = useState([])

    const fetchedAttendence = async () => {

        let allAttendences = [];

        const querySnapshot = await getDocs(collection(firestore, "attendence"));

        querySnapshot.forEach((doc) => {
            // console.log(`${doc.id} => ${doc.data()}`);
            const data = doc.data()
            allAttendences.push(data)
        });
        setFetchAttendence(allAttendences)

    }

    useEffect(() => {
        fetchedAttendence()
    }, [])

    return (
        <FetchAttendence.Provider value={{ fetchAttendence, setFetchAttendence, fetchedAttendence }}>
            {children}
        </FetchAttendence.Provider>
    )
}
export const useFetchAttendence = () => useContext(FetchAttendence)
