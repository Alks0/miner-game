export type ThemeTokens = {
  colors: {
    primary: string;
    primaryAlt: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    success: string;
    warning: string;
    danger: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number };
  shadow: { sm: string; md: string; lg: string };
  glow: { primary: string };
};

export const DEFAULT_TOKENS: ThemeTokens = {
  colors: {
    primary: '#7B2CF5',
    primaryAlt: '#2C89F5',
    surface: 'rgba(255,255,255,0.06)',
    surfaceAlt: 'rgba(255,255,255,0.12)',
    text: '#FFFFFF',
    success: '#2EE6A6',
    warning: '#F5D02C',
    danger: '#FF5F6D',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  shadow: {
    sm: '0 2px 8px rgba(0,0,0,0.2)',
    md: '0 8px 20px rgba(0,0,0,0.35)',
    lg: '0 20px 40px rgba(0,0,0,0.45)',
  },
  glow: { primary: '0 0 12px #7B2CF5, 0 0 24px #2C89F5' },
};

export class ThemeManager {
  private static _instance: ThemeManager;
  static get I(): ThemeManager {
    if (!this._instance) this._instance = new ThemeManager();
    return this._instance;
  }

  private tokens: ThemeTokens = DEFAULT_TOKENS;
  getTokens(): ThemeTokens { return this.tokens; }
  setTokens(tokens: Partial<ThemeTokens>) {
    this.tokens = { ...this.tokens, ...tokens } as ThemeTokens;
  }
}


