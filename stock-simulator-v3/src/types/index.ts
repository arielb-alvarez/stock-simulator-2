export interface ChartConfig {
  layout: {
    background: {
      type: string;
      color: string;
    };
    textColor: string;
  };
  grid: {
    vertLines: { color: string };
    horzLines: { color: string };
  };
}

export interface GlobalConfig {
  chart: ChartConfig;
}

export interface GlobalContextType {
  theme: string;
  setTheme: (theme: string) => void;
  config: GlobalConfig;
  setConfig: (config: GlobalConfig) => void;
}