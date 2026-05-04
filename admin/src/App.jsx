import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Add from './pages/Inventory/Add'
import List from './pages/Inventory/List'
import Edit from './pages/Inventory/Edit'
import ManageCollections from './pages/ManageCollections'
import Subscribers from './pages/Subscribers'
import Orders from './pages/Orders'
import Promos from './pages/Promos'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='min-h-screen bg-[#f8f9fa]'>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {token === "" ? (
        <Routes>
          <Route path="/admin-secure-auth" element={<Login setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/admin-secure-auth" />} />
        </Routes>
      ) : (
        <div className='flex w-full'>
          <Sidebar setToken={setToken} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
          <div className='main-content'>
            <Navbar setToken={setToken} setShowSidebar={setShowSidebar} />
            <Routes>
              <Route path='/dashboard' element={<Dashboard token={token} />} />
              <Route path='/inventory' element={<List token={token} />} />
              <Route path='/inventory/add' element={<Add token={token} />} />
              <Route path='/inventory/edit/:id' element={<Edit token={token} />} />
               <Route path='/orders' element={<Orders token={token} />} />
               <Route path='/promos' element={<Promos token={token} />} />
               <Route path='/manage-collections' element={<ManageCollections token={token} />} />
              <Route path='/subscribers' element={<Subscribers token={token} />} />
              <Route path='/customers' element={<div className='text-3xl font-bold outfit p-10'>Customer Directory (Coming Soon)</div>} />
              <Route path='/analytics' element={<div className='text-3xl font-bold outfit p-10'>Detailed Analytics (Coming Soon)</div>} />
              <Route path='/settings' element={<div className='text-3xl font-bold outfit p-10'>System Settings (Coming Soon)</div>} />
              <Route path='*' element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
