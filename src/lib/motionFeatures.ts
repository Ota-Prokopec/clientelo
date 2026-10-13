// Motion's domAnimation features, in a chunk of their own: src/main.tsx's LazyMotion loads them after the first render,
// since nothing animates before the Visitor's first input (design-identity.md#motion).
export { domAnimation as default } from 'motion/react'
