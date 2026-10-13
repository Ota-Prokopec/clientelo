// `cn`, the class merger every component composes its classes with: shadcn's `@/lib/utils`, as `shadcn init` writes it.
// It doesn't know the page's own type scale, so a `--text-*` token never goes through it beside a text colour
// (tailwind.md#tokens).
export { cn } from 'cn'
