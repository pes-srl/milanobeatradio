'use client'

import { useEffect } from 'react'

const EYE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.8"/></svg>'
const EYE_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5c2 0 3.7.6 5.1 1.5M22 12s-3.6 6.5-10 6.5c-2 0-3.7-.6-5.1-1.5"/><path d="m3 3 18 18"/></svg>'

/**
 * Adds a reveal button to the password field on /admin/login — Payload 3.88 ships none.
 *
 * The button is built with DOM APIs rather than a React portal on purpose: the field
 * belongs to Payload's own tree, and reading it into state from an effect would break
 * the `react-hooks/set-state-in-effect` rule this project enforces.
 */
export function PasswordToggle() {
  useEffect(() => {
    const field = document.querySelector<HTMLElement>('.field-type.password')
    const input = field?.querySelector('input')
    if (!field || !input) return

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mbr-reveal'
    button.innerHTML = EYE

    const render = () => {
      const shown = input.type === 'text'
      button.innerHTML = shown ? EYE_OFF : EYE
      button.setAttribute('aria-label', shown ? 'Nascondi la password' : 'Mostra la password')
      button.setAttribute('aria-pressed', String(shown))
    }
    const toggle = () => {
      input.type = input.type === 'password' ? 'text' : 'password'
      render()
      input.focus()
    }

    render()
    button.addEventListener('click', toggle)
    field.appendChild(button)

    return () => {
      button.removeEventListener('click', toggle)
      button.remove()
      input.type = 'password'
    }
  }, [])

  return null
}
