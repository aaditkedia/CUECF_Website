import { useEffect, useRef, useCallback } from 'react'

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const { threshold = 0.1, rootMargin = '50px' } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Small delay to let layout settle
    const timer = setTimeout(() => {
      // Find all .reveal, .reveal-left, .reveal-right, .reveal-scale children + self
      const targets = [el]
      el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(child => {
        targets.push(child)
      })

      targets.forEach(target => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              target.classList.add('revealed')
              observer.unobserve(target)
            }
          },
          { threshold, rootMargin }
        )
        observer.observe(target)
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [threshold, rootMargin])

  return ref
}

export function useMultiReveal(count, options = {}) {
  const refs = useRef([])
  const { threshold = 0.1, staggerDelay = 100 } = options

  useEffect(() => {
    const observers = []
    const timer = setTimeout(() => {
      refs.current.forEach((el, index) => {
        if (!el) return

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                el.classList.add('revealed')
              }, index * staggerDelay)
              observer.unobserve(el)
            }
          },
          { threshold, rootMargin: '50px' }
        )

        observer.observe(el)
        observers.push(observer)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observers.forEach(o => o.disconnect())
    }
  }, [count, threshold, staggerDelay])

  return useCallback((index) => (el) => {
    refs.current[index] = el
  }, [])
}
