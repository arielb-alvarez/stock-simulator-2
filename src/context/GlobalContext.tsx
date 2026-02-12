// context/GlobalContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { GlobalContextType, GlobalConfig, ChartType, ChartStyleConfig, 
         RSIConfig, MFIConfig, VolumeConfig, VolumeMAConfig, MAConfig, 
         BBConfig, VWAPConfig, AVLConfig, SARConfig, TRIXConfig, 
         SupertrendConfig, KDJConfig, EMVConfig, MTMConfig } from './types';
import { defaultConfig } from './defaultConfig2';
import { getChartTypeConfig } from './chartConfigUtils';
import {
  loadConfigFromStorage,
  saveConfigToStorage,
  resetStorage
} from './localStorage';
import { 
  generateRSIName, generateMFIName, generateMAName, generateBBName, 
  generateAVLName, generateSARName, generateTRIXName, 
  generateSupertrendName, generateKDJName, generateEMVName, generateMTMName 
} from './defaultConfig';

// --- Separate contexts for state and API ---
const ConfigStateContext = createContext<GlobalConfig | undefined>(undefined);
const ConfigApiContext = createContext<Omit<GlobalContextType, 'config'> | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GlobalConfig>(() => {
    try {
      const loadedConfig = loadConfigFromStorage();
      console.log('Loaded config from storage:', loadedConfig);
      return loadedConfig;
    } catch (error) {
      console.error('Failed to load config from storage:', error);
      return defaultConfig;
    }
  });

  // --- Save to storage with debouncing ---
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        saveConfigToStorage(config);
      } catch (error) {
        console.error('Failed to save config to storage:', error);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [config]);

  // -----------------------------------------------------------------
  // All update functions are identical to the original, but now they
  // are stable across renders (useCallback with empty deps where appropriate).
  // -----------------------------------------------------------------

  const updateConfig = useCallback((updates: Partial<GlobalConfig>) => {
    setConfig(prev => {
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = (prev as any)[key];
        const newValue = (updates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  const updateRSI = useCallback((id: string, updates: Partial<RSIConfig>) => {
    setConfig(prev => {
      const currentRSI = prev.indicators.rsi.find(rsi => rsi.id === id);
      if (!currentRSI) return prev;
      const newUpdates = { ...updates };
      if (updates.period && currentRSI) {
        const oldPeriod = currentRSI.period;
        const newPeriod = updates.period;
        if (currentRSI.name === `RSI ${oldPeriod}`) {
          newUpdates.name = generateRSIName(newPeriod);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (currentRSI as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          rsi: prev.indicators.rsi.map(rsi => 
            rsi.id === id ? { ...rsi, ...newUpdates } : rsi
          ),
        },
      };
    });
  }, []);

  const toggleRSI = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        rsi: prev.indicators.rsi.map(rsi =>
          rsi.id === id ? { ...rsi, show: !rsi.show } : rsi
        ),
      },
    }));
  }, []);

  const updateMFI = useCallback((id: string, updates: Partial<MFIConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.mfi.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if (updates.period && current.name === `MFI ${current.period}`) {
        newUpdates.name = generateMFIName(updates.period);
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          mfi: prev.indicators.mfi.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleMFI = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        mfi: prev.indicators.mfi.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateEMV = useCallback((id: string, updates: Partial<EMVConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.emv.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if ((updates.period !== undefined || updates.divisor !== undefined) && current) {
        const oldPeriod = current.period;
        const oldDivisor = current.divisor;
        const newPeriod = updates.period ?? oldPeriod;
        const newDivisor = updates.divisor ?? oldDivisor;
        if (current.name === generateEMVName(oldPeriod, oldDivisor)) {
          newUpdates.name = generateEMVName(newPeriod, newDivisor);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          emv: prev.indicators.emv.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleEMV = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        emv: prev.indicators.emv.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateVolume = useCallback((id: string, updates: Partial<VolumeConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.volume.find(item => item.id === id);
      if (!current) return prev;
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (updates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          volume: prev.indicators.volume.map(item =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      };
    });
  }, []);

  const toggleVolume = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.ma.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if (updates.period && current.name === generateMAName(current.type, current.period)) {
        newUpdates.name = generateMAName(current.type, updates.period);
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          ma: prev.indicators.ma.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleMA = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        ma: prev.indicators.ma.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateEMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.ema.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if (updates.period && current.name === generateMAName(current.type, current.period)) {
        newUpdates.name = generateMAName(current.type, updates.period);
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          ema: prev.indicators.ema.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleEMA = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        ema: prev.indicators.ema.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateWMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.wma.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if (updates.period && current.name === generateMAName(current.type, current.period)) {
        newUpdates.name = generateMAName(current.type, updates.period);
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          wma: prev.indicators.wma.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleWMA = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        wma: prev.indicators.wma.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateBB = useCallback((id: string, updates: Partial<BBConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.bb.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if ((updates.period || updates.stdDev) && current) {
        const oldPeriod = current.period;
        const oldStdDev = current.stdDev;
        const newPeriod = updates.period ?? oldPeriod;
        const newStdDev = updates.stdDev ?? oldStdDev;
        if (current.name === generateBBName(oldPeriod, oldStdDev)) {
          newUpdates.name = generateBBName(newPeriod, newStdDev);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          bb: prev.indicators.bb.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleBB = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        bb: prev.indicators.bb.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateVWAP = useCallback((id: string, updates: Partial<VWAPConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.vwap.find(item => item.id === id);
      if (!current) return prev;
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (updates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          vwap: prev.indicators.vwap.map(item =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      };
    });
  }, []);

  const toggleVWAP = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        vwap: prev.indicators.vwap.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateAVL = useCallback((id: string, updates: Partial<AVLConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.avl.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if (updates.period && current.name === generateAVLName(current.period)) {
        newUpdates.name = generateAVLName(updates.period);
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          avl: prev.indicators.avl.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleAVL = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        avl: prev.indicators.avl.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateSAR = useCallback((id: string, updates: Partial<SARConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.sar.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if ((updates.start !== undefined || updates.maximum !== undefined) && current) {
        const oldStart = current.start;
        const oldMaximum = current.maximum;
        const newStart = updates.start ?? oldStart;
        const newMaximum = updates.maximum ?? oldMaximum;
        if (current.name === generateSARName(oldStart, oldMaximum)) {
          newUpdates.name = generateSARName(newStart, newMaximum);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          sar: prev.indicators.sar.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleSAR = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        sar: prev.indicators.sar.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateTRIX = useCallback((id: string, updates: Partial<TRIXConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.trix.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if (updates.period && current.name === generateTRIXName(current.period)) {
        newUpdates.name = generateTRIXName(updates.period);
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          trix: prev.indicators.trix.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleTRIX = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        trix: prev.indicators.trix.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateSupertrend = useCallback((id: string, updates: Partial<SupertrendConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.supertrend.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if ((updates.atrLength !== undefined || updates.factor !== undefined) && current) {
        const oldAtrLength = current.atrLength;
        const oldFactor = current.factor;
        const newAtrLength = updates.atrLength ?? oldAtrLength;
        const newFactor = updates.factor ?? oldFactor;
        if (current.name === generateSupertrendName(oldAtrLength, oldFactor)) {
          newUpdates.name = generateSupertrendName(newAtrLength, newFactor);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          supertrend: prev.indicators.supertrend.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleSupertrend = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        supertrend: prev.indicators.supertrend.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateKDJ = useCallback((id: string, updates: Partial<KDJConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.kdj.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if ((updates.period !== undefined || updates.kPeriod !== undefined || updates.dPeriod !== undefined) && current) {
        const oldPeriod = current.period;
        const oldKPeriod = current.kPeriod;
        const oldDPeriod = current.dPeriod;
        const newPeriod = updates.period ?? oldPeriod;
        const newKPeriod = updates.kPeriod ?? oldKPeriod;
        const newDPeriod = updates.dPeriod ?? oldDPeriod;
        if (current.name === generateKDJName(oldPeriod, oldKPeriod, oldDPeriod)) {
          newUpdates.name = generateKDJName(newPeriod, newKPeriod, newDPeriod);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          kdj: prev.indicators.kdj.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleKDJ = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        kdj: prev.indicators.kdj.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateMTM = useCallback((id: string, updates: Partial<MTMConfig>) => {
    setConfig(prev => {
      const current = prev.indicators.mtm.find(item => item.id === id);
      if (!current) return prev;
      const newUpdates = { ...updates };
      if ((updates.period !== undefined || updates.priceType !== undefined) && current) {
        const oldPeriod = current.period;
        const oldPriceType = current.priceType;
        const newPeriod = updates.period ?? oldPeriod;
        const newPriceType = updates.priceType ?? oldPriceType;
        if (current.name === generateMTMName(oldPeriod, oldPriceType)) {
          newUpdates.name = generateMTMName(newPeriod, newPriceType);
        }
      }
      const hasChanges = Object.keys(newUpdates).some(key => {
        const prevValue = (current as any)[key];
        const newValue = (newUpdates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          mtm: prev.indicators.mtm.map(item =>
            item.id === id ? { ...item, ...newUpdates } : item
          ),
        },
      };
    });
  }, []);

  const toggleMTM = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        mtm: prev.indicators.mtm.map(item =>
          item.id === id ? { ...item, show: !item.show } : item
        ),
      },
    }));
  }, []);

  const updateVolumeMA = useCallback((volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => {
    setConfig(prev => {
      const currentVolume = prev.indicators.volume.find(v => v.id === volumeId);
      if (!currentVolume) return prev;
      const currentMA = currentVolume.maLines.find(ma => ma.id === maId);
      if (!currentMA) return prev;
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = (currentMA as any)[key];
        const newValue = (updates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          volume: prev.indicators.volume.map(volume =>
            volume.id === volumeId
              ? {
                  ...volume,
                  maLines: volume.maLines.map(ma =>
                    ma.id === maId ? { ...ma, ...updates } : ma
                  )
                }
              : volume
          ),
        },
      };
    });
  }, []);

  const toggleVolumeMA = useCallback((volumeId: string, maId: string) => {
    setConfig(prev => {
      const currentVolume = prev.indicators.volume.find(v => v.id === volumeId);
      if (!currentVolume) return prev;
      const currentMA = currentVolume.maLines.find(ma => ma.id === maId);
      if (!currentMA) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          volume: prev.indicators.volume.map(volume =>
            volume.id === volumeId
              ? {
                  ...volume,
                  maLines: volume.maLines.map(ma =>
                    ma.id === maId ? { ...ma, show: !ma.show } : ma
                  )
                }
              : volume
          ),
        },
      };
    });
  }, []);

  const updateChartStyle = useCallback((updates: Partial<ChartStyleConfig>) => {
    setConfig(prev => {
      const hasChanges = Object.keys(updates).some(key => {
        const prevValue = (prev.chart as any)[key];
        const newValue = (updates as any)[key];
        return JSON.stringify(prevValue) !== JSON.stringify(newValue);
      });
      if (!hasChanges) return prev;
      return {
        ...prev,
        chart: { ...prev.chart, ...updates },
      };
    });
  }, []);

  const updateChartType = useCallback((chartType: ChartType) => {
    setConfig(prev => {
      if (prev.chartType === chartType) return prev;
      return {
        ...prev,
        chartType,
        chart: {
          ...prev.chart,
          candle: getChartTypeConfig(chartType),
        },
      };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(defaultConfig);
    resetStorage();
  }, []);

  // --- API object is stable across renders ---
  const api = useMemo(() => ({
    updateConfig,
    updateRSI,
    toggleRSI,
    updateMFI,
    toggleMFI,
    updateVolume,
    toggleVolume,
    updateVolumeMA,
    toggleVolumeMA,
    updateMA,
    toggleMA,
    updateEMA,
    toggleEMA,
    updateWMA,
    toggleWMA,
    updateBB,
    toggleBB,
    updateVWAP,
    toggleVWAP,
    updateAVL,
    toggleAVL,
    updateSAR,
    toggleSAR,
    updateTRIX,
    toggleTRIX,
    updateSupertrend,
    toggleSupertrend,
    updateKDJ,
    toggleKDJ,
    updateEMV,
    toggleEMV,
    updateMTM,
    toggleMTM,
    updateChartStyle,
    updateChartType,
    resetToDefaults,
  }), [
    updateConfig,
    updateRSI, toggleRSI,
    updateMFI, toggleMFI,
    updateVolume, toggleVolume,
    updateVolumeMA, toggleVolumeMA,
    updateMA, toggleMA,
    updateEMA, toggleEMA,
    updateWMA, toggleWMA,
    updateBB, toggleBB,
    updateVWAP, toggleVWAP,
    updateAVL, toggleAVL,
    updateSAR, toggleSAR,
    updateTRIX, toggleTRIX,
    updateSupertrend, toggleSupertrend,
    updateKDJ, toggleKDJ,
    updateEMV, toggleEMV,
    updateMTM, toggleMTM,
    updateChartStyle,
    updateChartType,
    resetToDefaults,
  ]);

  return (
    <ConfigStateContext.Provider value={config}>
      <ConfigApiContext.Provider value={api}>
        {children}
      </ConfigApiContext.Provider>
    </ConfigStateContext.Provider>
  );
}

// --- Custom hooks ---
export function useGlobalConfig() {
  const context = useContext(ConfigStateContext);
  if (context === undefined) {
    console.error('useGlobalConfig must be used within a GlobalProvider');
    return defaultConfig; // fallback
  }
  return context;
}

export function useGlobalApi() {
  const context = useContext(ConfigApiContext);
  if (context === undefined) {
    console.error('useGlobalApi must be used within a GlobalProvider');
    // Return dummy functions to avoid crashing
    return {} as Omit<GlobalContextType, 'config'>;
  }
  return context;
}

// Legacy hook for backward compatibility (now uses both)
export function useGlobalContext(): GlobalContextType {
  const config = useGlobalConfig();
  const api = useGlobalApi();
  return { config, ...api };
}

// Re-export types for backward compatibility
export type { ChartType };