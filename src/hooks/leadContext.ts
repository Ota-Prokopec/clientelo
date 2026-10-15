// The Visitor as a Lead, or null while they are a Visitor, for the components deep in a Section that change once the
// Visitor is a Lead: an inline Lead Ask asks for nothing the Lead already has. The landing page provides it.
import { createContext, use } from 'react'
import type { Lead } from '@/types.ts'

export const LeadContext = createContext<Lead | null>(null)

/**
 * The Lead the landing page knows, or null for a Visitor.
 *
 * ```ts
 * useLead() // null before the Lead Form is submitted; { kind: 'new', email } after; { kind: 'returning' } on a reload
 * ```
 */
export const useLead = (): Lead | null => use(LeadContext)
