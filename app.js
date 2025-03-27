import quranData from 'quran-data';
import config from 'config';

document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loading');
    const quranDisplay = document.getElementById('quranDisplay');
    const surahList = document.getElementById('surahList');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    // متغیرهای مربوط به پخش صوت
    let currentAudio = null;
    let currentTranslationAudio = null;
    let isPlaying = false;
    let currentlyPlayingVerse = null;
    let currentReciter = config.audio.defaultReciter;
    let currentTranslation = config.translation.defaultTranslation;
    let currentTranslationNarrator = config.translation.defaultTranslationNarrator;

    let quran = null;
    let currentSurah = null;
    let currentPage = 1;
    let totalPages = 1;
    let currentVerses = [];
    let searchResults = [];
    let isSearchMode = false;

    // بارگذاری قرآن از API
    try {
        // بارگذاری متن عربی قرآن
        const response = await fetch(quranData.apis.reciters[currentReciter]);
        const arabicData = await response.json();
        
        // بارگذاری ترجمه فارسی (فقه شیعه - آیت‌الله مکارم شیرازی)
        const translationResponse = await fetch(quranData.apis.translations[currentTranslation]);
        const translationData = await translationResponse.json();
        
        quran = {
            surahs: arabicData.data.surahs.map((surah, index) => {
                return {
                    number: surah.number,
                    name: surah.name,
                    englishName: surah.englishName,
                    englishNameTranslation: surah.englishNameTranslation,
                    numberOfAyahs: surah.ayahs.length,
                    revelationType: surah.revelationType,
                    ayahs: surah.ayahs.map((ayah, ayahIndex) => {
                        return {
                            number: ayah.number,
                            text: ayah.text,
                            numberInSurah: ayah.numberInSurah,
                            juz: ayah.juz,
                            page: ayah.page,
                            translation: translationData.data.surahs[index].ayahs[ayahIndex].text,
                            // اضافه کردن URL فایل‌های صوتی با فرمت MP3
                            audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}${ayah.number}.mp3`,
                            translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}${surah.number}_${ayah.numberInSurah}.mp3`
                        };
                    })
                };
            })
        };
        
        // پر کردن لیست سوره‌ها
        populateSurahList();
        
        // اضافه کردن قسمت تنظیمات صوتی
        addAudioSettings();
        
        // نمایش اولین سوره به صورت پیش‌فرض
        displaySurah(1);
        
        loading.style.display = 'none';
    } catch (error) {
        console.error('Error loading Quran data:', error);
        // استفاده از داده های پیش فرض برای نمایش سوره فاتحه در صورت خطا
        quran = {
            surahs: [{
                number: 1,
                name: "الفاتحة",
                englishName: "Al-Fatiha",
                englishNameTranslation: "The Opening",
                numberOfAyahs: 7,
                revelationType: "Meccan",
                ayahs: [
                    {
                        number: 1,
                        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
                        numberInSurah: 1,
                        juz: 1,
                        page: 1,
                        translation: "به نام خداوند بخشنده مهربان",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}1.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_1.mp3`
                    },
                    {
                        number: 2,
                        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
                        numberInSurah: 2,
                        juz: 1,
                        page: 1,
                        translation: "ستایش برای خداوند پروردگار جهانیان",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}2.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_2.mp3`
                    },
                    {
                        number: 3,
                        text: "الرَّحْمَٰنِ الرَّحِيمِ",
                        numberInSurah: 3,
                        juz: 1,
                        page: 1,
                        translation: "بخشنده و مهربان",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}3.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_3.mp3`
                    },
                    {
                        number: 4,
                        text: "مَالِكِ يَوْمِ الدِّينِ",
                        numberInSurah: 4,
                        juz: 1,
                        page: 1,
                        translation: "مالک روز جزا",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}4.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_4.mp3`
                    },
                    {
                        number: 5,
                        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
                        numberInSurah: 5,
                        juz: 1,
                        page: 1,
                        translation: "تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}5.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_5.mp3`
                    },
                    {
                        number: 6,
                        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
                        numberInSurah: 6,
                        juz: 1,
                        page: 1,
                        translation: "ما را به راه راست هدایت کن",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}6.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_6.mp3`
                    },
                    {
                        number: 7,
                        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
                        numberInSurah: 7,
                        juz: 1,
                        page: 1,
                        translation: "راه کسانی که آنها را نعمت داده‌ای، نه کسانی که بر آنها خشم کرده‌ای و نه گمراهان",
                        audioUrl: `${quranData.apis.audioBaseUrls.recitation[currentReciter]}7.mp3`,
                        translationAudioUrl: `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}1_7.mp3`
                    }
                ]
            }]
        };
        
        populateSurahList();
        addAudioSettings();
        displaySurah(1);
        quranDisplay.innerHTML += `<div class="error">خطا در بارگذاری کامل قرآن. لطفاً اتصال اینترنت خود را بررسی و صفحه را دوباره بارگذاری کنید.</div>`;
        loading.style.display = 'none';
    }

    // اضافه کردن تنظیمات صوتی
    function addAudioSettings() {
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container';
        
        const settingsHTML = `
            <div class="settings-row">
                <div class="settings-group">
                    <label for="reciterSelect">قاری:</label>
                    <select id="reciterSelect" class="reciter-selector">
                        <option value="alafasy" ${currentReciter === 'alafasy' ? 'selected' : ''}>مشاری العفاسی</option>
                        <option value="minshawi" ${currentReciter === 'minshawi' ? 'selected' : ''}>محمد صدیق منشاوی</option>
                        <option value="husary" ${currentReciter === 'husary' ? 'selected' : ''}>محمود خلیل الحصری</option>
                        <option value="abdulbasit" ${currentReciter === 'abdulbasit' ? 'selected' : ''}>عبدالباسط عبدالصمد</option>
                        <option value="sudais" ${currentReciter === 'sudais' ? 'selected' : ''}>عبدالرحمن السدیس</option>
                    </select>
                </div>
                <div class="settings-group">
                    <label for="translationSelect">ترجمه:</label>
                    <select id="translationSelect" class="translation-selector">
                        <option value="makarem" ${currentTranslation === 'makarem' ? 'selected' : ''}>آیت‌الله مکارم شیرازی</option>
                        <option value="ansarian" ${currentTranslation === 'ansarian' ? 'selected' : ''}>استاد حسین انصاریان</option>
                        <option value="fooladvand" ${currentTranslation === 'fooladvand' ? 'selected' : ''}>محمدمهدی فولادوند</option>
                    </select>
                </div>
                <div class="settings-group">
                    <label for="translationNarratorSelect">گوینده ترجمه گویا:</label>
                    <select id="translationNarratorSelect" class="translation-narrator-selector">
                        <option value="everyayah" ${currentTranslationNarrator === 'everyayah' ? 'selected' : ''}>مکارم شیرازی (منبع موثق)</option>
                        <option value="quran_radio" ${currentTranslationNarrator === 'quran_radio' ? 'selected' : ''}>رادیو قرآن (منبع موثق)</option>
                        <option value="tebyan" ${currentTranslationNarrator === 'tebyan' ? 'selected' : ''}>تبیان (منبع موثق)</option>
                        <option value="ansarian" ${currentTranslationNarrator === 'ansarian' ? 'selected' : ''}>استاد حسین انصاریان</option>
                        <option value="bahrampour" ${currentTranslationNarrator === 'bahrampour' ? 'selected' : ''}>استاد بهرام‌پور</option>
                        <option value="makarem" ${currentTranslationNarrator === 'makarem' ? 'selected' : ''}>آیت‌الله مکارم شیرازی</option>
                        <option value="qaraati" ${currentTranslationNarrator === 'qaraati' ? 'selected' : ''}>حجت‌الاسلام قرائتی</option>
                        <option value="quran_com" ${currentTranslationNarrator === 'quran_com' ? 'selected' : ''}>ترجمه گویا Quran.com</option>
                    </select>
                </div>
                <div class="settings-group">
                    <label for="autoPlayNext">پخش خودکار آیه بعدی:</label>
                    <input type="checkbox" id="autoPlayNext" ${config.audio.autoPlayNext ? 'checked' : ''}>
                </div>
            </div>
        `;
        
        settingsContainer.innerHTML = settingsHTML;
        
        // اصلاح: روش ساده‌تر برای اضافه کردن تنظیمات به تگ مناسب
        const filterInfo = document.querySelector('.filter-info');
        if (filterInfo) {
            filterInfo.insertAdjacentElement('beforebegin', settingsContainer);
        } else {
            // اگر .filter-info نبود، به header اضافه می‌کنیم
            const header = document.querySelector('header');
            if (header) {
                header.insertAdjacentElement('afterend', settingsContainer);
            }
        }
        
        // اضافه کردن event listener برای تغییر قاری
        document.getElementById('reciterSelect').addEventListener('change', async (e) => {
            currentReciter = e.target.value;
            await changeReciter(currentReciter);
        });
        
        // اضافه کردن event listener برای تغییر ترجمه
        document.getElementById('translationSelect').addEventListener('change', async (e) => {
            currentTranslation = e.target.value;
            await changeTranslation(currentTranslation);
        });
        
        // اضافه کردن event listener برای تغییر گوینده ترجمه گویا
        document.getElementById('translationNarratorSelect').addEventListener('change', (e) => {
            currentTranslationNarrator = e.target.value;
            // بروزرسانی URL‌های ترجمه گویا
            quran.surahs.forEach((surah) => {
                surah.ayahs.forEach((ayah) => {
                    if (currentTranslationNarrator === 'quran_com') {
                        ayah.translationAudioUrl = `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}${ayah.numberInSurah}`;
                    } else if (currentTranslationNarrator === 'everyayah') {
                        ayah.translationAudioUrl = `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}${surah.number.toString().padStart(3, '0')}${ayah.numberInSurah.toString().padStart(3, '0')}.mp3`;
                    } else if (currentTranslationNarrator === 'quran_radio') {
                        ayah.translationAudioUrl = `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}${surah.number}/${ayah.numberInSurah}.mp3`;
                    } else if (currentTranslationNarrator === 'tebyan') {
                        ayah.translationAudioUrl = `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}${surah.number}_${ayah.numberInSurah}.mp3`;
                    } else {
                        ayah.translationAudioUrl = `${quranData.apis.audioBaseUrls.translation[currentTranslationNarrator]}${surah.number}_${ayah.numberInSurah}.mp3`;
                    }
                });
            });
        });
        
        // اضافه کردن event listener برای تغییر تنظیم پخش خودکار
        document.getElementById('autoPlayNext').addEventListener('change', (e) => {
            config.audio.autoPlayNext = e.target.checked;
        });
    }
    
    // تغییر قاری
    async function changeReciter(reciter) {
        loading.style.display = 'flex';
        try {
            // قطع پخش صوت فعلی
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
                isPlaying = false;
                if (currentlyPlayingVerse) {
                    const playButton = document.querySelector(`#verse-${currentlyPlayingVerse} .play-button`);
                    if (playButton) {
                        playButton.classList.remove('playing');
                        playButton.innerHTML = getPlayIcon();
                    }
                }
                currentlyPlayingVerse = null;
            }
            
            // بارگذاری داده‌های قاری جدید - اصلاح شده با مدیریت خطا
            let reciterData;
            try {
                const response = await fetch(quranData.apis.reciters[reciter]);
                reciterData = await response.json();
            } catch (error) {
                console.error("Error fetching reciter data, using current data instead:", error);
                // در صورت خطا از داده‌های موجود استفاده می‌کنیم
            }
            
            // بروزرسانی URL‌های صوتی
            quran.surahs.forEach((surah, surahIndex) => {
                surah.ayahs.forEach((ayah, ayahIndex) => {
                    ayah.audioUrl = `${quranData.apis.audioBaseUrls.recitation[reciter]}${ayah.number}.mp3`;
                });
            });
            
            // اگر در حالت نمایش سوره یا جزء یا صفحه هستیم، محتوا را دوباره رندر می‌کنیم
            if (currentSurah || currentVerses.length > 0) {
                renderCurrentPage();
            }
            
            loading.style.display = 'none';
        } catch (error) {
            console.error('Error changing reciter:', error);
            loading.style.display = 'none';
            alert('خطا در تغییر قاری. لطفاً دوباره تلاش کنید.');
        }
    }
    
    // تغییر ترجمه
    async function changeTranslation(translation) {
        loading.style.display = 'flex';
        try {
            // بارگذاری ترجمه جدید
            const translationResponse = await fetch(quranData.apis.translations[translation]);
            const translationData = await translationResponse.json();
            
            // بروزرسانی متن ترجمه‌ها
            quran.surahs.forEach((surah, surahIndex) => {
                surah.ayahs.forEach((ayah, ayahIndex) => {
                    ayah.translation = translationData.data.surahs[surahIndex].ayahs[ayahIndex].text;
                });
            });
            
            // اگر در حالت نمایش سوره یا جزء یا صفحه هستیم، محتوا را دوباره رندر می‌کنیم
            if (currentSurah || currentVerses.length > 0) {
                renderCurrentPage();
            }
            
            loading.style.display = 'none';
        } catch (error) {
            console.error('Error changing translation:', error);
            loading.style.display = 'none';
            alert('خطا در تغییر ترجمه. لطفاً دوباره تلاش کنید.');
        }
    }

    // پر کردن لیست سوره‌ها
    function populateSurahList() {
        surahList.innerHTML = '';
        
        quran.surahs.forEach(surah => {
            // برای لیست کناری
            const li = document.createElement('li');
            li.textContent = `${surah.number}. ${surah.name}`;
            li.dataset.surahNumber = surah.number;
            li.addEventListener('click', () => {
                isSearchMode = false;
                displaySurah(surah.number);
                
                // حذف کلاس active از همه آیتم‌ها و اضافه کردن به آیتم انتخاب شده
                document.querySelectorAll('#surahList li').forEach(item => {
                    item.classList.remove('active');
                });
                li.classList.add('active');
            });
            surahList.appendChild(li);
        });
    }

    // Function kept for compatibility but not doing anything
    function populateFilters() {
    }

    // نمایش سوره
    function displaySurah(surahNumber) {
        currentSurah = quran.surahs.find(s => s.number === surahNumber);
        if (!currentSurah) return;
        
        // علامت گذاری سوره انتخاب شده در فهرست
        document.querySelectorAll('#surahList li').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.surahNumber) === surahNumber) {
                item.classList.add('active');
            }
        });
        
        currentVerses = currentSurah.ayahs;
        totalPages = 1; 
        currentPage = 1;
        
        renderCurrentPage();
        updatePagination();
        
        // اسکرول به بالای صفحه
        window.scrollTo(0, 0);
    }

    // نمایش جزء
    function displayJuz(juzNumber) {
        let juzVerses = [];
        
        quran.surahs.forEach(surah => {
            surah.ayahs.forEach(ayah => {
                if (ayah.juz === juzNumber) {
                    juzVerses.push({
                        ...ayah,
                        surahNumber: surah.number,
                        surahName: surah.name
                    });
                }
            });
        });
        
        currentVerses = juzVerses;
        totalPages = Math.ceil(currentVerses.length / config.display.versesPerPage);
        currentPage = 1;
        currentSurah = null;
        
        renderCurrentPage();
        updatePagination();
    }

    // نمایش صفحه قرآن
    function displayPage(pageNumber) {
        let pageVerses = [];
        
        quran.surahs.forEach(surah => {
            surah.ayahs.forEach(ayah => {
                if (ayah.page === pageNumber) {
                    pageVerses.push({
                        ...ayah,
                        surahNumber: surah.number,
                        surahName: surah.name
                    });
                }
            });
        });
        
        currentVerses = pageVerses;
        totalPages = Math.ceil(currentVerses.length / config.display.versesPerPage);
        currentPage = 1;
        currentSurah = null;
        
        renderCurrentPage();
        updatePagination();
    }

    // رندر کردن صفحه فعلی
    function renderCurrentPage() {
        const versesToShow = isSearchMode || !currentSurah ? 
            currentVerses.slice((currentPage - 1) * config.display.versesPerPage, 
                               currentPage * config.display.versesPerPage) : 
            currentVerses;
        
        let html = '';
        
        if (currentSurah && currentPage === 1 && config.display.displayBismillah) {
            // فقط اگر سوره فاتحه یا توبه نباشد بسم الله را نمایش می‌دهیم
            if (currentSurah.number !== 1 && currentSurah.number !== 9) {
                html += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
            }
        }
        
        if (currentSurah) {
            html += `
                <div class="surah-title">
                    <h2>${currentSurah.name}</h2>
                    <div class="meta">
                        ${currentSurah.englishName} - ${currentSurah.ayahs.length} آیه - ${currentSurah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                    </div>
                </div>
            `;
        }
        
        html += '<div class="verses">';
        
        let lastSurahNumber = null;
        
        versesToShow.forEach(verse => {
            // اگر در حالت نمایش جزء یا صفحه هستیم و به سوره جدید رسیدیم
            if (!currentSurah && verse.surahNumber !== lastSurahNumber) {
                const surah = quran.surahs.find(s => s.number === verse.surahNumber);
                html += `
                    <div class="surah-title">
                        <h2>${surah.name}</h2>
                        <div class="meta">
                            ${surah.englishName} - ${surah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                        </div>
                    </div>
                `;
                
                // نمایش بسم الله برای سوره جدید (به جز فاتحه و توبه)
                if (config.display.displayBismillah && verse.surahNumber !== 1 && verse.surahNumber !== 9) {
                    html += `<div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`;
                }
                
                lastSurahNumber = verse.surahNumber;
            }
            
            html += `
                <div class="verse" id="verse-${verse.number}">
                    <div class="verse-arabic verse-clickable" data-verse-number="${verse.number}">${verse.text}</div>
                    ${config.display.showTranslation ? `<div class="verse-translation verse-clickable" data-verse-number="${verse.number}">${verse.translation}</div>` : ''}
                    
                    <div class="verse-audio-controls">
                        <button class="audio-button play-button" data-verse-number="${verse.number}">
                            ${getPlayIcon()} پخش قرائت
                        </button>
                        <button class="audio-button play-translation-button" data-verse-number="${verse.number}">
                            ${getPlayIcon()} پخش ترجمه گویا
                        </button>
                        <!-- Hidden field for custom translation audio path -->
                        <audio id="custom-translation-${verse.number}" class="custom-translation-audio" data-verse-number="${verse.number}" src=""></audio>
                    </div>
                    <span class="verse-number">${verse.numberInSurah}</span>
                </div>
            `;
        });
        
        html += '</div>';
        
        quranDisplay.innerHTML = html;
        
        // اگر در حالت جستجو هستیم، نتایج را برجسته می‌کنیم
        if (isSearchMode && config.search.highlightResults) {
            highlightSearchResults();
        }
        
        // اضافه کردن event listener برای دکمه‌های پخش صوت
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function() {
                const verseNumber = this.getAttribute('data-verse-number');
                playAudio(verseNumber, this);
            });
        });
        
        // اضافه کردن event listener برای دکمه‌های پخش ترجمه گویا
        document.querySelectorAll('.play-translation-button').forEach(button => {
            button.addEventListener('click', function() {
                const verseNumber = this.getAttribute('data-verse-number');
                playTranslationAudio(verseNumber, this);
            });
        });
        
        // اضافه کردن event listener برای کلیک روی متن آیه
        document.querySelectorAll('.verse-clickable').forEach(element => {
            element.addEventListener('click', function() {
                const verseNumber = this.getAttribute('data-verse-number');
                const playButton = document.querySelector(`#verse-${verseNumber} .play-button`);
                
                // If already playing this verse, stop it
                if (currentlyPlayingVerse === verseNumber && currentAudio) {
                    currentAudio.pause();
                    if (playButton) {
                        playButton.classList.remove('playing');
                        playButton.innerHTML = getPlayIcon();
                    }
                    // Remove highlight from verse
                    const verse = document.getElementById(`verse-${currentlyPlayingVerse}`);
                    if (verse) {
                        verse.classList.remove('playing-verse');
                    }
                    currentAudio = null;
                    currentlyPlayingVerse = null;
                    isPlaying = false;
                } else {
                    // Play this verse
                    playAudio(verseNumber, playButton);
                }
            });
        });
    }
    
    // آیکون پخش
    function getPlayIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
        </svg>`;
    }
    
    // آیکون توقف
    function getPauseIcon() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>`;
    }
    
    // پخش صوت آیه
    function playAudio(verseNumber, button) {
        // اگر آیه‌ای در حال پخش است، آن را متوقف می‌کنیم
        if (currentAudio) {
            currentAudio.pause();
            if (currentlyPlayingVerse) {
                const oldButton = document.querySelector(`#verse-${currentlyPlayingVerse} .play-button`);
                if (oldButton) {
                    oldButton.classList.remove('playing');
                    oldButton.innerHTML = getPlayIcon();
                }
            }
        }
        
        if (currentTranslationAudio) {
            currentTranslationAudio.pause();
            const oldTransButton = document.querySelector(`#verse-${currentlyPlayingVerse} .play-translation-button`);
            if (oldTransButton) {
                oldTransButton.classList.remove('playing');
                oldTransButton.innerHTML = getPlayIcon();
            }
            currentTranslationAudio = null;
        }
        
        // اگر همان آیه قبلی را دوباره کلیک کرده‌ایم، فقط پخش را متوقف می‌کنیم
        if (currentlyPlayingVerse === verseNumber) {
            const verseElement = document.getElementById(`verse-${verseNumber}`);
            if (verseElement) {
                verseElement.classList.remove('playing-verse');
            }
            currentlyPlayingVerse = null;
            currentAudio = null;
            isPlaying = false;
            return;
        }
        
        // یافتن آیه در داده‌ها
        let verse = null;
        let surahNumber = null;
        outerLoop: for (const surah of quran.surahs) {
            for (const ayah of surah.ayahs) {
                if (ayah.number.toString() === verseNumber.toString()) {
                    verse = ayah;
                    surahNumber = surah.number;
                    break outerLoop;
                }
            }
        }
        
        if (!verse) return;
        
        // تنظیم آیه جاری
        currentlyPlayingVerse = verseNumber;
        
        // بروزرسانی اطلاعات آیه جاری در فیلترها
        updateCurrentVerseInfo(verse, surahNumber);
        
        // ایجاد پخش‌کننده جدید
        currentAudio = new Audio(verse.audioUrl);
        
        // تنظیم style دکمه
        button.classList.add('playing');
        button.innerHTML = getPauseIcon();
        
        // حذف کلاس هایلایت از آیه قبلی
        const oldVerse = document.getElementById(`verse-${currentlyPlayingVerse}`);
        if (oldVerse) {
            oldVerse.classList.remove('playing-verse');
        }
        
        // هایلایت کردن آیه در حال پخش
        const verseElement = document.getElementById(`verse-${verseNumber}`);
        if (verseElement) {
            verseElement.classList.add('playing-verse');
        }
        
        // اضافه کردن error handling برای منابع صوتی ناموجود
        currentAudio.onerror = function() {
            console.error(`Error loading audio file: ${verse.audioUrl}`);
            button.classList.remove('playing');
            button.innerHTML = getPlayIcon();
            button.disabled = true;
            currentAudio = null;
            currentlyPlayingVerse = null;
        };
        
        // شروع پخش
        currentAudio.play().catch(error => {
            console.error('Error playing audio:', error);
            button.classList.remove('playing');
            button.innerHTML = getPlayIcon();
            currentAudio = null;
            currentlyPlayingVerse = null;
        });
        
        isPlaying = true;
        
        // اضافه کردن event listener برای پایان پخش
        currentAudio.onended = function() {
            button.classList.remove('playing');
            button.innerHTML = getPlayIcon();
            
            // Remove highlight from verse
            const verseElement = document.getElementById(`verse-${verseNumber}`);
            if (verseElement) {
                verseElement.classList.remove('playing-verse');
            }
            
            currentAudio = null;
            currentlyPlayingVerse = null;
            
            // Auto-play next verse regardless of screen size
            if (config.audio.autoPlayNext || window.innerWidth <= 768) {
                const nextVerseNumber = parseInt(verseNumber) + 1;
                const nextVerseButton = document.querySelector(`[data-verse-number="${nextVerseNumber}"]`);
                if (nextVerseButton) {
                    // If next verse is on this page
                    setTimeout(() => {
                        nextVerseButton.click();
                    }, 1000);
                } else {
                    // If next verse is on next page and there are more pages
                    if (currentPage < totalPages) {
                        nextPageBtn.click();
                        setTimeout(() => {
                            const firstVerseButton = document.querySelector('.play-button');
                            if (firstVerseButton) {
                                firstVerseButton.click();
                            }
                        }, 1000);
                    }
                }
            }
        };
    }
    
    // پخش صوت ترجمه آیه با پشتیبانی از منابع جایگزین و آپلود دستی
    function playTranslationAudio(verseNumber, button) {
        // اگر ترجمه‌ای در حال پخش است، آن را متوقف می‌کنیم
        if (currentTranslationAudio) {
            currentTranslationAudio.pause();
            const oldTransButton = document.querySelector(`#verse-${currentlyPlayingVerse} .play-translation-button`);
            if (oldTransButton) {
                oldTransButton.classList.remove('playing');
                oldTransButton.innerHTML = getPlayIcon();
            }
        }
        
        // Check for custom translation audio element with a source
        const customAudioElement = document.querySelector(`#custom-translation-${verseNumber}`);
        if (customAudioElement && customAudioElement.src && customAudioElement.src !== window.location.href) {
            // Use the custom audio element source
            playCustomTranslationAudio(verseNumber, button, customAudioElement.src);
            return;
        }
        
        // یافتن آیه در داده‌ها
        let verse = null;
        let surahNumber = null;
        outerLoop: for (const surah of quran.surahs) {
            for (const ayah of surah.ayahs) {
                if (ayah.number.toString() === verseNumber.toString()) {
                    verse = ayah;
                    surahNumber = surah.number;
                    break outerLoop;
                }
            }
        }
        
        if (!verse) return;
        
        // تنظیم آیه جاری
        currentlyPlayingVerse = verseNumber;
        
        // بروزرسانی اطلاعات آیه جاری در فیلترها
        updateCurrentVerseInfo(verse, surahNumber);
        
        tryPlayTranslationAudio(verse, button, 0);
    }
    
    // پخش فایل صوتی ترجمه گویای آپلود شده
    function playCustomTranslationAudio(verseNumber, button, audioUrl) {
        // قطع پخش صوت فعلی
        if (currentAudio) {
            currentAudio.pause();
            const oldButton = document.querySelector(`#verse-${currentlyPlayingVerse} .play-button`);
            if (oldButton) {
                oldButton.classList.remove('playing');
                oldButton.innerHTML = getPlayIcon();
            }
            currentAudio = null;
        }
        
        // تنظیم آیه جاری
        currentlyPlayingVerse = verseNumber;
        
        // ایجاد پخش‌کننده جدید
        currentTranslationAudio = new Audio(audioUrl);
        
        // نمایش وضعیت بارگذاری
        button.innerHTML = `<span class="loading-spinner"></span> بارگذاری...`;
        
        // تنظیم style دکمه
        button.classList.add('playing');
        
        // شروع پخش
        currentTranslationAudio.play().then(() => {
            button.innerHTML = getPauseIcon();
            
            // هایلایت کردن آیه در حال پخش
            const verseElement = document.getElementById(`verse-${verseNumber}`);
            if (verseElement) {
                verseElement.classList.add('playing-verse');
            }
            
            // اضافه کردن event listener برای پایان پخش
            currentTranslationAudio.onended = function() {
                button.classList.remove('playing');
                button.innerHTML = getPlayIcon();
                
                // حذف کلاس هایلایت از آیه
                if (verseElement) {
                    verseElement.classList.remove('playing-verse');
                }
                
                currentTranslationAudio = null;
                currentlyPlayingVerse = null;
                
                // پخش خودکار آیه بعدی اگر تنظیم شده باشد
                if (config.audio.autoPlayNext || window.innerWidth <= 768) {
                    const nextVerseNumber = parseInt(verseNumber) + 1;
                    const nextVerseButton = document.querySelector(`[data-verse-number="${nextVerseNumber}"]`);
                    if (nextVerseButton) {
                        setTimeout(() => {
                            nextVerseButton.click();
                        }, 1000);
                    } else if (currentPage < totalPages) {
                        nextPageBtn.click();
                        setTimeout(() => {
                            const firstVerseButton = document.querySelector('.play-button');
                            if (firstVerseButton) {
                                firstVerseButton.click();
                            }
                        }, 1000);
                    }
                }
            };
        }).catch(error => {
            console.error('Error playing custom translation audio:', error);
            button.classList.remove('playing');
            button.innerHTML = getPlayIcon();
            currentTranslationAudio = null;
            currentlyPlayingVerse = null;
        });
    }
    
    // سیستم پخش چند لایه با منابع جایگزین
    function tryPlayTranslationAudio(verse, button, fallbackIndex) {
        const narrators = [
            currentTranslationNarrator, 
            ...config.translation.fallbackNarrators
        ];
        
        if (fallbackIndex >= narrators.length) {
            // اگر همه منابع با شکست مواجه شدند
            button.classList.remove('playing');
            button.innerHTML = getPlayIcon();
            
            // نمایش پیام خطا به کاربر
            const errorMsg = document.createElement('div');
            errorMsg.className = 'audio-error-message';
            errorMsg.textContent = 'متأسفانه فایل صوتی ترجمه این آیه در حال حاضر در دسترس نیست.';
            
            // اضافه کردن پیام خطا به صفحه
            const verseElement = document.getElementById(`verse-${verse.number}`);
            if (verseElement) {
                const existingError = verseElement.querySelector('.audio-error-message');
                if (!existingError) {
                    verseElement.querySelector('.verse-audio-controls').appendChild(errorMsg);
                    
                    // حذف خودکار پیام خطا بعد از چند ثانیه
                    setTimeout(() => {
                        errorMsg.remove();
                    }, 5000);
                }
            }
            
            currentTranslationAudio = null;
            currentlyPlayingVerse = null;
            
            // اگر ترجمه گویا در دسترس نیست، آیه بعدی را پخش می‌کنیم
            if (config.audio.autoPlayNext || window.innerWidth <= 768) {
                const nextVerseNumber = parseInt(verse.number) + 1;
                const nextVerseButton = document.querySelector(`[data-verse-number="${nextVerseNumber}"]`);
                if (nextVerseButton) {
                    setTimeout(() => {
                        nextVerseButton.click();
                    }, 1000);
                } else if (currentPage < totalPages) {
                    nextPageBtn.click();
                    setTimeout(() => {
                        const firstVerseButton = document.querySelector('.play-button');
                        if (firstVerseButton) {
                            firstVerseButton.click();
                        }
                    }, 1000);
                }
            }
            
            return;
        }
        
        // انتخاب گوینده فعلی
        const currentNarrator = narrators[fallbackIndex];
        
        // نمایش وضعیت بارگذاری
        button.innerHTML = `<span class="loading-spinner"></span> بارگذاری...`;
        
        // ساخت URL با توجه به نوع گوینده
        let audioUrl = '';
        const surahNum = verse.surahNumber || 1;
        
        if (currentNarrator === 'quran_com') {
            audioUrl = `${quranData.apis.audioBaseUrls.translation[currentNarrator]}${verse.numberInSurah}`;
        } else if (currentNarrator === 'everyayah') {
            audioUrl = `${quranData.apis.audioBaseUrls.translation[currentNarrator]}${surahNum.toString().padStart(3, '0')}${verse.numberInSurah.toString().padStart(3, '0')}.mp3`;
        } else if (currentNarrator === 'quran_radio') {
            audioUrl = `${quranData.apis.audioBaseUrls.translation[currentNarrator]}${surahNum}/${verse.numberInSurah}.mp3`;
        } else if (currentNarrator === 'tebyan') {
            audioUrl = `${quranData.apis.audioBaseUrls.translation[currentNarrator]}${surahNum}_${verse.numberInSurah}.mp3`;
        } else {
            audioUrl = `${quranData.apis.audioBaseUrls.translation[currentNarrator]}${surahNum}_${verse.numberInSurah}.mp3`;
        }
        
        console.log(`Trying audio source ${fallbackIndex+1}/${narrators.length}: ${audioUrl}`);
        
        // ایجاد پخش‌کننده جدید
        currentTranslationAudio = new Audio(audioUrl);
        
        // اضافه کردن error handling برای منابع صوتی ناموجود
        currentTranslationAudio.onerror = function() {
            console.error(`Error loading translation audio file from ${currentNarrator}: ${audioUrl}`);
            // تلاش با منبع بعدی
            tryPlayTranslationAudio(verse, button, fallbackIndex + 1);
        };
        
        // تنظیم style دکمه
        button.classList.add('playing');
        
        // شروع پخش با مدیریت خطای بهتر
        currentTranslationAudio.play().then(() => {
            button.innerHTML = getPauseIcon();
            
            // هایلایت کردن آیه در حال پخش
            const verseElement = document.getElementById(`verse-${verse.number}`);
            if (verseElement) {
                verseElement.classList.add('playing-verse');
            }
            
            // اضافه کردن event listener برای پایان پخش
            currentTranslationAudio.onended = function() {
                button.classList.remove('playing');
                button.innerHTML = getPlayIcon();
                
                // حذف کلاس هایلایت از آیه
                if (verseElement) {
                    verseElement.classList.remove('playing-verse');
                }
                
                currentTranslationAudio = null;
                currentlyPlayingVerse = null;
                
                // Auto-play next verse regardless of screen size
                if (config.audio.autoPlayNext || window.innerWidth <= 768) {
                    const nextVerseNumber = parseInt(verse.number) + 1;
                    const nextVerseButton = document.querySelector(`[data-verse-number="${nextVerseNumber}"]`);
                    if (nextVerseButton) {
                        setTimeout(() => {
                            nextVerseButton.click();
                        }, 1000);
                    } else if (currentPage < totalPages) {
                        nextPageBtn.click();
                        setTimeout(() => {
                            const firstVerseButton = document.querySelector('.play-button');
                            if (firstVerseButton) {
                                firstVerseButton.click();
                            }
                        }, 1000);
                    }
                }
            };
        }).catch(error => {
            console.error(`Error playing translation audio from ${currentNarrator}:`, error);
            // تلاش با منبع بعدی
            tryPlayTranslationAudio(verse, button, fallbackIndex + 1);
        });
    }

    // بروزرسانی کنترل‌های صفحه‌بندی
    function updatePagination() {
        pageInfo.textContent = `صفحه ${currentPage} از ${totalPages}`;
        
        // Hide pagination controls if showing a complete surah
        if (currentSurah && !isSearchMode) {
            document.querySelector('.pagination').style.display = 'none';
        } else {
            document.querySelector('.pagination').style.display = 'flex';
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }
    }

    // جستجوی در قرآن
    function searchQuran(query) {
        if (query.length < config.search.minSearchLength) {
            alert(`عبارت جستجو باید حداقل ${config.search.minSearchLength} کاراکتر باشد.`);
            return;
        }
        
        loading.style.display = 'flex';
        
        // ایجاد تأخیر مصنوعی برای نمایش لودینگ (برای جستجوهای سنگین)
        setTimeout(() => {
            searchResults = [];
            const queryLower = query.toLowerCase();
            
            quran.surahs.forEach(surah => {
                surah.ayahs.forEach(ayah => {
                    // جستجو در متن عربی و ترجمه فارسی
                    if (
                        ayah.text.toLowerCase().includes(queryLower) || 
                        ayah.translation.toLowerCase().includes(queryLower)
                    ) {
                        searchResults.push({
                            ...ayah,
                            surahNumber: surah.number,
                            surahName: surah.name
                        });
                    }
                });
            });
            
            // نمایش نتایج جستجو
            if (searchResults.length > 0) {
                isSearchMode = true;
                currentVerses = searchResults;
                totalPages = Math.ceil(currentVerses.length / config.display.versesPerPage);
                currentPage = 1;
                currentSurah = null;
                
                renderCurrentPage();
                updatePagination();
                
                quranDisplay.innerHTML = `
                    <div class="search-results-header">
                        <h3>${searchResults.length} نتیجه برای "${query}" یافت شد</h3>
                    </div>
                    ${quranDisplay.innerHTML}
                `;
            } else {
                quranDisplay.innerHTML = `
                    <div class="search-results-header">
                        <h3>نتیجه‌ای برای "${query}" یافت نشد</h3>
                    </div>
                `;
                
                isSearchMode = false;
            }
            
            loading.style.display = 'none';
        }, 500);
    }

    // برجسته‌سازی نتایج جستجو
    function highlightSearchResults() {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;
        
        const arabicTexts = document.querySelectorAll('.verse-arabic');
        const translationTexts = document.querySelectorAll('.verse-translation');
        
        const highlightText = (elements, term) => {
            elements.forEach(element => {
                const originalText = element.textContent;
                if (originalText.toLowerCase().includes(term.toLowerCase())) {
                    const regex = new RegExp(`(${term})`, 'gi');
                    element.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
                }
            });
        };
        
        highlightText(arabicTexts, searchTerm);
        highlightText(translationTexts, searchTerm);
    }

    // کلیک روی دکمه جستجو
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchQuran(query);
        }
    });

    // جستجو با فشردن کلید Enter
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchQuran(query);
            }
        }
    });

    // کلیک روی دکمه‌های صفحه‌بندی
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
            updatePagination();
            window.scrollTo(0, 0);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
            updatePagination();
            window.scrollTo(0, 0);
        }
    });
    
    // بروزرسانی اطلاعات آیه جاری در فیلترها
    function updateCurrentVerseInfo(verse, surahNumber) {
        if (!verse) {
            // نمایش متن پیش‌فرض
            document.querySelector('.filter-info').innerHTML = `
                <div class="current-verse-box">
                    <div class="current-verse-details">لطفاً آیه‌ای را انتخاب کنید</div>
                </div>
            `;
            return;
        }
        
        // یافتن اطلاعات سوره
        const surah = quran.surahs.find(s => s.number === surahNumber);
        
        // نمایش اطلاعات آیه در باکس مخصوص
        document.querySelector('.filter-info').innerHTML = `
            <div class="current-verse-box">
                <div class="current-verse-details">
                    <span class="detail-item">سوره: ${surah ? surah.name : '-'}</span>
                    <span class="detail-item">جزء: ${verse.juz}</span>
                    <span class="detail-item">صفحه: ${verse.page}</span>
                    <span class="detail-item">آیه: ${verse.numberInSurah}</span>
                </div>
            </div>
        `;
    }

    // Add function to create mobile dropdown
    function setupMobileMenu() {
        // Create a toggle button for mobile view
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            
            // Check if toggle button already exists
            if (!document.querySelector('.sidebar-toggle')) {
                const toggleButton = document.createElement('button');
                toggleButton.className = 'sidebar-toggle';
                toggleButton.textContent = 'فهرست سوره‌ها';
                
                // Insert before the h3 in sidebar
                const sidebarTitle = sidebar.querySelector('h3');
                sidebar.insertBefore(toggleButton, sidebarTitle);
                
                // Add event listener to toggle button
                toggleButton.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }
        }
    }
    
    // Call setup function when page loads
    setupMobileMenu();
    
    // Call setup again when window resizes
    window.addEventListener('resize', setupMobileMenu);
});