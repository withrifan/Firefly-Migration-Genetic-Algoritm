class DNA {
    // Constructor: Fungsi yang dijalankan pertama kali saat membuat object DNA baru
    constructor(genes) {
        // Jika kita memberikan 'genes' (DNA warisan), maka pakai itu.
        // Ini biasanya dipakai saat anak lahir dari hasil crossover orang tua.
        if (genes) {
            this.genes = genes;
        }
        // Jika TIDAK ada 'genes' (artinya ini generasi pertama),
        // maka buat DNA baru secara acak.
        else {
            this.genes = [];
            // Loop sebanyak 'lifespan' (durasi hidup kunang-kunang)
            for (let i = 0; i < lifespan; i++) {
                // Buat vektor arah acak (random2D) untuk setiap frame kehidupan
                this.genes[i] = p5.Vector.random2D();
                // Batasi kekuatan vektornya (setMag) agar gerakannya tidak terlalu liar (maxForce)
                this.genes[i].setMag(maxForce);
            }
        }
    }

    // Fungsi Crossover: Mengawinkan DNA ini dengan DNA pasangan (partner)
    // Tujuannya untuk menciptakan kombinasi gen baru (anak).
    crossover(partner) {
        let newgenes = [];
        // Pilih titik potong acak di tengah-tengah panjang DNA
        let mid = floor(random(this.genes.length));

        for (let i = 0; i < this.genes.length; i++) {
            // Logika Percampuran
            // Jika index 'i' lebih besar dari titik tengah, ambil gen dari DIRI SENDIRI (this)
            if (i > mid) {
                newgenes[i] = this.genes[i];
            }
            // Jika tidak (index 'i' di awal), ambil gen dari PASANGAN (partner)
            else {
                newgenes[i] = partner.genes[i];
            }
            // Hasilnya: Anak akan punya setengah sifat Ayah dan setengah sifat Ibu
        }
        // Kembalikan object DNA baru berisi gen campuran tadi
        return new DNA(newgenes);
    }

    // Fungsi Mutasi: Menambahkan variasi acak agar evolusi tidak macet
    // 'mutationRate' menentukan seberapa sering mutasi terjadi (misal 0.01 atau 1%)
    mutation(mutationRate) {
        for (let i = 0; i < this.genes.length; i++) {
            // Cek probabilitas: Apakah gen ke-'i' ini harus bermutasi?
            // Jika angka random (0-1) lebih kecil dari mutationRate, maka LAKUKAN MUTASI
            if (random(1) < mutationRate) {
                // Ganti gen lama dengan vektor arah yang benar-benar baru & acak
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(maxForce);
            }
            // Jika tidak kena mutasi, gen dibiarkan apa adanya.
        }
    }
}