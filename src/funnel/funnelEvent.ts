// The Funnel Events (#49), each with its own properties, as one union: a misspelt event or a missing property fails
// `pnpm check-types` wherever trackFunnelEvent() is called. The properties every event carries are in visitProperties.ts.
import type { InteractiveTool, SectionId, Segment } from '@/types.ts'

/** Where a tap opened the Lead Form from: an inline Lead Ask's link after an Interactive Tool, or the Sticky CTA. */
export type LeadAskClickPlacement = InteractiveTool | 'sticky-cta'

/** Why a Lead Form submit failed: leadSchema rejected the email, or submitLead() rejected. */
export type LeadFormErrorReason = 'invalid-email' | 'submit-failed'

/** What started a download of the Lead Magnet PDF: the automatic one on success, or a tap on Delivery's link. */
export type PdfDownloadTrigger = 'auto' | 'link'

/** One Funnel Event, by its `event` name, with its own properties. */
export type FunnelEvent =
  | { event: 'arrival' }
  | { event: 'section_view'; section: SectionId }
  | { event: 'interactive_tool_use'; tool: 'fund-picker'; ticker: string }
  | { event: 'interactive_tool_use'; tool: 'fee-calculator' }
  | { event: 'lead_ask_click'; placement: LeadAskClickPlacement }
  | { event: 'lead_form_seen' }
  | { event: 'lead_form_start' }
  | { event: 'lead_form_submit' }
  | { event: 'lead_form_success' }
  | { event: 'lead_form_error'; reason: LeadFormErrorReason }
  | { event: 'pdf_download'; trigger: PdfDownloadTrigger }
  | { event: 'segment_answer'; segment: Segment }
