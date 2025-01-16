import React, { useState, useEffect } from 'react';
import { PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { useNavigate, Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Slide, toast } from 'react-toastify';
import LayOut from "../../LayOut/LayOut"; // Assuming LayOut is being reused for consistent styling
import { fetchBanks, removeBankFromState } from '../../Redux/BankSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BankDeleteApiById } from '../../Utils/Axios';
import { useAuth } from '../../Context/AuthContext';


const AccountsView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { banks , loading, error } = useSelector(state => state.banks);
    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { user } = useAuth();
    const companyId = user.companyId;

    useEffect(() => {
        if (companyId) {
            console.log("fetchBanks",fetchBanks);
            dispatch(fetchBanks(companyId));
        }
    }, [dispatch, companyId]);

    useEffect(() => {
        console.log('Banks from Redux store:', banks);
    }, [banks]);

    // Filter banks based on search term
    useEffect(() => {
        if (banks && Array.isArray(banks)) {
            const result = banks.filter((bank) =>
                bank.bankName.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredData(result);
        } else {
            setFilteredData([]);
        }
    }, [search, banks]);

    const handleEdit = (bankId) => {
        navigate(`/accountRegistration`, { state: { bankId } });
        console.log("bankId from bankView", bankId);
    };

    const handleDelete = async (bankId) => {
        try {
            console.log('Deleting customer with companyId:', companyId, 'and bankId:', bankId);
            // Make a DELETE request to the API with the given ID
            const response = await BankDeleteApiById(companyId, bankId);
            console.log('Delete response:', response);
            dispatch(removeBankFromState(bankId)) // Refetch customers from the Redux store
            toast.error('Bank deleted successfully', {
                position: 'top-right',
                transition: Slide,
                hideProgressBar: true,
                theme: "colored",
                autoClose: 1000, // Close the toast after 1 second
            });
            // console.log(response);
            // console.log(response.data.data);
        } catch (error) {
            console.error('Error in handleDelete:', error.response || error);
            if (error.response && error.response.data) {
                console.error('Server Error Message:', error.response.data);
            }
        }
    };


    const columns = [
        {
            name: "Account Number",
            selector: (row) => row.accountNumber,
            width: "230px"
        },
        {
            name: "Bank Name",
            selector: (row) => row.bankName,
            width: "230px"
        },
        {
            name: "Branch Name",
            selector: (row) => row.branch,
            width: "230px"
        },
        {
            name: "IFSC Code",
            selector: (row) => row.ifscCode,
            width: "230px"
        },
        {
            name: "Account Type",
            selector: (row) => row.accountType,
            width: "190px"
        },
        {
            name: "Actions",
            cell: (row) => (
                <div>
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "transparent" }}
                        onClick={() => handleEdit(row.bankId)}
                        title="Edit"
                    >
                        <PencilSquare size={22} color='#2255a4' />
                    </button>
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "transparent" }}
                        onClick={() => handleDelete(row.bankId)}
                        title="Delete"
                    >
                        <XSquareFill size={22} color='#da542e' />
                    </button>
                </div>
            ),
            width: "150px"
        }
    ];

    const getFilteredList = (searchTerm) => {
        setSearch(searchTerm);
    };

    return (
        <LayOut>
            <div className="container-fluid p-0">
                <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
                    <div className="col">
                        <h1 className="h3 mb-3"><strong>AccountDetails</strong></h1>
                    </div>
                    <div className="col-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Home</Link>
                                </li>
                                <li className="breadcrumb-item active">AccountDetails</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Search and Filter Form */}
                <div className="row">
                    <div className="col-12 col-lg-12 col-xxl-12 d-flex">
                        <div className="card flex-fill">
                            <div className="card-header">
                                <div className="row">
                                    <div className="col-md-4">
                                        <Link to={"/accountRegistration"}>
                                            <button className="btn btn-primary">Add Account</button>
                                        </Link>
                                    </div>
                                    <div className="col-md-4 offset-md-4 d-flex justify-content-end">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search..."
                                            value={search}
                                            onChange={(e) => getFilteredList(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                pagination
                                paginationPerPage={rowsPerPage}
                                onChangePage={page => setCurrentPage(page)}
                                onChangeRowsPerPage={perPage => setRowsPerPage(perPage)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LayOut>
    );
};

export default AccountsView;
