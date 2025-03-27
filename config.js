export default {
    // تنظیمات نمایش
    display: {
        versesPerPage: 10,          // تعداد آیات در هر صفحه
        showTranslation: true,      // نمایش ترجمه فارسی
        displayBismillah: true,     // نمایش بسم الله در ابتدای هر سوره
    },
    
    // تنظیمات جستجو
    search: {
        highlightResults: true,     // برجسته‌سازی نتایج جستجو
        minSearchLength: 2,         // حداقل تعداد کاراکتر برای جستجو
    },
    
    // تنظیمات صوتی
    audio: {
        defaultReciter: 'alafasy',   // قاری پیش‌فرض
        autoPlayNext: true,          // پخش خودکار آیه بعدی
        showPlayer: true,            // نمایش کنترل‌های پخش
        autoPlayTranslation: true,   // پخش خودکار ترجمه گویا پس از هر آیه
    },
    
    // تنظیمات ترجمه
    translation: {
        defaultTranslation: 'makarem', // ترجمه پیش‌فرض (فقه شیعه - مکارم شیرازی)
        showAudioTranslation: true,    // نمایش دکمه پخش ترجمه گویا
        defaultTranslationNarrator: 'everyayah', // گوینده پیش‌فرض ترجمه گویا
        fallbackNarrators: ['quran_radio', 'tebyan', 'makarem', 'ansarian', 'bahrampour'], // گویندگان جایگزین در صورت خطا
    }
};