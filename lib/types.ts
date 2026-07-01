export type SignalDirection = "BUY" | "SELL";

export type SignalStatus =
  | "OPEN"
  | "TARGET_HIT"
  | "STOPLOSS_HIT"
  | "EXPIRED";

/** A KOL (key opinion leader) as returned by the kols endpoint. */
export interface Kol {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  verified: boolean;
  total_signals: number;
  accuracy_pct: number;
  avg_roi_pct: number;
  joined_at: string;
  last_signal_at: string;
}

/** A single trading signal as returned by the signals endpoint. */
export interface Signal {
  id: string;
  kol_id: string;
  symbol: string;
  direction: SignalDirection;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  current_price: number;
  status: SignalStatus;
  roi_pct: number;
  entry_time: string;
  expiry_time: string;
  created_at: string;
}

/** A KOL enriched with the derived data the leaderboard renders. */
export interface KolRow extends Kol {
  /** Up to the latest 10 signals for this KOL, newest first. */
  recentSignals: Signal[];
  /** ROI values oldest→newest, for the sparkline column. */
  roiSeries: number[];
}
