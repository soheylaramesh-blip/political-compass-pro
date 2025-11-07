import React, { useState } from 'react';
import { Results } from '../types';
import Card from './common/Card';
import { useTranslation } from '../hooks/useTranslation';

// Define the global objects from the CDNs
declare const html2canvas: any;
declare const jspdf: { jsPDF: new (options: any) => any };

interface ExportShareProps {
  results: Results;
  resultsRef: React.RefObject<HTMLDivElement>;
}

const ExportShare: React.FC<ExportShareProps> = ({ results, resultsRef }) => {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  const generateTextSummary = (): string => {
    return `
${t('exportTitle', { level: results.level })}
------------------------------------------------
${t('exportQuadrant')}: ${results.analysis.quadrantName}

${t('exportScores')}:
- ${t('economicAxis')}: ${results.scores.economic.toFixed(2)} (${results.scores.economic > 0 ? t('right') : t('left')})
- ${t('socialAxis')}: ${results.scores.social.toFixed(2)} (${results.scores.social > 0 ? t('authoritarian') : t('libertarian')})

${t('exportDescription')}:
${results.analysis.quadrantDescription}

${t('exportBehavioral')}:
${results.analysis.behavioralAnalysis}
    `;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleExportPNG = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { 
      backgroundColor: null,
      useCORS: true,
    });
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'political-compass-results.png';
    a.click();
  };
  
  const handleExportPDF = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { 
      backgroundColor: null,
      useCORS: true,
      windowWidth: 1200 // Use a fixed width for consistent PDF layout
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jspdf.jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('political-compass-results.pdf');
  };

  const handleExportHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Political Compass Results</title>
          <style>
              body { font-family: sans-serif; line-height: 1.6; padding: 20px; }
              h1 { color: #333; }
              h2 { color: #555; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              p { color: #666; }
              .container { max-width: 800px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>${t('exportTitle', { level: results.level })}</h1>
              <h2>${t('exportQuadrant')}: ${results.analysis.quadrantName}</h2>
              <h3>${t('exportScores')}:</h3>
              <ul>
                  <li>${t('economicAxis')}: ${results.scores.economic.toFixed(2)}</li>
                  <li>${t('socialAxis')}: ${results.scores.social.toFixed(2)}</li>
              </ul>
              <h3>${t('exportDescription')}:</h3>
              <p>${results.analysis.quadrantDescription}</p>
              <h3>${t('exportBehavioral')}:</h3>
              <p>${results.analysis.behavioralAnalysis}</p>
          </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadBlob(blob, 'political-compass-results.html');
  };
  
  const handleExportDOCX = () => {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Political Compass Results</title></head>
        <body>
            <h1>${t('exportTitle', { level: results.level })}</h1>
            <h2>${t('exportQuadrant')}: ${results.analysis.quadrantName}</h2>
            <p><b>${t('economicAxis')}:</b> ${results.scores.economic.toFixed(2)}</p>
            <p><b>${t('socialAxis')}:</b> ${results.scores.social.toFixed(2)}</p>
            <h3>${t('exportDescription')}</h3>
            <p>${results.analysis.quadrantDescription}</p>
            <h3>${t('exportBehavioral')}</h3>
            <p>${results.analysis.behavioralAnalysis}</p>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      downloadBlob(blob, 'political-compass-results.doc');
  };
  
  const handleExportCSV = () => {
    const csvContent = [
      ['Axis', 'Score', 'Label'],
      [t('economicAxis'), results.scores.economic.toFixed(2), results.scores.economic > 0 ? t('right') : t('left')],
      [t('socialAxis'), results.scores.social.toFixed(2), results.scores.social > 0 ? t('authoritarian') : t('libertarian')]
    ].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'political-compass-scores.csv');
  };
  
  const handleExportTXT = () => {
    const textContent = generateTextSummary();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    downloadBlob(blob, 'political-compass-results.txt');
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generateTextSummary()).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('shareTitle'),
        text: t('shareText', { quadrant: results.analysis.quadrantName }),
        url: window.location.href,
      });
    } else {
      alert(t('shareApiNotSupported'));
    }
  };

  const actions = [
    { label: 'PNG', handler: handleExportPNG, icon: '🖼️' },
    { label: 'PDF', handler: handleExportPDF, icon: '📄' },
    { label: 'HTML', handler: handleExportHTML, icon: '🌐' },
    { label: 'DOCX', handler: handleExportDOCX, icon: '✍️' },
    { label: 'CSV', handler: handleExportCSV, icon: '📊' },
    { label: 'TXT', handler: handleExportTXT, icon: '📝' },
    { label: copyStatus === 'copied' ? t('exportCopied') : t('exportCopy'), handler: handleCopyToClipboard, icon: '📋' },
    { label: t('exportShare'), handler: handleShare, icon: '🔗' },
  ];

  return (
    <Card className="mt-6">
      <div className="p-6">
        <h3 className="app-title font-semibold mb-4 text-center">
          {t('exportAndShareTitle')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {actions.map(({ label, handler, icon }) => (
            <button
              key={label}
              onClick={handler}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-[var(--progress-bg)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-text)] transition-all duration-200 group"
            >
              <span className="text-2xl mb-1">{icon}</span>
              <span className="text-xs font-semibold text-center" style={{ color: 'var(--text-color)' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ExportShare;