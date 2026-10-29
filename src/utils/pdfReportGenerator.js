import { DIMENSIONS } from '../data/questions.js';

/**
 * Gerador Nativo de Relatório Executivo em PDF (A4 Alta Resolução)
 * Renderiza o dossiê completo do aluno com a identidade visual Alê (Cobre, Bronze e Marrom Profundo)
 * e empacota diretamente em arquivo binário .PDF (Padrão ISO PDF 1.4) sem depender de janelas de impressão.
 */

export async function generateAndDownloadReportPDF({ results, insights, leadData }) {
  const width = 1240;  // A4 @ ~150 DPI
  const height = 1754;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const { overallScore, profile, dimensions } = results || {};
  const { strongPoint, evolutionPoint, attentionPoint, evolutionMap } = insights || {};
  const studentName = (leadData?.name || 'Participante').trim();
  const dateFormatted = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // 1. Fundo Editorial Marrom Profundo & Vinheta Cobre
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#120704');
  bgGrad.addColorStop(0.5, '#0B0402');
  bgGrad.addColorStop(1, '#080302');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Halo superior cobre sutil
  const auraGrad = ctx.createRadialGradient(width / 2, 180, 20, width / 2, 180, 520);
  auraGrad.addColorStop(0, 'rgba(233, 108, 50, 0.22)');
  auraGrad.addColorStop(1, 'rgba(233, 108, 50, 0)');
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, width, 600);

  // Moldura externa em Cobre / Bronze
  ctx.strokeStyle = 'rgba(233, 108, 50, 0.45)';
  ctx.lineWidth = 2;
  roundRect(ctx, 44, 44, width - 88, height - 88, 16);
  ctx.stroke();

  let cursorY = 82;

  // 2. Carregar e desenhar a Logo Oficial Alê no topo
  try {
    const logoImg = await loadImage('/images/logo-ale-oficial.png');
    const logoH = 74;
    const logoW = (logoImg.width / logoImg.height) * logoH;
    ctx.drawImage(logoImg, (width - logoW) / 2, cursorY, logoW, logoH);
    cursorY += logoH + 18;
  } catch {
    cursorY += 20;
  }

  // Tag de cabeçalho
  ctx.fillStyle = '#D79A62';
  ctx.font = '600 17px Oswald, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`DIAGNÓSTICO OFICIAL DE MATURIDADE DECISÓRIA  •  ${dateFormatted}`, width / 2, cursorY);
  cursorY += 32;

  // Nome do Aluno
  ctx.fillStyle = '#F5EFEA';
  ctx.font = '700 24px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.fillText(`Aluno(a): ${studentName}`, width / 2, cursorY);
  cursorY += 30;

  // 3. Card Principal: Perfil Identificado + Índice de Consistência
  const heroBoxX = 80;
  const heroBoxW = width - 160;
  const heroBoxH = 250;

  ctx.fillStyle = 'rgba(28, 12, 7, 0.92)';
  ctx.strokeStyle = 'rgba(233, 108, 50, 0.5)';
  ctx.lineWidth = 2;
  roundRect(ctx, heroBoxX, cursorY, heroBoxW, heroBoxH, 14);
  ctx.fill();
  ctx.stroke();

  // Lado Esquerdo do Hero Card: Código, Nome do Perfil e Resumo
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E96C32';
  ctx.font = '700 18px Oswald, Arial, sans-serif';
  ctx.fillText(`${profile?.code || 'NÍVEL'}  —  SEU PERFIL IDENTIFICADO`, heroBoxX + 36, cursorY + 44);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 42px "Bebas Neue", Oswald, Arial, sans-serif';
  ctx.fillText((profile?.name || 'PERFIL DECISÓRIO').toUpperCase(), heroBoxX + 36, cursorY + 92);

  ctx.fillStyle = '#D79A62';
  ctx.font = '600 18px "Plus Jakarta Sans", Arial, sans-serif';
  wrapText(ctx, profile?.tagline || '', heroBoxX + 36, cursorY + 124, heroBoxW - 340, 24, 2);

  ctx.fillStyle = '#CFC5BC';
  ctx.font = '400 16px "Plus Jakarta Sans", Arial, sans-serif';
  wrapText(ctx, profile?.summary || '', heroBoxX + 36, cursorY + 166, heroBoxW - 340, 22, 3);

  // Lado Direito do Hero Card: Placar de Consistência XX/100
  const scoreBoxW = 240;
  const scoreBoxH = 190;
  const scoreBoxX = heroBoxX + heroBoxW - scoreBoxW - 32;
  const scoreBoxY = cursorY + 30;

  ctx.fillStyle = '#100603';
  ctx.strokeStyle = '#E96C32';
  ctx.lineWidth = 2;
  roundRect(ctx, scoreBoxX, scoreBoxY, scoreBoxW, scoreBoxH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#E96C32';
  ctx.font = '700 68px "Bebas Neue", Oswald, Arial, sans-serif';
  ctx.fillText(`${overallScore ?? 0}/100`, scoreBoxX + scoreBoxW / 2, scoreBoxY + 105);

  ctx.fillStyle = '#D79A62';
  ctx.font = '600 15px Oswald, Arial, sans-serif';
  ctx.fillText('ÍNDICE DE CONSISTÊNCIA', scoreBoxX + scoreBoxW / 2, scoreBoxY + 148);

  cursorY += heroBoxH + 34;

  // 4. Seção: As 5 Dimensões Estratégicas
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E96C32';
  ctx.font = '700 18px Oswald, Arial, sans-serif';
  ctx.fillText('01  •  DESEMPENHO NAS 5 DIMENSÕES DECISÓRIAS', 80, cursorY);
  cursorY += 16;

  const dimBoxH = 265;
  ctx.fillStyle = 'rgba(22, 10, 6, 0.9)';
  ctx.strokeStyle = 'rgba(215, 154, 98, 0.28)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 80, cursorY, width - 160, dimBoxH, 12);
  ctx.fill();
  ctx.stroke();

  const dimKeys = ['comportamento', 'gestao', 'probabilidade', 'analise', 'disciplina'];
  let dimRowY = cursorY + 38;

  dimKeys.forEach((key) => {
    const meta = DIMENSIONS[key] || { name: key, shortDescription: '' };
    const val = Math.min(100, Math.max(0, Number(dimensions?.[key] ?? 0)));

    ctx.textAlign = 'left';
    ctx.fillStyle = '#F5EFEA';
    ctx.font = '700 18px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(meta.name.toUpperCase(), 112, dimRowY);

    ctx.fillStyle = '#A8998C';
    ctx.font = '400 15px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText(`—  ${meta.shortDescription}`, 295, dimRowY);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#E96C32';
    ctx.font = '700 20px Oswald, Arial, sans-serif';
    ctx.fillText(`${val}%`, width - 112, dimRowY);

    // Barra de fundo
    const trackX = 112;
    const trackY = dimRowY + 10;
    const trackW = width - 224;
    const trackH = 10;

    ctx.fillStyle = '#120603';
    roundRect(ctx, trackX, trackY, trackW, trackH, 5);
    ctx.fill();

    // Preenchimento cobre
    const fillW = Math.max(8, (trackW * val) / 100);
    const barGrad = ctx.createLinearGradient(trackX, 0, trackX + fillW, 0);
    barGrad.addColorStop(0, '#B76832');
    barGrad.addColorStop(1, '#E96C32');
    ctx.fillStyle = barGrad;
    roundRect(ctx, trackX, trackY, fillW, trackH, 5);
    ctx.fill();

    dimRowY += 46;
  });

  cursorY += dimBoxH + 34;

  // 5. Seção: Diagnóstico de Congruência (3 Cards Lado a Lado)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E96C32';
  ctx.font = '700 18px Oswald, Arial, sans-serif';
  ctx.fillText('02  •  DIAGNÓSTICO INTERPRETATIVO', 80, cursorY);
  cursorY += 16;

  const cards = [
    { tag: '01 • PONTO FORTE', data: strongPoint },
    { tag: '02 • PONTO DE EVOLUÇÃO', data: evolutionPoint },
    { tag: '03 • ATENÇÃO OPERACIONAL', data: attentionPoint }
  ];

  const cardGap = 20;
  const cardW = (width - 160 - cardGap * 2) / 3;
  const cardH = 230;

  cards.forEach((c, idx) => {
    const cx = 80 + idx * (cardW + cardGap);
    ctx.fillStyle = 'rgba(24, 11, 7, 0.92)';
    ctx.strokeStyle = 'rgba(215, 154, 98, 0.3)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cx, cursorY, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#E96C32';
    ctx.font = '700 15px Oswald, Arial, sans-serif';
    ctx.fillText(c.tag, cx + 22, cursorY + 34);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 20px "Plus Jakarta Sans", Arial, sans-serif';
    wrapText(ctx, c.data?.title || '—', cx + 22, cursorY + 66, cardW - 44, 24, 2);

    ctx.fillStyle = '#CFC5BC';
    ctx.font = '400 15px "Plus Jakarta Sans", Arial, sans-serif';
    wrapText(ctx, c.data?.description || '', cx + 22, cursorY + 118, cardW - 44, 21, 5);
  });

  cursorY += cardH + 34;

  // 6. Seção: Seu Mapa de Evolução (01 Mantenha, 02 Desenvolva, 03 Priorize)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#E96C32';
  ctx.font = '700 18px Oswald, Arial, sans-serif';
  ctx.fillText('03  •  MATRIZ TÁTICA DE EVOLUÇÃO', 80, cursorY);
  cursorY += 16;

  const evoCols = [
    { num: '01', title: 'MANTENHA', items: evolutionMap?.mantenha || [] },
    { num: '02', title: 'DESENVOLVA', items: evolutionMap?.desenvolva || [] },
    { num: '03', title: 'PRIORIZE', items: evolutionMap?.priorize || [] }
  ];

  const evoH = 330;

  evoCols.forEach((col, idx) => {
    const cx = 80 + idx * (cardW + cardGap);
    ctx.fillStyle = 'rgba(22, 10, 6, 0.92)';
    ctx.strokeStyle = 'rgba(233, 108, 50, 0.32)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cx, cursorY, cardW, evoH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#E96C32';
    ctx.font = '700 18px Oswald, Arial, sans-serif';
    ctx.fillText(`${col.num}  •  ${col.title}`, cx + 22, cursorY + 36);

    let itemY = cursorY + 68;
    if (col.items.length === 0) {
      ctx.fillStyle = '#8F8075';
      ctx.font = 'italic 15px "Plus Jakarta Sans", Arial, sans-serif';
      ctx.fillText('Nenhum item nesta faixa.', cx + 22, itemY);
    } else {
      col.items.slice(0, 3).forEach((item) => {
        ctx.fillStyle = '#F5EFEA';
        ctx.font = '700 16px "Plus Jakarta Sans", Arial, sans-serif';
        ctx.fillText(`${item.name.toUpperCase()} (${item.score}%)`, cx + 22, itemY);

        ctx.fillStyle = '#C4B8AE';
        ctx.font = '400 14px "Plus Jakarta Sans", Arial, sans-serif';
        wrapText(ctx, item.guidance || '', cx + 22, itemY + 22, cardW - 44, 18, 3);
        itemY += 82;
      });
    }
  });

  // 7. Rodapé Institucional
  ctx.textAlign = 'center';
  ctx.fillStyle = '#A8998C';
  ctx.font = '500 15px Oswald, Arial, sans-serif';
  ctx.fillText('ALÊ  •  OS NÚMEROS FALAM. O CONHECIMENTO TRADUZ.', width / 2, height - 66);

  // Converter Canvas para JPEG e empacotar em PDF A4 padrão
  const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.94);
  const pdfBlob = createA4PdfFromJpegDataUrl(jpegDataUrl, width, height);

  const safeFileName = studentName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'participante';

  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-diagnostico-${safeFileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function createA4PdfFromJpegDataUrl(dataUrl, imgWidth, imgHeight) {
  const base64 = dataUrl.split(',')[1];
  const binaryStr = atob(base64);
  const imgBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    imgBytes[i] = binaryStr.charCodeAt(i);
  }

  // Dimensões A4 em pontos PostScript (72 dpi)
  const pageW = 595.28;
  const pageH = 841.89;

  const encoder = new TextEncoder();
  const chunks = [];
  const offsets = [];
  let byteLength = 0;

  const pushStr = (str) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const pushBytes = (bytes) => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const startObj = (id) => {
    offsets[id] = byteLength;
    pushStr(`${id} 0 obj\n`);
  };

  const endObj = () => {
    pushStr('\nendobj\n');
  };

  // Cabeçalho PDF 1.4
  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  // 1: Catalog
  startObj(1);
  pushStr('<< /Type /Catalog /Pages 2 0 R >>');
  endObj();

  // 2: Pages
  startObj(2);
  pushStr('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  endObj();

  // 3: Page
  startObj(3);
  pushStr(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`
  );
  endObj();

  // 4: Image XObject (JPEG DCTDecode)
  startObj(4);
  pushStr(
    `<< /Type /XObject /Subtype /Image /Width ${imgWidth} /Height ${imgHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
  );
  pushBytes(imgBytes);
  pushStr('\nendstream');
  endObj();

  // 5: Content Stream para desenhar a página inteira
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;
  const contentBytes = encoder.encode(contentStream);
  startObj(5);
  pushStr(`<< /Length ${contentBytes.length} >>\nstream\n`);
  pushBytes(contentBytes);
  pushStr('endstream');
  endObj();

  // Tabela XREF
  const xrefOffset = byteLength;
  pushStr('xref\n0 6\n0000000000 65535 f \n');
  for (let i = 1; i <= 5; i++) {
    const padded = String(offsets[i]).padStart(10, '0');
    pushStr(`${padded} 00000 n \n`);
  }

  // Trailer
  pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks, { type: 'application/pdf' });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = String(text || '').split(/\s+/);
  let line = '';
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      linesCount++;
      if (linesCount >= maxLines) {
        ctx.fillText(line.trim() + '...', x, y);
        return;
      }
      ctx.fillText(line.trim(), x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, y);
  }
}
