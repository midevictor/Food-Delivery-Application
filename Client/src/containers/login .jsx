import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { LoginBg, Logo } from '../assets'
import { LoginInput } from '../components'
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {motion} from "framer-motion"
import { buttonClick, fadeInOut } from '../animations';
//i need to import getAuth and the provider used
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import  {app} from "../config/firebase.config"
import {vaidateUserJWTToken} from "../api"

const Login  = () => {
  const [userEmail, setUserEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const  [confirmPassword, setConfirmPassswsord] = useState("");

  const firebaseAuth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate()

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, googleProvider).then(userCred => {
      firebaseAuth.onAuthStateChanged((cred) => {
        if(cred){
          cred.getIdToken().then((token) => {
            vaidateUserJWTToken(token).then(data => {
              console.log(data);
            })
            navigate("/", {replace: true})
          })
        }
      })
    })
    
  }

  const signUpWithEmailPass = async () => {
    if(password !== confirmPassword){
      alert("passwords do not match");
      return;
    }
    else if(userEmail === "" || password === "" || confirmPassword === ""){
      alert("please fill in all the fields");
      return;
    } else{
      setUserEmail("");
      setPassword("");
      setConfirmPassswsord("");
      await createUserWithEmailAndPassword(firebaseAuth, userEmail, password).then(userCred => {
        firebaseAuth.onAuthStateChanged((cred) => {
          if(cred){
            cred.getIdToken().then((token) => {
              vaidateUserJWTToken(token).then(data => {    
                console.log(data);
              })
              navigate("/", {replace: true})
            })
          }
        })
      })
      // console.log("equal")
    }   
  }

  const signInWithEmailPass = async  () => {
    if(userEmail !== "" && password !== "" ){
      await signInWithPopup(firebaseAuth, googleProvider).then(userCred => {
        firebaseAuth.onAuthStateChanged((cred) => {
          if(cred){
            cred.getIdToken().then((token) => {
              vaidateUserJWTToken(token).then(data => {
                console.log(data);
              });
              navigate("/", {replace: true})
            });
          }
        })
      })
    }
    else{
      // error
    }

  }

  return <div className='w-screen h-screen relative overflow-hidden flex'>
    {/* background image */}
    <img src={LoginBg} alt="loginBg" className='w-full h-full object-cover top-0 left-0 absolute'/>
    {/* content box */}
    <div className='flex flex-col items-center bg-lightOverlay w-[80%] md:w-508 h-full z-10 backdrop-blur-md p-4 px-4 py-12 gap-5'>
        {/* top logo section */}
        <div className='flex items-center justify-start gap-4 w-full'>
            <img src={Logo} alt="" className='w-8' />
            <p className='text-headingColor font-semibold text-2xl'>City</p>
        </div>
        {/* welcome text */}
        <p className="text-3xl font-semibold text-headingColor">Welcome Back</p>
        <p className=' text-textColor -mt-6'>{isSignUp ? "Sign Up" : "Sign In"} with following</p>
        {/* input section */}
        <div className='w-full flex flex-col items-center justify-center gap-5 px-4 md:px-12 py-2'>
          <LoginInput placeholder={"Email Here"} icon={<FaEnvelope className='text-xl text-textColor'/>} inputState={userEmail} inputStateFunc={setUserEmail} type="email" isSignUp={isSignUp}/>

          <LoginInput placeholder={"Password Here"} icon={<FaLock className='text-xl text-textColor'/>} inputState={password} inputStateFunc={setPassword} type="password" isSignUp={isSignUp}/>
          
          {isSignUp && (
            <LoginInput placeholder={"Confirm Password Here"} icon={<FaEnvelope className='text-xl text-textColor'/>} inputState={confirmPassword} inputStateFunc={setConfirmPassswsord} type="password" isSignUp={isSignUp}/>
          )}

          {!isSignUp ? (<p>Don't have an account: {" "} <motion.button  className="text-red-600 hover:underline cursor-pointer bg-transparent "{...buttonClick} onClick={() => setIsSignUp(true)}>Create One</motion.button></p>) : (<p>Already have an account: {" "} <motion.button  className="text-red-600 underline cursor-pointer bg-transparent "{...buttonClick} onClick={() => setIsSignUp(false)}>SignIn here</motion.button></p>)}

          {/* button section */}
         {isSignUp ?  <motion.button {...fadeInOut} className='w-full px-4 py-1 rounded-3xl bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150'
         onClick={(signUpWithEmailPass)}
         >
            Sign Up
          </motion.button> :  <motion.button {...fadeInOut} className='w-full px-4 py-1 rounded-3xl bg-red-400 cursor-pointer text-white text-xl capitalize hover:bg-red-500 transition-all duration-150'
          onClick={(signInWithEmailPass)}>
            Sign In
          </motion.button>}

          <div className='flex items-center gap-16 justify-between'>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          <p className="text-white">or</p>
          <div className="w-24 h-[1px] rounded-md bg-white"></div>
          </div>


          <motion.div {...buttonClick} className='flex items-center justify-center px-20 py-1 bg-lightOverlay backdrop-blur-md cursor-pointer rounded-3xl gap-4'
          onClick={loginWithGoogle}>
            <FcGoogle className="text-3xl"/>
            <p className='capitalize text-base text-headingColor'>
            {isSignUp ? "sign up with google" : "sign in with google"}
            </p>

          </motion.div>
        </div>

    </div>


  </div>
}

export default Login 
