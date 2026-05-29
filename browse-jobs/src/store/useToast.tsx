/**
 * useToast — lightweight toast context for "Coming in V1" and other
 * transient notifications. Not backed by Zustand; kept in React context
 * so toasts are scoped to the UI layer and do not pollute persisted state.
 *
 * Usage:
 *   1. Wrap your app tree with <ToastProvider> (done once in main.tsx / App.tsx).
 *   2. In any component: const { showToast } = useToast();
 *      showToast({ message: 'Coming in V1', type: 'info' });
 *
 * The "Coming in V1" shorthand: showToast() with no args shows the default message.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  /** Auto-dismiss duration in ms. Default 3500. Pass 0 to disable. */
  duration: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (options?: Partial<Omit<ToastItem, 'id'>>) => void;
  dismissToast: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: Partial<Omit<ToastItem, 'id'>> = {}) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const toast: ToastItem = {
        id,
        message: options.message ?? 'This feature is coming in V1.',
        type: options.type ?? 'info',
        duration: options.duration ?? 3500,
      };

      setToasts((prev) => [...prev, toast]);

      if (toast.duration > 0) {
        const timer = setTimeout(() => dismissToast(id), toast.duration);
        timers.current.set(id, timer);
      }
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>.');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Viewport (renders all active toasts)
// ---------------------------------------------------------------------------

const TYPE_STYLES: Record<ToastType, React.CSSProperties> = {
  info: {
    background: '#F1EFE8',
    color: '#444441',
    borderLeft: '3px solid #888780',
  },
  success: {
    background: '#EAF3DE',
    color: '#3B6D11',
    borderLeft: '3px solid #01959f',
  },
  warning: {
    background: '#FAEEDA',
    color: '#854F0B',
    borderLeft: '3px solid #BA7517',
  },
  error: {
    background: '#FCEBEB',
    color: '#A32D2D',
    borderLeft: '3px solid #A32D2D',
  },
};

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 360,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        lineHeight: 1.45,
        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
        pointerEvents: 'all',
        ...TYPE_STYLES[toast.type],
      }}
    >
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          color: 'inherit',
          opacity: 0.6,
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
