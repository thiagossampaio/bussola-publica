type AnalyticsEvent = {
  name: string;
  data?: Record<string, unknown>;
  ts: number;
  sessionId: string;
  variant?: string;
};

const STORAGE_KEY = 'bp_analytics_events_v1';
const SESSION_KEY = 'bp_session_id_v1';
const MAX_EVENTS = 200;

const safeRead = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWrite = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

const getSessionId = () => {
  const existing = safeRead(SESSION_KEY);
  if (existing) return existing;
  const id = `sess_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  safeWrite(SESSION_KEY, id);
  return id;
};

export const trackEvent = (name: string, data?: Record<string, unknown>, variant?: string) => {
  const payload: AnalyticsEvent = {
    name,
    data,
    ts: Date.now(),
    sessionId: getSessionId(),
    variant
  };

  const raw = safeRead(STORAGE_KEY);
  const list: AnalyticsEvent[] = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  list.push(payload);
  const trimmed = list.slice(-MAX_EVENTS);
  safeWrite(STORAGE_KEY, JSON.stringify(trimmed));

  if (import.meta.env.MODE === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', payload);
  }
};

export const getTrackedEvents = () => {
  const raw = safeRead(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
};
