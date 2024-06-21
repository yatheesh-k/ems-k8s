import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'


const Protected = () => {
  const token=sessionStorage.getItem('userId');
let auth={token}
return auth.token?<Outlet/>:<Navigate to={'/'}/>
}
export default Protected;