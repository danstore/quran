// این فایل برای مدیریت داده‌های قرآن استفاده می‌شود
// در نسخه نهایی، داده‌ها از API بارگیری می‌شوند

const quranData = {
    totalVerses: 6236,
    totalChapters: 114,
    totalJuzs: 30,
    totalPages: 604,
    
    // اطلاعات اضافی در مورد ساختار قرآن
    metaData: {
        revelationPlaces: ["Meccan", "Medinan"],
        chapterGroups: ["Mufassal", "Mi'un", "Mathani", "Twal"],
    },
    
    // مشخصات API‌های مورد استفاده
    apis: {
        quran: "https://api.alquran.cloud/v1/quran/ar.alafasy",
        translation: "https://api.alquran.cloud/v1/quran/fa.makarem",
        
        // API‌های صوتی برای قاریان مختلف
        reciters: {
            alafasy: "https://api.alquran.cloud/v1/quran/ar.alafasy",
            minshawi: "https://api.alquran.cloud/v1/quran/ar.minshawi",
            husary: "https://api.alquran.cloud/v1/quran/ar.husary", 
            abdulbasit: "https://api.alquran.cloud/v1/quran/ar.abdulbasit",
            sudais: "https://api.alquran.cloud/v1/quran/ar.abdurrahmansudais"
        },
        
        // ترجمه‌های مختلف فارسی (با تمرکز بر فقه شیعه)
        translations: {
            makarem: "https://api.alquran.cloud/v1/quran/fa.makarem",  // آیت‌الله مکارم شیرازی
            ansarian: "https://api.alquran.cloud/v1/quran/fa.ansarian", // استاد حسین انصاریان
            fooladvand: "https://api.alquran.cloud/v1/quran/fa.fooladvand", // محمدمهدی فولادوند
        },
        
        // URL‌های پایه برای فایل‌های صوتی
        audioBaseUrls: {
            recitation: {
                alafasy: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/",
                minshawi: "https://cdn.islamic.network/quran/audio/128/ar.minshawi/",
                husary: "https://cdn.islamic.network/quran/audio/128/ar.husary/",
                abdulbasit: "https://cdn.islamic.network/quran/audio/128/ar.abdulbasit/", 
                sudais: "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmansudais/"
            },
            translation: {
                // منابع قابل اطمینان‌تر با فرمت‌های سازگار با مرورگر
                everyayah: "https://everyayah.com/data/translations_persian/Makarem_Kabiri_128kbps/",
                quran_radio: "https://radio.quranedu.com/fa/translation/",
                tebyan: "https://audio.tebyan.net/Quran/Translation/Makarem/",
                // نسخه‌های مختلف ترجمه گویا
                ansarian: "https://audio.qurancentral.com/translations/fa/ansarian/mp3/",
                bahrampour: "https://audio.qurancentral.com/translations/fa/bahrampour/mp3/", 
                fouladvand: "https://audio.qurancentral.com/translations/fa/fouladvand/mp3/",
                makarem: "https://audio.qurancentral.com/translations/fa/makarem/mp3/",
                qaraati: "https://audio.qurancentral.com/translations/fa/qaraati/mp3/",
                quran_com: "https://api.quran.com/api/v4/chapter_recitations/2/",
                // منابع جایگزین
                alternative1: "https://everyayah.com/data/translations_persian/",
                alternative2: "https://quranwbw.com/assets/audio/translations/fa/"
            }
        }
    }
};

export default quranData;