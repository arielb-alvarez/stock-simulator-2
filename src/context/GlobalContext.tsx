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

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<GlobalConfig>(() => {
    const storedConfig = loadConfigFromStorage();
    return storedConfig || defaultConfig;
  });

  // Debounced save to localStorage (prevents excessive writes)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveConfigToStorage(config);
    }, 500);
    return () => clearTimeout(timer);
  }, [config]);

  // ----------------------------------------------------------------------
  // Utility: check if an object has any actual changes
  const hasChanges = <T extends object>(existing: T, updates: Partial<T>): boolean => {
    return Object.keys(updates).some(key => 
      existing[key as keyof T] !== updates[key as keyof T]
    );
  };

  // ----------------------------------------------------------------------
  // RSI
  const updateRSI = useCallback((id: string, updates: Partial<RSIConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.rsi.find(rsi => rsi.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      // Auto‑rename if using default name pattern
      if (updates.period && existing.name === `RSI ${existing.period}`) {
        updates.name = generateRSIName(updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          rsi: prev.indicators.rsi.map(rsi => 
            rsi.id === id ? { ...rsi, ...updates } : rsi
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

  // ----------------------------------------------------------------------
  // MFI
  const updateMFI = useCallback((id: string, updates: Partial<MFIConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.mfi.find(mfi => mfi.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if (updates.period && existing.name === `MFI ${existing.period}`) {
        updates.name = generateMFIName(updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          mfi: prev.indicators.mfi.map(mfi => 
            mfi.id === id ? { ...mfi, ...updates } : mfi
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
        mfi: prev.indicators.mfi.map(mfi => 
          mfi.id === id ? { ...mfi, show: !mfi.show } : mfi
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // EMV
  const updateEMV = useCallback((id: string, updates: Partial<EMVConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.emv.find(emv => emv.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if ((updates.period !== undefined || updates.divisor !== undefined) && 
          existing.name === generateEMVName(existing.period, existing.divisor)) {
        const newPeriod = updates.period ?? existing.period;
        const newDivisor = updates.divisor ?? existing.divisor;
        updates.name = generateEMVName(newPeriod, newDivisor);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          emv: prev.indicators.emv.map(emv => 
            emv.id === id ? { ...emv, ...updates } : emv
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
        emv: prev.indicators.emv.map(emv => 
          emv.id === id ? { ...emv, show: !emv.show } : emv
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // Volume
  const updateVolume = useCallback((id: string, updates: Partial<VolumeConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.volume.find(vol => vol.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          volume: prev.indicators.volume.map(volume => 
            volume.id === id ? { ...volume, ...updates } : volume
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
        volume: prev.indicators.volume.map(volume => 
          volume.id === id ? { ...volume, show: !volume.show } : volume
        ),
      },
    }));
  }, []);

  const updateVolumeMA = useCallback((volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => {
    setConfig(prev => {
      const volume = prev.indicators.volume.find(v => v.id === volumeId);
      if (!volume) return prev;
      const ma = volume.maLines.find(m => m.id === maId);
      if (!ma) return prev;
      if (!hasChanges(ma, updates)) return prev;

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          volume: prev.indicators.volume.map(vol => 
            vol.id === volumeId 
              ? {
                  ...vol,
                  maLines: vol.maLines.map(m => 
                    m.id === maId ? { ...m, ...updates } : m
                  )
                }
              : vol
          ),
        },
      };
    });
  }, []);

  const toggleVolumeMA = useCallback((volumeId: string, maId: string) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(vol => 
          vol.id === volumeId 
            ? {
                ...vol,
                maLines: vol.maLines.map(m => 
                  m.id === maId ? { ...m, show: !m.show } : m
                )
              }
            : vol
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // MA
  const updateMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.ma.find(ma => ma.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if (updates.period && existing.name === generateMAName(existing.type, existing.period)) {
        updates.name = generateMAName(existing.type, updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          ma: prev.indicators.ma.map(ma => 
            ma.id === id ? { ...ma, ...updates } : ma
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
        ma: prev.indicators.ma.map(ma => 
          ma.id === id ? { ...ma, show: !ma.show } : ma
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // EMA
  const updateEMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.ema.find(ema => ema.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if (updates.period && existing.name === generateMAName(existing.type, existing.period)) {
        updates.name = generateMAName(existing.type, updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          ema: prev.indicators.ema.map(ema => 
            ema.id === id ? { ...ema, ...updates } : ema
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
        ema: prev.indicators.ema.map(ema => 
          ema.id === id ? { ...ema, show: !ema.show } : ema
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // WMA
  const updateWMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.wma.find(wma => wma.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if (updates.period && existing.name === generateMAName(existing.type, existing.period)) {
        updates.name = generateMAName(existing.type, updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          wma: prev.indicators.wma.map(wma => 
            wma.id === id ? { ...wma, ...updates } : wma
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
        wma: prev.indicators.wma.map(wma => 
          wma.id === id ? { ...wma, show: !wma.show } : wma
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // BB
  const updateBB = useCallback((id: string, updates: Partial<BBConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.bb.find(bb => bb.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if ((updates.period || updates.stdDev) && 
          existing.name === generateBBName(existing.period, existing.stdDev)) {
        const newPeriod = updates.period ?? existing.period;
        const newStdDev = updates.stdDev ?? existing.stdDev;
        updates.name = generateBBName(newPeriod, newStdDev);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          bb: prev.indicators.bb.map(bb => 
            bb.id === id ? { ...bb, ...updates } : bb
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
        bb: prev.indicators.bb.map(bb => 
          bb.id === id ? { ...bb, show: !bb.show } : bb
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // VWAP
  const updateVWAP = useCallback((id: string, updates: Partial<VWAPConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.vwap.find(v => v.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;
      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          vwap: prev.indicators.vwap.map(vwap => 
            vwap.id === id ? { ...vwap, ...updates } : vwap
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
        vwap: prev.indicators.vwap.map(vwap => 
          vwap.id === id ? { ...vwap, show: !vwap.show } : vwap
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // AVL
  const updateAVL = useCallback((id: string, updates: Partial<AVLConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.avl.find(avl => avl.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if (updates.period && existing.name === generateAVLName(existing.period)) {
        updates.name = generateAVLName(updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          avl: prev.indicators.avl.map(avl => 
            avl.id === id ? { ...avl, ...updates } : avl
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
        avl: prev.indicators.avl.map(avl => 
          avl.id === id ? { ...avl, show: !avl.show } : avl
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // SAR
  const updateSAR = useCallback((id: string, updates: Partial<SARConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.sar.find(sar => sar.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if ((updates.start !== undefined || updates.maximum !== undefined) && 
          existing.name === generateSARName(existing.start, existing.maximum)) {
        const newStart = updates.start ?? existing.start;
        const newMaximum = updates.maximum ?? existing.maximum;
        updates.name = generateSARName(newStart, newMaximum);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          sar: prev.indicators.sar.map(sar => 
            sar.id === id ? { ...sar, ...updates } : sar
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
        sar: prev.indicators.sar.map(sar => 
          sar.id === id ? { ...sar, show: !sar.show } : sar
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // TRIX
  const updateTRIX = useCallback((id: string, updates: Partial<TRIXConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.trix.find(trix => trix.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if (updates.period && existing.name === generateTRIXName(existing.period)) {
        updates.name = generateTRIXName(updates.period);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          trix: prev.indicators.trix.map(trix => 
            trix.id === id ? { ...trix, ...updates } : trix
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
        trix: prev.indicators.trix.map(trix => 
          trix.id === id ? { ...trix, show: !trix.show } : trix
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // Supertrend
  const updateSupertrend = useCallback((id: string, updates: Partial<SupertrendConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.supertrend.find(st => st.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if ((updates.atrLength !== undefined || updates.factor !== undefined) && 
          existing.name === generateSupertrendName(existing.atrLength, existing.factor)) {
        const newAtrLength = updates.atrLength ?? existing.atrLength;
        const newFactor = updates.factor ?? existing.factor;
        updates.name = generateSupertrendName(newAtrLength, newFactor);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          supertrend: prev.indicators.supertrend.map(st => 
            st.id === id ? { ...st, ...updates } : st
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
        supertrend: prev.indicators.supertrend.map(st => 
          st.id === id ? { ...st, show: !st.show } : st
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // KDJ
  const updateKDJ = useCallback((id: string, updates: Partial<KDJConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.kdj.find(kdj => kdj.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if ((updates.period !== undefined || updates.kPeriod !== undefined || updates.dPeriod !== undefined) && 
          existing.name === generateKDJName(existing.period, existing.kPeriod, existing.dPeriod)) {
        const newPeriod = updates.period ?? existing.period;
        const newKPeriod = updates.kPeriod ?? existing.kPeriod;
        const newDPeriod = updates.dPeriod ?? existing.dPeriod;
        updates.name = generateKDJName(newPeriod, newKPeriod, newDPeriod);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          kdj: prev.indicators.kdj.map(kdj => 
            kdj.id === id ? { ...kdj, ...updates } : kdj
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
        kdj: prev.indicators.kdj.map(kdj => 
          kdj.id === id ? { ...kdj, show: !kdj.show } : kdj
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // MTM
  const updateMTM = useCallback((id: string, updates: Partial<MTMConfig>) => {
    setConfig(prev => {
      const existing = prev.indicators.mtm.find(mtm => mtm.id === id);
      if (!existing) return prev;
      if (!hasChanges(existing, updates)) return prev;

      if ((updates.period !== undefined || updates.priceType !== undefined) && 
          existing.name === generateMTMName(existing.period, existing.priceType)) {
        const newPeriod = updates.period ?? existing.period;
        const newPriceType = updates.priceType ?? existing.priceType;
        updates.name = generateMTMName(newPeriod, newPriceType);
      }

      return {
        ...prev,
        indicators: {
          ...prev.indicators,
          mtm: prev.indicators.mtm.map(mtm => 
            mtm.id === id ? { ...mtm, ...updates } : mtm
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
        mtm: prev.indicators.mtm.map(mtm => 
          mtm.id === id ? { ...mtm, show: !mtm.show } : mtm
        ),
      },
    }));
  }, []);

  // ----------------------------------------------------------------------
  // Chart style & type
  const updateChartStyle = useCallback((updates: Partial<ChartStyleConfig>) => {
    setConfig(prev => ({
      ...prev,
      chart: { ...prev.chart, ...updates },
    }));
  }, []);

  const updateChartType = useCallback((chartType: ChartType) => {
    setConfig(prev => ({
      ...prev,
      chartType,
      chart: {
        ...prev.chart,
        candle: getChartTypeConfig(chartType),
      },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig(defaultConfig);
    resetStorage();
  }, []);

  const updateConfig = useCallback((updates: Partial<GlobalConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Memoize the context value to prevent unnecessary re‑renders
  const value = useMemo<GlobalContextType>(() => ({
    config,
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
    config,
    updateRSI, toggleRSI,
    updateMFI, toggleMFI,
    updateVolume, toggleVolume, updateVolumeMA, toggleVolumeMA,
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
    updateChartStyle, updateChartType, resetToDefaults,
  ]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}

export type { ChartType };