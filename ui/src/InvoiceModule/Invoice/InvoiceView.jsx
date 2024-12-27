import React, { useState, useEffect } from 'react';
import { Eye, SendFill, XSquareFill } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Slide, toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchInvoices } from '../Redux/InvoiceSlice';
// import { InvoiceDeleteApiById } from '../Axios'; // API for deleting invoice
import LayOut from "../../LayOut/LayOut"; // Assuming LayOut is being reused for consistent styling

const InvoiceViews = () => {
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { invoices, loading, error } = useSelector(state => state.invoices); // Redux state for invoices
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch invoices when the component mounts
    // useEffect(() => {
    //     dispatch(fetchInvoices());
    // }, [dispatch]);

    // Filter invoices based on the search term
    // useEffect(() => {
    //     if (Array.isArray(invoices)) {
    //         const result = invoices.filter(invoice =>
    //             invoice.customerName?.toLowerCase().includes(search.toLowerCase())
    //         );
    //         setFilteredData(result);
    //     }
    // }, [invoices, search]);

    const handleUpdate = (invoiceId) => {
        navigate('/invoiceSlip', { state: { invoiceId } }); // Navigate to invoice slip page
    };

    const handleDelete = async (invoiceId) => {
        try {
            // await InvoiceDeleteApiById(invoiceId); // Delete invoice API call
            // dispatch(fetchInvoices()); // Refetch invoices from Redux
            toast.error('Invoice deleted successfully', { // Toast notification on successful delete
                position: 'top-right',
                transition: Slide,
                hideProgressBar: true,
                theme: 'colored',
                autoClose: 1000,
            });
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice', {
                position: 'top-right',
                transition: Slide,
                theme: 'colored',
            });
        }
    };

    const columns = [
        {
            name: 'S No',
            selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            width: '70px',
        },
        {
            name: 'Invoice Number',
            selector: row => row.invoiceId,
        },
        {
            name: 'Invoice Date',
            selector: row => row.invoiceDate,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
        },
        {
            name: 'Actions',
            maxWidth: '300px',
            cell: row => (
                <div>
                    <button
                        className="btn btn-sm mr-2"
                        style={{ backgroundColor: 'transparent' }}
                    >
                        <SendFill size={22} color="darkorange" />
                    </button>
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => handleUpdate(row.invoiceId)}
                    >
                        <Eye size={22} color="#2255A4" />
                    </button>
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => handleDelete(row.invoiceId)}
                    >
                        <XSquareFill size={22} color="#DA542E" />
                    </button>
                </div>
            ),
        },
    ];
    const getFilteredList = (searchTerm) => {
        setSearch(searchTerm);
    };

    return (
        <LayOut>
            <div className="container-fluid p-0">
                <div className="row d-flex align-items-center justify-content-between mt-1 mb-2">
                    <div className="col">
                        <h1 className="h3 mb-3"><strong>Invoices</strong></h1>
                    </div>
                    <div className="col-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                    <Link to={"/"}>Home</Link>
                                </li>
                                <li className="breadcrumb-item active">Invoices</li>
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
                                        <Link to={"/invoiceRegistartion"}>
                                            <button className="btn btn-primary">Create Invoice</button>
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

export default InvoiceViews;
