import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PeopleFill,
  PersonFillDown,
  PersonFillLock,
} from "react-bootstrap-icons";
import LayOut from "./LayOut";

const Body = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.1.163:8092/dashboard/all")
      .then((response) => {
        console.log(response.data);
        const formattedData = response.data.map((item) => ({
          ...item,
          employeesUpdatedDate: formatDate(item.employeesUpdatedDate),
          updatedDate: formatDate(item.updatedDate),
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const formatDate = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleDateString(); // Adjust format as needed
  };
  return (
    <LayOut>
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">
          <strong>Dashboard</strong>{" "}
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="row">
            <div className="col-xl-12 col-5">
              <div className="w-100">
                {data.map((item) => (
                  <div
                    className="row"
                    key={item.id}
                    style={{ justifyContent: "space-evenly" }}
                  >
                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="row mt-2">
                            <div className="col mt-0">
                              <h5 className="card-title">Total Employees</h5>
                            </div>
                            <div className="col-auto">
                              <div style={{ marginRight: "10px" }}>
                                <PeopleFill color="blue" size={30} />
                              </div>
                            </div>
                          </div>
                          <h1 className="mt-1 mb-3">{item.employeesCount}</h1>
                          <div className="mb-0">
                            <span className="text-muted">
                              Last Updated {item.employeesDaysAgo}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="row mt-2">
                            <div className="col mt-0">
                              <h5 className="card-title">Current Employees</h5>
                            </div>
                            <div className="col-auto">
                              <div style={{ marginRight: "10px" }}>
                                <PersonFillLock color="green" size={30} />
                              </div>
                            </div>
                          </div>
                          <h1 className="mt-1 mb-3">{item.currentCount}</h1>
                          <div className="mb-0">
                            <span className="text-muted">
                              Last Updated {item.employeesDaysAgo}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="card">
                        <div className="card-body">
                          <div className="row mt-2">
                            <div className="col mt-0">
                              <h5 className="card-title">Relieved Employees</h5>
                            </div>
                            <div className="col-auto">
                              <div style={{ marginRight: "10px" }}>
                                <PersonFillDown color="orange" size={30} />
                              </div>
                            </div>
                          </div>
                          <h1 className="mt-1 mb-3">{item.relievingCount}</h1>
                          <div className="mb-0">
                            <span className="text-muted">
                              Last Updated {item.daysAgo}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default Body;
