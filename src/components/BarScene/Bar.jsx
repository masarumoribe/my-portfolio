import { RigidBody } from '@react-three/rapier'
import { COLORS, SCENE, SKILLS, PROJECTS } from '../config'
import CounterModel from './models/CounterModel'
import WallModel from './models/WallModel'
import PythonBottle from './models/PythonBottle'
import JSBottle from './models/JSBottle'
import ReactBottle from './models/ReactBottle'
import CSSBottle from './models/CSSBottle'
import HTMLBottle from './models/HTMLBottle'
import NodeBottle from './models/NodeBottle'
import Bottle from './Bottle'
import Coaster from './Coaster'

function Bar() {
  const { counterY, counterH, shelf1Y, shelf2Y, shelfW, shelfH, roomWidth } = SCENE

  const CUSTOM_BOTTLES = {
    'Python': PythonBottle,
    'React':  ReactBottle,
    'Node':   NodeBottle,
    'JS':     JSBottle,
    'HTML':    HTMLBottle,
    'CSS':    CSSBottle,
  }

  return (
    <group>

      {/* ── Counter physics collider (invisible) ──────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.8} restitution={0.2}>
        <mesh
          position={[0, counterY - counterH / 1 + 1, 1.5]}
          receiveShadow
        >
          <boxGeometry args={[roomWidth, counterH, 2]} />
          <meshStandardMaterial colorWrite={false}/>
        </mesh>
      </RigidBody>

      {/* ── Counter visual model ──────────────────────────────── */}
      <CounterModel
        position={[0, counterY - counterH / 2 + 0.23, 0]}
        scale={5.6}
      />

      {/* ── Shelf 1 (top) ────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.7} restitution={0.3}>
        <mesh
          position={[0, shelf1Y + 0.1, -2]}
          receiveShadow
        >
          <boxGeometry args={[shelfW, shelfH, 1]} />
          <meshStandardMaterial colorWrite={false}/>
        </mesh>
      </RigidBody>

      {/* ── Floor ────────────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.9} restitution={0.1}>
        <mesh position={[0, -4, 0]} receiveShadow>
          <boxGeometry args={[roomWidth, 0.2, 8]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </RigidBody>

      {/* ── Back wall ────────────────────────────────────────── */}
      {/* Purely visual — position it behind the counter and shelves.
          Start with scale 1 and adjust until it fills the background. */}
      <WallModel
        position={[0, 1.4, -2.8]}
        scale={8}
      />

      {/* ── Left wall ────────────────────────────────────────── */}
      {/* <RigidBody type="fixed">
        <mesh position={[-roomWidth / 2, 0, 0]}>
          <boxGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </RigidBody> */}

      {/* ── Right wall ───────────────────────────────────────── */}
      {/* <RigidBody type="fixed">
        <mesh position={[roomWidth / 2, 0, 0]}>
          <boxGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={COLORS.wall} />
        </mesh>
      </RigidBody> */}

      {/* ── Skill bottles ────────────────────────────────────── */}
        {/* Spread across the top shelf. We calculate the X position
            of each bottle so they're evenly spaced and centered.
            bottleGap is the space between each bottle center. */}
        {SKILLS.map((skill, i) => {
        const bottleGap = 1.1
        const totalWidth = (SKILLS.length - 1) * bottleGap
        const x = -totalWidth / 2 + i * bottleGap
        const pos = [x, SCENE.shelf1Y + 0.6, -2.1]

        const CustomModel = CUSTOM_BOTTLES[skill.label]
        if (CustomModel) {
          return (
            <CustomModel
              key={skill.label}
              position={pos}
              scale={skill.scale}
              yOffset={skill.yOffset}
            />
          )
        }
        

        return (
            <Bottle
            key={skill.label}
            position={pos}
            color={skill.color}
            label={skill.label}
            />
        )
        })}

    {/* ── Project coasters ─────────────────────────────────── */}
      {/* Spread across the counter surface, centered.
          coasterGap is the space between each coaster center. */}
      {PROJECTS.map((project, i) => {
        const coasterGap = 1.6
        const totalWidth = (PROJECTS.length - 1) * coasterGap
        const x = -totalWidth / 2 + i * coasterGap

        return (
          <Coaster
            key={project.label}
            position={[x, SCENE.counterY + 1.3, 1]}
            project={project}
            onSelect={(p) => console.log('selected:', p.label)}
          />
        )
      })}

    </group>
  )
}

export default Bar