import Image from 'next/image';
import Link from 'next/link';
import { Children, isValidElement, type ReactNode } from 'react';
import type { MDXComponents } from 'mdx/types';
import { headingId } from '@/lib/mdx';

/** Flattens MDX children down to plain text so a heading can be given an id. */
function toText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return Children.toArray(node.props.children).map(toText).join('');
  }
  return '';
}

/**
 * The ids here must match `getToc`, which reads the same headings out of the
 * raw MDX — both sides call `headingId`, so the anchors always agree.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 id={headingId(toText(children))} className="scroll-mt-28" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={headingId(toText(children))} className="scroll-mt-28" {...props}>
      {children}
    </h3>
  ),
  a: ({ href = '', children, ...props }) => {
    const isInternal = href.startsWith('/') || href.startsWith('#');
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  img: ({ src = '', alt = '' }) => (
    <Image
      src={String(src)}
      alt={alt}
      width={1200}
      height={675}
      className="rounded-card border border-line"
    />
  ),
};
