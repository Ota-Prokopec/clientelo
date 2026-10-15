// Tests the Lead Form's validation rules: the email and the honeypot.
import { describe, expect, it } from 'vitest'
import { leadSchema } from '@/schemas/leadSchema.ts'

describe('leadSchema', () => {
  it('accepts an email typed with stray spaces, and trims them', () => {
    const parsedLead = leadSchema.safeParse({ email: '  jana.novakova@seznam.cz ', honeypot: '' })

    expect(parsedLead.data).toEqual({ email: 'jana.novakova@seznam.cz', honeypot: '' })
  })

  it.each(['', '   '])('asks for the email when the field is left empty (%j)', (email) => {
    const parsedLead = leadSchema.safeParse({ email, honeypot: '' })

    expect(parsedLead.error?.issues).toEqual([
      expect.objectContaining({ path: ['email'], message: 'Vyplňte prosím e-mail, na který vám tahák pošleme.' }),
    ])
  })

  it.each(['jana.novakova', 'jana@seznam', 'jana novakova@seznam.cz'])(
    'rejects %s, which is not an email, in Czech',
    (email) => {
      const parsedLead = leadSchema.safeParse({ email, honeypot: '' })

      expect(parsedLead.error?.issues).toEqual([
        expect.objectContaining({ path: ['email'], message: 'Tohle nevypadá jako e-mail. Zkontrolujte ho prosím.' }),
      ])
    },
  )

  // A bot that filled the honeypot gets no error to learn from: submitLead() drops its submit silently.
  it('accepts a filled honeypot', () => {
    const parsedLead = leadSchema.safeParse({ email: 'bot@example.com', honeypot: 'https://spam.example' })

    expect(parsedLead.success).toBe(true)
  })
})
