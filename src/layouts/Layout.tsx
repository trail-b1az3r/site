import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Skeleton } from '../components/ui'
import { ScrollProgress } from '../components/scroll'
export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return (<><ScrollProgress /><a className="skip" href="#main">Skip to content</a><Navbar />
    <main id="main"><Suspense fallback={<div className="wrap"><Skeleton n={3} /></div>}><Outlet /></Suspense></main><Footer /></>)
}
