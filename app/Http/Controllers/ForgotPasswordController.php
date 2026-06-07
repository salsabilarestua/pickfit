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
    public function showLinkRequestForm()
    {
        return view('lupapassword');
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $userExists = DB::table('users')->where('email', $request->email)->exists();

        if (!$userExists) {
            return back()->withErrors(['email' => 'Email tidak terdaftar di sistem kami.']);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );

        Mail::to($request->email)->send(new ResetPasswordMail($token, $request->email));

        return back()->with('status', 'Link reset password sudah dikirim ke Gmail kamu!');
    }

    public function showResetForm(Request $request, $token)
    {
        return view('auth.reset-password', ['token' => $token, 'request' => $request]);
    }

    public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed', 
    ]);

    // 1. Pastikan nama tabelnya password_reset_tokens
    $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

    if (!$record || !Hash::check($request->token, $record->token)) {
        return back()->withErrors(['email' => 'Token reset password tidak valid atau sudah kedaluwarsa.']);
    }

    // 2. Update password user
    DB::table('users')->where('email', $request->email)->update([
        'password' => Hash::make($request->password)
    ]);

    // 3. Ubah ini menjadi password_reset_tokens agar tidak error saat hapus token lama
    DB::table('password_reset_tokens')->where('email', $request->email)->delete();

    // 4. PERBAIKAN UTAMA: Arahkan redirect ke rute 'login' (bukan URL /login)
    return redirect()->route('login')->with('status', 'Password berhasil diperbarui! Silakan masuk.');
}
}