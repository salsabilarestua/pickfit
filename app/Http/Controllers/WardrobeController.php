<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wardrobe;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Outfit;
use Illuminate\Support\Facades\Validator;
use App\Models\Planner;

class WardrobeController extends Controller
{


    public function deletePlanner(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date'
        ]);

        Planner::where('user_id', Auth::id())
            ->where('tanggal', $request->tanggal)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jadwal berhasil dihapus!'
        ]);
    }

    public function planner()
    {
        $outfits = Outfit::where('user_id', Auth::id())
            ->latest()
            ->get();

        $plans = Planner::where('user_id', Auth::id())
            ->with('outfit')
            ->get();

        return view('planner', compact('outfits', 'plans'));
    }

    public function savePlanner(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'outfit_id' => 'required|exists:outfits,id'
        ]);

        Planner::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'tanggal' => $request->tanggal
            ],
            [
                'outfit_id' => $request->outfit_id
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Jadwal outfit berhasil disimpan!'
        ]);
    }

    public function deleteOutfit($id)
    {
        $outfit = Outfit::where('user_id', Auth::id())
            ->findOrFail($id);

        $outfit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Outfit berhasil dihapus!'
        ]);
    }
    public function getOutfits()
    {
        $outfits = Outfit::where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($outfits);
    }

        public function saveOutfit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Outfit kosong.'
            ], 422);
        }

        $outfit = Outfit::create([
            'user_id' => Auth::id(),
            'nama_outfit' => 'Outfit ' . now()->format('d-m-Y H:i'),
            'items' => $request->items
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Outfit berhasil disimpan!',
            'outfit' => $outfit
        ]);
    }
    public function mixmatch()
    {
        $wardrobes = Wardrobe::where('user_id', Auth::id())
            ->where('status_baju', 'Siap Pakai')
            ->latest()
            ->get();

        return view('mixmatch', compact('wardrobes'));
    }
    public function updateStatus(Request $request, $id)
    {
        $item = Wardrobe::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'status_baju' => 'required'
        ]);

        $item->update([
            'status_baju' => $request->status_baju
        ]);

        return back()->with('success', 'Status baju berhasil diperbarui!');
    }
    public function destroy($id)
    {
        $item = Wardrobe::where('user_id', Auth::id())->findOrFail($id);

        if ($item->foto_baju && Storage::disk('public')->exists($item->foto_baju)) {
        Storage::disk('public')->delete($item->foto_baju);
        }

        $item->delete();

        return back()->with('success', 'Item berhasil dihapus dari lemari!');
    }
    public function index()
    {
        $wardrobes = Wardrobe::where('user_id', Auth::id())
            ->latest()
            ->get();

        return view('lemari', compact('wardrobes'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_baju' => 'required',
            'status_baju' => 'required',
            'foto_baju' => 'required|image|mimes:jpg,jpeg,png,avif,webp|max:2048'
        ]);

        $path = $request->file('foto_baju')->store('wardrobes', 'public');

        Wardrobe::create([
            'user_id' => Auth::id(),
            'nama_baju' => $request->nama_baju,
            'status_baju' => $request->status_baju,
            'foto_baju' => $path
        ]);

        return back()->with('success', 'Baju berhasil ditambahkan ke lemari!');
    }
}