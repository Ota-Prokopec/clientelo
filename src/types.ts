// The domain's generic types: concepts several modules name, which no single component or module owns. A type only
// one module uses, or one that only describes a component's own Args, stays in that module's file.

/** An Interactive Tool, by the id step 5's Funnel Events hook onto. */
export type InteractiveTool = 'fund-picker' | 'fee-calculator'

/** Whose amount the Fee Calculator's bars show: a Bank Fund's TER costs the Visitor, a Twin's is the good number. */
export type FundKind = 'bank-fund' | 'twin'

/** How a Substitute stands in for an ETF: a Twin tracks the same index, a closest alternative a similar one. */
export type SubstituteRelation = 'twin' | 'closest-alternative'

/**
 * A Lead as the page knows them: a new one, who submitted the Lead Form on this visit with their email, or a returning
 * one, whom an earlier visit remembers. The page never stores the email, so a returning Lead has none.
 */
export type Lead = { kind: 'new'; email: string } | { kind: 'returning' }

/** A new Lead's answer to the Segmentation Question: where they invest. It picks their Day 5 Welcome Email. */
export type Segment = 'xtb' | 'trading-212' | 'revolut' | 'fio-patria' | 'robo-advisor' | 'bank-fund' | 'nowhere-yet'
