<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function build()
    {
        // Membuat link yang mengarah ke halaman reset password di aplikasi Laravel-mu
        $link = url('/reset-password/' . $this->token . '?email=' . urlencode($this->email));

        return $this->subject('Reset Password Akun PickFit Kamu')
                    ->html("
                        <div style='font-family: Poppins, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                            <h2 style='color: #333;'>Halo User PickFit,</h2>
                            <p style='color: #666; line-height: 1.5;'>Kami menerima permintaan untuk mereset password akunmu. Silakan klik tombol di bawah ini untuk melanjutkan:</p>
                            <div style='text-align: center; margin: 30px 0;'>
                                <a href='{$link}' style='background-color: #111; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;'>RESET PASSWORD</a>
                            </div>
                            <p style='color: #999; font-size: 12px;'>Jika kamu tidak merasa melakukan permintaan ini, abaikan saja email ini.</p>
                        </div>
                    ");
    }
}