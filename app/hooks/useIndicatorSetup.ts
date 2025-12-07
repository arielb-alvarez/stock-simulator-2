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
  registerCustomSARIndicator ,
  registerRSIIndicator,
  registerCustomVolumeIndicator,
  clearOverlayIndicators
} from '@/utils/indicatorRegistry';

export const useIndicatorSetup = () => {
  const { config } = useGlobalContext();

  const setupRSIIndicators = useCallback((chart: any) => {
    if (!chart) return;

    try {
      // Remove all existing RSI indicators first
      const allRSINames = config.indicators.rsi.map(rsiConfig => 
        `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`
      );
      
      allRSINames.forEach(indicatorName => {
        try {
          chart.removeIndicator(indicatorName);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Add visible RSI indicators with updated styles
      config.indicators.rsi
        .filter(rsiConfig => rsiConfig.show)
        .forEach((rsiConfig, index) => {
          const indicatorName = `RSI_${rsiConfig.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
          
          try {
            chart.createIndicator(indicatorName, false, {
              id: indicatorName,
              height: 100,
              gap: {
                top: 0.2,
                bottom: 0.2,
              },
              styles: {
                rsi: {
                  color: rsiConfig.lineColor,
                  size: rsiConfig.lineSize,
                },
                marginTop: 10 * index,
              },
              bands: [
                {
                  value: rsiConfig.overbought,
                  color: rsiConfig.overboughtLineColor,
                  width: 1,
                  style: 'dashed',
                },
                {
                  value: rsiConfig.oversold,
                  color: rsiConfig.oversoldLineColor,
                  width: 1,
                  style: 'dashed',
                },
              ],
            });
          } catch (indicatorError) {
            console.error(`Error creating RSI indicator ${indicatorName}:`, indicatorError);
          }
        });
    } catch (error) {
      console.error('Error in RSI setup:', error);
    }
  }, [config.indicators.rsi]);

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

      // Get enabled configurations for each type
      const enabledMA = config.indicators.ma.filter(ma => ma.show);
      const enabledEMA = config.indicators.ema.filter(ema => ema.show);
      const enabledWMA = config.indicators.wma.filter(wma => wma.show);
      const enabledAVL = config.indicators.avl.filter(avl => avl.show);
      const enabledBB = config.indicators.bb.filter(bb => bb.show);
      const enabledVWAP = config.indicators.vwap.filter(vwap => vwap.show);
      const enabledSAR = config.indicators.sar.filter(sar => sar.show);

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

      const totalOverlays = [enabledMA, enabledEMA, enabledWMA, enabledBB, enabledVWAP, enabledSAR]
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
    config.indicators.sar
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
    setupVolumeIndicators,
    setupMovingAverageOverlays,
    applyChartStyles,
  };
};