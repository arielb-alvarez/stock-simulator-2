// hooks/useIndicatorSetup.ts
import { useCallback } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { 
  registerCustomMAIndicator,
  registerCustomEMAIndicator,
  registerCustomWMAIndicator,
  registerCustomAVLIndicator,
  registerCustomBBIndicator,
  registerCustomVWAPIndicator,
  registerCustomSARIndicator,
  registerCustomTRIXIndicator,
  registerCustomSupertrendIndicator,
  registerRSIIndicator,
  registerMFIIndicator,
  registerCustomVolumeIndicator,
  clearOverlayIndicators,
  registerMultiPeriodRSIIndicator,
  registerMultiPeriodMFIIndicator,
  registerMultiPeriodKDJIndicator
} from '@/utils/indicatorRegistry';

export const useIndicatorSetup = () => {
  const { config } = useGlobalContext();

   const setupRSIIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing RSI indicators
      const rsiPatterns = ['RSI_', 'MULTI_RSI_'];
      rsiPatterns.forEach(pattern => {
        try {
          // Try to remove by pattern
          chart.removeIndicator(pattern);
        } catch (e) {
          // Ignore errors
        }
      });

      // Get enabled RSI configurations
      const enabledRSIs = config.indicators.rsi.filter(rsi => rsi.show);
      
      if (enabledRSIs.length === 0) {
        console.log('No enabled RSI configurations');
        return;
      }

      // Register multi-period RSI indicator
      const indicatorName = registerMultiPeriodRSIIndicator(config.indicators.rsi);
      
      if (!indicatorName) {
        console.error('Failed to register multi-period RSI indicator');
        return;
      }

      // Use the first RSI config for bands (common practice)
      const firstRSIConfig = enabledRSIs[0];
      
      try {
        chart.createIndicator(indicatorName, false, {
          id: 'rsi_pane',
          height: 100,
          gap: {
            top: 0.2,
            bottom: 0.2,
          },
          bands: [
            {
              value: firstRSIConfig.overbought,
              color: firstRSIConfig.overboughtLineColor,
              width: 1,
              style: 'dashed',
            },
            {
              value: firstRSIConfig.oversold,
              color: firstRSIConfig.oversoldLineColor,
              width: 1,
              style: 'dashed',
            },
          ],
        });
        
        console.log(`Created multi-period RSI indicator with ${enabledRSIs.length} lines`);
      } catch (indicatorError) {
        console.error(`Error creating RSI indicator:`, indicatorError);
      }
    } catch (error) {
      console.error('Error in RSI setup:', error);
    }
  }, [config.indicators.rsi]);

  const setupMFIIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing MFI indicators
      const mfiPatterns = ['MFI_', 'MULTI_MFI_'];
      mfiPatterns.forEach(pattern => {
        try {
          chart.removeIndicator(pattern);
        } catch (e) {
          // Ignore errors
        }
      });

      // Get enabled MFI configurations
      const enabledMFIs = config.indicators.mfi.filter(mfi => mfi.show);
      
      if (enabledMFIs.length === 0) {
        console.log('No enabled MFI configurations');
        return;
      }

      // Register multi-period MFI indicator
      const indicatorName = registerMultiPeriodMFIIndicator(config.indicators.mfi);
      
      if (!indicatorName) {
        console.error('Failed to register multi-period MFI indicator');
        return;
      }

      // Use the first MFI config for bands
      const firstMFIConfig = enabledMFIs[0];
      
      try {
        chart.createIndicator(indicatorName, false, {
          id: 'mfi_pane',
          height: 100,
          gap: {
            top: 0.2,
            bottom: 0.2,
          },
          bands: [
            {
              value: firstMFIConfig.overbought,
              color: firstMFIConfig.overboughtLineColor,
              width: 1,
              style: 'dashed',
            },
            {
              value: firstMFIConfig.oversold,
              color: firstMFIConfig.oversoldLineColor,
              width: 1,
              style: 'dashed',
            },
          ],
        });
        
        console.log(`Created multi-period MFI indicator with ${enabledMFIs.length} lines`);
      } catch (indicatorError) {
        console.error(`Error creating MFI indicator:`, indicatorError);
      }
    } catch (error) {
      console.error('Error in MFI setup:', error);
    }
  }, [config.indicators.mfi]);

  const setupKDJIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing KDJ indicators
      const kdjPatterns = ['KDJ_', 'MULTI_KDJ_'];
      kdjPatterns.forEach(pattern => {
        try {
          chart.removeIndicator(pattern);
        } catch (e) {
          // Ignore errors
        }
      });

      // Get enabled KDJ configurations
      const enabledKDJs = config.indicators.kdj.filter(kdj => kdj.show);
      
      if (enabledKDJs.length === 0) {
        console.log('No enabled KDJ configurations');
        return;
      }

      // Register multi-period KDJ indicator
      const indicatorName = registerMultiPeriodKDJIndicator(config.indicators.kdj);
      
      if (!indicatorName) {
        console.error('Failed to register multi-period KDJ indicator');
        return;
      }

      // Use the first KDJ config for bands
      const firstKDJConfig = enabledKDJs[0];
      
      try {
        chart.createIndicator(indicatorName, false, {
          id: 'kdj_pane',
          height: 100,
          gap: {
            top: 0.2,
            bottom: 0.2,
          },
          bands: [
            {
              value: firstKDJConfig.overbought,
              color: firstKDJConfig.overboughtLineColor,
              width: 1,
              style: 'dashed',
            },
            {
              value: firstKDJConfig.oversold,
              color: firstKDJConfig.oversoldLineColor,
              width: 1,
              style: 'dashed',
            },
          ],
        });
        
        console.log(`Created multi-period KDJ indicator with ${enabledKDJs.length} configurations`);
      } catch (indicatorError) {
        console.error(`Error creating KDJ indicator:`, indicatorError);
      }
    } catch (error) {
      console.error('Error in KDJ setup:', error);
    }
  }, [config.indicators.kdj]);

  const setupVolumeIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove ALL existing volume indicators
      const volumeIds = ['volume', 'VOL', 'VOLUME', 'volume_1', 'volume_2', 'CUSTOM_VOLUME'];
      volumeIds.forEach(id => {
        try {
          chart.removeIndicator(id);
        } catch (e) {
          // Ignore errors - indicator might not exist
        }
      });

      // Only setup volume if at least one volume config is enabled
      const enabledVolumes = config.indicators.volume.filter(vol => vol.show);
      
      if (enabledVolumes.length > 0) {
        const volumeConfig = enabledVolumes[0];
        
        // Register and create custom volume indicator
        const indicatorName = registerCustomVolumeIndicator(volumeConfig);
        
        try {
          // Create the custom volume indicator
          chart.createIndicator(indicatorName, false, {
            id: 'volume',
            height: 80,
            gap: {
              top: 0.1,
              bottom: 0.1,
            },
          });

          // Apply volume styles directly to the chart's volume indicator
          setTimeout(() => {
            try {
              chart.setStyles({
                indicator: {
                  volume: {
                    bar: {
                      upColor: volumeConfig.upColor,
                      downColor: volumeConfig.downColor,
                      noChangeColor: volumeConfig.upColor,
                    },
                    opacity: volumeConfig.opacity,
                  }
                }
              });
            } catch (styleError) {
              console.error('Error applying volume styles:', styleError);
            }
          }, 100);
          console.log('Custom volume indicator created successfully');
        } catch (createError) {
          console.error('Error creating custom volume indicator:', createError);
        }
      } else {
        console.log('No enabled volume configurations - volume indicator hidden');
      }
    } catch (error) {
      console.error('Error in volume indicator setup:', error);
    }
  }, [config.indicators.volume]);

  const setupMovingAverageOverlays = useCallback((chart: any) => {
    if (!chart) {
      console.warn('Chart instance not available for moving average setup');
      return;
    }

    try {
      console.log('Setting up moving average overlays...');
      
      // Clear existing overlay indicators first
      clearOverlayIndicators(chart);

      // Register indicators first and get their unique names
      const maUniqueName = registerCustomMAIndicator(config.indicators.ma);
      const emaUniqueName = registerCustomEMAIndicator(config.indicators.ema);
      const wmaUniqueName = registerCustomWMAIndicator(config.indicators.wma);
      const avlUniqueName = registerCustomAVLIndicator(config.indicators.avl);
      const bbUniqueName = registerCustomBBIndicator(config.indicators.bb);
      const vwapUniqueName = registerCustomVWAPIndicator(config.indicators.vwap);
      const sarUniqueName = registerCustomSARIndicator(config.indicators.sar);
      const trixUniqueName = registerCustomTRIXIndicator(config.indicators.trix);
      const supertrendUniqueName = registerCustomSupertrendIndicator(config.indicators.supertrend);

      // Get enabled configurations for each type
      const enabledMA = config.indicators.ma.filter(ma => ma.show);
      const enabledEMA = config.indicators.ema.filter(ema => ema.show);
      const enabledWMA = config.indicators.wma.filter(wma => wma.show);
      const enabledAVL = config.indicators.avl.filter(avl => avl.show);
      const enabledBB = config.indicators.bb.filter(bb => bb.show);
      const enabledVWAP = config.indicators.vwap.filter(vwap => vwap.show);
      const enabledSAR = config.indicators.sar.filter(sar => sar.show);
      const enabledTRIX = config.indicators.trix.filter(trix => trix.show);
      const enabledSupertrend = config.indicators.supertrend.filter(st => st.show);

      // Create overlays for enabled indicators
      if (enabledMA.length > 0 && maUniqueName) {
        try {
          chart.createIndicator(maUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created MA overlay with periods:`, enabledMA.map(ma => ma.period));
        } catch (createError) {
          console.error('Failed to create MA overlay:', createError);
        }
      }

      if (enabledEMA.length > 0 && emaUniqueName) {
        try {
          chart.createIndicator(emaUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created EMA overlay with periods:`, enabledEMA.map(ema => ema.period));
        } catch (createError) {
          console.error('Failed to create EMA overlay:', createError);
        }
      }

      if (enabledWMA.length > 0 && wmaUniqueName) {
        try {
          chart.createIndicator(wmaUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created WMA overlay with periods:`, enabledWMA.map(wma => wma.period));
        } catch (createError) {
          console.error('Failed to create WMA overlay:', createError);
        }
      }

      if (enabledBB.length > 0 && bbUniqueName) {
        try {
          chart.createIndicator(bbUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created BB overlay with periods:`, enabledBB.map(bb => bb.period));
        } catch (createError) {
          console.error('Failed to create BB overlay:', createError);
        }
      }

      // AVL overlay creation
      if (enabledAVL.length > 0 && avlUniqueName) {
        try {
          chart.createIndicator(avlUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created AVL overlay with periods:`, enabledAVL.map(avl => avl.period));
        } catch (createError) {
          console.error('Failed to create AVL overlay:', createError);
        }
      }

      if (enabledVWAP.length > 0 && vwapUniqueName) {
        try {
          chart.createIndicator(vwapUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created VWAP overlay with length:`, enabledVWAP[0].length);
        } catch (createError) {
          console.error('Failed to create VWAP overlay:', createError);
        }
      }

      if (enabledSAR.length > 0 && sarUniqueName) {
        try {
          chart.createIndicator(sarUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created SAR overlay with configs:`, enabledSAR.map(sar => `(${sar.start}, ${sar.maximum})`));
        } catch (createError) {
          console.error('Failed to create SAR overlay:', createError);
        }
      }

      if (enabledTRIX.length > 0 && trixUniqueName) {
        try {
          chart.createIndicator(trixUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created TRIX overlay with periods:`, enabledTRIX.map(trix => trix.period));
        } catch (createError) {
          console.error('Failed to create TRIX overlay:', createError);
        }
      }

      // Add SuperTrend overlay creation
      if (enabledSupertrend.length > 0 && supertrendUniqueName) {
        try {
          chart.createIndicator(supertrendUniqueName, true, { 
            id: "candle_pane"
          });
          console.log(`Created SuperTrend overlay with config: ATR=${enabledSupertrend[0].atrLength}, Factor=${enabledSupertrend[0].factor}`);
        } catch (createError) {
          console.error('Failed to create SuperTrend overlay:', createError);
        }
      }

      const totalOverlays = [enabledMA, enabledEMA, enabledWMA, enabledBB, enabledVWAP, enabledSAR, enabledTRIX, enabledSupertrend]
        .filter(arr => arr.length > 0).length;
      console.log(`Created ${totalOverlays} moving average overlays in candle pane`);

    } catch (error) {
      console.error('Critical error in moving average overlay setup:', error);
    }
  }, [
    config.indicators.ma, 
    config.indicators.ema, 
    config.indicators.wma, 
    config.indicators.avl,
    config.indicators.bb, 
    config.indicators.vwap,
    config.indicators.sar,
    config.indicators.trix,
    config.indicators.supertrend
  ]);

  const applyChartStyles = useCallback((chart: any) => {
    if (!chart) return;

    try {
      chart.setStyles({
        candle: config.chart.candle,
        grid: config.chart.grid,
        crosshair: config.chart.crosshair,
      });
    } catch (error) {
      console.error('Error applying chart styles:', error);
    }
  }, [config.chart]);

  return {
    setupRSIIndicators,
    setupMFIIndicators,
    setupKDJIndicators,
    setupVolumeIndicators,
    setupMovingAverageOverlays,
    applyChartStyles,
  };
};