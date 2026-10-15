// The Fee Calculator's Bank Fund choice: ČSOB Akciový or another bank's fund, as a segmented control
// (design-identity.md#components), one always picked.
import { bankFundOptions, type BankFundOption } from '@lib/bankFundOptions.ts'
import { SegmentedControl } from './SegmentedControl.tsx'

export type BankFundChoiceProps = {
  pickedBankFundOption: BankFundOption
  onPick: (bankFundOption: BankFundOption) => void
}

/**
 * A labelled segmented control of every Bank Fund option, each its name over its TER, the picked one filled `brand`.
 *
 * ```tsx
 * <BankFundChoice pickedBankFundOption={typicalBankFundOption} onPick={setPickedBankFundOption} />
 * // Bankovní fond ČSOB Akciový 2,59 % [Jiný fond banky kolem 2 %]
 * // pressing ČSOB Akciový calls onPick(csobAkciovyOption); pressing "Jiný fond banky" again calls nothing
 * ```
 */
export const BankFundChoice = ({ pickedBankFundOption, onPick }: BankFundChoiceProps) => {
  return (
    <SegmentedControl
      label="Bankovní fond"
      options={bankFundOptions.map(({ name, terLabel }) => ({
        value: name,
        content: (
          <>
            <span className="text-label">{name}</span>
            <span className="text-fact">{terLabel}</span>
          </>
        ),
      }))}
      pickedValue={pickedBankFundOption.name}
      onPick={(bankFundName) => {
        const bankFundOption = bankFundOptions.find((option) => option.name === bankFundName)
        if (bankFundOption) onPick(bankFundOption)
      }}
      optionClassName="h-auto min-h-11 flex-col gap-0 py-1.5"
    />
  )
}
