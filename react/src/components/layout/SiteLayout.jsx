import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function SiteLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-svh w-full flex-col bg-linear-to-r from-[#f1f3f4] to-[#e8ebed] font-[Inter,Arial,Helvetica,sans-serif] dark:from-[#1b1b1b] dark:to-[#140b1a]">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
