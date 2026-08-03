# LANGKAH PINDAH CINEMA PROMPT STUDIO KE AKUN CLAUDE BARU

Ikuti berurutan. Sekitar 15 menit.

---

## LANGKAH 1 — Download 4 file ini (dari chat ini)

Semua file sudah saya sediakan di chat ini. Tekan tombol download di masing-masing:

1. **CPS-ACCOUNT-TRANSFER.md** — konteks lengkap project
2. **cinema-prompt-studio-progress.md** — riwayat versi V1 sampai V4.7
3. **PRIMER-paste-di-akun-baru.md** — teks yang akan kamu paste nanti
4. **cinema-prompt-studio-user-guide.md** — ini file yang KAMU upload ke chat ini. Kalau masih ada di komputermu, pakai yang itu. Kalau hilang, cari di repo (`USER_GUIDE.md`).

Simpan semuanya di satu folder, misalnya `~/Downloads/cps-pindah/`.

---

## LANGKAH 2 — Cek apa lagi yang perlu diselamatkan dari akun lama

Buka Project Cinema Prompt Studio di akun lama:

- **Project instructions** — kalau ada isinya, blok semua teksnya, copy, simpan ke file `.txt` di folder yang sama. Ini tidak ikut pindah otomatis.
- **File di Project knowledge** — kalau ada file lain selain yang di atas, download satu per satu dari panel Project. File asli hanya bisa diambil dari sini.
- **Artifact** — kalau ada artifact penting, tekan tombol download di panel artifact.

Kalau Project-mu isinya cuma chat dan file yang sudah saya buatkan, langkah ini bisa dilewati.

---

## LANGKAH 3 — Buat Project di akun baru

1. Login ke akun Claude yang baru.
2. Di sidebar kiri, klik **Projects** → **New project**.
3. Nama: `Cinema Prompt Studio`
4. Kalau di akun lama ada Project instructions, paste isinya ke kolom instructions di sini.

---

## LANGKAH 4 — Upload file ke Project knowledge

Di dalam Project baru, cari panel knowledge / "Add content", lalu upload:

- CPS-ACCOUNT-TRANSFER.md
- cinema-prompt-studio-progress.md
- cinema-prompt-studio-user-guide.md

**PRIMER tidak perlu diupload** — file itu cuma untuk kamu buka dan copy isinya di langkah berikutnya.

---

## LANGKAH 5 — Mulai chat pertama dengan primer

1. Buka file **PRIMER-paste-di-akun-baru.md** di komputermu (pakai TextEdit, Notepad, atau editor apa saja).
2. Copy semua teks yang ada **di bawah garis `---`**.
3. Di dalam Project baru, mulai chat baru, paste teks itu, kirim.

---

## LANGKAH 6 — Verifikasi

Claude di akun baru harus bisa menjawab tiga hal dengan benar:

1. **Posisi backlog** → sedang verifikasi V4.5 flat grade, lalu test Blocking, lalu V4.6.
2. **Dua keputusan V4.6 yang sudah dikunci** → thumbnail opsi C (96px data URL, characters only) dan Help sebagai modal context-aware.
3. **Tiga keputusan V4.7 yang masih terbuka** → chips saja vs chips + cm manual; guard always-on vs toggle; konfirmasi V4.7 jadi versi sendiri.

Kalau salah satu meleset, suruh dia baca ulang CPS-ACCOUNT-TRANSFER.md bagian Part 5. Jangan lanjut kerja sebelum ketiganya benar.

---

## LANGKAH 7 — Sisi kode (tidak perlu dipindah)

Repo `sefruitlifeid-arch/cinema-prompt-studio` sudah berisi handoff package lengkap (`CLAUDE.md`, `HANDOFF.md`, `PRODUCT_DECISIONS.md`, dll). Claude Code di akun baru otomatis membaca `CLAUDE.md` begitu kamu buka folder projectnya. Jadi tidak ada yang perlu dimigrasi di sisi kode — cukup login Claude Code dengan akun baru.

---

## LANGKAH 8 — Tutup akun lama untuk project ini

Berhenti mengerjakan CPS di akun lama supaya keputusan tidak terbelah di dua tempat. Kalau perlu, arsipkan Projectnya.

---

## CATATAN PENTING

**Yang TIDAK ikut pindah, apa pun yang kamu lakukan:**

- **Riwayat chat** — tidak bisa diimpor ke akun personal lain. Ini kenapa CPS-ACCOUNT-TRANSFER.md dibuat: isinya rangkuman semua keputusan penting dari chat-chat tersebut.
- **Memory Claude** — memory tinggal di backend Anthropic, tidak bisa diekspor maupun diimpor. Akun baru mulai dari nol dan akan membentuk memory sendiri seiring sesi berjalan.
- **Custom skills** — tidak ada jalur migrasi. Kalau kamu punya skill custom (misalnya banana-pro-director, cinema-worldbuilder, video-prompting), export dulu dari akun lama sebelum berhenti pakai.
- **Koneksi ke aplikasi** (misalnya Higgsfield) — harus dihubungkan ulang di akun baru.

**Kenapa tidak ada cara otomatis:** Anthropic tidak mendukung migrasi data antar akun personal, dan hasil export akun tidak bisa diimpor ke akun personal lain. Export akun (Settings → Privacy → Export data) hanya menghasilkan JSON untuk arsip pribadi. Satu-satunya migrasi resmi adalah akun personal → organisasi Team/Enterprise, satu arah.
