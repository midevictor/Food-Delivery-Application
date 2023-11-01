import React from 'react'
import { Header } from '../components'
import { Dashboard } from '.'

const Main = () => {
  return <main className='w-screen min-h-screen flex items-center justify-center flex-col bg-primary'>
    <Header/>
    <Dashboard/>
  </main>
}

export default Main
