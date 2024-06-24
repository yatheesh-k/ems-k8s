import React from 'react'
import SideNav from './SideNav'
import Header from './Header'
import { Link } from 'react-router-dom'

const LayOut = ({children}) => {
    const name=sessionStorage.getItem("name");
  return (
    <div className='wrapper'>
        <div className='fixed-sideNav'>
          <SideNav/>
        </div>
       <div className='main'>
        <Header/>
        <main className='content'>
          {children}
        </main>
        <footer>
        <footer className="footer"> 
                <div className="container-fluid">
                    <div className="row text-muted">
                        <div className="col-6 text-start">
                            <p className="mb-0">
                                <Link className="text-muted"  target="_blank"><strong>{name} </strong></Link>
                            </p>
                        </div>
                        <div className="col-6 text-end">
                            <p>
                            Powered By  <Link className='text-muted' >PathBreaker Technologies Pvt.Ltd</Link>
                            </p>
                           
                        </div>
                    </div>
                </div>
            </footer>
        </footer>
       </div>

    </div>
  )
}

export default LayOut