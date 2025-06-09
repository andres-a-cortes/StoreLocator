import React from 'react'
import Header from './header'
import Sidebar from './sidebar'

const Layout = ({ children, page }) => {
    return (
        <div className='d-flex'>
            <Sidebar />
            <div className='content'>
                <Header text={page} />
                <main className="main-content p-3">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout