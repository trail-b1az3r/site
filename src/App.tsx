import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './layouts/Layout'
const P = (f: () => Promise<{ default: React.ComponentType }>) => lazy(f)
const Home = P(() => import('./pages/Home')), Projects = P(() => import('./pages/Projects')), Detail = P(() => import('./pages/ProjectDetail'))
const Models = P(() => import('./pages/Models')), GitHub = P(() => import('./pages/GitHubPage')), YouTube = P(() => import('./pages/YouTubePage'))
const About = P(() => import('./pages/About')), Knowledge = P(() => import('./pages/Knowledge')), Links = P(() => import('./pages/Links')), Timeline = P(() => import('./pages/TimelinePage')), Steam = P(() => import('./pages/Steam')), NotFound = P(() => import('./pages/NotFound'))
export default function App() {
  return (
    <Routes><Route element={<Layout />}>
      <Route index element={<Home />} /><Route path="about" element={<About />} /><Route path="projects" element={<Projects />} />
      <Route path="projects/:slug" element={<Detail />} /><Route path="ai" element={<Models />} /><Route path="github" element={<GitHub />} />
      <Route path="youtube" element={<YouTube />} /><Route path="knowledge" element={<Knowledge />} /><Route path="timeline" element={<Timeline />} /><Route path="steam" element={<Steam />} /><Route path="links" element={<Links />} />
      <Route path="*" element={<NotFound />} />
    </Route></Routes>
  )
}
