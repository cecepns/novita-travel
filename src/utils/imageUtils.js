/**
 * Image utility functions for handling image URLs
 */

const IMAGE_BASE_URL = 'https://api-inventory.isavralabel.com/novita-travel/uploads';

/**
 * Get the full image URL from a filename or relative path
 * @param {string} imagePath - The image filename or path
 * @param {string} fallback - Fallback URL if imagePath is not provided
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath, fallback = 'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg') => {
  if (!imagePath) {
    return fallback;
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads, remove the /uploads prefix
  if (imagePath.startsWith('/uploads/')) {
    const filename = imagePath.replace('/uploads/', '');
    return `${IMAGE_BASE_URL}/${filename}`;
  }
  
  // If it's just a filename, add it to the base URL
  return `${IMAGE_BASE_URL}/${imagePath}`;
};

/**
 * Get the upload URL for new images
 * @returns {string} - Upload endpoint URL
 */
export const getUploadUrl = () => {
  return 'https://api-inventory.isavralabel.com/novita-travel/api/upload';
};

/**
 * Default fallback image URL
 */
export const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg';
