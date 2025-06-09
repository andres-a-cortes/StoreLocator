import React from 'react'
import styles from '@/styles/home.module.scss'
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

const Header = ({ text }) => {
    const router = useRouter()
    const path = usePathname()
    
    const handleLogout = () => {
        sessionStorage?.removeItem('token')
        sessionStorage?.removeItem('userid')
        router.reload()
    }

    return (
        <header className="d-flex align-items-center justify-content-between header border-bottom text-dark">
            <h4 className='m-0'>{text}</h4>
            {path?.includes('admin') ? <span onClick={handleLogout} className={styles.cursor}>Log Out</span> : ''}
        </header>
    )
}

export default Header