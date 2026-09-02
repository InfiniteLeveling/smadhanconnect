import React from 'react';

/**
 * Clean lightweight Markdown renderer for Samadhan AI responses
 * Supports: Bold, Italic, Bullet lists, Numbered lists, Links, Code, and Paragraphs
 */
export const MarkdownMessage = ({ content, isAi = false }) => {
  if (!content) return null;

  // Function to format inline styles (bold, italic, code, links)
  const formatInline = (text) => {
    // Process markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-600 underline font-semibold hover:text-brand-800"
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Now format bold & italic across text fragments
    return parts.map((part, pIdx) => {
      if (typeof part !== 'string') return part;

      // Split by bold (**text**)
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bChunk, bIdx) => {
        if (bChunk.startsWith('**') && bChunk.endsWith('**')) {
          return (
            <strong key={`b-${pIdx}-${bIdx}`} className="font-extrabold text-slate-900">
              {bChunk.slice(2, -2)}
            </strong>
          );
        }

        // Split by italic (*text*)
        const italicParts = bChunk.split(/(\*[^*]+\*)/g);
        return italicParts.map((iChunk, iIdx) => {
          if (iChunk.startsWith('*') && iChunk.endsWith('*')) {
            return (
              <em key={`i-${pIdx}-${bIdx}-${iIdx}`} className="italic text-slate-700">
                {iChunk.slice(1, -1)}
              </em>
            );
          }

          // Split by inline code (`code`)
          const codeParts = iChunk.split(/(`[^`]+`)/g);
          return codeParts.map((cChunk, cIdx) => {
            if (cChunk.startsWith('`') && cChunk.endsWith('`')) {
              return (
                <code
                  key={`c-${pIdx}-${bIdx}-${iIdx}-${cIdx}`}
                  className="bg-slate-100 text-brand-700 px-1.5 py-0.5 rounded font-mono text-xs"
                >
                  {cChunk.slice(1, -1)}
                </code>
              );
            }
            return cChunk;
          });
        });
      });
    });
  };

  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let isNumberedList = false;

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal pl-5 my-2 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc pl-5 my-2 space-y-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
      isNumberedList = false;
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      flushList();
      return;
    }

    // Unordered Bullet List (• or - or *)
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || (trimmed.startsWith('* ') && !trimmed.endsWith('*'))) {
      const bulletText = trimmed.replace(/^[•\-*]\s+/, '');
      if (isNumberedList) flushList();
      isNumberedList = false;
      currentList.push(formatInline(bulletText));
      return;
    }

    // Numbered List (1. or 2.)
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numberMatch) {
      if (!isNumberedList && currentList.length > 0) flushList();
      isNumberedList = true;
      currentList.push(formatInline(numberMatch[2]));
      return;
    }

    // Normal paragraph line
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="leading-relaxed my-1.5">
        {formatInline(line)}
      </p>
    );
  });

  flushList();

  return (
    <div className={`space-y-1 text-sm ${isAi ? 'text-slate-800' : 'text-white'}`}>
      {elements}
    </div>
  );
};
