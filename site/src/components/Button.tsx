'use client';
import React from 'react';
import Link from 'next/link';
type Common = { children: React.ReactNode; title?: string; className?: string; };
type Props =
  | (Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' })
  | (Common & { as: 'link'; href: string });
export default function Button(props: Props) {
  const base = 'inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium text-white transition-transform duration-150 active:scale-[0.98]';
  const gradient = 'btn-gradient shadow-card';
  if ('as' in props && props.as === 'link') {
    const { href, children, title, className, ...rest } = props as any;
    return <Link href={href} title={title} className={`${base} ${gradient} ${className ?? ''}`} {...rest}>{children}</Link>;
  }
  const { children, title, className, ...rest } = props as any;
  return <button title={title} className={`${base} ${gradient} ${className ?? ''}`} {...rest}>{children}</button>;
}