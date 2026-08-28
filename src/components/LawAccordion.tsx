"use client";

import { useId, useState } from "react";

/*
  UX4G-styled accordion with the toggle owned by React. The vendor runtime
  was removed entirely: its capture-phase global scroll listeners could
  wedge the renderer mid-scroll, and this accordion was the only thing
  that used it. Same UX4G classes, same look — just our own state.
*/
export function LawAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <div className="ux4g-accordion ux4g-accordion-arrow-right ux4g-accordion-bordered mt-4">
      <div className="ux4g-accordion__item">
        <h3 className="ux4g-accordion__header">
          <button
            type="button"
            className={`ux4g-accordion__button${open ? "" : " collapsed"}`}
            aria-expanded={open}
            aria-controls={bodyId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="ux4g-accordion__button-content">
              <span className="ux4g-accordion__title">{title}</span>
            </span>
          </button>
        </h3>
        <div
          id={bodyId}
          className={`ux4g-accordion__collapse collapse${open ? " show" : ""}`}
        >
          <div className="ux4g-accordion__body">{children}</div>
        </div>
      </div>
    </div>
  );
}
