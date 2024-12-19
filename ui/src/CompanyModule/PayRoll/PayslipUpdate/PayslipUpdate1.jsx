import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../Context/AuthContext";
import LayOut from "../../../LayOut/LayOut";
import {
  companyViewByIdApi,
  EmployeeGetApiById,
  EmployeePayslipResponse,
  EmployeePayslipUpdate,
} from "../../../Utils/Axios";
import Loader from "../../../Utils/Loader";

const PayslipUpdate1 = () => {
return(
    <div></div>
  );
};

export default PayslipUpdate1;
