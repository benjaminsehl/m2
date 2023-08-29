import clsx from 'clsx';

import {missingClass, formatText} from '~/lib/utils';

export function Heading({
  as: Component = 'h2',
  children,
  className = '',
  format,
  type = 'subhead',
  width = 'default',
  align = 'left',
  ...props
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span';
  children: React.ReactNode;
  format?: boolean;
  type?: 'lead' | 'subhead' | 'label';
  width?: 'default' | 'narrow' | 'wide';
  align?: 'left' | 'center' | 'right';
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const types = {
    lead: 'text-lead font-display',
    subhead: 'text-subhead font-display',
    label: 'text-label uppercase',
  };
  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };
  const aligns = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };

  const base = 'whitespace-pre-line';

  const styles = clsx(
    types[type],
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'max-w-') && widths[width],
    aligns[align],
    base,
    className,
  );

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
}
