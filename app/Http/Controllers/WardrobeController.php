<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wardrobe;
use Illuminate\Support\Facades\DB;

class WardrobeController extends Controller
{
    public function index()
    {
        $koleksi = Wardrobe::all();
        
        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json($koleksi);
        }
        
        return view('lemari', compact('koleksi'));
    }

    public function store(Request $request)
    {
        try {
            if (!$request->has('image_url') || !$request->has('name')) {
                return response()->json(['error' => 'Data tidak lengkap'], 400);
            }

            $name = $request->input('name');
            $category = $request->input('category', 'Atasan');
            $base64Image = $request->input('image_url');

            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                $type = strtolower($type[1]); 

                if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif'])) {
                    return response()->json(['error' => 'Format gambar tidak valid'], 400);
                }

                $base64Image = base64_decode($base64Image);
                if ($base64Image === false) {
                    return response()->json(['error' => 'Gagal membaca data gambar'], 400);
                }
            } else {
                return response()->json(['error' => 'Format Base64 tidak sesuai'], 400);
            }

            $fileName = 'wardrobe_' . time() . '_' . uniqid() . '.' . $type;
            $destinationPath = public_path('storage/wardrobe');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            file_put_contents($destinationPath . '/' . $fileName, $base64Image);
            $imageUrl = asset('storage/wardrobe/' . $fileName);
            
            Wardrobe::create([
                'name' => $name,
                'category' => $category,
                'image_url' => $imageUrl,
            ]);

            return response()->json(['message' => 'Berhasil disimpan ke MySQL!'], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal simpan ke server: ' . $e->getMessage()], 500);
        }
    }

    public function mixmatch()
    {
        return view('mixmatch'); 
    }

    public function planner()
    {
        return view('planner'); 
    }

    public function saveOutfit(Request $request)
    {
        try {
            $preview = $request->input('preview_snapshot');
            $atasan = $request->input('nama_atasan');
            $bawahan = $request->input('nama_bawahan');
            $tanggal = $request->input('tanggal_jepret');

            if (!$preview) {
                return response()->json(['error' => 'Foto jepretan kosong.'], 400);
            }

            $userId = auth()->id() ?? 1; 

            $itemsJson = json_encode([
                'atasan' => $atasan,
                'bawahan' => $bawahan
            ]);

            DB::table('outfits')->insert([
                'user_id'          => $userId,
                'preview_snapshot' => $preview,
                'nama_atasan'      => $atasan,
                'nama_bawahan'     => $bawahan,
                'items'            => $itemsJson, // 👈 Menggunakan array yang sudah di-json_encode
                'tanggal_jepret'   => $tanggal,
                'created_at'       => now()
            ]);

            return response()->json(['message' => 'Sukses menyimpan OOTD real-time!']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal simpan ke server: ' . $e->getMessage()], 500);
        }
    }

    public function getOutfits()
    {
        try {
            $outfits = DB::table('outfits')
                        ->orderBy('id', 'desc')
                        ->get();
            return response()->json($outfits);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteOutfit($id = null)
    {
        try {
            if (!$id) {
                $id = request()->segment(count(request()->segments()));
            }

            if (!$id || !is_numeric($id)) {
                return response()->json(['error' => 'ID pakaian tidak valid.'], 400);
            }

            DB::statement("SET FOREIGN_KEY_CHECKS = 0");
            $terhapus = DB::table('outfits')->where('id', $id)->delete();
            DB::statement("SET FOREIGN_KEY_CHECKS = 1");

            if ($terhapus) {
                return response()->json(['message' => 'Koleksi jepretan berhasil dihapus!'], 200);
            } else {
                return response()->json(['error' => 'Data tidak ditemukan atau sudah terhapus.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menghapus di server: ' . $e->getMessage()], 500);
        }
    }

    public function savePlanner(Request $request)
    {
        try {
            $outfitId = $request->input('outfit_id');
            $tanggalRencana = $request->input('tanggal_rencana');
            $userId = auth()->id() ?? 1;

            DB::table('planners')->insert([
                'user_id'         => $userId,
                'outfit_id'       => $outfitId,
                'tanggal_rencana' => $tanggalRencana,
                'created_at'      => now()
            ]);

            return response()->json(['message' => 'Jadwal berhasil disimpan!']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal simpan jadwal: ' . $e->getMessage()], 500);
        }
    }

    public function getPlanner()
    {
        try {
            $userId = auth()->id() ?? 1;
            
            $planners = DB::table('planners')
                ->join('outfits', 'planners.outfit_id', '=', 'outfits.id')
                ->select('planners.*', 'outfits.preview_snapshot', 'outfits.nama_atasan', 'outfits.nama_bawahan')
                ->where('planners.user_id', $userId)
                ->orderBy('planners.id', 'desc')
                ->get();

            return response()->json($planners);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deletePlanner($id)
    {
        try {
            DB::table('planners')->where('id', $id)->delete();
            return response()->json(['message' => 'Jadwal berhasil dihapus!']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}