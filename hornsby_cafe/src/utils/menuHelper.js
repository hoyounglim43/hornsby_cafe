// src/utils/menuHelper.js

/**
 * Processes the menu with modular options and returns a fully expanded menu
 * with all customization options resolved
 * 
 * @param {Object} menuData - The modular menu data from menu.json
 * @returns {Array} - Fully expanded menu items with resolved customization options
 */
export function processMenu(menuData) {
  const { customizationOptions, menuItems } = menuData;
  
  return menuItems.map(item => {
    // Create a copy of the item to work with
    const processedItem = { ...item };
    
    // Replace customizationOptionsRefs with actual customization options
    if (item.customizationOptionsRefs && Array.isArray(item.customizationOptionsRefs)) {
      // Create a new array for the actual customization options
      processedItem.customizationOptions = item.customizationOptionsRefs.map(ref => {
        // Parse the reference path (e.g., "size.standard" => ["size", "standard"])
        const [category, type] = ref.split('.');
        
        // Get the referenced option
        return customizationOptions[category][type];
      });
      
      // Remove the references as they're no longer needed
      delete processedItem.customizationOptionsRefs;
    }
    
    return processedItem;
  });
}

// Example usage:
// import menuData from './menu.json';
// const processedMenu = processMenu(menuData);