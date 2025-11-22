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
      console.log('🎨 Chart styles applied');
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
      
      console.log('🔄 Removing RSI indicators:', allRSINames);
      allRSINames.forEach(indicatorName => {
        try {
          chart.removeIndicator(indicatorName);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Add visible RSI indicators with updated styles
      const enabledRSIs = config.indicators.rsi.filter(rsiConfig => rsiConfig.show);
      console.log('📊 Setting up RSI indicators:', enabledRSIs.length);
      
      enabledRSIs.forEach((rsiConfig, index) => {
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
          console.log(`✅ Created RSI indicator: ${indicatorName}`);
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
      console.log('🔄 Removing volume indicators:', volumeIds);
      
      volumeIds.forEach(id => {
        try {
          chart.removeIndicator(id);
        } catch (e) {
          // Ignore errors - indicator might not exist
        }
      });

      // Only setup volume if at least one volume config is enabled
      const enabledVolumes = config.indicators.volume.filter(vol => vol.show);
      console.log('📊 Setting up volume indicators:', enabledVolumes.length);
      
      if (enabledVolumes.length > 0) {
        const volumeConfig = enabledVolumes[0];
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
              console.log('✅ Volume styles applied');
            } catch (styleError) {
              console.error('Error applying volume styles:', styleError);
            }
          }, 100);
          console.log(`✅ Created volume indicator: ${indicatorName}`);
        } catch (createError) {
          console.error('Error creating custom volume indicator:', createError);
        }
      } else {
        console.log('📊 No volume indicators to setup');
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
      // Get fixed indicator names
      const indicatorNames = getCurrentIndicatorNames();

      // Remove all existing moving average overlays first
      const allOverlayNames = [
        indicatorNames.ma,
        indicatorNames.ema,
        indicatorNames.wma,
        'CUSTOM_MA', 'CUSTOM_EMA', 'CUSTOM_WMA'
      ];
      
      console.log('🔄 Removing moving average overlays:', allOverlayNames);
      
      // Clean up existing overlays
      allOverlayNames.forEach(indicatorName => {
        try {
          chart.removeIndicator(indicatorName);
          console.log(`✅ Removed overlay: ${indicatorName}`);
        } catch (e) {
          // Ignore removal errors
        }
      });

      // Get enabled configurations for each type
      const enabledMA = config.indicators.ma.filter(ma => ma.show);
      const enabledEMA = config.indicators.ema.filter(ema => ema.show);
      const enabledWMA = config.indicators.wma.filter(wma => wma.show);

      console.log('📊 MA configurations:', {
        ma: enabledMA.map(m => m.period),
        ema: enabledEMA.map(e => e.period),
        wma: enabledWMA.map(w => w.period)
      });

      // Re-register indicators with current config (force update)
      registerCustomMAIndicator(config.indicators.ma);
      registerCustomEMAIndicator(config.indicators.ema);
      registerCustomWMAIndicator(config.indicators.wma);

      // Create overlays for enabled indicators
      if (enabledMA.length > 0) {
        try {
          chart.createIndicator(indicatorNames.ma, true, { 
            id: "candle_pane"
          });
          console.log(`✅ Created MA overlay with periods:`, enabledMA.map(ma => ma.period));
        } catch (createError) {
          console.error('❌ Failed to create MA overlay:', createError);
        }
      }

      if (enabledEMA.length > 0) {
        try {
          chart.createIndicator(indicatorNames.ema, true, { 
            id: "candle_pane"
          });
          console.log(`✅ Created EMA overlay with periods:`, enabledEMA.map(ema => ema.period));
        } catch (createError) {
          console.error('❌ Failed to create EMA overlay:', createError);
        }
      }

      if (enabledWMA.length > 0) {
        try {
          chart.createIndicator(indicatorNames.wma, true, { 
            id: "candle_pane"
          });
          console.log(`✅ Created WMA overlay with periods:`, enabledWMA.map(wma => wma.period));
        } catch (createError) {
          console.error('❌ Failed to create WMA overlay:', createError);
        }
      }

      const totalOverlays = [enabledMA, enabledEMA, enabledWMA]
        .filter(arr => arr.length > 0).length;
      console.log(`✅ Created ${totalOverlays} moving average overlays in candle pane`);

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