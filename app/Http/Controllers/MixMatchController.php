<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MixMatchController extends Controller
{
    public function index()
    {
        // Return view tanpa membawa database karena data baju ada di localStorage user
        return view('mixmatch');
    } // Kurung kurawal index ditutup di sini

    // Fungsi panggilGemini sekarang sudah aman di dalam Class
    public function panggilGemini(\Illuminate\Http\Request $request)
    {
        $base64Image = $request->input('image');
        $namaItem = $request->input('name');

        if (!$base64Image) {
            return response()->json(['error' => 'Data gambar tidak terbaca di backend.'], 400);
        }

        // PENTING: Deteksi & potong header base64 (baik data:image/png atau data:image/jpeg)
        $posisiKoma = strpos($base64Image, ',');
        if ($posisiKoma !== false) {
            $cleanBase64 = substr($base64Image, $posisiKoma + 1);
        } else {
            $cleanBase64 = $base64Image;
        }

        // FIX UTAMA: Mengembalikan karakter '+' yang berubah menjadi spasi saat dikirim via JSON AJAX
        $cleanBase64 = str_replace(' ', '+', $cleanBase64);

        // Tentukan Mime Type gambar secara dinamis
        $mimeType = "image/jpeg";
        if (str_contains($base64Image, 'image/png')) $mimeType = "image/png";
        if (str_contains($base64Image, 'image/webp')) $mimeType = "image/webp";

        // API Key valid resmi milikmu
        $apiKey = "AIzaSyDNj27dA9i7JJYSDS50quU7w2dIcHPlvJk";
        $url = "https://generativelanguageresource.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

        $promptText = "Kamu adalah seorang Fashion Stylist Expert profesional. 
        Analisis foto pakaian asli buatan user yang bernama '{$namaItem}' ini. Berikan rekomendasi outfit yang sangat mendalam dan modis berdasarkan bentuk siluet potongan (cuttingan), bahan kain, dan warna aslinya.
        
        Tuliskan hasil analisismu langsung menggunakan format susunan tag HTML seperti ini agar rapi di halaman web:
        
        <p><b>Analisis Model & Karakteristik:</b> (Tulis deskripsi detail pakaian ini berdasarkan foto, misalnya: kemeja oversized, celana cargo loose fit, bahan linen jatuh, atau kaos knit fitted, dll.)</p>
        <ul>
           <li><b>Rekomendasi Bawahan/Atasan:</b> (Sebutkan jenis pasangan baju/celana yang cocok, tipe cuttingan shape-nya seperti apa, dan warna yang kontras seimbang)</li>
           <li><b>Aksesori Pendukung:</b> (Rekomendasikan tas, kacamata hitam, jam tangan, kalung, atau topi yang sesuai tema look-nya. DILARANG KERAS menyebutkan kerudung, hijab, jilbab, atau penutup kepala religi apapun!)</li>
           <li><b>Pilihan Alas Kaki (Sepatu):</b> (Rekomendasikan jenis sepatu seperti loafers formal, sneakers kasual chunky, flat shoes, atau boots beserta opsi warnanya)</li>
        </ul>
        
        Gunakan gaya bahasa santai, informatif, modis, dan mengesankan untuk anak muda. Jangan sebutkan kata hijab/kerudung/muslimah sama sekali.";

        try {
            // Kirim request ke Google Gemini AI
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->post($url, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $promptText],
                            [
                                'inlineData' => [
                                    'mimeType' => $mimeType,
                                    'data' => $cleanBase64
                                ]
                            ]
                        ]
                    ]
                ]
            ]);

            $data = $response->json();

            // Jika Google membalas dengan status error, tangkap pesannya di sini
            if (isset($data['error'])) {
                return response()->json(['error' => 'Respon Google: ' . $data['error']['message']], 400);
            }

            if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                $hasilTeksAI = $data['candidates'][0]['content']['parts'][0]['text'];
                // Bersihkan penutup markdown html bawaan LLM jika ada
                $hasilTeksAI = str_replace(['```html', '```'], '', $hasilTeksAI);
                return response()->json(['text' => $hasilTeksAI]);
            }

            return response()->json(['error' => 'Google mengembalikan respon kosong.'], 500);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal koneksi ke server Google: ' . $e->getMessage()], 500);
        }
    }
} // Tanda penutup class MixMatchController sekarang berada di paling akhir file