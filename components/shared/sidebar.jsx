import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'

const Sidebar = () => {

    const router = useRouter();

    let nav = [
        {
            text: 'Dashboard',
            link: '/admin'
        },
        {
            text: 'Manage Stores',
            link: '/admin/stores'
        },
        {
            text: 'Manage CSV',
            link: '/admin/csv'
        },
        {
            text: 'Manage Levels',
            link: '/admin/levels'
        },
        {
            text: 'Manage Brands',
            link: '/admin/brands'
        },
        {
            text: 'Manage Categories',
            link: '/admin/categories'
        }
    ]

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-dark bg-light" style={{ width: '280px', borderRight: '1px solid' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-decoration-none">
                <h4 className="px-3 mb-0">Admin Panel</h4>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto text-dark">
                {nav.map((data, i) => {
                    return (
                        <li key={'link_' + i}>
                            <Link href={data.link} className={`${(data.link == router.pathname) ? 'active' : 'text-dark'} nav-link`}>
                                {data.text}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Sidebar