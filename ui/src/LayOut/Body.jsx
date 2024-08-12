import React from "react";
import LayOut from "./LayOut";
import { useAuth } from "../Context/AuthContext";
import { userRoles } from "../Utils/Auth";

const Body = () => {
  const {user}=useAuth();
  
  // Check if userRoles is defined and if 'ems_admin' role is included
  const isAdmin = user && user.userRole && user.userRole.includes("ems_admin");

  return (
    <LayOut>
  
      <div className="container-fluid p-0" style={{height:"100%"}} >
        <h1 className="h3 mb-3">
          <strong>Dashboard</strong>{" "}
        </h1>
       <div className="row h-100 w-90">
       {isAdmin ? (
        <iframe src="http://122.175.43.71:5601/s/ems/app/dashboards#/view/deba4a73-baa2-4c62-aa78-089197311bcb?_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A60000)%2Ctime%3A(from%3Anow-15m%2Cto%3Anow))&hide-filter-bar=true"
         height="100%" width="100%" 
        title="EMS Dashboard">
        </iframe>
        ) : (
          <div className="text-center">Loading Dashboards...</div>
        )}
      </div>
      </div>
    </LayOut>
  );
};
export default Body;