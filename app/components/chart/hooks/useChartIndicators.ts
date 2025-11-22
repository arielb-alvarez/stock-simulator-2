import { useCallback } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import {
  registerCustomMAIndicator,
  registerCustomEMAIndicator,
  registerCustomWMAIndicator,
  registerRSIIndicator,
  registerCustomVolumeIndicator,
  getCurrentIndicatorNames
} from '../indicators';
import { UseChartIndicatorsReturn } from '../types/chart';

export const useChartIndicators = (): UseChartIndicatorsReturn => {
  const { config } = useGlobalContext();

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
        const indicatorName = registerCustomVolumeIndicator(volumeConfig);
        
        try {
          chart.createIndicator(indicatorName, false, {
            id: 'volume',
            height: 80,
            gap: {
              top: 0.1,
              bottom: 0.1,
            },
          });

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
        } catch (createError) {
          console.error('Error creating custom volume indicator:', createError);
        }
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
      // Get current indicator names based on enabled periods
      const indicatorNames = getCurrentIndicatorNames(
        config.indicators.ma,
        config.indicators.ema,
        config.indicators.wma
      );

      // Remove all existing moving average overlays first
      const allOverlayNames = [
        ...(indicatorNames.ma ? [indicatorNames.ma] : []),
        ...(indicatorNames.ema ? [indicatorNames.ema] : []),
        ...(indicatorNames.wma ? [indicatorNames.wma] : []),
        'CUSTOM_MA', 'CUSTOM_EMA', 'CUSTOM_WMA'
      ];
      
      // Clean up existing overlays
      allOverlayNames.forEach(indicatorName => {
        try {
          chart.removeIndicator(indicatorName);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Get enabled configurations for each type
      const enabledMA = config.indicators.ma.filter(ma => ma.show);
      const enabledEMA = config.indicators.ema.filter(ema => ema.show);
      const enabledWMA = config.indicators.wma.filter(wma => wma.show);

      // Create overlays for enabled indicators
      if (enabledMA.length > 0 && indicatorNames.ma) {
        try {
          chart.createIndicator(indicatorNames.ma, true, { id: "candle_pane" });
        } catch (createError) {
          console.error('❌ Failed to create MA overlay:', createError);
        }
      }

      if (enabledEMA.length > 0 && indicatorNames.ema) {
        try {
          chart.createIndicator(indicatorNames.ema, true, { id: "candle_pane" });
        } catch (createError) {
          console.error('❌ Failed to create EMA overlay:', createError);
        }
      }

      if (enabledWMA.length > 0 && indicatorNames.wma) {
        try {
          chart.createIndicator(indicatorNames.wma, true, { id: "candle_pane" });
        } catch (createError) {
          console.error('❌ Failed to create WMA overlay:', createError);
        }
      }

    } catch (error) {
      console.error('💥 Critical error in moving average overlay setup:', error);
    }
  }, [config.indicators.ma, config.indicators.ema, config.indicators.wma]);

  return {
    setupRSIIndicators,
    setupVolumeIndicators,
    setupMovingAverageOverlays,
    applyChartStyles
  };
};