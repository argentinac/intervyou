import { useState, useCallback, useEffect } from 'react'

const TRUNCATE_LEN = 280

function truncateAnnotated(text, maxLen) {
  let plain = ''
  let result = ''
  let i = 0
  while (i < text.length && plain.length < maxLen) {
    if (text.slice(i, i + 2) === '[[') {
      const end = text.indexOf(']]', i + 2)
      if (end === -1) { result += text.slice(i); break }
      const inner = text.slice(i + 2, end)
      const remaining = maxLen - plain.length
      if (inner.length <= remaining) {
        result += '[[' + inner + ']]'
        plain += inner
        i = end + 2
      } else {
        result += '[[' + inner.slice(0, remaining) + ']]'
        plain += inner.slice(0, remaining)
        break
      }
    } else {
      result += text[i]
      plain += text[i]
      i++
    }
  }
  return plain.length < text.replace(/\[\[(.+?)\]\]/gs, '$1').length ? result + '…' : result
}

function AnnotatedText({ text }) {
  const parts = text.split(/\[\[(.+?)\]\]/gs)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} style={{ background: '#FEE2E2', color: '#991B1B', borderRadius: 3, padding: '0 2px' }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function Toast({ visible, message }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      opacity: visible ? 1 : 0, transition: 'opacity 0.2s ease, transform 0.2s ease',
      background: '#111827', color: '#fff', borderRadius: 8, padding: '10px 20px',
      fontSize: 13, fontWeight: 500, zIndex: 9999, pointerEvents: 'none',
      whiteSpace: 'nowrap',
    }}>
      {message}
    </div>
  )
}

function FullAnswerDrawer({ items, openIndex, activeTab, onClose, onTabChange }) {
  const item = items[openIndex]
  const total = items.length

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!item) return null

  const text = activeTab === 'user' ? item.userAnswer : item.suggestedAnswer

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          zIndex: 1000, animation: 'fadeIn 0.15s ease',
        }}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: '#fff', zIndex: 1001,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        animation: 'slideInRight 0.2s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>Respuesta completa</h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6B7280', lineHeight: 1 }}
              aria-label="Cerrar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 4 }}>
            Pregunta {openIndex + 1} de {total}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{item.question}</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 24px' }}>
          {[
            { key: 'user', label: 'Tu respuesta' },
            { key: 'suggested', label: 'Versión mejorada' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0', marginRight: 24,
                fontSize: 14, fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? '#111827' : '#9CA3AF',
                borderBottom: activeTab === tab.key ? '2px solid #7C3AED' : '2px solid transparent',
                transition: 'color 0.15s, border-color 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {activeTab === 'user' ? <AnnotatedText text={text} /> : text}
          </p>
        </div>

        {/* Footer */}
        <DrawerCopyButton text={text} />
      </div>
    </>
  )
}

function DrawerCopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const cleanText = text.replace(/\[\[(.+?)\]\]/gs, '$1')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cleanText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }, [text])

  return (
    <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end' }}>
      <button
        onClick={handleCopy}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
          background: copied ? '#F0FDF4' : '#fff',
          color: copied ? '#15803D' : '#374151',
          border: `1px solid ${copied ? '#86EFAC' : '#E5E7EB'}`,
          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
        }}
      >
        <CopyIcon />
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

function QARow({ item, index, total, onOpenDrawer }) {
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = useCallback((msg) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }, [])

  const copyText = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast('¡Copiado!')
    } catch {
      // ignore
    }
  }, [showToast])

  const userPlain = item.userAnswer.replace(/\[\[(.+?)\]\]/gs, '$1')
  const userTruncated = userPlain.length > TRUNCATE_LEN
  const suggestedTruncated = item.suggestedAnswer.length > TRUNCATE_LEN

  return (
    <>
      <Toast visible={toastVisible} message={toastMsg} />
      {/* Mobile: card layout */}
      <div style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
        padding: 20, marginBottom: index < total - 1 ? 12 : 0,
      }}>
        {/* Question header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <span style={{
            flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
            background: '#7C3AED', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
          }}>
            {index + 1}
          </span>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.5 }}>
            {item.question}
          </p>
        </div>

        {/* Two columns on desktop, stacked on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {/* Tu respuesta */}
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 14 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tu respuesta
            </p>
            <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              <AnnotatedText text={userTruncated ? truncateAnnotated(item.userAnswer, TRUNCATE_LEN) : item.userAnswer} />
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {userTruncated && (
                <button
                  onClick={() => onOpenDrawer(index, 'user')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: 12, color: '#7C3AED', fontWeight: 500, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  Ver respuesta completa →
                </button>
              )}
              <button
                onClick={() => copyText(item.userAnswer.replace(/\[\[(.+?)\]\]/gs, '$1'))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <CopyIcon /> Copiar
              </button>
            </div>
          </div>

          {/* Respuesta sugerida */}
          <div style={{ background: '#F5F3FF', borderRadius: 8, padding: 14 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Respuesta sugerida
            </p>
            <p style={{ margin: 0, fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
              {suggestedTruncated ? item.suggestedAnswer.slice(0, TRUNCATE_LEN) + '…' : item.suggestedAnswer}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {suggestedTruncated && (
                <button
                  onClick={() => onOpenDrawer(index, 'suggested')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: 12, color: '#7C3AED', fontWeight: 500, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  Ver respuesta completa →
                </button>
              )}
              <button
                onClick={() => copyText(item.suggestedAnswer)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  background: '#fff', color: '#6B7280', border: '1px solid #DDD6FE',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <CopyIcon /> Copiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function QAReviewTable({ qaReview }) {
  const [drawerIndex, setDrawerIndex] = useState(null)
  const [activeTab, setActiveTab] = useState('user')

  const items = Array.isArray(qaReview) ? qaReview.filter(Boolean) : []
  if (items.length === 0) return null

  const handleOpenDrawer = useCallback((index, tab) => {
    setDrawerIndex(index)
    setActiveTab(tab)
  }, [])

  const handleClose = useCallback(() => setDrawerIndex(null), [])

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
      <div>
        {items.map((item, i) => (
          <QARow
            key={i}
            item={item}
            index={i}
            total={items.length}
            onOpenDrawer={handleOpenDrawer}
          />
        ))}
      </div>
      {drawerIndex !== null && (
        <FullAnswerDrawer
          items={items}
          openIndex={drawerIndex}
          activeTab={activeTab}
          onClose={handleClose}
          onTabChange={setActiveTab}
        />
      )}
    </>
  )
}
