/**
 * Input sanitization utility for Jam3a-2.0
 * Provides functions to sanitize user inputs to prevent XSS attacks
 */

// Sanitize text input to prevent XSS
export const sanitizeText = (input: string): string => {
  if (!input) return '';
  
  // Replace HTML special characters with their entity equivalents
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Sanitize HTML content (for rich text editors)
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a DOMParser instance
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Remove potentially dangerous elements and attributes
  const dangerousElements = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style'];
  const dangerousAttributes = ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress'];
  
  // Remove dangerous elements
  dangerousElements.forEach(tag => {
    const elements = doc.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode?.removeChild(elements[i]);
    }
  });
  
  // Remove dangerous attributes from all elements
  const allElements = doc.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    dangerousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });
    
    // Remove javascript: and data: URLs
    if (element.hasAttribute('href')) {
      const href = element.getAttribute('href') || '';
      if (href.toLowerCase().startsWith('javascript:') || href.toLowerCase().startsWith('data:')) {
        element.setAttribute('href', '#');
      }
    }
    
    if (element.hasAttribute('src')) {
      const src = element.getAttribute('src') || '';
      if (src.toLowerCase().startsWith('javascript:') || src.toLowerCase().startsWith('data:')) {
        element.removeAttribute('src');
      }
    }
  }
  
  // Get sanitized HTML
  return doc.body.innerHTML;
};

// Sanitize URL to prevent javascript: and data: URLs
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  const trimmedUrl = url.trim().toLowerCase();
  
  if (
    trimmedUrl.startsWith('javascript:') || 
    trimmedUrl.startsWith('data:') || 
    trimmedUrl.startsWith('vbscript:')
  ) {
    return '#';
  }
  
  return url;
};

// Sanitize JSON input
export const sanitizeJson = (json: string): string => {
  try {
    // Parse and stringify to ensure valid JSON
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch (e) {
    // Return empty object if invalid JSON
    return '{}';
  }
};

// Sanitize SQL input to prevent SQL injection
export const sanitizeSql = (input: string): string => {
  if (!input) return '';
  
  // Replace single quotes and other SQL injection characters
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
};

// Sanitize filename to prevent path traversal
export const sanitizeFilename = (filename: string): string => {
  if (!filename) return '';
  
  // Remove path traversal sequences and invalid characters
  return filename
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\/g, '')
    .replace(/[\/\\]/g, '')
    .replace(/[<>:"|?*]/g, '');
};

// Export default object with all functions
const sanitizer = {
  sanitizeText,
  sanitizeHtml,
  sanitizeUrl,
  sanitizeJson,
  sanitizeSql,
  sanitizeFilename
};

export default sanitizer;
