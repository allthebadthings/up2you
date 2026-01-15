// Global type declarations

interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string,
    config?: {
      event_category?: string
      event_label?: string
      value?: number
      [key: string]: any
    }
  ) => void
}
