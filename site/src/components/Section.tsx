import React from 'react';
export default function Section(props: { title?: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        {props.title ? <h2 className="text-3xl font-semibold tracking-tight">{props.title}</h2> : null}
        {props.subtitle ? <p className="mt-2 text-white/70 max-w-3xl">{props.subtitle}</p> : null}
        <div className={props.title || props.subtitle ? 'mt-8' : ''}>{props.children}</div>
      </div>
    </section>
  );
}