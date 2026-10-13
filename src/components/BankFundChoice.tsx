// The Fee Calculator's Bank Fund choice: ČSOB Akciový or another bank's fund, as a segmented control
// (design-identity.md#components), one always picked.
import { bankFundOptions, type BankFundOption } from '@lib/bankFundOptions.ts'
import { SegmentedControl } from './SegmentedControl.tsx'

export type BankFundChoiceArgs = {
  pickedBankFundOption: BankFundOption
  onPick: (bankFundOption: BankFundOption) => void
}

/**
 * A labelled segmented control of every Bank Fund option, each its name over its TER, the picked one filled `brand`.
 *
 * ```tsx
 * <BankFundChoice pickedBankFundOption={bankFundOptions[0]} onPick={setPickedBankFundOption} />
 * // Bankovní fond [ČSOB Akciový 2,22 %] Jiný fond banky kolem 2 %
 * // pressing "Jiný fond banky" calls onPick(bankFundOptions[1]); pressing ČSOB Akciový again calls nothing
 * ```
 */
export const BankFundChoice = ({ pickedBankFundOption, onPick }: BankFundChoiceArgs) => {
  return (
    <SegmentedControl
      label="Bankovní fond"
      options={bankFundOptions.map(({ bankFund, terLabel }) => ({
        value: bankFund.name,
        content: (
          <>
            <span className="text-label">{bankFund.name}</span>
            <span className="text-fact">{terLabel}</span>
          </>
        ),
      }))}
      pickedValue={pickedBankFundOption.bankFund.name}
      onPick={(bankFundName) => {
        const bankFundOption = bankFundOptions.find((option) => option.bankFund.name === bankFundName)
        if (bankFundOption) onPick(bankFundOption)
      }}
      optionClassName="h-auto min-h-11 flex-col gap-0 py-1.5"
    />
  )
}
