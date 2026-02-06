// context/GlobalContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
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

  useEffect(() => {
    saveConfigToStorage(config);
  }, [config]);

  const updateConfig = useCallback((updates: Partial<GlobalConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateRSI = useCallback((id: string, updates: Partial<RSIConfig>) => {
    setConfig(prev => {
      const currentRSI = prev.indicators.rsi.find(rsi => rsi.id === id);
      
      if (updates.period && currentRSI) {
        const oldPeriod = currentRSI.period;
        const newPeriod = updates.period;
        const defaultNamePattern = `RSI ${oldPeriod}`;
        if (currentRSI.name === defaultNamePattern) {
          updates.name = generateRSIName(newPeriod);
        }
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

  const updateMFI = useCallback((id: string, updates: Partial<MFIConfig>) => {
    setConfig(prev => {
      const currentMFI = prev.indicators.mfi.find(mfi => mfi.id === id);
      
      if (updates.period && currentMFI) {
        const oldPeriod = currentMFI.period;
        const newPeriod = updates.period;
        const defaultNamePattern = `MFI ${oldPeriod}`;
        if (currentMFI.name === defaultNamePattern) {
          updates.name = generateMFIName(newPeriod);
        }
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

  const updateEMV = useCallback((id: string, updates: Partial<EMVConfig>) => {
    setConfig(prev => {
      const currentEMV = prev.indicators.emv.find(emv => emv.id === id);
      
      if ((updates.period !== undefined || updates.divisor !== undefined) && currentEMV) {
        const oldPeriod = currentEMV.period;
        const oldDivisor = currentEMV.divisor;
        const newPeriod = updates.period !== undefined ? updates.period : oldPeriod;
        const newDivisor = updates.divisor !== undefined ? updates.divisor : oldDivisor;
        const defaultNamePattern = generateEMVName(oldPeriod, oldDivisor);
        
        if (currentEMV.name === defaultNamePattern) {
          updates.name = generateEMVName(newPeriod, newDivisor);
        }
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

  const updateVolume = useCallback((id: string, updates: Partial<VolumeConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        volume: prev.indicators.volume.map(volume => 
          volume.id === id ? { ...volume, ...updates } : volume
        ),
      },
    }));
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

  const updateMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const currentMA = prev.indicators.ma.find(ma => ma.id === id);
      
      if (updates.period && currentMA) {
        const oldPeriod = currentMA.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateMAName(currentMA.type, oldPeriod);
        
        if (currentMA.name === defaultNamePattern) {
          updates.name = generateMAName(currentMA.type, newPeriod);
        }
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

  const updateEMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const currentEMA = prev.indicators.ema.find(ema => ema.id === id);
      
      if (updates.period && currentEMA) {
        const oldPeriod = currentEMA.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateMAName(currentEMA.type, oldPeriod);
        
        if (currentEMA.name === defaultNamePattern) {
          updates.name = generateMAName(currentEMA.type, newPeriod);
        }
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

  const updateWMA = useCallback((id: string, updates: Partial<MAConfig>) => {
    setConfig(prev => {
      const currentWMA = prev.indicators.wma.find(wma => wma.id === id);
      
      if (updates.period && currentWMA) {
        const oldPeriod = currentWMA.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateMAName(currentWMA.type, oldPeriod);
        
        if (currentWMA.name === defaultNamePattern) {
          updates.name = generateMAName(currentWMA.type, newPeriod);
        }
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

  const updateBB = useCallback((id: string, updates: Partial<BBConfig>) => {
    setConfig(prev => {
      const currentBB = prev.indicators.bb.find(bb => bb.id === id);
      
      if ((updates.period || updates.stdDev) && currentBB) {
        const oldPeriod = currentBB.period;
        const oldStdDev = currentBB.stdDev;
        const newPeriod = updates.period || oldPeriod;
        const newStdDev = updates.stdDev || oldStdDev;
        const defaultNamePattern = generateBBName(oldPeriod, oldStdDev);
        
        if (currentBB.name === defaultNamePattern) {
          updates.name = generateBBName(newPeriod, newStdDev);
        }
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

  const updateVWAP = useCallback((id: string, updates: Partial<VWAPConfig>) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        vwap: prev.indicators.vwap.map(vwap => 
          vwap.id === id ? { ...vwap, ...updates } : vwap
        ),
      },
    }));
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

  const updateAVL = useCallback((id: string, updates: Partial<AVLConfig>) => {
    setConfig(prev => {
      const currentAVL = prev.indicators.avl.find(avl => avl.id === id);
      
      if (updates.period && currentAVL) {
        const oldPeriod = currentAVL.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateAVLName(oldPeriod);
        
        if (currentAVL.name === defaultNamePattern) {
          updates.name = generateAVLName(newPeriod);
        }
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

  const updateSAR = useCallback((id: string, updates: Partial<SARConfig>) => {
    setConfig(prev => {
      const currentSAR = prev.indicators.sar.find(sar => sar.id === id);
      
      if ((updates.start !== undefined || updates.maximum !== undefined) && currentSAR) {
        const oldStart = currentSAR.start;
        const oldMaximum = currentSAR.maximum;
        const newStart = updates.start !== undefined ? updates.start : oldStart;
        const newMaximum = updates.maximum !== undefined ? updates.maximum : oldMaximum;
        const defaultNamePattern = generateSARName(oldStart, oldMaximum);
        
        if (currentSAR.name === defaultNamePattern) {
          updates.name = generateSARName(newStart, newMaximum);
        }
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

  const updateTRIX = useCallback((id: string, updates: Partial<TRIXConfig>) => {
    setConfig(prev => {
      const currentTRIX = prev.indicators.trix.find(trix => trix.id === id);
      
      if (updates.period && currentTRIX) {
        const oldPeriod = currentTRIX.period;
        const newPeriod = updates.period;
        const defaultNamePattern = generateTRIXName(oldPeriod);
        
        if (currentTRIX.name === defaultNamePattern) {
          updates.name = generateTRIXName(newPeriod);
        }
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

  const updateSupertrend = useCallback((id: string, updates: Partial<SupertrendConfig>) => {
    setConfig(prev => {
      const currentST = prev.indicators.supertrend.find(st => st.id === id);
      
      if ((updates.atrLength !== undefined || updates.factor !== undefined) && currentST) {
        const oldAtrLength = currentST.atrLength;
        const oldFactor = currentST.factor;
        const newAtrLength = updates.atrLength !== undefined ? updates.atrLength : oldAtrLength;
        const newFactor = updates.factor !== undefined ? updates.factor : oldFactor;
        const defaultNamePattern = generateSupertrendName(oldAtrLength, oldFactor);
        
        if (currentST.name === defaultNamePattern) {
          updates.name = generateSupertrendName(newAtrLength, newFactor);
        }
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

  const updateKDJ = useCallback((id: string, updates: Partial<KDJConfig>) => {
    setConfig(prev => {
      const currentKDJ = prev.indicators.kdj.find(kdj => kdj.id === id);
      
      if ((updates.period !== undefined || updates.kPeriod !== undefined || updates.dPeriod !== undefined) && currentKDJ) {
        const oldPeriod = currentKDJ.period;
        const oldKPeriod = currentKDJ.kPeriod;
        const oldDPeriod = currentKDJ.dPeriod;
        const newPeriod = updates.period !== undefined ? updates.period : oldPeriod;
        const newKPeriod = updates.kPeriod !== undefined ? updates.kPeriod : oldKPeriod;
        const newDPeriod = updates.dPeriod !== undefined ? updates.dPeriod : oldDPeriod;
        const defaultNamePattern = generateKDJName(oldPeriod, oldKPeriod, oldDPeriod);
        
        if (currentKDJ.name === defaultNamePattern) {
          updates.name = generateKDJName(newPeriod, newKPeriod, newDPeriod);
        }
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

  const updateMTM = useCallback((id: string, updates: Partial<MTMConfig>) => {
    setConfig(prev => {
      const currentMTM = prev.indicators.mtm.find(mtm => mtm.id === id);
      
      if ((updates.period !== undefined || updates.priceType !== undefined) && currentMTM) {
        const oldPeriod = currentMTM.period;
        const oldPriceType = currentMTM.priceType;
        const newPeriod = updates.period !== undefined ? updates.period : oldPeriod;
        const newPriceType = updates.priceType !== undefined ? updates.priceType : oldPriceType;
        const defaultNamePattern = generateMTMName(oldPeriod, oldPriceType);
        
        if (currentMTM.name === defaultNamePattern) {
          updates.name = generateMTMName(newPeriod, newPriceType);
        }
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

  const updateVolumeMA = useCallback((volumeId: string, maId: string, updates: Partial<VolumeMAConfig>) => {
    setConfig(prev => ({
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
    }));
  }, []);

  const toggleVolumeMA = useCallback((volumeId: string, maId: string) => {
    setConfig(prev => ({
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
    }));
  }, []);

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

  const value: GlobalContextType = {
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
  };

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

// Re-export types for backward compatibility
export type { ChartType };