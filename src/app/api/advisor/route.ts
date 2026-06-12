import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Transaction, UserProfile } from '@/types';

// System prompt formatting rule
const SYSTEM_PROMPT = `
Anda adalah seorang "Smart Financial Advisor" pribadi yang cerdas, adaptif, santai, namun tegas, khusus untuk membantu mahasiswa mengelola keuangan mereka. Tugas Anda adalah menganalisis riwayat transaksi pengguna dan memberikan prediksi serta rekomendasi keuangan yang dipersonalisasi.

Aturan Output:
1. Sapa pengguna dengan nama mereka.
2. Gunakan gaya bahasa yang santai, menggunakan bahasa Indonesia kasual/anak muda (seperti contoh: "Hey [Nama], berdasarkan analisis...").
3. Berikan analisis tren (misal: pengeluaran kopi naik, sering nongkrong).
4. Berikan *Forecasting* (Prediksi): Hitung apakah dengan tren saat ini, saldo mereka cukup sampai tanggal kiriman berikutnya. Jika tidak, sebutkan prediksi tanggal uang mereka akan habis.
5. Berikan rekomendasi tindakan konkret dan singkat.
6. Jaga respons maksimal 3-4 kalimat agar mudah dibaca di dasbor aplikasi.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile, transactions, customApiKey } = body as {
      profile: UserProfile;
      transactions: Transaction[];
      customApiKey?: string;
    };

    if (!profile || !transactions) {
      return NextResponse.json(
        { error: 'Missing profile or transactions data' },
        { status: 400 }
      );
    }

    // Determine the API key to use
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    // If no API key is configured or the user explicitly chose simulated mode,
    // generate a high-fidelity dynamic response based on actual data
    if (!apiKey) {
      const generatedMock = generateDynamicMockResponse(profile, transactions);
      return NextResponse.json({ insight: generatedMock, isMock: true });
    }

    // Initialize Gemini API client
    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Format dynamic prompt data
      const userPrompt = `
[DATA PENGGUNA]
Nama: ${profile.name}
Saldo Saat Ini: Rp ${profile.balance.toLocaleString('id-ID')}
Tanggal Kiriman Berikutnya: ${new Date(profile.nextAllowanceDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })} (${calculateDaysRemaining(profile.nextAllowanceDate)} hari lagi)

[RIWAYAT TRANSAKSI 2 MINGGU TERAKHIR]
${transactions
  .map(
    (tx) =>
      `- ${new Date(tx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}: ${
        tx.title
      } ${tx.type === 'credit' ? '+' : '-'}Rp ${tx.amount.toLocaleString('id-ID')}`
  )
  .join('\n')}

Analisis data di atas dan berikan insight/forecasting sesuai instruksi!
`;

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] }],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      });

      const text = response.response ? response.response.text() : '';
      return NextResponse.json({ insight: text.trim(), isMock: false });
    } catch (apiError: any) {
      console.error('Gemini API Error, falling back to mock logic:', apiError);
      // Fallback gracefully on API errors
      const generatedMock = generateDynamicMockResponse(profile, transactions);
      return NextResponse.json({
        insight: generatedMock + " (Fallback: Terjadi gangguan pada koneksi AI)",
        isMock: true,
        error: apiError.message,
      });
    }
  } catch (error: any) {
    console.error('API Router Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helpers
function calculateDaysRemaining(targetDateStr: string): number {
  const target = new Date(targetDateStr);
  const now = new Date('2026-06-12'); // Fixed base date matching context
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// Smart local analytical advisor fallback
function generateDynamicMockResponse(profile: UserProfile, transactions: Transaction[]): string {
  // Find coffee transactions
  const coffeeTxs = transactions.filter(
    (tx) =>
      tx.type === 'debit' &&
      (tx.category.toLowerCase().includes('kopi') ||
        tx.title.toLowerCase().includes('starbucks') ||
        tx.title.toLowerCase().includes('kopi'))
  );

  const totalCoffeeAmount = coffeeTxs.reduce((sum, tx) => sum + tx.amount, 0);
  
  // Calculate average daily debit spend
  const debitTxs = transactions.filter((tx) => tx.type === 'debit');
  const totalDebit = debitTxs.reduce((sum, tx) => sum + tx.amount, 0);

  // Group transactions by date to see span
  const uniqueDates = Array.from(new Set(transactions.map((tx) => tx.date)));
  const daysSpan = uniqueDates.length || 12;
  const avgDailyDebit = totalDebit / daysSpan;

  const daysRemaining = calculateDaysRemaining(profile.nextAllowanceDate);
  const balanceNeeded = avgDailyDebit * daysRemaining;
  const isEnough = profile.balance >= balanceNeeded;

  // Predict depletion date
  let depletionMsg = '';
  if (!isEnough && avgDailyDebit > 0) {
    const daysLeft = Math.floor(profile.balance / avgDailyDebit);
    const depletionDate = new Date('2026-06-12');
    depletionDate.setDate(depletionDate.getDate() + daysLeft);
    const formattedDate = depletionDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
    });
    depletionMsg = `Dengan pengeluaran harian sekitar Rp ${Math.round(
      avgDailyDebit
    ).toLocaleString('id-ID')}, saldo kamu diprediksi bakal habis tanggal ${formattedDate}.`;
  } else {
    depletionMsg = `Dengan ritme hemat ini, sisa saldo kamu diprediksi cukup kok sampai kiriman berikutnya datang!`;
  }

  // Trend analysis
  let trendMsg = '';
  if (coffeeTxs.length >= 3) {
    trendMsg = `Belakangan ini jajan kopi kamu lagi kenceng banget nih (total Rp ${totalCoffeeAmount.toLocaleString(
      'id-ID'
    )}), sering mampir ke Starbucks ya?`;
  } else if (totalDebit > profile.monthlyAllowance * 0.5) {
    trendMsg = `Wah, baru setengah jalan tapi kamu udah ngebelanjain lebih dari 50% kiriman bulananmu nih.`;
  } else {
    trendMsg = `Catatan pengeluaran kamu masih tergolong wajar dan terkendali minggu ini.`;
  }

  // Actionable recommendations
  let recMsg = '';
  if (!isEnough) {
    if (coffeeTxs.length >= 3) {
      recMsg = `Coba deh kurangi jajan kopi mahal dan beralih ke kopi saset dulu biar dompet kamu selamat.`;
    } else {
      recMsg = `Mulai rem pengeluaran non-primer kayak nongkrong atau nonton biar sisa saldo awet sampai akhir bulan.`;
    }
  } else {
    recMsg = `Pertahankan terus pola pengeluaran ini dan sisihkan sebagian buat tabungan cadangan ya!`;
  }

  return `Hey ${profile.name}, ${trendMsg} ${depletionMsg} ${recMsg}`;
}
