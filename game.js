// Основные переменные игры
const gameState = {
    currentScreen: 'splash',
    playerName: '',
    score: 0,
    level: 1,
    currentRound: 1,
    totalRounds: 4,
    cardsInRound: 7,
    currentCategory: '',
    selectedCards: new Set(),
    gameActive: false,
    timeElapsed: 0,
    timerInterval: null,
    levelsCompleted: 0,
    usedCategories: new Set(),
    currentTargetLetter: '',
    animationIntervals: [],
    letterCounts: [],
    correctAnswers: 0,
    level2Round: 1,
    level3Round: 1,
    levelCompleted: false,
    hintsUsedLevel1: new Set(),
    hintsUsedLevel3: new Set(),
    level3HintedCards: new Set(),
    penaltyPointsLevel1: 0,
    penaltyPointsLevel2: 0,
    penaltyPointsLevel3: 0,
    roundTimeRemaining: 0,
    roundTimerInterval: null,
    roundTimeTotal: 0,
    difficulty: 'easy'
};

const LEVEL_CONFIG = {
    level1: {
        baseCards: 7,
        cardsPerRoundIncrease: 2
    },
    level2: {
        baseCards: 7,
        cardsPerRoundIncrease: 2
    },
    level3: {
        baseCards: 7,
        cardsPerRoundIncrease: 2
    }
};

const AVAILABLE_LETTERS = ['Б', 'В', 'Д', 'З', 'К', 'Л', 'М', 'П', 'Р', 'С', 'Т', 'Ш'];

const DIFFICULTY_TIMES = {
    easy: {
        level1: 45,
        level2: 40,
        level3: 60
    },
    medium: {
        level1: 20,
        level2: 25,
        level3: 30
    },
    hard: {
        level1: 7,
        level2: 10,
        level3: 15
    }
};

const wordDictionary = [
    // Животные
    { word: "Кот", emoji: "🐱", category: "животные", letterCount: 3 },
    { word: "Собака", emoji: "🐶", category: "животные", letterCount: 6 },
    { word: "Лев", emoji: "🦁", category: "животные", letterCount: 3 },
    { word: "Тигр", emoji: "🐯", category: "животные", letterCount: 4 },
    { word: "Медведь", emoji: "🐻", category: "животные", letterCount: 7 },
    { word: "Заяц", emoji: "🐰", category: "животные", letterCount: 4 },
    { word: "Волк", emoji: "🐺", category: "животные", letterCount: 4 },
    { word: "Лиса", emoji: "🦊", category: "животные", letterCount: 4 },
    { word: "Обезьяна", emoji: "🐵", category: "животные", letterCount: 8 },
    { word: "Птица", emoji: "🐦", category: "животные", letterCount: 5 },
    { word: "Рыба", emoji: "🐟", category: "животные", letterCount: 4 },
    { word: "Слон", emoji: "🐘", category: "животные", letterCount: 4 },
    { word: "Змея", emoji: "🐍", category: "животные", letterCount: 4 },
    { word: "Черепаха", emoji: "🐢", category: "животные", letterCount: 8 },
    { word: "Бабочка", emoji: "🦋", category: "животные", letterCount: 8 },
    
    // Одежда
    { word: "Платье", emoji: "👗", category: "одежда", letterCount: 6 },
    { word: "Штаны", emoji: "👖", category: "одежда", letterCount: 5 },
    { word: "Пальто", emoji: "🧥", category: "одежда", letterCount: 6 },
    { word: "Кепка", emoji: "🧢", category: "одежда", letterCount: 5 },
    { word: "Сапоги", emoji: "👢", category: "одежда", letterCount: 6 },
    { word: "Носки", emoji: "🧦", category: "одежда", letterCount: 5 },
    { word: "Шарф", emoji: "🧣", category: "одежда", letterCount: 4 },
    { word: "Рубашка", emoji: "👔", category: "одежда", letterCount: 7 },
    { word: "Перчатки", emoji: "🧤", category: "одежда", letterCount: 8 },
    
    // Транспорт
    { word: "Машина", emoji: "🚗", category: "транспорт", letterCount: 6 },
    { word: "Автобус", emoji: "🚌", category: "транспорт", letterCount: 7 },
    { word: "Самолет", emoji: "✈️", category: "транспорт", letterCount: 7 },
    { word: "Поезд", emoji: "🚂", category: "транспорт", letterCount: 5 },
    { word: "Корабль", emoji: "🚢", category: "транспорт", letterCount: 7 },
    { word: "Мотоцикл", emoji: "🏍️", category: "транспорт", letterCount: 8 },
    { word: "Велосипед", emoji: "🚲", category: "транспорт", letterCount: 9 },
    { word: "Вертолет", emoji: "🚁", category: "транспорт", letterCount: 8 },
    { word: "Лодка", emoji: "🚤", category: "транспорт", letterCount: 5 },
    
    // Природа
    { word: "Дерево", emoji: "🌳", category: "природа", letterCount: 6 },
    { word: "Цветок", emoji: "🌸", category: "природа", letterCount: 6 },
    { word: "Солнце", emoji: "☀️", category: "природа", letterCount: 6 },
    { word: "Гора", emoji: "⛰️", category: "природа", letterCount: 4 },
    { word: "Река", emoji: "🌊", category: "природа", letterCount: 4 },
    { word: "Облако", emoji: "☁️", category: "природа", letterCount: 6 },
    { word: "Дождь", emoji: "🌧️", category: "природа", letterCount: 5 },
    
    // Еда
    { word: "Хлеб", emoji: "🍞", category: "еда", letterCount: 4 },
    { word: "Сыр", emoji: "🧀", category: "еда", letterCount: 3 },
    { word: "Торт", emoji: "🎂", category: "еда", letterCount: 4 },
    { word: "Яблоко", emoji: "🍎", category: "еда", letterCount: 6 },
    { word: "Банан", emoji: "🍌", category: "еда", letterCount: 5 },
    { word: "Молоко", emoji: "🥛", category: "еда", letterCount: 6 },
    { word: "Сок", emoji: "🧃", category: "еда", letterCount: 3 },
    { word: "Суп", emoji: "🍲", category: "еда", letterCount: 3 },
    { word: "Пицца", emoji: "🍕", category: "еда", letterCount: 5 },
    { word: "Мороженое", emoji: "🍦", category: "еда", letterCount: 9 },
    { word: "Шоколад", emoji: "🍫", category: "еда", letterCount: 7 },
    
    // Предметы
    { word: "Книга", emoji: "📖", category: "предметы", letterCount: 5 },
    { word: "Стул", emoji: "🪑", category: "предметы", letterCount: 4 },
    { word: "Лампа", emoji: "💡", category: "предметы", letterCount: 5 },
    { word: "Телефон", emoji: "📱", category: "предметы", letterCount: 7 },
    { word: "Ноутбук", emoji: "💻", category: "предметы", letterCount: 7 },
    { word: "Ключ", emoji: "🔑", category: "предметы", letterCount: 4 },
    { word: "Часы", emoji: "⏰", category: "предметы", letterCount: 4 },
    { word: "Зонт", emoji: "☂️", category: "предметы", letterCount: 4 },
    { word: "Сумка", emoji: "👜", category: "предметы", letterCount: 5 },
    { word: "Карандаш", emoji: "✏️", category: "предметы", letterCount: 8 },
    { word: "Ручка", emoji: "🖊️", category: "предметы", letterCount: 5 }
];

// Менеджер звуков
const audioManager = {
    sounds: {},
    volume: 0.5,
    muted: false,
    backgroundMusic: null,
    timerSoundPlaying: false,
    lastClickTime: 0,
    clickCooldown: 150, // Минимальное время между кликами в мс
    
    init: function() {
        try {
            // Инициализация звуков
            this.sounds = {
                win: document.getElementById('sound-win'),
                lose: document.getElementById('sound-lose'),
                timer: document.getElementById('sound-timer'),
                background: document.getElementById('sound-background'),
                click: document.getElementById('sound-click')
            };
            
            // Установка громкости
            this.setVolume(this.volume);
            
            // Восстановление настроек из localStorage
            this.loadSettings();
            
            // Создаем UI контролы
            this.createAudioControls();
        
        } catch (error) {
            console.error("Ошибка инициализации аудио:", error);
        }
    },
    
    createAudioControls: function() {
        try {
            const controlsHTML = `
                <div class="audio-controls" id="audio-controls">
                    <button class="audio-btn" id="music-toggle" title="Фоновая музыка">
                        <i class="fas fa-music"></i>
                    </button>
                    <button class="audio-btn" id="sfx-toggle" title="Звуковые эффекты">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <input type="range" min="0" max="100" value="${this.volume * 100}" 
                           class="volume-slider" id="volume-slider" title="Громкость">
                    <span class="volume-indicator">${Math.round(this.volume * 100)}%</span>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', controlsHTML);
            
            // Обработчики событий
            document.getElementById('music-toggle').addEventListener('click', () => this.toggleMusic());
            document.getElementById('sfx-toggle').addEventListener('click', () => this.toggleSFX());
            document.getElementById('volume-slider').addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
            
            this.updateButtonIcons();
            
            // Начинаем играть фоновую музыку если сохранена настройка
            if (!this.sounds.background.paused) {
                this.playBackground();
            }
            
        } catch (error) {
            console.error("Ошибка создания аудио контролов:", error);
        }
    },
    
    play: function(soundName, volume = 1) {
    try {
        if (this.muted || !this.sounds[soundName]) {
            return null;
        }
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn("Звук не найден:", soundName);
            return null;
        }
        
        // Для звука клика проверяем кулдаун и ограничиваем длительность
        if (soundName === 'click') {
            const now = Date.now();
            if (now - this.lastClickTime < this.clickCooldown) {
                return null; // Пропускаем если клик был слишком недавно
            }
            this.lastClickTime = now;
            
            // Останавливаем звук через 0.2 секунды для короткого щелчка
            sound.currentTime = 0;
            sound.volume = Math.min(this.volume, volume);
            
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Останавливаем звук через 200 мс
                    setTimeout(() => {
                        if (!sound.paused) {
                            sound.pause();
                            sound.currentTime = 0;
                        }
                    }, 200);
                }).catch(error => {
                    // Игнорируем ошибки автовоспроизведения
                });
            }
            
            return sound;
        }
        
        // Для других звуков обычная логика
        sound.currentTime = 0;
        
        // Устанавливаем громкость
        if (soundName === 'win' || soundName === 'lose') {
            sound.volume = Math.min(this.volume * 1.2, volume);
        } else {
            sound.volume = Math.min(this.volume, volume);
        }
        
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Игнорируем ошибки автовоспроизведения
            });
        }
        
        return sound;
    } catch (error) {
        console.error("Ошибка воспроизведения звука:", soundName, error);
        return null;
    }
},
    
    playLevelEndSound: function(resultType, volume = 0.7) {
        try {
            if (this.muted) return null;
            
            let soundName;
            if (resultType === 'win') {
                soundName = 'win';
            } else if (resultType === 'lose') {
                soundName = 'lose';
            } else {
                soundName = 'win';
            }
            
            return this.play(soundName, volume);
        } catch (error) {
            console.error("Ошибка воспроизведения звука завершения уровня:", error);
            return null;
        }
    },
    
    playBackground: function() {
        try {
            if (!this.sounds.background || this.muted) return;
            
            this.sounds.background.volume = this.volume * 0.3;
            this.sounds.background.loop = true;
            
            const playPromise = this.sounds.background.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Успешное воспроизведение
                    this.updateButtonIcons();
                }).catch(error => {
                    // Браузер блокирует автовоспроизведение
                    this.sounds.background.pause();
                    this.updateButtonIcons();
                });
            }
        } catch (error) {
            console.error("Ошибка фоновой музыки:", error);
        }
    },
    
    stop: function(soundName) {
        try {
            if (this.sounds[soundName]) {
                this.sounds[soundName].pause();
                this.sounds[soundName].currentTime = 0;
            }
        } catch (error) {
            console.error("Ошибка остановки звука:", soundName, error);
        }
    },
    
    setVolume: function(volume) {
        try {
            this.volume = Math.max(0, Math.min(1, volume));
            
            // Обновляем громкость всех звуков
            Object.values(this.sounds).forEach(sound => {
                if (sound) {
                    // Для фоновой музыки делаем тише
                    if (sound === this.sounds.background) {
                        sound.volume = this.volume * 0.3;
                    } else {
                        sound.volume = this.volume;
                    }
                }
            });
            
            // Обновляем UI
            const slider = document.getElementById('volume-slider');
            const indicator = document.querySelector('.volume-indicator');
            if (slider) slider.value = this.volume * 100;
            if (indicator) indicator.textContent = `${Math.round(this.volume * 100)}%`;
            
            this.saveSettings();
        } catch (error) {
            console.error("Ошибка установки громкости:", error);
        }
    },
    
    toggleMusic: function() {
        try {
            if (this.sounds.background.paused) {
                this.playBackground();
            } else {
                this.sounds.background.pause();
            }
            this.updateButtonIcons();
            this.saveSettings();
        } catch (error) {
            console.error("Ошибка переключения музыки:", error);
        }
    },
    
    toggleSFX: function() {
        try {
            this.muted = !this.muted;
            this.updateButtonIcons();
            this.saveSettings();
            
            // Воспроизводим звук при включении
            if (!this.muted) {
                this.play('click', 0.2);
            }
        } catch (error) {
            console.error("Ошибка переключения SFX:", error);
        }
    },
    
    updateButtonIcons: function() {
        try {
            const musicBtn = document.getElementById('music-toggle');
            const sfxBtn = document.getElementById('sfx-toggle');
            
            if (musicBtn) {
                if (this.sounds.background.paused) {
                    musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    musicBtn.classList.add('muted');
                    musicBtn.title = 'Включить музыку';
                } else {
                    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
                    musicBtn.classList.remove('muted');
                    musicBtn.title = 'Выключить музыку';
                }
            }
            
            if (sfxBtn) {
                if (this.muted) {
                    sfxBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    sfxBtn.classList.add('muted');
                    sfxBtn.title = 'Включить звуковые эффекты';
                } else {
                    sfxBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                    sfxBtn.classList.remove('muted');
                    sfxBtn.title = 'Выключить звуковые эффекты';
                }
            }
        } catch (error) {
            console.error("Ошибка обновления иконок:", error);
        }
    },
    
    startTimerSound: function() {
        try {
            if (this.muted || this.timerSoundPlaying) return;
            
            this.timerSoundPlaying = true;
            this.sounds.timer.volume = this.volume * 0.3;
            this.sounds.timer.loop = true;
            
            const playPromise = this.sounds.timer.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    this.timerSoundPlaying = false;
                });
            }
        } catch (error) {
            console.error("Ошибка запуска звука таймера:", error);
            this.timerSoundPlaying = false;
        }
    },
    
    stopTimerSound: function() {
        try {
            this.timerSoundPlaying = false;
            if (this.sounds.timer) {
                this.sounds.timer.pause();
                this.sounds.timer.currentTime = 0;
            }
        } catch (error) {
            console.error("Ошибка остановки звука таймера:", error);
        }
    },
    
    saveSettings: function() {
        try {
            localStorage.setItem('whatIsWord_audio', JSON.stringify({
                volume: this.volume,
                muted: this.muted,
                musicPlaying: !this.sounds.background.paused
            }));
        } catch (error) {
            console.error("Ошибка сохранения настроек звука:", error);
        }
    },
    
    loadSettings: function() {
        try {
            const saved = localStorage.getItem('whatIsWord_audio');
            if (saved) {
                const settings = JSON.parse(saved);
                this.volume = settings.volume || 0.5;
                this.muted = settings.muted || false;
                
                // Восстанавливаем состояние музыки
                if (settings.musicPlaying && this.sounds.background) {
                    // Не запускаем сразу, дадим пользователю сначала взаимодействие
                    this.sounds.background.pause();
                    this.sounds.background.currentTime = 0;
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки настроек звука:", error);
        }
    }
};

function clearAllIntervals() {
    // Очищаем все таймеры игры
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
    
    // Очищаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    gameState.roundTimerInterval = null;
    
    // Очищаем все анимационные интервалы
    gameState.animationIntervals.forEach(interval => {
        clearInterval(interval);
    });
    gameState.animationIntervals = [];
    
    // Останавливаем звук таймера
    audioManager.stopTimerSound();
}

function rotateCard(card, level) {
    // Воспроизводим звук вращения
    audioManager.play('click', 0.2);
    
    // Добавляем класс для анимации
    card.classList.add('rotating');
    
    // Удаляем класс после завершения анимации
    setTimeout(() => {
        card.classList.remove('rotating');
    }, 500);
}

// Рейтинг игроков
let leaderboard = [];

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    initEventListeners();
    audioManager.init();
    showScreen('splash');
    
    // Добавляем обработчики звуков для всех кнопок
    setTimeout(() => {
        setupAudioForButtons();
    }, 500);
});

// Настройка звуков для кнопок
function setupAudioForButtons() {
    try {
        const buttons = document.querySelectorAll('button:not(.audio-btn)');
        buttons.forEach(btn => {
            // Добавляем обработчики клика
            btn.addEventListener('click', function(e) {
                // Исключаем кнопки из аудио-контролов
                if (!this.classList.contains('audio-btn')) {
                    audioManager.play('click', 0.3);
                }
            });
        });
    } catch (error) {
        console.error("Ошибка настройки аудио для кнопок:", error);
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Основные кнопки интерфейса
    const interfaceButtons = [
        'start-auth', 'view-leaderboard', 'back-to-splash', 'start-game',
        'end-level-btn', 'play-again', 'new-player', 'modal-close',
        'check-level1', 'next-round-level1', 'check-level2', 'next-round-level2',
        'check-level3', 'next-round-level3', 'confirm-end-level', 'cancel-end-level',
        'difficulty-easy', 'difficulty-medium', 'difficulty-hard'
    ];
    
    interfaceButtons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('audio-btn')) {
                    audioManager.play('click', 0.3);
                }
            });
        }
    });
    
    // Остальные обработчики событий
    document.getElementById('start-auth').addEventListener('click', () => showScreen('auth'));
    document.getElementById('view-leaderboard').addEventListener('click', showLeaderboardModal);
    document.getElementById('back-to-splash').addEventListener('click', () => showScreen('splash'));
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('end-level-btn').addEventListener('click', showEndLevelModal);
    document.getElementById('play-again').addEventListener('click', playAgain);
    document.getElementById('new-player').addEventListener('click', newPlayer);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    
    document.getElementById('check-level1').addEventListener('click', checkLevel1);
    document.getElementById('next-round-level1').addEventListener('click', nextRoundLevel1);
    
    document.getElementById('check-level2').addEventListener('click', checkLevel2);
    document.getElementById('next-round-level2').addEventListener('click', nextRoundLevel2);
    
    document.getElementById('check-level3').addEventListener('click', checkLevel3);
    document.getElementById('next-round-level3').addEventListener('click', nextRoundLevel3);
    
    document.getElementById('player-name').addEventListener('input', validatePlayerName);
    
    document.getElementById('confirm-end-level').addEventListener('click', endLevelConfirmed);
    document.getElementById('cancel-end-level').addEventListener('click', closeEndLevelModal);

    document.getElementById('difficulty-easy').addEventListener('click', () => selectDifficulty('easy'));
    document.getElementById('difficulty-medium').addEventListener('click', () => selectDifficulty('medium'));
    document.getElementById('difficulty-hard').addEventListener('click', () => selectDifficulty('hard'));
}

// Загрузка рейтинга из localStorage
function loadLeaderboard() {
    const savedLeaderboard = localStorage.getItem('whatIsWord_LB');
    if (savedLeaderboard) {
        try {
            leaderboard = JSON.parse(savedLeaderboard);
            leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
        } catch (e) {
            console.error("Ошибка загрузки рейтинга:", e);
            leaderboard = [];
        }
    }
}

// Сохранение рейтинга
function saveLeaderboard() {
    try {
        localStorage.setItem('whatIsWord_LB', JSON.stringify(leaderboard));
    } catch (error) {
        console.error("Ошибка сохранения рейтинга:", error);
    }
}

// Переключение между экранами
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenName;
        
        // Обновляем аудио обработчики при смене экрана
        setTimeout(setupAudioForButtons, 100);
        
        if (screenName === 'game') {
            updateGameUI();
            if (gameState.gameActive) {
                startLevel();
            }
        } else if (screenName === 'results') {
            showResults();
        }
    }
}

// Валидация имени игрока
function validatePlayerName() {
    const nameInput = document.getElementById('player-name');
    const errorElement = document.getElementById('name-error');
    const name = nameInput.value.trim();
    
    if (name.length < 2) {
        errorElement.textContent = "Имя должно содержать минимум 2 символа";
        return false;
    } else if (name.length > 20) {
        errorElement.textContent = "Имя должно содержать не более 20 символов";
        return false;
    } else {
        errorElement.textContent = "";
        return true;
    }
}

// Функция для выбора сложности
function selectDifficulty(difficulty) {
    // Убираем класс selected со всех кнопок
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Добавляем класс selected к выбранной кнопке
    const selectedBtn = document.getElementById(`difficulty-${difficulty}`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    
    // Обновляем информацию о сложности
    updateDifficultyInfo(difficulty);
    
    // Сохраняем выбранную сложность
    gameState.difficulty = difficulty;
}

// Функция для обновления информации о сложности
function updateDifficultyInfo(difficulty) {
    const infoElement = document.getElementById('difficulty-info');
    const times = DIFFICULTY_TIMES[difficulty];
    
    let difficultyName = '';
    if (difficulty === 'easy') difficultyName = 'Лёгкий';
    else if (difficulty === 'medium') difficultyName = 'Средний';
    else if (difficulty === 'hard') difficultyName = 'Сложный';
    
    infoElement.innerHTML = `
        <strong>${difficultyName}:</strong> ${times.level1} сек (уровень 1), 
        ${times.level2} сек (уровень 2), 
        ${times.level3} сек (уровень 3)
    `;
}

// Начало игры
function startGame() {
    if (!validatePlayerName()) return;
    
    const playerName = document.getElementById('player-name').value.trim();
    gameState.playerName = playerName;
    gameState.score = 0;
    gameState.level = 1;
    gameState.currentRound = 1;
    gameState.level2Round = 1;
    gameState.level3Round = 1;
    gameState.cardsInRound = LEVEL_CONFIG.level1.baseCards;
    gameState.timeElapsed = 0;
    gameState.levelsCompleted = 0;
    gameState.gameActive = true;
    gameState.selectedCards.clear();
    gameState.usedCategories.clear();
    gameState.correctAnswers = 0;
    gameState.levelCompleted = false;
    gameState.hintsUsedLevel1.clear();
    gameState.hintsUsedLevel3.clear();
    gameState.penaltyPointsLevel1 = 0;
    gameState.penaltyPointsLevel2 = 0;
    gameState.penaltyPointsLevel3 = 0;
    gameState.level3HintedCards.clear();
    
    // Сброс интервалов
    clearAllIntervals();
    
    gameState.animationIntervals.forEach(interval => clearInterval(interval));
    gameState.animationIntervals = [];
    
    startTimer();
    showScreen('game');
}

// Запуск таймера
function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

// Обновление таймера
function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeElapsed / 60);
    const seconds = gameState.timeElapsed % 60;
    document.getElementById('timer').textContent = `Время: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Запуск таймера раунда
function startRoundTimer(seconds, level) {
    // Очищаем предыдущий таймер раунда
    clearInterval(gameState.roundTimerInterval);
    
    gameState.roundTimeTotal = seconds;
    gameState.roundTimeRemaining = seconds;
    
    // Сбрасываем стили таймера при старте
    resetTimerStyles(level);
    
    // Обновляем отображение таймера
    updateRoundTimerDisplay(level);
    
    // Останавливаем звук таймера если был
    audioManager.stopTimerSound();
    
    // Запускаем таймер
    gameState.roundTimerInterval = setInterval(() => {
        gameState.roundTimeRemaining--;
        updateRoundTimerDisplay(level);
        
        // Если время вышло
        if (gameState.roundTimeRemaining <= 0) {
            clearInterval(gameState.roundTimerInterval);
            gameState.roundTimeRemaining = 0;
            updateRoundTimerDisplay(level);
            
            // Вызываем соответствующую функцию проверки при окончании времени
            handleTimeExpired(level);
        }
    }, 1000);
}

function resetTimerStyles(level) {
    let timerElement;
    if (level === 1) {
        timerElement = document.getElementById('round-timer-level1');
    } else if (level === 2) {
        timerElement = document.getElementById('round-timer-level2');
    } else if (level === 3) {
        timerElement = document.getElementById('round-timer-level3');
    } else {
        return;
    }
    
    if (timerElement) {
        timerElement.classList.remove('warning', 'danger', 'critical');
    }
}

// Функция для обновления отображения таймера раунда
function updateRoundTimerDisplay(level) {
    const minutes = Math.floor(gameState.roundTimeRemaining / 60);
    const seconds = gameState.roundTimeRemaining % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Определяем элемент таймера в зависимости от уровня
    let timerElement;
    if (level === 1) {
        timerElement = document.getElementById('round-timer-level1');
    } else if (level === 2) {
        timerElement = document.getElementById('round-timer-level2');
    } else if (level === 3) {
        timerElement = document.getElementById('round-timer-level3');
    } else {
        return;
    }
    
    if (!timerElement) return;
    
    // Обновляем текст таймера
    timerElement.textContent = `Время раунда: ${timeString}`;
    
    // Удаляем все классы состояния
    timerElement.classList.remove('warning', 'danger', 'critical');
    
    // Применяем стили в зависимости от оставшегося времени
    if (gameState.roundTimeRemaining <= 5) {
        // Меньше 5 секунд - красный с пульсацией
        timerElement.classList.add('critical');
        
        // Включаем звук таймера
        if (gameState.roundTimeRemaining > 0) {
            audioManager.startTimerSound();
        }
    } else if (gameState.roundTimeRemaining <= 10) {
        // Меньше 10 секунд - оранжевый
        timerElement.classList.add('danger');
        
        // Останавливаем звук таймера если был
        audioManager.stopTimerSound();
    } else {
        // Останавливаем звук таймера
        audioManager.stopTimerSound();
    }
}

// Функция для обработки окончания времени
function handleTimeExpired(level) {
    audioManager.stopTimerSound();
    
    let message = "Время вышло!\n";
    
    // Вызываем соответствующую функцию проверки в зависимости от уровня
    switch(level) {
        case 1:
            checkLevel1(true, message);
            break;
        case 2:
            checkLevel2(true, message);
            break;
        case 3:
            checkLevel3(true, message);
            break;
    }
}

function startLevel() {
    document.querySelectorAll('.level-1-container, .level-2-container, .level-3-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    gameState.selectedCards.clear();
    gameState.levelCompleted = false;
    
    document.getElementById('current-level').textContent = `Уровень: ${gameState.level}`;
    
    switch(gameState.level) {
        case 1: startLevel1(); break;
        case 2: startLevel2(); break;
        case 3: startLevel3(); break;
    }
}

// Обновление кнопки завершения уровня
function updateEndLevelButton() {
    const endLevelText = document.getElementById('end-level-text');
    endLevelText.textContent = gameState.level === 3 ? 'Завершить игру' : 'Завершить уровень';
}

// Модальное окно завершения уровня
function showEndLevelModal() {
    const modal = document.getElementById('end-level-modal');
    const modalTitle = document.getElementById('end-level-modal-title');
    const modalMessage = document.getElementById('end-level-modal-message');
    
    modalTitle.textContent = gameState.level === 3 ? 'Завершение игры' : 'Завершение уровня';
    modalMessage.textContent = gameState.level === 3 
        ? 'Вы уверены, что хотите завершить игру? Ваш прогресс будет сохранен.' 
        : 'Вы уверены, что хотите завершить уровень досрочно? Вы перейдете на следующий уровень.';
    
    modal.classList.add('active');
}

function closeEndLevelModal() {
    document.getElementById('end-level-modal').classList.remove('active');
}

function endLevelConfirmed() {
    // Сбрасываем стили таймера текущего уровня
    resetTimerStyles(gameState.level);
    
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    closeEndLevelModal();
    
    if (gameState.level === 3) {
        endGame("Завершено досрочно");
        return;
    }
    
    const completedLevel = gameState.level;
    
    if (completedLevel === 1) {
        gameState.hintsUsedLevel1.clear();
        gameState.penaltyPointsLevel1 = 0;
        gameState.usedCategories.clear();
    } else if (completedLevel === 2) {
        gameState.penaltyPointsLevel2 = 0;
        gameState.level2Round = 1;
        gameState.animationIntervals.forEach(interval => clearInterval(interval));
        gameState.animationIntervals = [];
    }
    
    gameState.selectedCards.clear();
    gameState.correctAnswers = 0;
    
    gameState.levelCompleted = true;
    gameState.levelsCompleted++;
    
    gameState.level++;
    
    updateGameUI();
    startLevel();
}

// Функция для проверки, есть ли достаточно слов на букву
function hasEnoughWordsForLetter(letter) {
    const wordsWithLetter = wordDictionary.filter(word => 
        word.word.charAt(0).toUpperCase() === letter.toUpperCase()
    );
    return wordsWithLetter.length >= 3;
}

// =================== УРОВЕНЬ 1 ===================
function startLevel1() {
    const container = document.querySelector('.level-1-container');
    container.classList.remove('hidden');
    
    const availableCategories = [...new Set(wordDictionary.map(word => word.category))];
    const unusedCategories = availableCategories.filter(category => !gameState.usedCategories.has(category));
    
    let selectedCategory = unusedCategories.length > 0 
        ? unusedCategories[Math.floor(Math.random() * unusedCategories.length)]
        : (gameState.usedCategories.clear(), availableCategories[Math.floor(Math.random() * availableCategories.length)]);
    
    gameState.usedCategories.add(selectedCategory);
    gameState.currentCategory = selectedCategory;
    
    document.getElementById('target-category').textContent = selectedCategory;
    document.getElementById('current-round').textContent = gameState.currentRound;
    document.getElementById('total-rounds').textContent = gameState.totalRounds;
    
    // Рассчитываем базовое количество карточек для текущего раунда
    const baseCardsCount = LEVEL_CONFIG.level1.baseCards + 
                         (gameState.currentRound - 1) * LEVEL_CONFIG.level1.cardsPerRoundIncrease;
    
    const categoryWords = wordDictionary.filter(word => word.category === selectedCategory);
    const otherWords = wordDictionary.filter(word => word.category !== selectedCategory);
    
    // Определяем максимально возможное количество правильных карточек (60% от базового)
    const maxCorrectCount = Math.min(categoryWords.length, Math.floor(baseCardsCount * 0.6));
    const correctCount = Math.max(1, maxCorrectCount); // Минимум 1 правильная карточка
    
    // Определяем максимально возможное количество неправильных карточек
    const maxIncorrectCount = Math.min(otherWords.length, baseCardsCount - correctCount);
    const incorrectCount = Math.max(1, maxIncorrectCount); // Минимум 1 неправильная карточка
    
    // Фактическое общее количество карточек
    const actualTotalCards = correctCount + incorrectCount;
    
    // Сохраняем фактическое количество карточек
    gameState.cardsInRound = actualTotalCards;
    gameState.correctAnswers = correctCount;
    
    // Обновляем отображаемое количество карточек
    document.getElementById('cards-count').textContent = actualTotalCards;
    
    // Берем случайные карточки для правильных ответов
    const selectedCategoryWords = [];
    const usedCorrectWords = new Set();
    const maxCorrectAttempts = Math.min(correctCount * 3, categoryWords.length * 2);
    
    for (let i = 0; i < Math.min(correctCount, categoryWords.length) && i < maxCorrectAttempts; i++) {
        const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        if (!usedCorrectWords.has(randomWord.word)) {
            selectedCategoryWords.push(randomWord);
            usedCorrectWords.add(randomWord.word);
        }
    }
    
    // Если не удалось набрать нужное количество правильных карточек, корректируем
    const actualCorrectCount = selectedCategoryWords.length;
    if (actualCorrectCount < correctCount) {
        // Уменьшаем общее количество, если не хватает правильных карточек
        const newIncorrectCount = Math.max(1, Math.min(incorrectCount, otherWords.length, actualTotalCards - actualCorrectCount));
        gameState.cardsInRound = actualCorrectCount + newIncorrectCount;
        gameState.correctAnswers = actualCorrectCount;
        document.getElementById('cards-count').textContent = gameState.cardsInRound;
    }
    
    // Берем случайные карточки для неправильных ответов
    const selectedOtherWords = [];
    const usedIncorrectWords = new Set();
    const neededIncorrectCount = gameState.cardsInRound - gameState.correctAnswers;
    const maxIncorrectAttempts = Math.min(neededIncorrectCount * 3, otherWords.length * 2);
    
    for (let i = 0; i < Math.min(neededIncorrectCount, otherWords.length) && i < maxIncorrectAttempts; i++) {
        const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
        if (!usedIncorrectWords.has(randomWord.word)) {
            selectedOtherWords.push(randomWord);
            usedIncorrectWords.add(randomWord.word);
        }
    }
    
    // Если не удалось набрать нужное количество неправильных карточек, корректируем
    const actualIncorrectCount = selectedOtherWords.length;
    if (actualIncorrectCount < neededIncorrectCount) {
        // Уменьшаем общее количество, если не хватает неправильных карточек
        gameState.cardsInRound = gameState.correctAnswers + actualIncorrectCount;
        document.getElementById('cards-count').textContent = gameState.cardsInRound;
    }
    
    // Формируем итоговый массив карточек
    let allWords = [...selectedCategoryWords, ...selectedOtherWords];
    
    // Проверяем, что у нас есть хотя бы минимальное количество карточек
    if (allWords.length < 4) {
        // Если карточек слишком мало, добавляем дополнительные из любых категорий
        const allAvailableWords = wordDictionary.filter(word => 
            !usedCorrectWords.has(word.word) && !usedIncorrectWords.has(word.word)
        );
        
        const neededAdditional = 4 - allWords.length;
        for (let i = 0; i < Math.min(neededAdditional, allAvailableWords.length); i++) {
            const randomWord = allAvailableWords[Math.floor(Math.random() * allAvailableWords.length)];
            if (!usedCorrectWords.has(randomWord.word) && !usedIncorrectWords.has(randomWord.word)) {
                allWords.push(randomWord);
                if (randomWord.category === selectedCategory) {
                    gameState.correctAnswers++;
                }
                usedCorrectWords.add(randomWord.word);
            }
        }
        
        gameState.cardsInRound = allWords.length;
        document.getElementById('cards-count').textContent = gameState.cardsInRound;
    }
    
    shuffleArray(allWords);
    
    const cardsContainer = document.getElementById('cards-container-level1');
    cardsContainer.innerHTML = '';
    
    allWords.forEach((word, index) => {
        const card = createCard(word, index, 'level1');
        card.dataset.isCorrect = word.category === selectedCategory;
        
        card.addEventListener('click', () => {
            if (!gameState.levelCompleted && gameState.roundTimeRemaining > 0) {
                toggleCardSelection(card, index);
            }
        });

        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (!gameState.levelCompleted && !card.classList.contains('showing-word') && gameState.roundTimeRemaining > 0) {
                useHint(card, index, 'level1');
            }
        });
        
        cardsContainer.appendChild(card);
    });
    
    // Обновляем счетчик выбранных карточек
    updateSelectedCount();
    document.getElementById('next-round-level1').classList.add('hidden');
    document.getElementById('check-level1').classList.remove('hidden');
    
    const level1Time = DIFFICULTY_TIMES[gameState.difficulty].level1;
    startRoundTimer(level1Time, 1);
}

// Создание карточки
function createCard(wordData, index, level) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.word = wordData.word;
    card.dataset.category = wordData.category;
    card.dataset.letterCount = wordData.letterCount;
    card.dataset.emoji = wordData.emoji;
    
    card.dataset.originalContent = `<div class="emoji">${wordData.emoji}</div>`;
    card.innerHTML = `<div class="emoji">${wordData.emoji}</div>`;
    
    return card;
}

// Использование подсказки
function useHint(card, index, level) {
    let hintsUsed = level === 'level1' ? gameState.hintsUsedLevel1 : gameState.hintsUsedLevel3;
    const penaltyPerHint = level === 'level1' ? 5 : 10;
    
    if (hintsUsed.has(index)) {
        showQuickMessage("Подсказка уже использована для этой карточки", "info");
        return;
    }
    
    // Звук использования подсказки
    audioManager.play('click', 0.3);
    
    if (level === 'level1') {
        gameState.penaltyPointsLevel1 += penaltyPerHint;
    } else if (level === 'level3') {
        gameState.penaltyPointsLevel3 += penaltyPerHint;
    }
    
    gameState.score = Math.max(0, gameState.score - penaltyPerHint);
    updateScoreDisplay();

    showQuickMessage(`Штраф за подсказку: -${penaltyPerHint} очков`, "warning");
    
    hintsUsed.add(index);
    card.classList.add('hint-used');
    showWordHint(card);
}

// Показать подсказку с словом
function showWordHint(card) {
    const word = card.dataset.word;
    
    if (!card.dataset.isShowingHint) {
        card.dataset.isShowingHint = 'true';
        card.innerHTML = `<div class="word-hint">${word}</div>`;
        card.classList.add('showing-word');
        
        setTimeout(() => {
            if (card.dataset.isShowingHint === 'true') {
                card.innerHTML = card.dataset.originalContent;
                card.classList.remove('showing-word');
                card.dataset.isShowingHint = 'false';
            }
        }, 3000);
    }
}

// Быстрое сообщение
function showQuickMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `quick-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? '#3498db' : type === 'warning' ? '#f39c12' : '#2ecc71'};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Звук уведомления
    audioManager.play('click', 0.2);
    
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 2000);
}

// Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Переключение выбора карточки
function toggleCardSelection(card, index) {
    if (gameState.selectedCards.has(index)) {
        gameState.selectedCards.delete(index);
        card.classList.remove('selected');
        audioManager.play('click', 0.2);
    } else {
        gameState.selectedCards.add(index);
        card.classList.add('selected');
        audioManager.play('click', 0.3);
    }
    
    updateSelectedCount();
}

// Обновление счетчика выбранных карточек
function updateSelectedCount() {
    document.getElementById('selected-count').textContent = gameState.selectedCards.size;
}

// Проверка ответа для уровня 1
function checkLevel1(timeExpired = false, timeExpiredMessage = "") {
    // Сбрасываем стили таймера
    resetTimerStyles(1);
    
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    let correctSelections = 0;
    const cards = document.querySelectorAll('#cards-container-level1 .card');
    
    // Получаем фактическое количество карточек из DOM
    const actualCardCount = cards.length;
    
    cards.forEach(card => {
        const index = parseInt(card.dataset.index);
        const isCorrect = card.dataset.isCorrect === 'true';
        const isSelected = gameState.selectedCards.has(index);
        
        if (isCorrect && isSelected) {
            correctSelections++;
            card.classList.add('selected');
        } else if (!isCorrect && isSelected) {
            card.classList.add('incorrect');
        } else if (isCorrect && !isSelected) {
            card.classList.add('missed');
        }
    });
    
    let pointsEarned = 0;
    let message = '';
    
    // Начинаем сообщение с информации о времени (если время вышло)
    if (timeExpired && timeExpiredMessage) {
        message = timeExpiredMessage;
    }
    
    // Добавляем основное сообщение о результате
    let resultMessage = '';
    let soundToPlay = 'win';
    
    // Используем gameState.correctAnswers вместо расчетного значения
    if (correctSelections === gameState.correctAnswers && gameState.selectedCards.size === gameState.correctAnswers) {
        pointsEarned = 100 + (gameState.currentRound * 20);
        resultMessage = `Отлично! Все ${gameState.correctAnswers} слов найдены правильно!`;
        
        // Добавляем бонус за оставшееся время (10% от базовых очков за каждые 5 секунд)
        if (!timeExpired && gameState.roundTimeRemaining > 0) {
            const timeBonus = Math.floor(pointsEarned * 0.1 * Math.floor(gameState.roundTimeRemaining / 5));
            pointsEarned += timeBonus;
            resultMessage += `\nБонус за время: +${timeBonus} очков`;
        }
    } else {
        const wrongSelections = gameState.selectedCards.size - correctSelections;
        const missedSelections = gameState.correctAnswers - correctSelections;
        
        pointsEarned = Math.floor(100 * (correctSelections / gameState.correctAnswers));
        pointsEarned = Math.max(0, pointsEarned - (wrongSelections * 15) - (missedSelections * 10));
        
        resultMessage = `Найдено ${correctSelections} из ${gameState.correctAnswers} правильных слов.`;
        if (wrongSelections > 0) resultMessage += ` Лишних выборов: ${wrongSelections}.`;
        if (missedSelections > 0) resultMessage += ` Пропущено: ${missedSelections}.`;
        
        soundToPlay = 'lose';
    }
    
    // Объединяем сообщения
    if (message && resultMessage) {
        message += "\n" + resultMessage;
    } else if (resultMessage) {
        message = resultMessage;
    }
    
    gameState.score += pointsEarned;
    updateScoreDisplay();
    
    let penaltyInfo = '';
    if (gameState.penaltyPointsLevel1 > 0) {
        penaltyInfo = `\n\nШтраф за подсказки: -${gameState.penaltyPointsLevel1} очков`;
        message += penaltyInfo;
    }

    // Воспроизводим звук результата
    setTimeout(() => {
        audioManager.playLevelEndSound(soundToPlay, 0.6);
    }, 300);
    
    showResultModal(message, pointsEarned);
    
    cards.forEach(card => card.style.pointerEvents = 'none');
    
    if (gameState.currentRound < gameState.totalRounds) {
        document.getElementById('check-level1').classList.add('hidden');
        document.getElementById('next-round-level1').classList.remove('hidden');
        document.getElementById('next-round-level1').textContent = 'Следующий раунд';
    } else {
        document.getElementById('check-level1').classList.add('hidden');
        document.getElementById('next-round-level1').textContent = 'Завершить уровень';
        document.getElementById('next-round-level1').classList.remove('hidden');
    }
}

// Переход к следующему раунду уровня 1
function nextRoundLevel1() {
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    gameState.hintsUsedLevel1.clear();
    gameState.penaltyPointsLevel1 = 0;
    gameState.selectedCards.clear();
    
    if (gameState.currentRound < gameState.totalRounds) {
        gameState.currentRound++;
        // Увеличиваем количество карточек для следующего раунда
        gameState.cardsInRound = LEVEL_CONFIG.level1.baseCards + 
                                (gameState.currentRound - 1) * LEVEL_CONFIG.level1.cardsPerRoundIncrease;
        startLevel1();
    } else {
        gameState.levelCompleted = true;
        gameState.levelsCompleted++;
        gameState.level = 2;
        gameState.currentRound = 1;
        // Сбрасываем количество карточек для уровня 2
        gameState.cardsInRound = LEVEL_CONFIG.level2.baseCards;
        gameState.usedCategories.clear();
        
        gameState.selectedCards.clear();
        gameState.hintsUsedLevel1.clear();
        gameState.penaltyPointsLevel1 = 0;
        
        updateGameUI();
        startLevel();
    }
}

// =================== УРОВЕНЬ 2 ===================
function startLevel2() {
    const container = document.querySelector('.level-2-container');
    container.classList.remove('hidden');
    
    gameState.animationIntervals.forEach(interval => clearInterval(interval));
    gameState.animationIntervals = [];
    
    document.getElementById('current-round-level2').textContent = gameState.level2Round;
    document.getElementById('total-rounds-level2').textContent = 5;
    
    // Фильтруем буквы, для которых есть хотя бы 3 слова
    const availableLetters = AVAILABLE_LETTERS.filter(letter => hasEnoughWordsForLetter(letter));
    
    if (availableLetters.length === 0) {
        // Если нет подходящих букв, используем любую букву
        const allLetters = [...new Set(wordDictionary.map(word => word.word.charAt(0).toUpperCase()))];
        const selectedLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
        gameState.currentTargetLetter = selectedLetter;
    } else {
        const selectedLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        gameState.currentTargetLetter = selectedLetter;
    }
    
    document.getElementById('target-letter').textContent = gameState.currentTargetLetter;
    
    const wordsWithLetter = wordDictionary.filter(word => 
        word.word.charAt(0).toUpperCase() === gameState.currentTargetLetter.toUpperCase()
    );
    const wordsWithoutLetter = wordDictionary.filter(word => 
        word.word.charAt(0).toUpperCase() !== gameState.currentTargetLetter.toUpperCase()
    );
    
    // Рассчитываем количество карточек для текущего раунда
    const totalCards = LEVEL_CONFIG.level2.baseCards + 
                      (gameState.level2Round - 1) * LEVEL_CONFIG.level2.cardsPerRoundIncrease;
    
    // Ограничиваем максимальное количество карточек
    const maxPossibleCards = Math.min(totalCards, wordsWithLetter.length + wordsWithoutLetter.length);
    const actualCards = Math.max(8, maxPossibleCards); // Минимум 8 карточек
    
    // Правильные карточки должны быть на 1-2 меньше, чем неправильные
    const maxCorrectCards = Math.max(2, Math.min(wordsWithLetter.length, Math.floor(actualCards * 0.4)));
    const correctCount = Math.max(2, maxCorrectCards - Math.floor(Math.random() * 2)); // От 2 до maxCorrectCards
    const incorrectCount = Math.max(correctCount + 1, Math.min(actualCards - correctCount, wordsWithoutLetter.length));
    
    // Корректируем общее количество, если нужно
    const actualTotalCards = Math.min(correctCount + incorrectCount, actualCards);
    
    // Берем случайные карточки для правильных ответов
    const selectedCorrectWords = [];
    const usedCorrectWords = new Set();
    const maxCorrectAttempts = Math.min(correctCount * 3, wordsWithLetter.length * 2);
    
    for (let i = 0; i < Math.min(correctCount, wordsWithLetter.length) && i < maxCorrectAttempts; i++) {
        const randomWord = wordsWithLetter[Math.floor(Math.random() * wordsWithLetter.length)];
        if (!usedCorrectWords.has(randomWord.word)) {
            selectedCorrectWords.push(randomWord);
            usedCorrectWords.add(randomWord.word);
        }
    }
    
    // Если не хватает правильных карточек, уменьшаем количество
    const actualCorrectCount = selectedCorrectWords.length;
    const actualIncorrectCount = Math.min(incorrectCount, wordsWithoutLetter.length);
    
    // Берем случайные карточки для неправильных ответов
    const selectedIncorrectWords = [];
    const usedIncorrectWords = new Set();
    const maxIncorrectAttempts = Math.min(actualIncorrectCount * 3, wordsWithoutLetter.length * 2);
    
    for (let i = 0; i < Math.min(actualIncorrectCount, wordsWithoutLetter.length) && i < maxIncorrectAttempts; i++) {
        const randomWord = wordsWithoutLetter[Math.floor(Math.random() * wordsWithoutLetter.length)];
        if (!usedIncorrectWords.has(randomWord.word)) {
            selectedIncorrectWords.push(randomWord);
            usedIncorrectWords.add(randomWord.word);
        }
    }
    
    const allWords = [...selectedCorrectWords, ...selectedIncorrectWords];
    shuffleArray(allWords);
    
    gameState.correctAnswers = selectedCorrectWords.length;
    document.getElementById('cards-count-level2').textContent = allWords.length;
    
    const cardsContainer = document.getElementById('cards-container-level2');
    cardsContainer.innerHTML = '';
    gameState.selectedCards.clear();
    
    allWords.forEach((word, index) => {
        const card = createCard(word, index, 'level2');
        card.classList.add('moving-card');
        card.dataset.isCorrect = word.word.charAt(0).toUpperCase() === gameState.currentTargetLetter.toUpperCase();
        
        const containerRect = cardsContainer.getBoundingClientRect();
        const cardWidth = 80;
        const cardHeight = 80;
        
        const maxX = containerRect.width - cardWidth;
        const maxY = containerRect.height - cardHeight;
        
        const startX = Math.random() * maxX;
        const startY = Math.random() * maxY;
        
        card.style.left = `${startX}px`;
        card.style.top = `${startY}px`;
        
        const speedX = (Math.random() - 0.5) * 3;
        const speedY = (Math.random() - 0.5) * 3;
        
        let x = startX;
        let y = startY;
        let currentSpeedX = speedX;
        let currentSpeedY = speedY;
        
        const animationInterval = setInterval(() => {
            if (!card.classList.contains('selected') && !card.classList.contains('stopped') && gameState.roundTimeRemaining > 0) {
                x += currentSpeedX;
                y += currentSpeedY;
                
                if (x <= 0 || x >= maxX) {
                    currentSpeedX = -currentSpeedX;
                    x = Math.max(0, Math.min(x, maxX));
                }
                
                if (y <= 0 || y >= maxY) {
                    currentSpeedY = -currentSpeedY;
                    y = Math.max(0, Math.min(y, maxY));
                }
                
                card.style.left = `${x}px`;
                card.style.top = `${y}px`;
            }
        }, 50);
        
        gameState.animationIntervals.push(animationInterval);
        
        card.addEventListener('click', (e) => {
            if (e.button === 0 && gameState.roundTimeRemaining > 0) {
                if (e.detail > 1) {
                    e.preventDefault();
                }
        
                if (e.detail === 2) { // Двойной клик
                    handleDoubleClickLevel2(card, index);
                    return;
                }
        
                // Одинарный клик
                if (!card.classList.contains('selected') && !gameState.levelCompleted) {
                    // Запускаем анимацию вращения при выборе
                    rotateCard(card, 2);
            
                    clearInterval(animationInterval);
                    card.classList.add('stopped');
                    card.classList.add('selected');
                    gameState.selectedCards.add(index);
                    updateSelectedCountLevel2();
                    
                    // Звук выбора карточки
                    audioManager.play('click', 0.3);
                }
            }
        });
        
        cardsContainer.appendChild(card);
    });
    
    updateSelectedCountLevel2();
    document.getElementById('next-round-level2').classList.add('hidden');
    document.getElementById('check-level2').classList.remove('hidden');
    
    const level2Time = DIFFICULTY_TIMES[gameState.difficulty].level2;
    startRoundTimer(level2Time, 2);
}

// Обновление счетчика выбранных карточек для уровня 2
function updateSelectedCountLevel2() {
    document.getElementById('selected-count-level2').textContent = gameState.selectedCards.size;
}

// Обработка двойного клика для уровня 2
function handleDoubleClickLevel2(card, index) {
    if (card.classList.contains('selected') && !gameState.levelCompleted && gameState.roundTimeRemaining > 0) {
        
        // Запускаем анимацию вращения
        rotateCard(card, 2);
        
        card.classList.remove('selected', 'stopped');
        gameState.selectedCards.delete(index);
        
        const penalty = 5;
        gameState.penaltyPointsLevel2 += penalty;
        gameState.score = Math.max(0, gameState.score - penalty);
        
        updateScoreDisplay();
        updateSelectedCountLevel2();
        
        showQuickMessage(`Штраф за отмену выбора: -${penalty} очков`, "warning");
        
        // Возобновляем анимацию движения с небольшой задержкой
        setTimeout(() => {
            resumeCardAnimation(card);
        }, 300);
    }
}

function resumeCardAnimation(card) {
    const cardsContainer = document.getElementById('cards-container-level2');
    const containerRect = cardsContainer.getBoundingClientRect();
    const cardWidth = 80;
    const cardHeight = 80;
    
    const maxX = containerRect.width - cardWidth;
    const maxY = containerRect.height - cardHeight;
    
    const currentLeft = parseFloat(card.style.left) || 0;
    const currentTop = parseFloat(card.style.top) || 0;
    
    let x = Math.max(0, Math.min(currentLeft, maxX));
    let y = Math.max(0, Math.min(currentTop, maxY));
    
    const speedX = (Math.random() - 0.5) * 3;
    const speedY = (Math.random() - 0.5) * 3;
    
    let currentSpeedX = speedX;
    let currentSpeedY = speedY;
    
    const currentIndex = parseInt(card.dataset.index);
    const existingInterval = gameState.animationIntervals[currentIndex];
    
    if (existingInterval) {
        clearInterval(existingInterval);
    }
    
    const animationInterval = setInterval(() => {
        if (!card.classList.contains('selected') && !card.classList.contains('stopped') && gameState.roundTimeRemaining > 0) {
            x += currentSpeedX;
            y += currentSpeedY;
            
            if (x <= 0 || x >= maxX) {
                currentSpeedX = -currentSpeedX;
                x = Math.max(0, Math.min(x, maxX));
            }
            
            if (y <= 0 || y >= maxY) {
                currentSpeedY = -currentSpeedY;
                y = Math.max(0, Math.min(y, maxY));
            }
            
            card.style.left = `${x}px`;
            card.style.top = `${y}px`;
        }
    }, 50);
    
    gameState.animationIntervals[currentIndex] = animationInterval;
}

// Проверка ответа для уровня 2
function checkLevel2(timeExpired = false, timeExpiredMessage = "") {
    // Сбрасываем стили таймера
    resetTimerStyles(2);
    
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    gameState.animationIntervals.forEach(interval => clearInterval(interval));
    gameState.animationIntervals = [];
    
    let correctSelections = 0;
    const cards = document.querySelectorAll('#cards-container-level2 .moving-card');
    
    cards.forEach(card => {
        const index = parseInt(card.dataset.index);
        const isCorrect = card.dataset.isCorrect === 'true';
        const isSelected = gameState.selectedCards.has(index);
        
        if (isCorrect && isSelected) {
            correctSelections++;
            card.classList.add('correct');
        } else if (!isCorrect && isSelected) {
            card.classList.add('incorrect');
        } else if (isCorrect && !isSelected) {
            card.classList.add('missed');
        }
    });
    
    let pointsEarned = 0;
    let message = '';
    
    // Начинаем сообщение с информации о времени (если время вышло)
    if (timeExpired && timeExpiredMessage) {
        message = timeExpiredMessage;
    }
    
    // Добавляем основное сообщение о результате
    let resultMessage = '';
    let soundToPlay = 'win';
    
    if (correctSelections === gameState.correctAnswers && gameState.selectedCards.size === gameState.correctAnswers) {
        pointsEarned = 150 + (gameState.level2Round * 10);
        resultMessage = `Отлично! Все ${gameState.correctAnswers} слов на букву "${gameState.currentTargetLetter}" найдены!`;
        
        // Добавляем бонус за оставшееся время (10% от базовых очков за каждые 5 секунд)
        if (!timeExpired && gameState.roundTimeRemaining > 0) {
            const timeBonus = Math.floor(pointsEarned * 0.1 * Math.floor(gameState.roundTimeRemaining / 5));
            pointsEarned += timeBonus;
            resultMessage += `\nБонус за время: +${timeBonus} очков`;
        }
    } else {
        const wrongSelections = gameState.selectedCards.size - correctSelections;
        const missedSelections = gameState.correctAnswers - correctSelections;
        
        pointsEarned = Math.floor(150 * (correctSelections / gameState.correctAnswers));
        pointsEarned = Math.max(0, pointsEarned - (wrongSelections * 20) - (missedSelections * 15));
        
        resultMessage = `Найдено ${correctSelections} из ${gameState.correctAnswers} правильных слов на букву "${gameState.currentTargetLetter}".`;
        if (wrongSelections > 0) resultMessage += ` Лишних выборов: ${wrongSelections}.`;
        if (missedSelections > 0) resultMessage += ` Пропущено: ${missedSelections}.`;
        
        soundToPlay = 'lose';
    }

    if (gameState.penaltyPointsLevel2 > 0) {
        const penalty = gameState.penaltyPointsLevel2;
        pointsEarned = Math.max(0, pointsEarned - penalty);
        resultMessage += `\nШтраф за отмену выбора: -${penalty} очков.`;
    }
    
    // Объединяем сообщения
    if (message && resultMessage) {
        message += "\n" + resultMessage;
    } else if (resultMessage) {
        message = resultMessage;
    }
    
    gameState.score += pointsEarned;
    updateScoreDisplay();
    
    // Воспроизводим звук результата
    setTimeout(() => {
        audioManager.playLevelEndSound(soundToPlay, 0.6);
    }, 300);
    
    showResultModal(message, pointsEarned);
    
    cards.forEach(card => card.style.pointerEvents = 'none');
    
    if (gameState.level2Round < 5) {
        document.getElementById('check-level2').classList.add('hidden');
        document.getElementById('next-round-level2').classList.remove('hidden');
        document.getElementById('next-round-level2').textContent = 'Следующий раунд';
    } else {
        document.getElementById('check-level2').classList.add('hidden');
        document.getElementById('next-round-level2').textContent = 'Завершить уровень';
        document.getElementById('next-round-level2').classList.remove('hidden');
    }
}

// Переход к следующему раунду уровня 2
function nextRoundLevel2() {
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    if (gameState.level2Round < 5) {
        gameState.level2Round++;
        gameState.penaltyPointsLevel2 = 0;
        gameState.selectedCards.clear();
        
        gameState.animationIntervals.forEach(interval => clearInterval(interval));
        gameState.animationIntervals = [];
        
        startLevel2();
    } else {
        gameState.levelCompleted = true;
        gameState.levelsCompleted++;
        gameState.level = 3;
        gameState.level2Round = 1;
        gameState.penaltyPointsLevel2 = 0;
        gameState.selectedCards.clear();
        
        updateGameUI();
        startLevel();
    }
}

// =================== УРОВЕНЬ 3 ===================
function startLevel3() {
    const container = document.querySelector('.level-3-container');
    container.classList.remove('hidden');
    
    document.getElementById('current-round-level3').textContent = gameState.level3Round;
    document.getElementById('total-rounds-level3').textContent = 5;

    gameState.level3HintedCards.clear();
    gameState.selectedCards.clear();
    
    const possibleCounts = [3, 4, 5, 6, 7, 8];
    shuffleArray(possibleCounts);
    gameState.letterCounts = possibleCounts.slice(0, 2).sort((a, b) => a - b);
    
    const gameContainer = document.querySelector('.level-3-game-container');
    gameContainer.innerHTML = '';
    
    const sourceContainer = document.createElement('div');
    sourceContainer.className = 'level3-source-container';
    sourceContainer.id = 'cards-container-level3';
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'level3-categories-container';
    categoriesContainer.id = 'categories-container-level3';
    
    const categoryBoxesContainer = document.createElement('div');
    categoryBoxesContainer.className = 'category-boxes-container';
    
    gameState.letterCounts.forEach(count => {
        const categoryBox = document.createElement('div');
        categoryBox.className = 'category-box';
        categoryBox.dataset.count = count;
        categoryBox.dataset.id = `category-${count}`;
        categoryBox.innerHTML = `
            <h4>${count} букв${getLetterEnding(count)}</h4>
            <div class="drop-zone" data-count="${count}" id="drop-zone-${count}">
                <div class="empty-state">
                    Перетащите сюда карточки<br>
                    <small>с ${count} буквами</small>
                </div>
            </div>
        `;
        
        categoryBoxesContainer.appendChild(categoryBox);
    });
    
    categoriesContainer.appendChild(categoryBoxesContainer);
    gameContainer.appendChild(sourceContainer);
    gameContainer.appendChild(categoriesContainer);
    
    const selectedWords = [];
    
    // Рассчитываем количество карточек для каждого типа
    const basePerCategory = 4;
    const increasePerRound = 1;
    const cardsPerCategory = basePerCategory + (gameState.level3Round - 1) * increasePerRound;
    
    gameState.letterCounts.forEach(count => {
        const wordsWithCount = wordDictionary.filter(word => word.letterCount === count);
        
        const wordsForContainer = [];
        const usedWords = new Set();
        const maxWords = Math.min(cardsPerCategory, wordsWithCount.length);
        const maxAttempts = Math.min(maxWords * 3, wordsWithCount.length * 2);
        
        for (let i = 0; i < maxWords && i < maxAttempts; i++) {
            if (wordsWithCount.length === 0) break;
            
            const randomWord = wordsWithCount[Math.floor(Math.random() * wordsWithCount.length)];
            if (!usedWords.has(randomWord.word)) {
                wordsForContainer.push(randomWord);
                usedWords.add(randomWord.word);
            }
        }
        
        selectedWords.push(...wordsForContainer);
    });
    
    // Проверяем, если для одного типа не хватает карточек, добавляем из другого типа
    let totalCards = selectedWords.length;
    const targetTotalCards = gameState.letterCounts.length * cardsPerCategory;
    
    if (totalCards < targetTotalCards) {
        // Определяем, для какого типа не хватает карточек
        const countsByType = {};
        gameState.letterCounts.forEach(count => {
            countsByType[count] = selectedWords.filter(word => word.letterCount === count).length;
        });
        
        // Ищем тип с наименьшим количеством карточек
        let minCount = Infinity;
        let minCountType = null;
        for (const count in countsByType) {
            if (countsByType[count] < minCount) {
                minCount = countsByType[count];
                minCountType = parseInt(count);
            }
        }
        
        // Если нашли тип с недостающими карточками
        if (minCountType !== null && minCount < cardsPerCategory) {
            const otherCount = gameState.letterCounts.find(c => c !== minCountType);
            const wordsWithOtherCount = wordDictionary.filter(word => word.letterCount === otherCount);
            
            // Находим слова другого типа, которые еще не использованы
            const usedWordsSet = new Set(selectedWords.map(word => word.word));
            const availableWords = wordsWithOtherCount.filter(word => !usedWordsSet.has(word.word));
            
            // Берем нужное количество слов из другого типа
            const neededWords = cardsPerCategory - minCount;
            const additionalWords = [];
            const maxAdditionalAttempts = Math.min(neededWords * 3, availableWords.length * 2);
            
            for (let i = 0; i < Math.min(neededWords, availableWords.length) && i < maxAdditionalAttempts; i++) {
                const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
                if (!usedWordsSet.has(randomWord.word)) {
                    additionalWords.push(randomWord);
                    usedWordsSet.add(randomWord.word);
                }
            }
            
            selectedWords.push(...additionalWords);
            totalCards = selectedWords.length;
        }
    }

    document.getElementById('cards-count-level3').textContent = totalCards;
    
    shuffleArray(selectedWords);
    
    selectedWords.forEach((word, index) => {
        const card = createCard(word, index, 'level3');
        card.draggable = true;
        card.classList.add('draggable-card');
        card.dataset.originalZone = 'source';
        card.dataset.moves = 0;
        
        card.style.margin = '5px';
        
        card.addEventListener('dragstart', handleDragStartLevel3);
        
        sourceContainer.appendChild(card);
    });
    
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOverLevel3);
        zone.addEventListener('drop', handleDropLevel3);
        zone.addEventListener('dragenter', handleDragEnterLevel3);
        zone.addEventListener('dragleave', handleDragLeaveLevel3);
    });
    
    sourceContainer.addEventListener('dragover', handleDragOverLevel3);
    sourceContainer.addEventListener('drop', handleDropToSourceLevel3);
    sourceContainer.addEventListener('dragenter', handleDragEnterLevel3);
    sourceContainer.addEventListener('dragleave', handleDragLeaveLevel3);
    
    document.getElementById('next-round-level3').classList.add('hidden');
    document.getElementById('check-level3').classList.remove('hidden');
    
    const level3Time = DIFFICULTY_TIMES[gameState.difficulty].level3;
    startRoundTimer(level3Time, 3);
}

function getLetterEnding(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return '';
    }
    
    if (lastDigit === 1) {
        return 'а';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
        return 'ы';
    } else {
        return '';
    }
}

// Обработчики перетаскивания для уровня 3
let draggedCardLevel3 = null;

function handleDragStartLevel3(e) {
    if (!gameState.levelCompleted && gameState.roundTimeRemaining > 0) {
        draggedCardLevel3 = this;
        e.dataTransfer.setData('text/plain', this.dataset.index);
        
        if (!draggedCardLevel3.dataset.originalZone) {
            draggedCardLevel3.dataset.originalZone = 'source';
        }
        
        setTimeout(() => this.classList.add('dragging'), 0);
        
        // Звук начала перетаскивания
        audioManager.play('click', 0.2);
    }
}

function handleDragOverLevel3(e) {
    e.preventDefault();
}

function handleDragEnterLevel3(e) {
    e.preventDefault();
    this.classList.add('active');
}

function handleDragLeaveLevel3() {
    this.classList.remove('active');
}

function handleDropLevel3(e) {
    e.preventDefault();
    this.classList.remove('active');
    
    if (draggedCardLevel3 && !gameState.levelCompleted && gameState.roundTimeRemaining > 0) {
        const targetCount = parseInt(this.dataset.count);
        const cardIndex = parseInt(draggedCardLevel3.dataset.index);
        
        const currentMoves = parseInt(draggedCardLevel3.dataset.moves || 0);
        draggedCardLevel3.dataset.moves = currentMoves + 1;
        
        if (draggedCardLevel3.dataset.originalZone !== 'source' && currentMoves > 0) {
            const penalty = 5;
            gameState.score = Math.max(0, gameState.score - penalty);
            gameState.penaltyPointsLevel3 += penalty;
            updateScoreDisplay();
            showQuickMessage(`Штраф за перемещение: -${penalty} очков`, 'warning');
        }
        
        if (draggedCardLevel3.parentElement) {
            draggedCardLevel3.parentElement.removeChild(draggedCardLevel3);
        }
        
        const emptyState = this.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
        
        draggedCardLevel3.classList.add('dropped');
        draggedCardLevel3.draggable = true;
        
        draggedCardLevel3.dataset.currentZone = this.id;
        draggedCardLevel3.dataset.targetCount = targetCount;
        draggedCardLevel3.dataset.originalZone = 'dropped';
        
        setupCardHoverEffects(draggedCardLevel3);
        
        this.appendChild(draggedCardLevel3);
        draggedCardLevel3.classList.remove('dragging');
        
        arrangeCardsInZone(this);
    }
    
    draggedCardLevel3 = null;
}

function handleDropToSourceLevel3(e) {
    e.preventDefault();
    this.classList.remove('active');
    
    if (draggedCardLevel3 && !gameState.levelCompleted && gameState.roundTimeRemaining > 0) {
        const cardIndex = parseInt(draggedCardLevel3.dataset.index);
        
        const currentMoves = parseInt(draggedCardLevel3.dataset.moves || 0);
        draggedCardLevel3.dataset.moves = currentMoves + 1;
        
        if (draggedCardLevel3.dataset.originalZone !== 'source' && currentMoves > 0) {
            const penalty = 5;
            gameState.score = Math.max(0, gameState.score - penalty);
            gameState.penaltyPointsLevel3 += penalty;
            updateScoreDisplay();
            showQuickMessage(`Штраф за возврат в исходный блок: -${penalty} очков`, 'warning');
        }
        
        if (draggedCardLevel3.parentElement) {
            draggedCardLevel3.parentElement.removeChild(draggedCardLevel3);
        }
        
        draggedCardLevel3.classList.remove('dropped', 'hover-correct', 'hover-incorrect', 'dragging');
        draggedCardLevel3.dataset.currentZone = 'source';
        draggedCardLevel3.dataset.originalZone = 'source';
        delete draggedCardLevel3.dataset.targetCount;
        
        removeCardHoverEffects(draggedCardLevel3);
        
        this.appendChild(draggedCardLevel3);
        
        draggedCardLevel3.addEventListener('dragstart', handleDragStartLevel3);
    }
    
    draggedCardLevel3 = null;
}

function setupCardHoverEffects(card) {
    removeCardHoverEffects(card);
    
    const highlightCard = () => {
        if (!gameState.levelCompleted && card.dataset.targetCount) {
            const cardCount = parseInt(card.dataset.letterCount);
            const targetCount = parseInt(card.dataset.targetCount);
            
            card.classList.remove('hover-correct', 'hover-incorrect');
            
            if (cardCount === targetCount) {
                card.classList.add('hover-correct');
            } else {
                card.classList.add('hover-incorrect');
            }
        }
    };
    
    const removeHighlight = () => {
        card.classList.remove('hover-correct', 'hover-incorrect');
    };
    
    card._mouseEnterHandler = highlightCard;
    card._mouseLeaveHandler = removeHighlight;
    
    card.addEventListener('mouseenter', card._mouseEnterHandler);
    card.addEventListener('mouseleave', card._mouseLeaveHandler);
}

function removeCardHoverEffects(card) {
    if (card._mouseEnterHandler) {
        card.removeEventListener('mouseenter', card._mouseEnterHandler);
        delete card._mouseEnterHandler;
    }
    
    if (card._mouseLeaveHandler) {
        card.removeEventListener('mouseleave', card._mouseLeaveHandler);
        delete card._mouseLeaveHandler;
    }
}

// Упорядочить карточки в зоне
function arrangeCardsInZone(zone) {
    const cards = zone.querySelectorAll('.card');
    
    if (cards.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            Перетащите сюда карточки<br>
            <small>с ${zone.dataset.count} буквами</small>
        `;
        zone.appendChild(emptyState);
        return;
    }
}

// Проверка ответа для уровня 3
function checkLevel3(timeExpired = false, timeExpiredMessage = "") {
    // Сбрасываем стили таймера
    resetTimerStyles(3);
    
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    const dropZones = document.querySelectorAll('.drop-zone');
    let correctlyPlaced = 0;
    let totalCardsInZones = 0;
    
    dropZones.forEach(zone => {
        const targetCount = parseInt(zone.dataset.count);
        
        const cards = zone.querySelectorAll('.card');
        totalCardsInZones += cards.length;
        
        cards.forEach(card => {
            const cardCount = parseInt(card.dataset.letterCount);
            
            card.classList.remove('hover-correct', 'hover-incorrect');
            
            if (cardCount === targetCount) {
                correctlyPlaced++;
                card.classList.add('correct');
            } else {
                card.classList.add('incorrect');
            }
        });
    });
    
    const sourceContainer = document.getElementById('cards-container-level3');
    const sourceCards = sourceContainer ? sourceContainer.querySelectorAll('.card') : [];
    
    sourceCards.forEach(card => {
        card.classList.add('missed');
    });
    
    let pointsEarned = 0;
    let message = '';
    
    // Начинаем сообщение с информации о времени (если время вышло)
    if (timeExpired && timeExpiredMessage) {
        message = timeExpiredMessage;
    }
    
    // Добавляем основное сообщение о результате
    let resultMessage = '';
    let soundToPlay = 'win';
    
    const totalCardsExpected = parseInt(document.getElementById('cards-count-level3').textContent) || 0;
    
    if (correctlyPlaced === totalCardsInZones && sourceCards.length === 0 && totalCardsInZones > 0) {
        pointsEarned = 200 + (gameState.level3Round * 10);
        resultMessage = `Отлично! Все ${totalCardsInZones} карточек правильно распределены!`;
        
        // Добавляем бонус за оставшееся время (10% от базовых очков за каждые 5 секунд)
        if (!timeExpired && gameState.roundTimeRemaining > 0) {
            const timeBonus = Math.floor(pointsEarned * 0.1 * Math.floor(gameState.roundTimeRemaining / 5));
            pointsEarned += timeBonus;
            resultMessage += `\nБонус за время: +${timeBonus} очков`;
        }
    } else if (totalCardsInZones > 0) {
        const wrongPlaced = totalCardsInZones - correctlyPlaced;
        const missedCards = sourceCards.length;
        
        pointsEarned = Math.floor(200 * (correctlyPlaced / Math.max(1, totalCardsInZones)));
        pointsEarned = Math.max(0, pointsEarned - (wrongPlaced * 25) - (missedCards * 15));
        
        resultMessage = `Правильно распределено ${correctlyPlaced} из ${totalCardsInZones} карточек.`;
        if (wrongPlaced > 0) resultMessage += ` Ошибок: ${wrongPlaced}.`;
        if (missedCards > 0) resultMessage += ` Пропущено: ${missedCards}.`;
        
        soundToPlay = 'lose';
    } else {
        pointsEarned = 0;
        resultMessage = "Ни одна карточка не размещена в категориях.";
        soundToPlay = 'lose';
    }
    
    const totalPenalty = gameState.penaltyPointsLevel3;
    if (totalPenalty > 0) {
        pointsEarned = Math.max(0, pointsEarned - totalPenalty);
        resultMessage += `\nШтрафы за дополнительные перемещения: -${totalPenalty} очков`;
    }
    
    pointsEarned = Math.max(0, Math.floor(pointsEarned));
    
    // Объединяем сообщения
    if (message && resultMessage) {
        message += "\n" + resultMessage;
    } else if (resultMessage) {
        message = resultMessage;
    }
    
    gameState.score += pointsEarned;
    updateScoreDisplay();
    
    // Воспроизводим звук результата
    setTimeout(() => {
        audioManager.playLevelEndSound(soundToPlay, 0.6);
    }, 300);
    
    showResultModal(message, pointsEarned);
    
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.draggable = false;
        card.style.pointerEvents = 'none';
        removeCardHoverEffects(card);
    });
    
    if (gameState.level3Round < 5) {
        document.getElementById('check-level3').classList.add('hidden');
        document.getElementById('next-round-level3').classList.remove('hidden');
        document.getElementById('next-round-level3').textContent = 'Следующий раунд';
    } else {
        document.getElementById('check-level3').classList.add('hidden');
        document.getElementById('next-round-level3').textContent = 'Завершить уровень';
        document.getElementById('next-round-level3').classList.remove('hidden');
    }
}

// Переход к следующему раунду уровня 3
function nextRoundLevel3() {
    // Останавливаем таймер раунда
    clearInterval(gameState.roundTimerInterval);
    audioManager.stopTimerSound();
    
    if (gameState.level3Round < 5) {
        gameState.level3Round++;
        gameState.hintsUsedLevel3.clear();
        gameState.penaltyPointsLevel3 = 0;
        gameState.level3HintedCards.clear();
        
        startLevel3();
    } else {
        gameState.levelCompleted = true;
        gameState.levelsCompleted++;
        endGame("Игра завершена!");
    }
}

// Завершение игры
function endGame(status) {
    gameState.gameActive = false;
    
    clearInterval(gameState.timerInterval);
    clearInterval(gameState.roundTimerInterval);
    
    gameState.animationIntervals.forEach(interval => clearInterval(interval));
    gameState.animationIntervals = [];
    
    // Останавливаем звук таймера
    audioManager.stopTimerSound();
    
    // Воспроизводим звук завершения игры
    if (gameState.levelsCompleted === 3) {
        audioManager.playLevelEndSound('win', 0.7);
    } else if (gameState.score <= 0) {
        audioManager.playLevelEndSound('lose', 0.7);
    } else {
        audioManager.playLevelEndSound('win', 0.6);
    }
    
    savePlayerResult(status);
    
    setTimeout(() => {
        showScreen('results');
    }, 300);
}

// Сохранение результата игрока
function savePlayerResult(status) {
    const playerResult = {
        name: gameState.playerName,
        score: gameState.score,
        levels: gameState.levelsCompleted,
        time: gameState.timeElapsed,
        date: new Date().toLocaleDateString('ru-RU'),
        timestamp: new Date().getTime(),
        status: status,
        difficulty: gameState.difficulty
    };
    
    loadLeaderboard();
    leaderboard.push(playerResult);
    
    // Сортируем по очкам, затем по времени
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }
    
    saveLeaderboard();
}

// Показать результаты
function showResults() {
    document.getElementById('result-player').textContent = `Игрок: ${gameState.playerName}`;
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('levels-completed').textContent = gameState.levelsCompleted;
    
    const minutes = Math.floor(gameState.timeElapsed / 60);
    const seconds = gameState.timeElapsed % 60;
    document.getElementById('final-time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Обновляем сложность
    const difficultyText = getDifficultyText(gameState.difficulty);
    document.getElementById('final-difficulty').textContent = difficultyText;
    
    let statusText = "Не завершено";
    if (gameState.levelsCompleted === 3) {
        statusText = "Все уровни пройдены!";
    } else if (gameState.score <= 0) {
        statusText = "Проигрыш";
    } else if (gameState.levelsCompleted > 0) {
        statusText = `Пройдено ${gameState.levelsCompleted} из 3 уровней`;
    }
    document.getElementById('game-status').textContent = statusText;
    
    updateLeaderboardTable();
}

// Обновление таблицы рекордов
function updateLeaderboardTable() {
    const leaderboardBody = document.getElementById('leaderboard-body');
    leaderboardBody.innerHTML = '';
    
    leaderboard.forEach((player, index) => {
        const row = document.createElement('tr');
        
        // Проверяем, является ли эта запись текущим игроком
        const isCurrentPlayer = (
            player.name === gameState.playerName && 
            player.score === gameState.score && 
            player.time === gameState.timeElapsed &&
            player.difficulty === gameState.difficulty
        );
        
        if (isCurrentPlayer) {
            row.style.backgroundColor = '#e8f4fc';
            row.style.fontWeight = 'bold';
        }
        
        const minutes = Math.floor(player.time / 60);
        const seconds = player.time % 60;
        const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const difficultyText = getDifficultyText(player.difficulty || 'easy');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>${player.levels}</td>
            <td>${timeFormatted}</td>
            <td>${difficultyText}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

// Обновление интерфейса игры
function updateGameUI() {
    document.getElementById('current-player').textContent = `Игрок: ${gameState.playerName}`;
    updateScoreDisplay();
    updateTimerDisplay();
    updateEndLevelButton();
}

// Обновление отображения очков
function updateScoreDisplay() {
    document.getElementById('score').textContent = `Очки: ${gameState.score}`;
}

// Показать модальное окно с результатами
function showResultModal(message, points) {
    // Определяем заголовок в зависимости от содержания сообщения
    let title = "Результат";
    
    // Проверяем, если сообщение начинается с "Время вышло!"
    if (message.startsWith("Время вышло!")) {
        title = "Время вышло!";
    } else if (points > 0) {
        title = "Результат";
    } else {
        title = "Информация";
    }
    
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-points').textContent = points;
    
    document.getElementById('result-modal').classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('result-modal').classList.remove('active');
}

// Начать игру заново
function playAgain() {
    const currentDifficulty = gameState.difficulty;
    gameState.score = 0;
    gameState.level = 1;
    gameState.currentRound = 1;
    gameState.level2Round = 1;
    gameState.level3Round = 1;
    gameState.cardsInRound = LEVEL_CONFIG.level1.baseCards;
    gameState.timeElapsed = 0;
    gameState.levelsCompleted = 0;
    gameState.gameActive = true;
    gameState.selectedCards.clear();
    gameState.usedCategories.clear();
    gameState.correctAnswers = 0;
    gameState.levelCompleted = false;
    gameState.hintsUsedLevel1.clear();
    gameState.hintsUsedLevel3.clear();
    gameState.penaltyPointsLevel1 = 0;
    gameState.penaltyPointsLevel2 = 0;
    gameState.penaltyPointsLevel3 = 0;
    gameState.level3HintedCards.clear();
    
    // Сохраняем текущую сложность
    gameState.difficulty = currentDifficulty;
    
    gameState.animationIntervals.forEach(interval => clearInterval(interval));
    gameState.animationIntervals = [];
    
    startTimer();
    showScreen('game');
}

// Начать игру с новым игроком
function newPlayer() {
    showScreen('auth');
}

// Показать рейтинг в модальном окне
function showLeaderboardModal() {
    loadLeaderboard();
    
    const modalHtml = `
        <div class="modal active" id="leaderboard-modal">
            <div class="modal-content" style="max-width: 700px;">
                <h3>Рейтинг игроков</h3>
                
                <div class="table-container" style="margin: 15px 0;">
                    <table style="width: 100%;">
                        <thead>
                            <tr>
                                <th>Место</th>
                                <th>Имя</th>
                                <th>Очки</th>
                                <th>Уровни</th>
                                <th>Время</th>
                                <th>Дата</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboard-modal-body">
                            ${generateLeaderboardRows()}
                        </tbody>
                    </table>
                </div>
                
                ${leaderboard.length === 0 ? 
                    '<p style="text-align: center; color: #7f8c8d; padding: 15px;">Пока нет результатов. Будьте первым!</p>' : 
                    ''}
                
                <div class="button-group" style="margin-top: 15px;">
                    <button id="close-leaderboard" class="btn-primary">
                        Закрыть
                    </button>
                    <button id="start-from-leaderboard" class="btn-secondary">
                        Начать игру
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer.firstElementChild);
    
    setTimeout(() => {
        const closeBtn = document.getElementById('close-leaderboard');
        const startBtn = document.getElementById('start-from-leaderboard');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('leaderboard-modal');
                if (modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                }
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const modal = document.getElementById('leaderboard-modal');
                if (modal) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                        showScreen('auth');
                    }, 300);
                }
            });
        }
        
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                }
            });
        }
    }, 100);
}

// Генерация строк таблицы рейтинга
function generateLeaderboardRows() {
    if (leaderboard.length === 0) return '';
    
    let rows = '';
    leaderboard.forEach((player, index) => {
        const minutes = Math.floor(player.time / 60);
        const seconds = player.time % 60;
        const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const difficultyText = getDifficultyText(player.difficulty || 'easy');
        
        rows += `
            <tr ${index < 3 ? 'class="top-' + (index + 1) + '"' : ''}>
                <td>${index + 1}</td>
                <td>${player.name || 'Неизвестный'}</td>
                <td><strong>${player.score || 0}</strong></td>
                <td>${player.levels || 0}</td>
                <td>${timeFormatted}</td>
                <td>${difficultyText}</td>
            </tr>
        `;
    });
    
    return rows;
}

// Функция для получения текстового представления сложности
function getDifficultyText(difficulty) {
    switch(difficulty) {
        case 'easy': return 'Лёгкий';
        case 'medium': return 'Средний';
        case 'hard': return 'Сложный';
        default: return 'Лёгкий';
    }
}