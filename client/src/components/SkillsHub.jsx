import { useState, useEffect } from 'react'
import { SKILLS_CATALOG } from '../lib/skills/catalog'
import { supabase } from '../lib/supabase'
import { unlockAudio } from '../audioContext'

export default function SkillsHub({ user, onStartSkill }) {
  const [skillProgress, setSkillProgress] = useState({})

  useEffect(() => {
    if (!user || user.is_anonymous) return
    supabase
      .from('skill_progress')
      .select('skill_id, technique_idx')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return
        const map = {}
        data.forEach(({ skill_id, technique_idx }) => {
          if (!map[skill_id]) map[skill_id] = new Set()
          map[skill_id].add(technique_idx)
        })
        const counts = {}
        Object.entries(map).forEach(([id, set]) => { counts[id] = set.size })
        setSkillProgress(counts)
      })
  }, [user])

  return (
    <div className="skills-hub-wrap">
      <div className="skills-hub-header">
        <h1 className="skills-hub-title">Habilidades</h1>
        <p className="skills-hub-subtitle">Practicá técnicas específicas para destacar en tu próxima entrevista.</p>
      </div>
      <div className="skills-hub-grid">
        {SKILLS_CATALOG.map((skill) => {
          const done = skillProgress[skill.id] || 0
          const pct = Math.round((done / skill.techniques.length) * 100)
          const barColor = pct === 100 ? '#22c55e' : skill.nivelColor
          const nivelLabel = pct === 100 ? '✓ Completado' : skill.nivel

          return (
            <div
              key={skill.id}
              className="skills-hub-card"
              onClick={() => { unlockAudio(); onStartSkill?.(skill.id) }}
            >
              <div className="skills-hub-img-wrap">
                <img src={skill.img3d} alt={skill.shortTitle} className="skills-hub-img" />
              </div>
              <div className="skills-hub-info">
                <div className="skills-hub-name">{skill.name}</div>
                <div className="skills-hub-nivel">{nivelLabel}</div>
                <div className="skills-hub-bar-wrap">
                  <div className="skills-hub-bar-track">
                    <div className="skills-hub-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                  <span className="skills-hub-pct">{pct}%</span>
                </div>
                <div className="skills-hub-techniques">
                  {skill.techniques.length} técnicas · {done} completadas
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
