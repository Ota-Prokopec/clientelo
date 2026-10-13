// The domain's generic types: concepts several modules name, which no single component or module owns. A type only
// one module uses, or one that only describes a component's own Args, stays in that module's file.

/** An Interactive Tool, by the id step 5's Funnel Events hook onto. */
export type InteractiveTool = 'fund-picker' | 'fee-calculator'

/** Whose amount the Fee Calculator's bars show: a Bank Fund's TER costs the Visitor, a Twin's is the good number. */
export type FundKind = 'bank-fund' | 'twin'

/** How a Substitute stands in for an ETF: a Twin tracks the same index, a closest alternative a similar one. */
export type SubstituteRelation = 'twin' | 'closest-alternative'
