import Login from '@/components/login'
import { globalConfig } from '@/globalConfig'
import '@/styles/globals.scss'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [login, setLogin] = useState(false)
  useEffect(() => {
    const checkLogin = sessionStorage?.getItem('token')
    if (router?.pathname?.includes('admin') && checkLogin) {
      setLogin(true)
    }
  }, [])

  return (
    <>
      {!router?.pathname?.includes('admin') ? <Component {...pageProps} /> : !login ? <Login /> : <Component {...pageProps} />}
    </>
  )
}
