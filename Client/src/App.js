import React, { useEffect, useState } from 'react'
import {Route, Routes} from "react-router-dom"
import { Main, Login } from './containers'
import { getAuth } from 'firebase/auth'
import  {app} from "../src/config/firebase.config"
import { vaidateUserJWTToken } from './api'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from './context/actions/userActions'
import {motion} from "framer-motion"
import { fadeInOut } from './animations'
import { MainLoader } from './components'
import {Alert} from "./components"
import { Dashboard } from './containers'
function App() {
  const firebaseAuth = getAuth(app);
  const [isLoading, setIsLoading] = useState(false);
  // const [isAlert, setIsAlert] = useState(false);
  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch()
  //basically gets the details of the users when the user refereshes the page and dispatch the details 
   useEffect (() => {
    setIsLoading(true)
    firebaseAuth.onAuthStateChanged((cred) => {
      if(cred){
        cred.getIdToken().then((token) => {
          vaidateUserJWTToken(token).then(data => {
            // console.log(data);
            dispatch(setUserDetails(data))
          })
        })
      }
     setInterval (() => {
      setIsLoading(false);
     }, 3000)
    })
   }, [])
  return (
    <div className='w-screen min-h-screen h-auto flex flex-col justify-center items-center'>
      {isLoading && (
        <motion.div {...fadeInOut} className='fixed z-50 inset-0 bg-lightOverlay backdrop-blur-md flex items-center justify-center w-full'>
          <MainLoader/>
        </motion.div>
      )}
      <Routes>
        <Route path='/*' element={<Main/>}/>
        <Route path="/login" element={<Login/>}/> 
        <Route path='/dashboard/*' element={<Dashboard/>}/>  
      </Routes>

      {alert?.type && <Alert type={alert?.type} message={alert?.message}/>}

      
     
     </div>
  )
}

export default App
