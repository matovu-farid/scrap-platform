import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Style h1 with large size, bold weight, and bottom margin
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold tracking-tight mb-6">{children}</h1>
    ),

    // Style h2 with medium size, semibold weight, and spacing
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-4">
        {children}
      </h2>
    ),

    // Style h3 with smaller size and proper spacing
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold tracking-tight mt-8 mb-3">
        {children}
      </h3>
    ),

    // Style paragraphs with proper line height and spacing
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),

    // Merge with any custom components passed in
    ...components,
  };
}
