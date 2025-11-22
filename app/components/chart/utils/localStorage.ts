export const getStoredActiveTool = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem('active-tool') || '';
  } catch (error) {
    console.error('Error loading active tool from localStorage:', error);
    return '';
  }
};

export const saveActiveTool = (tool: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('active-tool', tool);
  } catch (error) {
    console.error('Error saving active tool to localStorage:', error);
  }
};