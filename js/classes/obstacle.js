class Obstacle {
    // Constructor: Menyiapkan data tembok baru saat dibuat
    // Parameter: x, y (posisi pojok kiri atas), w (lebar), h (tinggi)
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // Fungsi Show: Menggambar tembok ke layar canvas
    show() {
        fill(255); // Set warna tembok menjadi Putih

        // Pastikan mode gambar adalah CORNER
        // Artinya koordinat (x, y) dihitung dari pojok kiri-atas tembok
        rectMode(CORNER);

        // Gambar persegi panjang sesuai data properti di atas
        rect(this.x, this.y, this.w, this.h);
    }

    // Fungsi Contains: Deteksi Tabrakan (Collision Detection)
    // Menerima input 'v' (vector posisi si kunang-kunang)
    // Mengembalikan 'true' jika menabrak, 'false' jika aman
    contains(v) {
        // Logika Matematika: Apakah titik 'v' berada DI DALAM kotak ini?
        return (
            v.x > this.x &&               // Apakah di sebelah KANAN sisi kiri tembok?
            v.x < this.x + this.w &&      // Apakah di sebelah KIRI sisi kanan tembok?
            v.y > this.y &&               // Apakah di sebelah BAWAH sisi atas tembok?
            v.y < this.y + this.h         // Apakah di sebelah ATAS sisi bawah tembok?
        );
        // Jika syarat terpenuhi, berarti titik ada di dalam kotak -> TABRAKAN!
    }
}