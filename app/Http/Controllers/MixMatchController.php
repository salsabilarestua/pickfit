<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MixMatchController extends Controller
{
    public function panggilGemini(Request $request) 
    {
        $atasan = $request->input('atasan');
        $bawahan = $request->input('bawahan');

        if (!$atasan || !$bawahan) {
            return response()->json(['error' => 'Nama atasan atau bawahan tidak terdeteksi.'], 400);
        }

        $groqApiKey = "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";
        $url = "https://api.groq.com/openai/v1/chat/completions";

        // Instruksi fashion stylist expert
        $promptText = "Kamu adalah seorang Fashion Stylist Expert profesional untuk anak muda. 
        User aplikasi PickFit telah memilih perpaduan OOTD berikut di lemarinya:
        - Pakaian Atasan: {$atasan}
        - Pakaian Bawahan: {$bawahan}
        
        Berikan analisis keserasian (mix and match) dari kedua pakaian tersebut, lalu berikan rekomendasi pelengkap look yang sangat detail, modis, dan kekinian agar penampilan mereka maksimal.
        
        Tuliskan hasil analisismu langsung menggunakan format susunan tag HTML seperti ini agar rapi di halaman web:
        
        <p><b>💡 Analisis Kombinasi Look:</b> (Jelaskan secara detail nuansa atau vibe dari perpaduan antara '{$atasan}' dan '{$bawahan}' ini, apakah kesannya kasual, streetwear, formal, atau formal santai, serta bagaimana keserasian potongannya)</p>
        
        <ul>
           <li><b>👟 Pilihan Alas Kaki (Sepatu):</b> (Rekomendasikan secara spesifik jenis sepatu yang paling cocok beserta opsi warnanya, misalnya: Sneakers chunky putih, Dr. Martens boots hitam, loafers kulit cokelat, dll., jelaskan alasannya kenapa cocok dengan celana tersebut)</li>
           <li><b>🎒 Aksesoris Pendukung:</b> (Sebutkan jam tangan tipe apa, kacamata model apa, jenis tas seperti slingbag/backpack/tote bag, kalung/gelang, atau topi yang sesuai tema look ini untuk mendongkrak penampilan. DILARANG KERAS menyebutkan kerudung, hijab, jilbab, atau penutup kepala religi apapun!)</li>
           <li><b>🧥 Outer Tambahan (Opsional):</b> (Berikan saran jika look ini akan semakin keren kalau ditambah outer seperti jaket denim, kemeja flanel luar, blazer, atau cardigan beserta warnanya)</li>
        </ul>
        
        Gunakan gaya bahasa santai, ekspresif, informatif, modis, dan mengesankan untuk anak muda. Jangan sebutkan kata hijab/kerudung/muslimah sama sekali.";

        $payload = [
            'model' => 'llama-3.3-70b-versatile', 
            'messages' => [
                [
                    'role' => 'user',
                    'content' => $promptText
                ]
            ],
            'temperature' => 0.7
        ];

        try {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $groqApiKey
            ]);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                $errDetail = json_decode($response, true);
                $msg = isset($errDetail['error']['message']) ? $errDetail['error']['message'] : 'Status ' . $httpCode;
                return response()->json(['error' => 'Respon Groq API: ' . $msg], 400);
            }

            $data = json_decode($response, true);

            if (isset($data['choices'][0]['message']['content'])) {
                $hasilTeksAI = $data['choices'][0]['message']['content'];
                return response()->json(['text' => $hasilTeksAI]);
            }

            return response()->json(['error' => 'Struktur respon dari AI kosong.'], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kendala internal server: ' . $e->getMessage()], 500);
        }
    }
}