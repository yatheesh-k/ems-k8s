import React from "react";
import LayOut from "./LayOut";
import { userRoles } from "../Utils/Auth";

const Body = () => {
  // Check if userRoles is defined and if 'ems_admin' role is included
  const isAdmin = userRoles && userRoles.includes('ems_admin');

  return (
    <LayOut>
  
      <div className="container-fluid p-0" style={{height:"100%"}} >
        <h1 className="h3 mb-3">
          <strong>Dashboard</strong>{" "}
        </h1>
       <div className="row h-100 w-90">
       {isAdmin ? (
          <iframe
            src="http://122.175.43.71:5601/s/ems/app/dashboards#/view/a937e737-55c7-4fe4-b81a-3d40a5d2f7bd?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))&_a=()"
            height="100%" width="100%" 
            title="EMS Dashboard"
          ></iframe>
        ) : (
          <div className="text-center">Loading Dashboards...</div>
        )}
      </div>
      </div>
    </LayOut>
  );
};
export default Body;