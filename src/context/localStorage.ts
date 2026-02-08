// context/localStorage.ts
import { GlobalConfig, VolumeConfig } from './types';
import { defaultConfig } from './defaultConfig2';

export const STORAGE_KEY = 'kline-chart-config';
export const CONFIG_VERSION = '3.0'; // Incremented version for new structure

// Define type for stored config with version
interface StoredConfig {
  version: string;
  config: GlobalConfig;
}

// Migration utilities
const migrateConfig = (parsed: any): GlobalConfig => {
  // If it's already the current version, return as-is
  if (parsed.version === CONFIG_VERSION && parsed.config) {
    return parsed.config;
  }

  // Version 1.0 migration (if needed)
  if (!parsed.version || parsed.version === '1.0') {
    console.log('Migrating from version 1.0');
    return migrateFromV1(parsed);
  }

  // Version 2.0 migration
  if (parsed.version === '2.0') {
    console.log('Migrating from version 2.0');
    return migrateFromV2(parsed.config || parsed);
  }

  // If unknown version, return defaults
  console.warn(`Unknown config version: ${parsed.version}, returning defaults`);
  return defaultConfig;
};

const migrateFromV1 = (oldConfig: any): GlobalConfig => {
  // Create a deep copy of default config
  const migrated = JSON.parse(JSON.stringify(defaultConfig));
  
  // Try to preserve as much user data as possible
  if (oldConfig.chartType) migrated.chartType = oldConfig.chartType;
  if (oldConfig.symbol) migrated.symbol = oldConfig.symbol;
  if (oldConfig.interval) migrated.interval = oldConfig.interval;
  if (oldConfig.limit) migrated.limit = oldConfig.limit;
  
  // Merge chart styles if they exist
  if (oldConfig.chart && typeof oldConfig.chart === 'object') {
    migrated.chart = {
      ...migrated.chart,
      ...oldConfig.chart
    };
  }
  
  // Handle indicators - only merge if they have the expected structure
  if (oldConfig.indicators && typeof oldConfig.indicators === 'object') {
    Object.keys(migrated.indicators).forEach(key => {
      const typedKey = key as keyof typeof migrated.indicators;
      
      if (oldConfig.indicators[typedKey] && Array.isArray(oldConfig.indicators[typedKey])) {
        // For each indicator in default config, try to find matching one by ID
        migrated.indicators[typedKey] = migrated.indicators[typedKey].map((defaultItem: any, index: number) => {
          const oldItem = oldConfig.indicators[typedKey][index];
          if (oldItem && typeof oldItem === 'object') {
            return {
              ...defaultItem,
              ...oldItem,
              // Ensure required fields
              id: oldItem.id || defaultItem.id,
              show: oldItem.show !== undefined ? oldItem.show : defaultItem.show,
              name: oldItem.name || defaultItem.name
            };
          }
          return defaultItem;
        });
      }
    });
  }
  
  return migrated;
};

const migrateFromV2 = (oldConfig: any): GlobalConfig => {
  // Version 2.0 already had volume array, but let's ensure it's properly migrated
  const migrated = JSON.parse(JSON.stringify(oldConfig));
  
  // Ensure all indicators exist and have proper structure
  const defaultIndicators = defaultConfig.indicators;
  
  // For each indicator type, ensure it matches the default structure
  (Object.keys(defaultIndicators) as Array<keyof typeof defaultIndicators>).forEach(key => {
    if (!migrated.indicators[key] || !Array.isArray(migrated.indicators[key])) {
      // Copy default if missing
      migrated.indicators[key] = JSON.parse(JSON.stringify(defaultIndicators[key]));
    } else {
      // Merge existing with defaults
      migrated.indicators[key] = defaultIndicators[key].map((defaultItem: any, index: number) => {
        const existingItem = migrated.indicators[key][index];
        if (existingItem && typeof existingItem === 'object') {
          return {
            ...defaultItem,
            ...existingItem,
            // Don't override ID or name if they exist
            id: existingItem.id || defaultItem.id,
            name: existingItem.name || defaultItem.name
          };
        }
        return defaultItem;
      });
    }
  });
  
  return migrated;
};

// Enhanced volume migration
export const migrateVolumeConfig = (volumeConfig: any): VolumeConfig => {
  // If it already has the new structure with maLines array, return it
  if (volumeConfig.maLines && Array.isArray(volumeConfig.maLines)) {
    return volumeConfig;
  }
  
  // Create default volume config
  const defaultVolume = defaultConfig.indicators.volume[0];
  
  // Migrate from old structure to new structure
  const migrated: VolumeConfig = {
    id: volumeConfig.id || defaultVolume.id,
    show: volumeConfig.show !== undefined ? volumeConfig.show : defaultVolume.show,
    upColor: volumeConfig.upColor || defaultVolume.upColor,
    downColor: volumeConfig.downColor || defaultVolume.downColor,
    opacity: volumeConfig.opacity !== undefined ? volumeConfig.opacity : defaultVolume.opacity,
    name: volumeConfig.name || defaultVolume.name,
    maLines: defaultVolume.maLines.map(ma => ({ ...ma })), // Copy default MA lines
    maPeriod: undefined // Old property, will be ignored
  };
  
  // If old config had single MA line, migrate it to the first MA line
  if (volumeConfig.showMA !== undefined) {
    migrated.maLines[0].show = volumeConfig.showMA;
  }
  if (volumeConfig.maPeriod !== undefined) {
    migrated.maLines[0].period = volumeConfig.maPeriod;
  }
  if (volumeConfig.maColor) {
    migrated.maLines[0].color = volumeConfig.maColor;
  }
  if (volumeConfig.maLineSize !== undefined) {
    migrated.maLines[0].lineSize = volumeConfig.maLineSize;
  }
  
  return migrated;
};

// Validation and sanitization
const validateConfig = (config: any): config is GlobalConfig => {
  if (!config || typeof config !== 'object') return false;
  
  // Check required top-level properties
  const requiredProps = ['chartType', 'symbol', 'interval', 'chart', 'indicators'];
  if (!requiredProps.every(prop => prop in config)) return false;
  
  // Check indicators structure
  if (!config.indicators || typeof config.indicators !== 'object') return false;
  
  const requiredIndicators = ['rsi', 'mfi', 'volume', 'ma', 'ema', 'wma', 'bb'];
  if (!requiredIndicators.every(indicator => indicator in config.indicators)) return false;
  
  // Ensure all indicator arrays exist and are arrays
  const indicatorKeys = Object.keys(defaultConfig.indicators);
  return indicatorKeys.every(key => 
    Array.isArray(config.indicators[key]) && 
    config.indicators[key].length > 0
  );
};

// Recursive cleanup of undefined properties
const removeUndefinedProperties = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj
      .map(item => removeUndefinedProperties(item))
      .filter(item => item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      const value = removeUndefinedProperties(obj[key]);
      if (value !== undefined) {
        cleaned[key] = value;
      }
    });
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  
  return obj;
};

// Safe merge with defaults
export const mergeWithDefaults = (config: any): GlobalConfig => {
  if (!config || typeof config !== 'object') {
    return JSON.parse(JSON.stringify(defaultConfig));
  }
  
  // Start with a deep copy of defaults
  const merged = JSON.parse(JSON.stringify(defaultConfig));
  
  // Merge top-level properties
  const topLevelProps = ['chartType', 'symbol', 'interval', 'limit', 'series'];
  topLevelProps.forEach(prop => {
    if (prop in config && config[prop] !== undefined) {
      (merged as any)[prop] = config[prop];
    }
  });
  
  // Deep merge chart config
  if (config.chart && typeof config.chart === 'object') {
    merged.chart = deepMerge(merged.chart, config.chart);
  }
  
  // Handle indicators - ensure each one has proper structure
  const indicatorTypes = Object.keys(defaultConfig.indicators) as Array<keyof typeof defaultConfig.indicators>;
  
  indicatorTypes.forEach(type => {
    if (Array.isArray(config.indicators?.[type])) {
      const configArray = config.indicators[type];
      const defaultArray = merged.indicators[type];
      
      merged.indicators[type] = defaultArray.map((defaultItem: any, index: number) => {
        const configItem = configArray[index];
        
        if (configItem && typeof configItem === 'object') {
          // Special handling for volume migration
          if (type === 'volume') {
            return migrateVolumeConfig(configItem);
          }
          
          // For other indicators, merge with defaults
          return {
            ...defaultItem,
            ...configItem,
            // Ensure required properties
            id: configItem.id || defaultItem.id,
            name: configItem.name || defaultItem.name,
            show: configItem.show !== undefined ? configItem.show : defaultItem.show
          };
        }
        
        return defaultItem;
      });
    }
  });
  
  return merged;
};

// Deep merge helper
const deepMerge = (target: any, source: any): any => {
  if (source === null || source === undefined) return target;
  
  if (Array.isArray(source)) {
    // For arrays, we'll just return the source if provided
    return source.map((item, index) => {
      if (index < target.length && typeof item === 'object' && item !== null) {
        return deepMerge(target[index], item);
      }
      return item;
    });
  }
  
  if (typeof source === 'object' && typeof target === 'object') {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      if (source[key] !== undefined) {
        if (key in target && typeof source[key] === 'object' && source[key] !== null) {
          result[key] = deepMerge(target[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    });
    
    return result;
  }
  
  return source !== undefined ? source : target;
};

// Main storage functions
export const loadConfigFromStorage = (): GlobalConfig => {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(defaultConfig));
  }
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      console.log('No stored config found, using defaults');
      return JSON.parse(JSON.stringify(defaultConfig));
    }
    
    const parsed = JSON.parse(stored);
    
    // Handle different storage formats
    let loadedConfig: GlobalConfig;
    
    if (parsed.version) {
      // Versioned config - apply migrations
      loadedConfig = migrateConfig(parsed);
    } else if (parsed.config) {
      // Has config property but no version
      loadedConfig = migrateFromV2(parsed.config);
    } else {
      // Old format without version or config property
      loadedConfig = migrateFromV1(parsed);
    }
    
    // Validate and merge with defaults for safety
    const validatedConfig = mergeWithDefaults(loadedConfig);
    
    // Final validation
    if (!validateConfig(validatedConfig)) {
      console.warn('Config validation failed, using defaults');
      return JSON.parse(JSON.stringify(defaultConfig));
    }
    
    return validatedConfig;
    
  } catch (error) {
    console.error('Error loading config from storage:', error);
    return JSON.parse(JSON.stringify(defaultConfig));
  }
};

export const saveConfigToStorage = (config: GlobalConfig): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Clean the config before saving
    const cleanedConfig = removeUndefinedProperties(config);
    
    // Create storage object with version
    const storedConfig: StoredConfig = {
      version: CONFIG_VERSION,
      config: cleanedConfig
    };
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedConfig));
    
  } catch (error) {
    console.error('Error saving config to storage:', error);
  }
};

export const resetStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log('Storage reset successfully');
  } catch (error) {
    console.error('Error resetting storage:', error);
  }
};

// Debug utility (optional)
export const debugStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    console.log('Current storage:', stored ? JSON.parse(stored) : 'Empty');
  } catch (error) {
    console.error('Debug error:', error);
  }
};