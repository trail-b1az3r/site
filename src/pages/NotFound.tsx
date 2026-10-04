import { Link } from 'react-router-dom'
import { Page, Seo } from '../components/ui'
export default function NotFound() {
  return (<Page title="Page not found" lead="That address doesn't exist on this site."><Seo title="Page not found" desc="This page does not exist." /><p><Link className="btn" to="/">Go to the home page</Link></p></Page>)
}
