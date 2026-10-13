// Delivery: what replaces the Lead Form once the Visitor is a Lead, inline, never a toast or a dialog
// (design-identity.md#components). For now the on-page confirmation only. #15 adds the download, the unlocked content
// and the Segmentation Question.

export type DeliveryArgs = {
  /** The email the Lead left, read back so they can spot a typo. */
  email: string
}

/**
 * Confirms the Lead Magnet is on its way, and takes focus when it appears, so a keyboard or screen-reader user isn't
 * left on the form that just disappeared.
 *
 * ```tsx
 * <Delivery email="jana.novakova@seznam.cz" />
 * // Hotovo. Tahák vám posíláme na jana.novakova@seznam.cz. …
 * ```
 */
export const Delivery = ({ email }: DeliveryArgs) => {
  return (
    <div ref={(delivery) => delivery?.focus({ preventScroll: true })} tabIndex={-1} className="grid gap-2 outline-none">
      <p className="text-title">Hotovo.</p>
      <p>
        Tahák vám posíláme na <strong className="break-all">{email}</strong>. Když do pár minut nedorazí, mrkněte i do
        složky Hromadné nebo Spam.
      </p>
    </div>
  )
}
