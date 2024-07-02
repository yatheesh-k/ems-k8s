import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModalTitle } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function Message() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            companyName: '',
        },
    });
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [companyName, setCompanyName] = useState('');

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleCompanyNameChange = (event) => {
        setCompanyName(event.target.value);
    };

    const onSubmit = (data) => {
        closeModal()
        const { companyName } = data;
        navigate(`/${companyName}/login`);
    };
    
    return (
        <main className="d-flex w-100" style={{ background: '#fff' }}>
            <div className="container d-flex flex-column" style={{ background: '#fff' }}>
                <div className="row vh-100">
                    <div className="col-sm-10 col-md-7 col-lg-6 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">
                            <div className="text-center mt-2">
                                <img src="assets/img/person-1.svg" alt="person" style={{ width: '800px', height: '300px', marginBottom: "40px" }} />
                                <h1 className="lead" style={{ fontSize: "3rem", fontFamily: "Arial, sans-serif", fontWeight: 'bold', color: '#333', display: 'inline-block', whiteSpace: 'nowrap' }}>Welcome to Employee Management System </h1>
                                <h3 style={{ fontFamily: "sans-serif", color: '#555' }}>Enter the path according to your company</h3>
                            </div>
                            <div className='row' style={{ marginTop: "20px" }}>
                                <div className='col-12 col-md-6 col-lg-5 mb-3' style={{ paddingLeft: "200px" }}>
                                    <Link to={'/emsAdmin/login'}>
                                        <button className="btn btn-primary btn-lg" >EMS Login</button>
                                    </Link>
                                </div>
                                <div className='col-lg-1'></div>
                                <div className='col-12 col-md-6 col-lg-5 mb-3' style={{ paddingLeft: "190px" }} >
                                    <button className="btn btn-primary btn-lg" onClick={openModal}>Company Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <ModalTitle className="modal-title">Company Short Name</ModalTitle>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <input
                                        type="text"
                                        name='companyName'
                                        className="form-control"
                                        onChange={handleCompanyNameChange}
                                        placeholder="Enter company Short name"
                                        {...register("companyName", {
                                            required: "Company Short Name is Required",
                                            pattern: {
                                                value: /^[A-Za-z ]+$/,
                                                message: "This Field accepts only Alphabetic Characters",
                                            }
                                        })}
                                    />
                                    {errors.companyName && (<p className='errorMsg'>{errors.companyName.message}</p>)}
                                    < div className="modal-footer" >
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </main >
    );
}

export default Message;


