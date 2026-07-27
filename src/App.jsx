import { useRef, useState, useCallback, useEffect } from 'react'
import Experience from './components/Experience/Experience'
import Overlay    from './components/UI/Overlay'

function App() {
  const progressRef   = useRef(0)
  const targetRef     = useRef(0)
  const scrollYRef    = useRef(0)
  const targetScrollY = useRef(0)
  const lastHoverTime = useRef(0)
  const hideTimer     = useRef(null)

  const [hoveredProject, setHoveredProject] = useState(null)

const handleProjectHover = useCallback((project) => {
  if (hideTimer.current) clearTimeout(hideTimer.current)
  
  if (hoveredProject?.label === project.label) {
    setHoveredProject(null)
    return
  }
  
  lastHoverTime.current = Date.now()  // record when card appeared
  setHoveredProject(project)
}, [hoveredProject])

useEffect(() => {
  const handleTouchStart = (e) => {
    // Ignore touches within 500ms of card appearing
    if (Date.now() - lastHoverTime.current < 500) return
    
    const card = document.getElementById('project-hover-card')
    if (card && !card.contains(e.target) && hoveredProject) {
      setTimeout(() => setHoveredProject(null), 50)
    }
  }

  window.addEventListener('touchstart', handleTouchStart)
  return () => window.removeEventListener('touchstart', handleTouchStart)
}, [hoveredProject])

  const handleProjectUnhover = useCallback(() => {
    const isMobile = window.innerWidth < 768
    // Delay hiding — gives user 400ms to move mouse to the card
    hideTimer.current = setTimeout(() => {
      setHoveredProject(null)
    }, isMobile ? 3000 : 600)
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