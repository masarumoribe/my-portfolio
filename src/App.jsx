import { useRef } from 'react'
import Experience from './components/Experience/Experience'
import Overlay from './components/UI/Overlay'

function App() {
  // progressRef lives here so both Experience and Overlay can access it
  const progressRef = useRef(0)
  const targetRef = useRef(0)
  const scrollYRef = useRef(0)
  const targetScrollY = useRef(0)
  
  return (
    <>
    <Experience 
      progressRef={progressRef} 
      targetRef={targetRef} 
      scrollYRef={scrollYRef}
      targetScrollY={targetScrollY}
    />
    <Overlay progressRef={progressRef} />
    </>
  )
}

export default App