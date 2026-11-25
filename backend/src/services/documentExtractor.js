import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractTextFromFile(fileBuffer, originalFilename, mimeType) {
  const extension = originalFilename.split('.').pop().toLowerCase();

  try {
    if (extension === 'pdf' || mimeType === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      return cleanText(data.text);
    } 
    
    if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return cleanText(result.value);
    } 
    
    if (extension === 'txt' || mimeType.startsWith('text/')) {
      return cleanText(fileBuffer.toString('utf-8'));
    }

    // Default fallback: string conversion
    return cleanText(fileBuffer.toString('utf-8'));
  } catch (error) {
    console.error(`Error extracting text from ${originalFilename}:`, error);
    throw new Error(`Failed to extract text from ${originalFilename}: ${error.message}`);
  }
}

export function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}

export function chunkText(text, maxChunkSize = 2500, overlap = 200) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentSize = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentSize += word.length + 1;

    if (currentSize >= maxChunkSize) {
      chunks.push(currentChunk.join(' '));
      // Overlap by taking last few words
      const overlapWords = currentChunk.slice(-Math.min(30, currentChunk.length));
      currentChunk = [...overlapWords];
      currentSize = currentChunk.reduce((acc, w) => acc + w.length + 1, 0);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}
