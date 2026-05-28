<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Mail\ResetPasswordMail;

class ForgotPasswordController extends Controller
{
    // 1. Tampilkan Form Minta Link (Gambar 1)
    public function showLinkRequestForm()
    {
        return view('lupapassword');
    }

    // 2. Proses Kirim Link Token ke Gmail
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Cek apakah email terdaftar di database tabel users
        $userExists = DB::table('users')->where('email', $request->email)->exists();

        if (!$userExists) {
            return back()->withErrors(['email' => 'Email tidak terdaftar di sistem kami.']);
        }

        // Buat token random yang unik untuk keamanan link
        $token = Str::random(64);

        // Simpan atau update token di tabel password_resets bawaan laravel
        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        // Kirim email
        Mail::to($request->email)->send(new ResetPasswordMail($token, $request->email));

        return back()->with('status', 'Link reset password sudah dikirim ke Gmail kamu!');
    }

    // 3. Tampilkan Form Input Password Baru saat Tombol di Gmail diklik (Gambar 2)
    public function showResetForm(Request $request, $token)
    {
        return view('auth.reset-password', ['token' => $token, 'request' => $request]);
    }

    // 4. Eksekusi Update Password Baru ke Database
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed', // 'confirmed' otomatis mengecek input 'password_confirmation'
        ]);

        // Cek token dari tabel password_resets
        $record = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return back()->withErrors(['email' => 'Token reset password tidak valid atau sudah kedaluwarsa.']);
        }

        // Update password baru milik user di tabel users
        DB::table('users')->where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        // Hapus token yang sudah terpakai agar tidak bisa digunakan lagi
        DB::table('password_resets')->where(['email' => $request->email])->delete();

        return redirect('/login')->with('status', 'Password berhasil diperbarui! Silakan masuk.');
    }
}