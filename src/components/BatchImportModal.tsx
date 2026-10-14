import React, { useState } from 'react';
import { X, Sparkles, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ParsedStory {
  title: string;
  text: string;
  language: 'en' | 'es';
  recommendedVoice: string;
}

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStories: (stories: ParsedStory[]) => void;
  currentLanguage: 'en' | 'es';
}

export const BatchImportModal: React.FC<BatchImportModalProps> = ({
  isOpen,
  onClose,
  onImportStories,
  currentLanguage,
}) => {
  const [rawText, setRawText] = useState<string>('');
  const [importLanguage, setImportLanguage] = useState<'en' | 'es'>(currentLanguage);
  const [previewStories, setPreviewStories] = useState<ParsedStory[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Parser: handles "Title: ... / text / ---" or markdown "## Title ... / ---" or simple paragraphs
  const parseRawInput = (text: string, lang: 'en' | 'es'): ParsedStory[] => {
    if (!text.trim()) return [];

    // Check if JSON format
    if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          return json
            .filter((item) => item.text || item.content)
            .map((item, idx) => ({
              title: item.title || `${lang === 'es' ? 'Cuento' : 'Story'} ${idx + 1}`,
              text: (item.text || item.content || '').trim(),
              language: item.language || lang,
              recommendedVoice: item.voice || (lang === 'es' ? 'Kore' : 'Aoede'),
            }));
        }
      } catch (e) {
        // Fall back to text parsing
      }
    }

    // Split by separator '---' or '===', or double newline with "Title:" or "##"
    const rawBlocks = text
      .split(/(?:\r?\n){2,}(?:---+|===+)(?:\r?\n){1,}|(?:\r?\n)(?:---+|===+)(?:\r?\n)/)
      .map((b) => b.trim())
      .filter(Boolean);

    const results: ParsedStory[] = [];

    for (let i = 0; i < rawBlocks.length; i++) {
      const block = rawBlocks[i];
      const lines = block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      let storyTitle = '';
      let storyContent = '';

      // Check for explicit "Title: ..." or "## ..."
      const firstLine = lines[0];
      const titleMatch = firstLine.match(/^(?:title|t[íi]tulo)\s*:\s*(.+)$/i);
      const mdTitleMatch = firstLine.match(/^#{1,3}\s*(.+)$/);

      if (titleMatch) {
        storyTitle = titleMatch[1].trim();
        storyContent = lines.slice(1).join('\n\n');
      } else if (mdTitleMatch) {
        storyTitle = mdTitleMatch[1].trim();
        storyContent = lines.slice(1).join('\n\n');
      } else {
        // If first line is short (< 60 chars), treat as title
        if (firstLine.length < 60 && lines.length > 1) {
          storyTitle = firstLine.replace(/^[0-9]+[.)]\s*/, '').trim();
          storyContent = lines.slice(1).join('\n\n');
        } else {
          storyTitle = `${lang === 'es' ? 'Cuento' : 'Bedtime Story'} ${i + 1}`;
          storyContent = lines.join('\n\n');
        }
      }

      if (storyContent.trim()) {
        results.push({
          title: storyTitle || `Story ${i + 1}`,
          text: storyContent.trim(),
          language: lang,
          recommendedVoice: lang === 'es' ? 'Kore' : 'Aoede',
        });
      }
    }

    return results;
  };

  const handleTextChange = (val: string) => {
    setRawText(val);
    setError(null);
    const parsed = parseRawInput(val, importLanguage);
    setPreviewStories(parsed);
  };

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setImportLanguage(lang);
    const parsed = parseRawInput(rawText, lang);
    setPreviewStories(parsed);
  };

  const handleLoadSampleBatch = () => {
    const sampleBatchEn = `Title: The Sleepy Firefly
Every evening in the quiet mossy valley, a little firefly named Felix watched the moon rise. While other bugs zoomed and buzzed, Felix loved to gently blink his tiny golden light like a warm star. "Sleep tight, little forest," Felix whispered, tucking beneath a sweet clover leaf.

---

Title: The Hedgehog's Cozy Teacup
Pip the hedgehog discovered an old porcelain teacup under a wild rosebush. It had painted blue flowers and was just the right size for a hedgehog bed. He filled it with dry dandelion fluff, curled his little paws, and took a peaceful afternoon nap while the gentle autumn rain tapped on the leaves.

---

Title: The Owl Who Counted Stars
Barnaby the wise little barn owl sat atop the tallest birch tree with a mug of warm chamomile tea. "One, two, three," he hooted softly as the stars peeked through the velvet twilight. When he counted all the way to forty, he yawned, closed his amber eyes, and drifted into sweet dreams.`;

    const sampleBatchEs = `Título: La Luciérnaga Somnolienta
Cada noche en el valle de musgo, una pequeña luciérnaga llamada Félix veía salir la luna. Mientras otros insectos revoloteaban de prisa, Félix prefería encender su lucecita dorada con calma, como una estrella en la hierba. "Que descanses, bosque lindo", susurraba antes de arroparse en una hoja de trébol.

---

Título: La Tacita del Erizo
Pipo el erizo encontró una tacita de porcelana blanca debajo de un rosal silvestre. Tenía flores azules y era del tamaño perfecto para una camita. La llenó con suave pelusa de diente de león, acomodó sus patitas y se quedó profundamente dormido mientras la lluvia de otoño acariciaba el tejado de hojas.

---

Título: El Búho que Contaba Estrellas
Barnaby, el búho de plumas suaves, tomaba té de manzanilla en lo alto del abedul. "Una, dos, tres", canturreaba despacio a medida que las estrellas encendían su brillo en el cielo oscuro. Al llegar a la estrella cuarenta, bostezó con ternura, cerró sus ojitos dorados y soñó con la luna llena.`;

    const textToLoad = importLanguage === 'es' ? sampleBatchEs : sampleBatchEn;
    handleTextChange(textToLoad);
  };

  const handleConfirmImport = () => {
    if (previewStories.length === 0) {
      setError(
        importLanguage === 'es'
          ? 'Por favor escribe o pega al menos un cuento para importar.'
          : 'Please provide at least one story with title and text.'
      );
      return;
    }

    onImportStories(previewStories);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-[#FDFBF7] dark:bg-[#1C1A17] text-stone-900 dark:text-stone-100 rounded-2xl shadow-xl border border-amber-900/10 dark:border-amber-100/10 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-amber-900/10 dark:border-amber-100/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-800 dark:text-amber-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                {importLanguage === 'es' ? 'Importar Lista de Cuentos' : 'Import Stories List'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {importLanguage === 'es'
                  ? 'Pega varios cuentos separados por "---" para agregarlos a tu biblioteca'
                  : 'Paste multiple stories separated by "---" to batch generate narration'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
          
          {/* Controls bar: Language + Quick Sample Template */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-600 dark:text-stone-400">
                {importLanguage === 'es' ? 'Idioma de la lista:' : 'List language:'}
              </span>
              <div className="flex items-center p-0.5 rounded-lg bg-stone-200/60 dark:bg-stone-800 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    importLanguage === 'en'
                      ? 'bg-white dark:bg-stone-700 font-semibold shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('es')}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    importLanguage === 'es'
                      ? 'bg-white dark:bg-stone-700 font-semibold shadow-xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Español
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleBatch}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{importLanguage === 'es' ? 'Cargar Ejemplo de 3 Cuentos' : 'Paste Sample 3 Stories'}</span>
            </button>
          </div>

          {/* Textarea Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {importLanguage === 'es'
                ? 'Pega tus cuentos aquí (usa "Title:" y separa con "---"):'
                : 'Paste your stories list here (use "Title:" and separate with "---"): '}
            </label>
            <textarea
              rows={9}
              value={rawText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`Title: The Sleepy Cloud\nOnce upon a time high in the sky...\n\n---\n\nTitle: Barnaby the Bear\nBarnaby was a cozy bear who loved muffins...`}
              className="w-full p-3.5 text-xs font-mono rounded-xl bg-white/70 dark:bg-stone-900/60 border border-amber-900/10 dark:border-amber-100/10 focus:outline-none focus:border-amber-600 leading-relaxed text-stone-800 dark:text-stone-200 resize-y"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Real-time Parsed Preview */}
          {previewStories.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {importLanguage === 'es'
                    ? `${previewStories.length} cuentos detectados listos para importar:`
                    : `${previewStories.length} stories detected ready to import:`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {previewStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs"
                  >
                    <div className="font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                      {idx + 1}. {story.title}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 italic">
                      "{story.text.slice(0, 100)}..."
                    </div>
                    <div className="mt-2 text-[10px] text-stone-400 font-mono">
                      {story.text.split(/\s+/).length} {importLanguage === 'es' ? 'palabras' : 'words'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-amber-900/10 dark:border-amber-100/10 flex items-center justify-between bg-stone-100/50 dark:bg-stone-900/50">
          <span className="text-xs text-stone-500">
            {previewStories.length > 0
              ? `${previewStories.length} ${importLanguage === 'es' ? 'cuentos listos' : 'stories ready'}`
              : ''}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              {importLanguage === 'es' ? 'Cancelar' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={previewStories.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {importLanguage === 'es'
                ? `Importar ${previewStories.length} Cuentos a la Biblioteca`
                : `Import ${previewStories.length} Stories to Library`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
