import React, { useState } from 'react'
import styles from '@/styles/home.module.scss'
import { useRouter } from 'next/router';
import { login } from '@/functions/globalFunctions';

function Login() {
    const router = useRouter()

    const [data, setData] = useState({})
    const [error, setError] = useState(false)

    const handleChange = (event) => {
        let value = event.target.value
        let name = event.target.name
        setData({ ...data, [name]: value })
    }

    const handleSignin = async (event) => {
        event.preventDefault();
        setError(false)
        let response = await login(data)
        if(response?.error == 'Invalid credentials' || !response) {
            setError(true)
        } else {
            sessionStorage.setItem('token', response.token)
            sessionStorage.setItem('userid', response.userid)
            router.reload()
        }
    }

    return (
        <div className={styles.login}>
            <div className='w-25 border p-5'>
                <h3>Welcome! Please Signin</h3>
                <form onSubmit={handleSignin}>
                    <div className='mb-2'>
                        <label>User Name</label>
                        <input className='form-control' required type={'text'} name="username" onChange={handleChange} placeholder='johndoe' />
                    </div>
                    <div className='mb-2'>
                        <label>Password</label>
                        <input className='form-control' required type={'password'} name="password" onChange={handleChange} placeholder='......' />
                    </div>
                    <div>
                        <button className='btn btn-primary w-100' type={'submit'}>SIGN IN</button>
                        {error && <p className='text-center text-danger mt-2'>Invalid Credentials</p>}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login