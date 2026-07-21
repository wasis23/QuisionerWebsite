import { JournalMetadata, Question, ResponseItem } from '../types';

export const initialJournalMetadata: JournalMetadata = {
  id: 'j-001',
  slug: 'otonomi-pasien-rme-2026',
  title: 'Otonomi Pasien atas Rekam Medis Elektronik Pasca-Kematian: Rekonstruksi Pengaturan Post-Mortem Privacy melalui Teknologi Blockchain',
  authors: 'Radhika Mahar Dhini (Universitas Duta Bangsa Surakarta) & Frestiany Regina Putri (Politeknik Indonusa Surakarta)',
  institution: 'Faculty of Law, Syiah Kuala University / Universitas Duta Bangsa / Politeknik Indonusa',
  abstractId: 'Perkembangan layanan kesehatan digital telah mentransformasi Rekam Medis Elektronik (RME) menjadi data kesehatan bernilai tinggi yang mengandung informasi pribadi sangat sensitif. Namun, hukum Indonesia belum mengatur secara spesifik mengenai hak privasi data rekam medis pasien setelah meninggal dunia (post-mortem privacy). Penelitian ini menganalisis rekonstruksi hukum pengaturan privasi pasca-kematian dengan memanfaatkan teknologi blockchain untuk menjamin immutabilitas, keamanan data, dan pelaksanaan Electronic Advance Directive.',
  abstractEn: 'The development of digital health services has transformed Electronic Health Records (EHR/RME) into high-value health data containing highly sensitive personal information. However, Indonesian law has not specifically regulated the privacy rights of patient medical records after death (post-mortem privacy). This study analyzes the legal reconstruction of post-mortem privacy management utilizing blockchain technology to ensure data immutability, security, and execution of Electronic Advance Directives.',
  pdfPathId: '/Indonesia.pdf',
  pdfPathEn: '/English.pdf',
  status: 'active',
  isOpen: true,
  deadline: '2026-12-31',
  keywords: ['Rekam Medis Elektronik', 'Otonomi Pasien', 'Post-Mortem Privacy', 'Teknologi Blockchain', 'Perlindungan Data Kesehatan'],
};

export const initialQuestions: Question[] = [
  // Bagian II. Pengetahuan Responden (Skala: 1-5)
  {
    id: 'q_k1',
    section: 'knowledge',
    text: 'Saya memahami konsep Rekam Medis Elektronik (RME).',
    type: 'comprehension',
    required: true,
    order: 1,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k2',
    section: 'knowledge',
    text: 'Saya mengetahui kerahasiaan rekam medis tetap berlaku setelah pasien meninggal.',
    type: 'comprehension',
    required: true,
    order: 2,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k3',
    section: 'knowledge',
    text: 'Saya mengetahui adanya pengaturan hukum perlindungan data kesehatan di Indonesia.',
    type: 'comprehension',
    required: true,
    order: 3,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k4',
    section: 'knowledge',
    text: 'Saya memahami konsep Patient Autonomy.',
    type: 'comprehension',
    required: true,
    order: 4,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k5',
    section: 'knowledge',
    text: 'Saya pernah mendengar konsep Post-Mortem Privacy.',
    type: 'comprehension',
    required: true,
    order: 5,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k6',
    section: 'knowledge',
    text: 'Saya mengetahui bahwa teknologi blockchain dapat digunakan untuk mengamankan data digital.',
    type: 'comprehension',
    required: true,
    order: 6,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k7',
    section: 'knowledge',
    text: 'Saya memahami bahwa blockchain memiliki karakteristik data yang sulit diubah (immutable).',
    type: 'comprehension',
    required: true,
    order: 7,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },
  {
    id: 'q_k8',
    section: 'knowledge',
    text: 'Saya memahami bahwa Blockchain dapat memberikan bukti digital yang lebih kuat apabila terjadi sengketa hukum.',
    type: 'comprehension',
    required: true,
    order: 8,
    customScaleLabels: {
      1: 'Sangat Tidak Paham',
      2: 'Tidak Paham',
      3: 'Cukup Paham',
      4: 'Paham',
      5: 'Sangat Paham'
    }
  },

  // Bagian III. Penilaian Jurnal (Skala 1-5)
  {
    id: 'q_e1',
    section: 'evaluation',
    text: 'Topik penelitian relevan dengan isu terkini privasi data kesehatan.',
    type: 'readability',
    required: true,
    order: 9,
    customScaleLabels: {
      1: 'Sangat Tidak Relevan',
      2: 'Tidak Relevan',
      3: 'Cukup Relevan',
      4: 'Relevan',
      5: 'Sangat Relevan'
    }
  },
  {
    id: 'q_e2',
    section: 'evaluation',
    text: 'Permasalahan yang diteliti memiliki urgensi tinggi.',
    type: 'readability',
    required: true,
    order: 10,
    customScaleLabels: {
      1: 'Sangat Rendah',
      2: 'Rendah',
      3: 'Cukup',
      4: 'Tinggi',
      5: 'Sangat Tinggi'
    }
  },
  {
    id: 'q_e3',
    section: 'evaluation',
    text: 'Jurnal memiliki nilai kebaruan (novelty) ilmu pengetahuan.',
    type: 'readability',
    required: true,
    order: 11,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e4',
    section: 'evaluation',
    text: 'Latar belakang penelitian dipaparkan dengan jelas dan rinci.',
    type: 'readability',
    required: true,
    order: 12,
    customScaleLabels: {
      1: 'Sangat Sulit Dimengerti',
      2: 'Sulit Dimengerti',
      3: 'Cukup Dimengerti',
      4: 'Mudah Dimengerti',
      5: 'Sangat Mudah Dimengerti'
    }
  },
  {
    id: 'q_e5',
    section: 'evaluation',
    text: 'Rumusan masalah dirumuskan dengan tegas dan tajam.',
    type: 'readability',
    required: true,
    order: 13,
    customScaleLabels: {
      1: 'Sangat Tidak Jelas',
      2: 'Tidak Jelas',
      3: 'Cukup Jelas',
      4: 'Jelas',
      5: 'Sangat Jelas'
    }
  },
  {
    id: 'q_e6',
    section: 'evaluation',
    text: 'Tujuan penelitian terarah dan terukur.',
    type: 'readability',
    required: true,
    order: 14,
    customScaleLabels: {
      1: 'Sangat Tidak Jelas',
      2: 'Tidak Jelas',
      3: 'Cukup Jelas',
      4: 'Jelas',
      5: 'Sangat Jelas'
    }
  },
  {
    id: 'q_e7',
    section: 'evaluation',
    text: 'Argumentasi hukum dalam pembahasannya terstruktur dan logis.',
    type: 'readability',
    required: true,
    order: 15,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e8',
    section: 'evaluation',
    text: 'Analisis regulasi dan perundang-undangan memadai.',
    type: 'readability',
    required: true,
    order: 16,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e9',
    section: 'evaluation',
    text: 'Perbandingan pengaturan antar negara memberikan nilai tambah.',
    type: 'readability',
    required: true,
    order: 17,
    customScaleLabels: {
      1: 'Sangat Rendah',
      2: 'Rendah',
      3: 'Cukup',
      4: 'Tinggi',
      5: 'Sangat Tinggi'
    }
  },
  {
    id: 'q_e10',
    section: 'evaluation',
    text: 'Konsep Patient Autonomy dijelaskan secara mendalam.',
    type: 'readability',
    required: true,
    order: 18,
    customScaleLabels: {
      1: 'Sangat Sulit Dimengerti',
      2: 'Sulit Dimengerti',
      3: 'Cukup Dimengerti',
      4: 'Mudah Dimengerti',
      5: 'Sangat Mudah Dimengerti'
    }
  },
  {
    id: 'q_e11',
    section: 'evaluation',
    text: 'Konsep Post-Mortem Privacy dijelaskan dengan artikulatif.',
    type: 'readability',
    required: true,
    order: 19,
    customScaleLabels: {
      1: 'Sangat Sulit Dimengerti',
      2: 'Sulit Dimengerti',
      3: 'Cukup Dimengerti',
      4: 'Mudah Dimengerti',
      5: 'Sangat Mudah Dimengerti'
    }
  },
  {
    id: 'q_e12',
    section: 'evaluation',
    text: 'Konsep integrasi Blockchain mudah dipahami oleh pembaca non-teknis.',
    type: 'readability',
    required: true,
    order: 20,
    customScaleLabels: {
      1: 'Sangat Sulit Dimengerti',
      2: 'Sulit Dimengerti',
      3: 'Cukup Dimengerti',
      4: 'Mudah Dimengerti',
      5: 'Sangat Mudah Dimengerti'
    }
  },
  {
    id: 'q_e13',
    section: 'evaluation',
    text: 'Usulan rekonstruksi hukum realistis untuk diimplementasikan di Indonesia.',
    type: 'readability',
    required: true,
    order: 21,
    customScaleLabels: {
      1: 'Sangat Tidak Realistis',
      2: 'Tidak Realistis',
      3: 'Cukup Realistis',
      4: 'Realistis',
      5: 'Sangat Realistis'
    }
  },
  {
    id: 'q_e14',
    section: 'evaluation',
    text: 'Penggunaan Blockchain terbukti meningkatkan derajat keamanan RME.',
    type: 'readability',
    required: true,
    order: 22,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e15',
    section: 'evaluation',
    text: 'Electronic Advance Directive merupakan solusi tepat untuk perlindungan RME pasca-kematian.',
    type: 'readability',
    required: true,
    order: 23,
    customScaleLabels: {
      1: 'Sangat Tidak Tepat',
      2: 'Tidak Tepat',
      3: 'Cukup Tepat',
      4: 'Tepat',
      5: 'Sangat Tepat'
    }
  },
  {
    id: 'q_e16',
    section: 'evaluation',
    text: 'Model usulan mampu melindungi hak keperdataan dan privasi pasien.',
    type: 'readability',
    required: true,
    order: 24,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e17',
    section: 'evaluation',
    text: 'Model usulan memberikan kepastian hukum bagi institusi pelayanan kesehatan.',
    type: 'readability',
    required: true,
    order: 25,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e18',
    section: 'evaluation',
    text: 'Model usulan dapat mengurangi konflik sengketa hukum antara ahli waris dan RS.',
    type: 'readability',
    required: true,
    order: 26,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e19',
    section: 'evaluation',
    text: 'Model usulan membantu kelancaran tugas profesional Perekam Medis.',
    type: 'readability',
    required: true,
    order: 27,
    customScaleLabels: {
      1: 'Sangat Buruk',
      2: 'Buruk',
      3: 'Cukup',
      4: 'Baik',
      5: 'Sangat Baik'
    }
  },
  {
    id: 'q_e20',
    section: 'evaluation',
    text: 'Rumah sakit dan fasilitas kesehatan memerlukan regulasi turunan yang lebih rinci.',
    type: 'readability',
    required: true,
    order: 28,
    customScaleLabels: {
      1: 'Sangat Tidak Perlunya',
      2: 'Tidak Perlu',
      3: 'Cukup Perlu',
      4: 'Perlu',
      5: 'Sangat Perlu'
    }
  },
  {
    id: 'q_e21',
    section: 'evaluation',
    text: 'Pasien berhak secara penuh menentukan persetujuan akses RME pasca-kematian.',
    type: 'readability',
    required: true,
    order: 29,
    customScaleLabels: {
      1: 'Sangat Tidak Setuju',
      2: 'Tidak Setuju',
      3: 'Cukup Setuju',
      4: 'Setuju',
      5: 'Sangat Setuju'
    }
  },
  {
    id: 'q_e22',
    section: 'evaluation',
    text: 'Teknologi Blockchain sangat layak dipertimbangkan dalam sistem kesehatan nasional.',
    type: 'readability',
    required: true,
    order: 30,
    customScaleLabels: {
      1: 'Sangat Tidak Layak',
      2: 'Tidak Layak',
      3: 'Cukup Layak',
      4: 'Layak',
      5: 'Sangat Layak'
    }
  },
  {
    id: 'q_e23',
    section: 'evaluation',
    text: 'Mendukung penuh perubahan/amandemen regulasi perlindungan data kesehatan.',
    type: 'readability',
    required: true,
    order: 31,
    customScaleLabels: {
      1: 'Sangat Tidak Mendukung',
      2: 'Tidak Mendukung',
      3: 'Cukup Mendukung',
      4: 'Mendukung',
      5: 'Sangat Mendukung'
    }
  },

  // Bagian IV. Review Terbuka & Star Rating
  {
    id: 'q_r1',
    section: 'review',
    text: 'Apa kelebihan utama dari artikel jurnal ini?',
    type: 'text',
    required: true,
    order: 32,
  },
  {
    id: 'q_r2',
    section: 'review',
    text: 'Apa kekurangan atau hal yang perlu diperbaiki dari artikel ini?',
    type: 'text',
    required: true,
    order: 33,
  },
  {
    id: 'q_r3',
    section: 'review',
    text: 'Saran dan rekomendasi untuk pengembangan penelitian selanjutnya?',
    type: 'text',
    required: true,
    order: 34,
  },
  {
    id: 'q_r4',
    section: 'review',
    text: 'Penilaian Keseluruhan (Overall Quality Rating 1-5 Bintang)',
    type: 'star',
    required: true,
    order: 35,
    customScaleLabels: {
      1: '⭐ Sangat Buruk',
      2: '⭐⭐ Buruk',
      3: '⭐⭐⭐ Cukup Baik',
      4: '⭐⭐⭐⭐ Sangat Baik',
      5: '⭐⭐⭐⭐⭐ Luar Biasa / Kualitas Tinggi'
    }
  }
];

export const initialResponses: ResponseItem[] = [
  {
    id: 'resp-101',
    timestamp: '2026-07-21T10:15:22Z',
    languageRead: 'id',
    timeSpentSeconds: 420,
    respondent: {
      name: 'Dr. Hendra Wijaya, S.H., M.H.',
      gender: 'Laki-Laki',
      age: '36-45 tahun',
      education: 'S3 (Doktor)',
      occupation: 'Dosen Hukum Kesehatan',
    },
    answers: {
      q_k1: 5, q_k2: 5, q_k3: 4, q_k4: 5, q_k5: 4, q_k6: 4, q_k7: 5, q_k8: 4,
      q_e1: 5, q_e2: 5, q_e3: 4, q_e4: 4, q_e5: 5, q_e6: 5, q_e7: 4, q_e8: 5,
      q_e9: 4, q_e10: 5, q_e11: 4, q_e12: 3, q_e13: 4, q_e14: 4, q_e15: 5,
      q_e16: 5, q_e17: 4, q_e18: 4, q_e19: 4, q_e20: 5, q_e21: 5, q_e22: 4, q_e23: 5,
      q_r1: 'Pendekatan interdisipliner antara hukum kesehatan dan teknologi blockchain sangat menarik dan komprehensif.',
      q_r2: 'Aspek implementasi teknis smart contract di rumah sakit tipe C/D belum dibahas mendalam.',
      q_r3: 'Penelitian berikutnya dapat melakukan studi empiris uji coba prototipe di salah satu RS rujukan.',
      q_r4: 5
    }
  },
  {
    id: 'resp-102',
    timestamp: '2026-07-21T11:04:10Z',
    languageRead: 'en',
    timeSpentSeconds: 510,
    respondent: {
      name: 'Dr. Sarah Jenkins, M.Sc',
      gender: 'Perempuan',
      age: '26-35 tahun',
      education: 'S2 (Magister)',
      occupation: 'Health Informatics Researcher',
    },
    answers: {
      q_k1: 5, q_k2: 4, q_k3: 3, q_k4: 5, q_k5: 5, q_k6: 5, q_k7: 5, q_k8: 5,
      q_e1: 5, q_e2: 5, q_e3: 5, q_e4: 4, q_e5: 4, q_e6: 5, q_e7: 4, q_e8: 4,
      q_e9: 5, q_e10: 4, q_e11: 5, q_e12: 4, q_e13: 4, q_e14: 5, q_e15: 4,
      q_e16: 4, q_e17: 4, q_e18: 3, q_e19: 4, q_e20: 4, q_e21: 5, q_e22: 5, q_e23: 4,
      q_r1: 'Clear articulate structure on post-mortem privacy rights and robust comparative study.',
      q_r2: 'Needs more diagrammatic explanation of permissioned vs public blockchain nodes.',
      q_r3: 'Provide framework for cross-border data transfer security.',
      q_r4: 4
    }
  },
  {
    id: 'resp-103',
    timestamp: '2026-07-21T11:45:30Z',
    languageRead: 'id',
    timeSpentSeconds: 340,
    respondent: {
      name: 'Budi Santoso, Amd.PK',
      gender: 'Laki-Laki',
      age: '26-35 tahun',
      education: 'D3 / D4',
      occupation: 'Perekam Medis & Informasi Kesehatan',
    },
    answers: {
      q_k1: 5, q_k2: 4, q_k3: 4, q_k4: 3, q_k5: 3, q_k6: 3, q_k7: 4, q_k8: 4,
      q_e1: 4, q_e2: 5, q_e3: 4, q_e4: 5, q_e5: 4, q_e6: 4, q_e7: 4, q_e8: 4,
      q_e9: 3, q_e10: 4, q_e11: 3, q_e12: 3, q_e13: 4, q_e14: 4, q_e15: 4,
      q_e16: 4, q_e17: 5, q_e18: 5, q_e19: 5, q_e20: 5, q_e21: 4, q_e22: 4, q_e23: 5,
      q_r1: 'Sangat relevan dengan kebutuhan praktisi perekam medis di faskes yang sering bingung memberikan izin rekam medis pasien wafat.',
      q_r2: 'Istilah teknis blockchain agak sulit bagi praktisi medis non-IT.',
      q_r3: 'Buatkan panduan SOP praktis untuk rumah sakit.',
      q_r4: 4
    }
  },
  {
    id: 'resp-104',
    timestamp: '2026-07-21T13:20:15Z',
    languageRead: 'id',
    timeSpentSeconds: 290,
    respondent: {
      name: 'Nadia Putri, S.H.',
      gender: 'Perempuan',
      age: '18-25 tahun',
      education: 'S1 (Sarjana)',
      occupation: 'Mahasiswa Pascasarjana Hukum',
    },
    answers: {
      q_k1: 4, q_k2: 5, q_k3: 5, q_k4: 4, q_k5: 4, q_k6: 4, q_k7: 3, q_k8: 4,
      q_e1: 5, q_e2: 4, q_e3: 4, q_e4: 4, q_e5: 4, q_e6: 4, q_e7: 5, q_e8: 5,
      q_e9: 4, q_e10: 4, q_e11: 4, q_e12: 2, q_e13: 3, q_e14: 4, q_e15: 4,
      q_e16: 4, q_e17: 4, q_e18: 4, q_e19: 3, q_e20: 5, q_e21: 5, q_e22: 4, q_e23: 4,
      q_r1: 'Analisis norma pasal-pasal UU PDP dan UU Kesehatan sangat tajam.',
      q_r2: 'Bahasa teknologi perlu diperhalus agar pembaca sarjana hukum lebih mudah mengikuti.',
      q_r3: 'Dapat ditambahkan perbandingan dengan negara di kawasan ASEAN.',
      q_r4: 4
    }
  },
  {
    id: 'resp-105',
    timestamp: '2026-07-21T14:10:00Z',
    languageRead: 'en',
    timeSpentSeconds: 380,
    respondent: {
      name: 'Marcus Vance',
      gender: 'Laki-Laki',
      age: '36-45 tahun',
      education: 'S2 (Magister)',
      occupation: 'Cybersecurity Analyst in Healthcare',
    },
    answers: {
      q_k1: 5, q_k2: 5, q_k3: 4, q_k4: 4, q_k5: 5, q_k6: 5, q_k7: 5, q_k8: 5,
      q_e1: 5, q_e2: 5, q_e3: 5, q_e4: 5, q_e5: 4, q_e6: 5, q_e7: 4, q_e8: 4,
      q_e9: 4, q_e10: 4, q_e11: 4, q_e12: 5, q_e13: 4, q_e14: 5, q_e15: 5,
      q_e16: 5, q_e17: 5, q_e18: 4, q_e19: 4, q_e20: 4, q_e21: 5, q_e22: 5, q_e23: 5,
      q_r1: 'Strong conceptualization of cryptographic access control for post-mortem EHRs.',
      q_r2: 'Scalability benchmarks could enhance technical validity.',
      q_r3: 'Evaluate gas cost / transaction cost for Electronic Advance Directives.',
      q_r4: 5
    }
  }
];
