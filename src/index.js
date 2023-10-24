import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import FetchTodosContextProvider from './contexts/FetchTodosContext';
import AuthContextProvider from './contexts/AuthContext';
import FetchCoursesProvider from './contexts/FetchCourses';
import FetchStudentsProvider from './contexts/FetchStudents';
import FetchAttendenceProvider from './contexts/FetchAttendence';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <FetchTodosContextProvider>
          <FetchCoursesProvider>
            <FetchStudentsProvider>
              <FetchAttendenceProvider>
                <App />
              </FetchAttendenceProvider>
            </FetchStudentsProvider>
          </FetchCoursesProvider>
        </FetchTodosContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
