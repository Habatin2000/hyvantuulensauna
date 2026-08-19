'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared accessibility behavior for hand-rolled modal dialogs:
 * moves focus into the dialog on open, traps Tab inside it, closes on
 * Escape and returns focus to the previously focused element on close.
 * Attach the returned ref to the dialog container (role="dialog").
 */
export function useModalA11y<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  initialFocusSelector?: string,
) {
  const dialogRef = useRef<T>(null);
  // Callers pass inline closures; keep the latest without re-running the effect
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    // Focus the requested element, or the first interactive one in the dialog
    const initialFocus = initialFocusSelector
      ? dialog.querySelector<HTMLElement>(initialFocusSelector)
      : null;
    (initialFocus ?? getFocusable()[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, initialFocusSelector]);

  return dialogRef;
}
