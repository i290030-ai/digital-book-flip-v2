import { Analytics } from '@vercel/analytics/react'
import FlipBook from './components/FlipBook.jsx'
import chapters from './data/chapters.json'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#e8e0d4', padding: '20px' }}>
      <FlipBook chapters={chapters} />
      <Analytics />
    </div>
  )
}
