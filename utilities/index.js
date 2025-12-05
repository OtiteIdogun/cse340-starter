/**
 * Utilities Module
 * Helper functions for navigation and common operations
 */

const invModel = require("../models/inventory-model");

// ============================================================================
// Navigation Builder
// ============================================================================

const Util = {}

/**
 * Constructs the navigation HTML unordered list
 * Retrieves all vehicle classifications and builds a dropdown menu
 * @returns {Promise<string>} HTML string of the navigation list
 */
const getNav = async () => {
  try {
    const classifications = await invModel.getClassifications();

    // Start building the navigation list
    let navHtml = "<ul>";
    navHtml += '<li><a href="/" title="Home page">Home</a></li>';

    // Add each classification as a navigation item
    classifications.forEach((classification) => {
      const { classification_id, classification_name } = classification;
      navHtml += "<li>";
      navHtml +=
        `<a href="/inv/type/${classification_id}" title="See our inventory of ${classification_name} vehicles">` +
        classification_name +
        "</a>";
      navHtml += "</li>";
    });

    navHtml += "</ul>";
    return navHtml;
  } catch (error) {
    console.error("Error building navigation:", error);
    throw error;
  }
};

Util.getNav = getNav;

// ============================================================================
// Exports
// ============================================================================
module.exports = Util
