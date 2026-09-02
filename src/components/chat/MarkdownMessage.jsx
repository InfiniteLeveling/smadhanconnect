import React from 'react';

/**
 * Modern Clean Markdown Renderer for Samadhan AI Responses
 * Formats: Bold, Italic, Code, Links, Bullet lists, Numbered step lists, and Highlight callouts
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
          className="text-brand-600 underline font-semibold hover:text-brand-800 transition-colors"
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Format bold & italic across text fragments
    return parts.map((part, pIdx) => {
      if (typeof part !== 'string') return part;

      // Split by bold (**text**)
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return boldParts.map((bChunk, bIdx) => {
        if (bChunk.startsWith('**') && bChunk.endsWith('**')) {
          return (
            <strong 
              key={`b-${pIdx}-${bIdx}`} 
              className={`font-bold ${isAi ? 'text-slate-900' : 'text-white'}`}
            >
              {bChunk.slice(2, -2)}
            </strong>
          );
        }

        // Split by italic (*text*)
        const italicParts = bChunk.split(/(\*[^*]+\*)/g);
        return italicParts.map((iChunk, iIdx) => {
          if (iChunk.startsWith('*') && iChunk.endsWith('*')) {
            return (
              <em 
                key={`i-${pIdx}-${bIdx}-${iIdx}`} 
                className={`italic ${isAi ? 'text-slate-600' : 'text-slate-100'}`}
              >
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
                  className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                    isAi ? 'bg-slate-100 text-brand-700 border border-slate-200/70' : 'bg-white/20 text-white'
                  }`}
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
          <ol key={`ol-${elements.length}`} className="my-2 space-y-1.5 pl-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed text-xs sm:text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5 ${
                  isAi ? 'bg-emerald-100 text-emerald-800' : 'bg-white/20 text-white'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1">{item}</div>
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-2 space-y-1.5 pl-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed text-xs sm:text-sm">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                  isAi ? 'bg-emerald-600' : 'bg-white'
                }`} />
                <div className="flex-1">{item}</div>
              </li>
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

    // Blockquote or Callout (> text)
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <div 
          key={`quote-${lineIdx}`}
          className={`p-3 my-2 rounded-xl border-l-4 text-xs sm:text-sm leading-relaxed ${
            isAi 
              ? 'bg-brand-50/70 border-brand-600 text-brand-900' 
              : 'bg-white/10 border-white text-white'
          }`}
        >
          {formatInline(trimmed.replace(/^>\s+/, ''))}
        </div>
      );
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
      <p key={`p-${lineIdx}`} className="leading-relaxed my-1 text-xs sm:text-sm">
        {formatInline(line)}
      </p>
    );
  });

  flushList();

  return (
    <div className={`space-y-1.5 ${isAi ? 'text-slate-800' : 'text-white'}`}>
      {elements}
    </div>
  );
};
