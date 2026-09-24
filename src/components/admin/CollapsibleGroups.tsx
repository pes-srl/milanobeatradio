'use client'

import { useEffect } from 'react'

export function CollapsibleGroups() {
  useEffect(() => {
    // Function to initialize accordions on collection groups
    const setupAccordions = () => {
      const groups = document.querySelectorAll<HTMLElement>('.collections__group')
      
      groups.forEach((group, index) => {
        const label = group.querySelector<HTMLElement>('.collections__label')
        const cardList = group.querySelector<HTMLElement>('.collections__card-list')
        
        if (!label || !cardList) return

        // Prevent attaching multiple listeners
        if (label.getAttribute('data-accordion-init') === 'true') return
        label.setAttribute('data-accordion-init', 'true')
        label.style.cursor = 'pointer'

        // Add a toggle arrow indicator if not present
        if (!label.querySelector('.mbr-collapse-arrow')) {
          const arrow = document.createElement('span')
          arrow.className = 'mbr-collapse-arrow'
          arrow.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`
          label.appendChild(arrow)
        }

        // Always default to collapsed on load
        group.classList.add('mbr-group--collapsed')

        // Toggle click handler
        label.addEventListener('click', (e) => {
          // Avoid triggering when clicking links or buttons inside label if any
          if ((e.target as HTMLElement).tagName === 'A' || (e.target as HTMLElement).tagName === 'BUTTON') return

          group.classList.toggle('mbr-group--collapsed')
        })
      })
    }

    // Run setup immediately and on DOM changes (in case Payload renders asynchronously)
    setupAccordions()
    
    // Polling / MutationObserver for dynamic Payload renders
    const observer = new MutationObserver(() => {
      setupAccordions()
    })

    const targetNode = document.querySelector('.collections') || document.body
    observer.observe(targetNode, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
