import { useRef, useState, useCallback } from 'react'
import Experience from './components/Experience/Experience'
import Overlay    from './components/UI/Overlay'

function App() {
  const progressRef   = useRef(0)
  const targetRef     = useRef(0)
  const scrollYRef    = useRef(0)
  const targetScrollY = useRef(0)
  const hideTimer     = useRef(null)

  const [hoveredProject, setHoveredProject] = useState(null)

  const handleProjectHover = useCallback((project) => {
    // Clear any pending hide — user moved to another cocktail or back
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setHoveredProject(project)
  }, [])

  const handleProjectUnhover = useCallback(() => {
    // Delay hiding — gives user 400ms to move mouse to the card
    hideTimer.current = setTimeout(() => {
      setHoveredProject(null)
    }, 600)
  }, [])

  const handleCardEnter = useCallback(() => {
    // Mouse entered the card — cancel the hide timer
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }, [])

  const handleCardLeave = useCallback(() => {
    // Mouse left the card — hide after short delay
    hideTimer.current = setTimeout(() => {
      setHoveredProject(null)
    }, 300)
  }, [])

  return (
    <>
      <Experience
        progressRef={progressRef}
        targetRef={targetRef}
        scrollYRef={scrollYRef}
        targetScrollY={targetScrollY}
        onProjectHover={handleProjectHover}
        onProjectUnhover={handleProjectUnhover}
      />
      <Overlay
        progressRef={progressRef}
        hoveredProject={hoveredProject}
        onCardEnter={handleCardEnter}
        onCardLeave={handleCardLeave}
        targetScrollY={targetScrollY}
        scrollYRef={scrollYRef}
      />
    </>
  )
}

export default App