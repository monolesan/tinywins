document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    currentScreen: 'welcome',
    selectedMood: 0,
    userName: null,
    currentSection: 'journal', // Track current visible section
    isScrolling: false, // Flag to prevent multiple scroll events
    lastScrollTime: 0, // For throttling
    writingModeIsActive: false,
    currentTheme: 0,
    currentSound: 0,
    audioElements: [],
    currentAudio: null,
    dailyQuestion: null,  // Store the question of the day
    aboutVisible: false,   // Track if About page is visible
    todayMoodSelected: false,
    aboutAnimationPlayed: false, // Track if about page animation has played,
    isReadingEntries: false
  };

  // Local Storage Keys
  const STORAGE_KEYS = {
    USER_NAME: 'dailyJournal_userName',
    DAILY_DATA: 'dailyJournal_dailyData',
    ENTRIES: 'dailyJournal_entries'
  };
  
  // DOM Elements
  const welcomeContainer = document.getElementById('welcome-container');
  const nameForm = document.getElementById('name-form');
  const nameInput = document.getElementById('name-input');
  const moodContainer = document.getElementById('mood-container');
  const journalEntriesWrapper = document.getElementById('journal-entries-wrapper');
  const journalContainer = document.getElementById('journal-container');
  const entriesContainer = document.getElementById('entries-container');
  const startJourneyButtons = document.querySelectorAll('.start_journey');
  
  // Add event listeners for all start_journey buttons
  startJourneyButtons.forEach(button => {
    button.addEventListener('click', () => {
      // First call hideAboutPage to handle animation and state
      hideAboutPage();
      
      // If user has a name, show journal screen directly
      if (state.userName) {
        checkTodayStatus(); // This will show the appropriate screen based on today's status
      }
      // If no name, hideAboutPage will show the welcome screen by default
    });
  });

  // About Page Elements
  const aboutContainer = document.getElementById('about-container');
  const settingsAbout = document.getElementById('settings-about');
  const settingsHome = document.getElementById('settings-home');
  const closeAbout = document.getElementById('close-about');
  const closeAboutMobile = document.getElementById('close-about-mobile');
  
  // Mood Elements
  const moodMoons = document.querySelectorAll('.moon');
  const moonImage = document.querySelectorAll('.moon-image');
  
  // Journal Elements
  const containerOfAllElements = document.getElementsByClassName('container')[0];
  const journalEntry = document.getElementById('journal-entry');
  const saveEntryBtn = document.getElementById('save-entry');
  const viewEntriesBtn = document.getElementById('view-entries');
  const growers = document.querySelectorAll('.grow-wrap');
  const charCount = document.getElementById('char-count');
  const greeting = document.getElementById('greeting');
  const dailyQuestionText = document.getElementById('daily-question-text');
  const moodImageToday = document.getElementById('mood-image-today');
  const moodSpanToday = document.getElementById('mood-span-today');
  const notificationSaved = document.getElementById('notification_save');

  
  // Settings Elements
  const settingsElement = document.getElementById('settings-element');
  const iconSpread = document.getElementById('icon-spread');
  const iconSoundOn = document.getElementById('icon-sound-on');
  const iconSoundOff = document.getElementById('icon-sound-off');
  const iconThemePrevious = document.getElementById('icon-theme-previous');
  const iconThemeNext = document.getElementById('icon-theme-next');
  const currentThemeSpan = document.getElementById('current-theme');
  const currentSoundSpan = document.getElementById('current-sound');
  const iconSoundPrevious = document.getElementById('icon-sound-previous');
  const iconSoundNext = document.getElementById('icon-sound-next');
  const iconSoundPlay = document.getElementById('icon-sound-play');
  const iconSoundPause = document.getElementById('icon-sound-pause');
  const settingsWhiteContainer = document.getElementsByClassName('settings-white-container')[0];

  const first = document.querySelector('.first');
  const second = document.querySelector('.second');
  
  let currentTrack = 0;
  const audio = new Audio();

  var isMobile = false;
  if (window.innerWidth < 500) {
    isMobile = true;
    document.getElementById('triangle-desctop').style.display = 'none';
    console.log("Mobile or small screen detected");
} else if (window.innerWidth >= 500) {
    isMobile = false;
    document.getElementById('triangle-mobile').style.display = 'none';
    console.log("Desktop or large screen detected");
}

  // Mood label mapping
  const moodLabels = {
    1: 'Depressed',
    2: 'Anxious',
    3: 'Neutral',
    4: 'Content',
    5: 'Happy'
  };
  
  // Background colors
  const backgroundColors = [
    {
      name: 'soft amber', 
      color: '#FCFBF6',
      animationSVG1: 'none',
      animationSVG2: 'none',
      colorSVG1: 'pink',
      colorSVG2: 'yellow',
      appearanceSVG1:'block',
      appearanceSVG2:'block',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
      xySVG1: ['60vw', '100%']
    },
    {
      name: 'simple days', 
      color: '#F9F0D8',
      animationSVG1: 'none',
      animationSVG2: 'none',
      colorSVG1: 'pink',
      colorSVG2: 'yellow',
      appearanceSVG1:'none',
      appearanceSVG2:'none',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
      xySVG1: ['60vw', '100%']
    },
    {
      name: 'moonrise mist',
      color: 'linear-gradient(90deg,rgba(172, 182, 229, 1) 0%, rgba(220, 252, 252, 1) 56%, rgba(134, 253, 232, 1) 100%)',
      // color: 'linear-gradient(to right, #acb6e5, #86fde8)',
      animationSVG1: 'rotate',
      animationSVG2: 'rotate2',
      colorSVG1: '#F8F9FA',
      colorSVG2: '#F0E6F6',
      appearanceSVG1:'block',
      appearanceSVG2:'block',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
      xySVG1: ['100%', '100%']
    },
    {
      name: 'moss forest',
      color: '#faffd6',
      animationSVG1: 'rotate',
      animationSVG2: 'rotate2',
      colorSVG1: '#d8e267',
      colorSVG2: '#caf286',
      appearanceSVG1:'block',
      appearanceSVG2:'block',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
      xySVG1: ['60vw', '60vh']
    },
    {
      name: 'blue sky',
      color: '#F0F4F7',
      animationSVG1: 'rotate2',
      animationSVG2: 'rotate2',
      colorSVG1: '#D6E3FC',
      colorSVG2: '#A7D4FF',
      appearanceSVG1:'block',
      appearanceSVG2:'block',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
      xySVG1: ['60vw', '60vh']
    },
    {
      name: 'blush cloud',
      color:'#FFE6E6',
      // color: 'radial-gradient(circle,rgba(254, 214, 255, 1) 35%, rgba(202, 233, 252, 1) 89%)',
      // color: 'radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)',
      animationSVG1: 'rotate',
      animationSVG2: 'rotate2',
      colorSVG1: '#FF98C9',
      // colorSVG2: '#FFD1D1',
      colorSVG2: '#FFC7DE',
      appearanceSVG1:'block',
      appearanceSVG2:'block',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
    },
    {
      name: 'velvet heart',
      color: '#e9e6ff',
      animationSVG1: 'rotate2',
      animationSVG2: 'rotate',
      colorSVG1: '#c0b5ff',
      colorSVG2: '#e3a3ff',
      appearanceSVG1:'block',
      appearanceSVG2:'block',
      opacitySVG1: '0.5',
      opacitySVG2: '0.8',
      // color:'#FFCAE8'
    }
  ];
  
  const trackList = [
    {
      name: 'birds chirping',
      artist: 'kevp888',
      url: 'https://cdn.freesound.org/previews/242/242491_4289480-lq.mp3'
    },
    {
      name: 'rain in the forest',
      artist: 'moloch777',
      url: 'https://cdn.freesound.org/previews/803/803886_9034501-lq.mp3'
    },
    {
      name: 'sea waves',
      artist: 'crosbychris',
      url: 'https://cdn.freesound.org/previews/213/213077_706395-lq.mp3'
    }
  ];
  
  const moodQuestions = {
    0: [
      "What's one small thing you managed to do today?",
      "What would be a kind thing to say to yourself right now?",
      "What would help you feel just 1% better?",
      "What's something that used to bring you comfort?",
      "Who or what do you wish you could lean on today?",
      "Can you name one small hope that carried you through today.",
      "What’s one reassuring memory that feels safe to visit?",
      "Can you name one comforting thing around you right now?",
      "What’s a memory that brings a smile to your face?",
      "What’s one thing you’d like to let go of, just for now?",
      "If your heart could speak right now, what would it say?",
      "When did you last feel even a flicker of peace or comfort?",
      "What’s one thing you wish someone would say to you today?",
      "What’s one thing you can do today that feels gentle and kind to yourself?",
      "What’s a small thing you’re proud of for simply doing today?"
    ],
    1: [
      "What's something you're grateful for, even if it's small?",
      "What helped you get through today?",
      "Is there something you can let go of?",
      "If you could speak to your past self today, what would you say?",
      "What does your mind need more of right now?",
      "What’s the simplest win you achieved today—and how did it feel?",
      "If you had a mantra for calm, what would its shortest version be?",
      "What’s one image that comes to mind when you picture calm?",
      "What’s one gentle activity you can do later today?",
      "What’s one reassuring phrase you could tell yourself right now?",
      "What’s one task you completed today, however small?",
      "What’s one sip of something (tea, water) that tasted good today?",
      "What’s one thing you’re allowing yourself not to worry about today?",
      "What’s one comforting thought to start or end your day with?",
      "What’s one object nearby you can touch to ground yourself, and what texture do you feel?",
      "Think of a quiet place—real or imagined—what’s one detail that soothes you there?",
      ""
    ],
    2: [
      "What are you curious about today?",
      "What's one small win you had recently?",
      "What's one thing you want to focus on this week?",
      "What does balance look like for you right now?",
      "What would make today feel meaningful?",
      "In what way did you practice self-kindness today?",
      "What’s one thing you did today that made you feel accomplished?",
      "What’s one thing you’d like to remember about today?",
      "What’s one thing you did today that made you feel connected?",
      "What’s one tiny achievement you can celebrate?",
      "What’s one way you surprised yourself today?",
      "What topic would you love to dive into this week?"
    ],
    3: [
      "What made you smile today?",
      "What are you proud of?",
      "Who or what are you thankful for today?",
      "What's a moment you wish you could pause and savor?",
      "How can you share this good energy with someone else?",
      "What’s one thing you’re looking forward to tomorrow?",
      "What’s one thing you learned today?",
      "What’s one quality in yourself you appreciated today?",
      "What’s one thing that made you feel proud today?",
      "What’s one simple pleasure you enjoyed?",
      "What’s one positive habit you practiced today?",
      "Which moment from today would you gladly replay on repeat?",
      "Who did you feel most in sync with today, and what made it special?",
      "If you could preserve one scene from today, which would it be?",
      "What nugget of wisdom did you pick up today?"
    ],
    4: [
      "What are you celebrating today?",
      "What feels most aligned in your life right now?",
      "What’s one thing you’re excited about this week?",
      "What dream feels most alive today?",
      "If today had a title, what would it be?",
      "What’s one dream or idea you feel inspired by today?",
      "What’s one act of kindness you witnessed or gave?",
      "What’s one memory that came to mind that warmed your heart?",
      "What’s one thing you’re endlessly grateful for right now?",
      "What’s one thing you did today that made you feel alive?",
      "What’s one thing that made you laugh or smile today?",
      "What’s one moment you felt pure joy?"
    ]
  };

  let didScroll = false;
  let prevScrollDirection = '';
  var oldScrollY = window.scrollY;
  const windowsHeight = window.innerHeight;
  
  window.onscroll = () => {
    didScroll = true;

    // Check if we're in about page or journal entries
    if (state.aboutVisible && !state.aboutAnimationPlayed && !isMobile) {
      console.log('desktop');
      const arrowSvg = document.getElementById('arrow-animation-svg');
      if (arrowSvg) {
        const bottom = arrowSvg.getBoundingClientRect().bottom;
        if (oldScrollY < window.scrollY && windowsHeight < bottom) {
          // Scrolling down and arrow is below viewport
          document.getElementById('svg-text-opacity').style.opacity = '1';
          arrowSvg.classList.toggle("morphed");
          state.aboutAnimationPlayed = true; // Mark animation as played
        }
      }
    } else if (state.aboutVisible && !state.aboutAnimationPlayed && isMobile) {
      console.log('mobile');
      const arrowSvgMobile = document.getElementById('arrow-animation-svg-mobile');
      if (arrowSvgMobile) {
        const bottom = arrowSvgMobile.getBoundingClientRect().bottom;
        if (oldScrollY < window.scrollY && windowsHeight < bottom) {
          // Scrolling down and arrow is below viewport
          document.getElementById('svg-text-opacity-mobile').style.opacity = '1';
          arrowSvgMobile.classList.toggle("morphed");
          state.aboutAnimationPlayed = true; // Mark animation as played
        }
      }
    } else if (!state.aboutVisible){
      // Journal entries wrapper logic
      const targetEl = document.getElementById('divider_bounce');
      if (targetEl) {
        const bottom = targetEl.getBoundingClientRect().bottom;
        if (oldScrollY < window.scrollY && prevScrollDirection !== 'down') {
          console.log('down');
          state.isReadingEntries = true;
          entriesContainer.style.opacity = '100%';
        } else if (oldScrollY > window.scrollY && prevScrollDirection !== 'up') {
          console.log('up');
          if (windowsHeight < bottom) {
            console.log('up and bottom is visible');
            state.isReadingEntries = false;
            console.log('bottom is visible');
            entriesContainer.style.opacity = '41%';
          }
        }
      }
    }
    if (window.scrollY > 40) {
        settingsWhiteContainer.classList.add("glass-effect");
        if (!isSettingOpen && !isMobile) {
           settingsWhiteContainer.classList.remove("glass-effect");
        }
        console.log('glass-effect added');
      } else {
        settingsWhiteContainer.classList.remove("glass-effect");
        console.log('glass-effect removed');
    }
    oldScrollY = window.scrollY;
  }


  
  // Entries Elements
  const entriesList = document.getElementById('entries-list');
  const reflectBtn = document.getElementById('reflect-btn');
  
  // Initialize the app
  initApp();
  
  // Form Event Listeners
  nameForm.addEventListener('submit', handleNameSubmit);
  
  // Mood Rating Event Listeners
  moodMoons.forEach(moon => {
    moon.addEventListener('click', () => {
      const rating = parseInt(moon.dataset.rating);
      state.selectedMood = rating;
      
      // Update active state for all moons
      moodMoons.forEach(m => {
        if (parseInt(m.dataset.rating) <= rating) {
          m.classList.add('active');
        } else {
          m.classList.remove('active');
        }
      });
      
      // Submit mood immediately
      handleMoodSubmit();
    });

    moon.addEventListener('mouseenter', () => {
      const rating = parseInt(moon.dataset.rating);
      // Highlight moons on hover
      moodMoons.forEach(m => {
        if (parseInt(m.dataset.rating) <= rating) {
          m.classList.add('active');
        } else {
          m.classList.remove('active');
        }
      });
    });

    moon.addEventListener('mouseleave', () => {
      // Restore active state based on selected rating
      moodMoons.forEach(m => {
        if (parseInt(m.dataset.rating) <= state.selectedMood) {
          m.classList.add('active');
        } else {
          m.classList.remove('active');
        }
      });
    });
  });

  // Journal Event Listeners
  saveEntryBtn.addEventListener('click', handleSaveEntry);
  journalEntry.addEventListener('click', () => writingMode());
  viewEntriesBtn.addEventListener('click', readingMode);

  let isSettingOpen = false;
  //Settings Event Listeners
  iconSpread.addEventListener('click', () => {
   
    iconSpread.classList.toggle("morphed");
    //ternary operator
    isSettingOpen = isSettingOpen ? false : true;
    console.log('isSettingOpen:', isSettingOpen);
    settingsElement.classList.toggle('hidden');
    if (window.scrollY > 40 && !isMobile) {
        settingsWhiteContainer.classList.add("glass-effect");
        if (!isSettingOpen) {
           settingsWhiteContainer.classList.remove("glass-effect");
        }
      }
    if (isMobile) {
      containerOfAllElements.classList.toggle('hidden');
    }

    if (isMobile && !state.aboutVisible) {
      settingsWhiteContainer.classList.toggle('full_width');
    }
  });

  iconThemePrevious.addEventListener('click', () => {
    if (state.currentTheme > 0) {
      state.currentTheme--;
    } else {
      state.currentTheme = backgroundColors.length - 1;
    }
    updateTheme();
  });

  iconThemeNext.addEventListener('click', () => {
    if (state.currentTheme < backgroundColors.length - 1) {
      state.currentTheme++;
    } else {
      state.currentTheme = 0;
    }
    updateTheme();
  });

  iconSoundPrevious.addEventListener('click', prevTrack);
  iconSoundNext.addEventListener('click', nextTrack);
  iconSoundPlay.addEventListener('click', () => {
    if (!audio.src) {
      loadTrack(currentTrack);
    }
    playTrack();
  });

  iconSoundPause.addEventListener('click', () => {
    pauseTrack();
  });

  iconSoundOff.addEventListener('click', () => {
    if (!audio.src) {
      loadTrack(currentTrack);
    }
    playTrack();
  });

  iconSoundOn.addEventListener('click', () => {
    pauseTrack();
  });

  // About Page Event Listeners
  settingsAbout.addEventListener('click', showAboutPage);
  settingsHome.addEventListener('click', () => {
    hideAboutPage();
    if (isMobile){
      iconSpread.classList.toggle("morphed");
settingsElement.classList.add('hidden');
isSettingOpen = false;
    }
  });

  let buttonClicked = false;
  closeAbout.addEventListener('click', hideAboutPage);
  closeAboutMobile.addEventListener('click', () => { 
    buttonClicked = true;
    hideAboutPage();
     if (isSettingOpen) {
      iconSpread.classList.remove("morphed");
      isSettingOpen = false;
    } else {
      // iconSpread.classList.add("morphed");
    }
    
    settingsElement.classList.add('hidden');
  });

  document.addEventListener('keydown', function(event) {
      const key = event.key;

      if (!state.writingModeIsActive && state.currentScreen === 'journal' && /^[a-zA-Z]$/.test(key)) {
        writingMode();        
        journalEntry.focus(); // Keep focus on the textarea
        console.log("You pressed:", key);
      }

      if ((event.metaKey && key === 's') || (event.ctrlKey && key === 's') && state.writingModeIsActive) {
        event.preventDefault(); // Prevent default keys behavior
        journalEntry.blur(); 
        handleSaveEntry(); // Save entry on Enter key
        
      }
    });

  // Initialize the app based on stored data
  function initApp() {
    updateTheme();
    soundName();
    
    // Check if we already have the user's name
    const storedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    if (storedName) {
      state.userName = storedName;
      checkTodayStatus();
      aboutContainer.classList.add('about-container-weknow');
      settingsAbout.classList.remove('hidden');
    } else {
      // For new users, show about page first and hide the close button
      aboutContainer.classList.remove('hidden');
      aboutContainer.classList.add('about-container-forthefirsttime');
      welcomeContainer.classList.add('hidden');
      moodContainer.classList.add('hidden');
      journalEntriesWrapper.classList.add('hidden');
      closeAbout.classList.add('hidden');
      closeAboutMobile.classList.add('hidden');
      settingsAbout.classList.add('hidden'); // Hide settings-about for new users
      state.aboutVisible = true; // Track that about page is visible
      
      // Add one-time listener for close button to show welcome screen
      const onCloseAbout = () => {
        hideAboutPage();
        showWelcomeScreen();
        closeAbout.removeEventListener('click', onCloseAbout);
      };
      closeAbout.addEventListener('click', onCloseAbout);
    }
  }
  
  // Handle name form submission
  function handleNameSubmit(event) {
    event.preventDefault();
    
    const name = nameInput.value.trim();
    const errorLabel = document.querySelector('label.error[for="name-input"]');
    
    if (!name) {
      console.log('Name input is empty');
      nameInput.classList.add('error-input');
      errorLabel.classList.remove('error-opacity');
      return;
    }
    
    state.userName = name;
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    settingsAbout.classList.remove('hidden');
    checkTodayStatus();
  }
  
  // Add input event listener for real-time validation
  nameInput.addEventListener('input', () => {
    const name = nameInput.value.trim();
    const errorLabel = document.querySelector('label.error[for="name-input"]');
    
    if (name) {
      nameInput.classList.remove('error-input');
      errorLabel.classList.add('error-opacity');
    }
  });
  
  // Check if user has already completed a journal entry today
  function checkTodayStatus() {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // First check if there's a saved question and mood in localStorage
      const savedDailyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_DATA) || '{}');
      
      if (savedDailyData.date === today) {
        // User has already accessed the app today
        if (savedDailyData.hasAnswered) {
          // User has already submitted an entry today - load their answer
          const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '[]');
          
          // Find today's entry
          const todayEntry = entries.find(entry => entry.date.startsWith(today));
          
          if (todayEntry) {
            state.selectedMood = todayEntry.mood_rating;
            state.dailyQuestion = todayEntry.question || savedDailyData.question;
            dailyQuestionText.innerHTML = state.dailyQuestion;
            journalEntry.value = todayEntry.answer;
            showJournalScreen();
            return;
          }
        }
        
        // User has accessed today but hasn't answered yet
        if (savedDailyData.mood > 0) {
          // User has already rated their mood - show the journal screen
          state.selectedMood = savedDailyData.mood;
          state.dailyQuestion = savedDailyData.question;
          dailyQuestionText.innerHTML = state.dailyQuestion;
          showJournalScreen();
          return;
        }
      }
      
      // No saved data for today or new day - show mood screen
      showMoodScreen();
    } catch (error) {
      console.error('Check today status error:', error);
      showMoodScreen(); // Default to mood screen if there's an error
    }
  }
  
  // Handle mood submission
  function handleMoodSubmit() {
    if (state.selectedMood > 0) {
      // Get and save question for this mood
      const question = getQuestionByMood(state.selectedMood);
      console.log(state.selectedMood);
      moodImageToday.src='moon_new/m'+state.selectedMood+'.png';
      
      // Save mood and question to localStorage
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(STORAGE_KEYS.DAILY_DATA, JSON.stringify({
        date: today,
        mood: state.selectedMood,
        question: question,
        hasAnswered: false
      }));
      
      journalEntry.value = ''; // Clear journal entry field
      showJournalScreen();
    }
  }
  
  // Handle journal entry submission
  function handleSaveEntry() {
    const answer = journalEntry.value.trim();
    if (!answer) {
      readingMode();
      // alert('Please write something in your journal.');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '[]');
    
    // Check if there's already an entry for today
    const existingEntryIndex = entries.findIndex(entry => entry.date.startsWith(today));
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      entries[existingEntryIndex].answer = answer;
      entries[existingEntryIndex].updated_at = new Date().toISOString();
    } else {
      // Create new entry
      entries.unshift({
        date: today,
        mood_rating: state.selectedMood,
        answer: answer,
        question: state.dailyQuestion,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Save entries back to localStorage
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    
    // Update daily data to mark as answered
    const savedDailyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_DATA) || '{}');
    savedDailyData.hasAnswered = true;
    localStorage.setItem(STORAGE_KEYS.DAILY_DATA, JSON.stringify(savedDailyData));
    
    notificationSaved.classList.remove('fade-out');
    notificationSaved.style.display = 'block';
    setTimeout(() => {
      // if (notificationSaved) {
      //  notificationSaved.style.display = 'none';
       notificationSaved.classList.add('fade-out');
      // }
    }, 3000);
    randomSymbolRain();
    // alert('Journal entry saved successfully!');
    
    // When the entry is saved, show the entries view
    readingMode();
  }
  
  // Render entries list
  function renderEntries() {
    entriesList.innerHTML = '';
    
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '[]');
    
    // Toggle reflect button visibility based on entries
    reflectBtn.style.display = entries.length > 0 ? 'block' : 'none';
    
    if (entries.length === 0) {
      entriesList.innerHTML = '<p>No entries yet. Start journaling today!</p>';
      return;
    }
    
    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date().toISOString().split('T')[0];

    entries.forEach((entry, index) => {
      const entryEl = document.createElement('div');
      entryEl.className = 'entry-card';
      
      const date = new Date(entry.date);
      const isToday = entry.date.startsWith(today);
      const formattedDateDay = date.toLocaleDateString('en-US', {
        day: 'numeric'
      });
      const formattedDateMonth = date.toLocaleDateString('en-US', {
        month: 'long'
      });
      
      // Truncate long answers
      let truncatedAnswer = entry.answer;
      let showReadMore = false;
      
      if (entry.answer.length > 300) {
        truncatedAnswer = entry.answer.substring(0, 300) + '…';
        showReadMore = true;
      }
      
      if (isMobile) {
      entryEl.innerHTML = `
        <div class="entry-date-container">
          <div>
            <span class="entry-date">${formattedDateDay} </span>
            <span class="entry-date">${formattedDateMonth} </span>
            ${isToday ? '<span class="italic today-span">today</span>' : ''}
          </div>
           <div class="entry-mood">
          <img src="moon_new/m${entry.mood_rating}.png" alt="Mood level ${entry.mood_rating}" class="entry-moon-image">
          <span class="italic">${moodLabels[entry.mood_rating]}</span>
        </div>
        </div>
        <div class="entry-content">
          <div class="entry-content-header">
          <h3>${entry.question}</h3>
          </div>
        </div>
       
      `;
    } else if (!isMobile) {
      // Create base HTML structure
      entryEl.innerHTML = `
        <div class="entry-date-container">
          <span class="entry-date">${formattedDateDay}</span>
          <span class="entry-date">${formattedDateMonth}</span>
        </div>
        <div class="entry-content">
          <div class="entry-content-header">
          ${isToday ? '<span class="italic today-span">today</span>' : ''}
          <h3>${entry.question}</h3>
          </div>
        </div>
        <div class="entry-mood">
          <img src="moon_new/m${entry.mood_rating}.png" alt="Mood level ${entry.mood_rating}" class="entry-moon-image">
          <span class="italic">${moodLabels[entry.mood_rating]}</span>
        </div>
      `;
    }
      
      // Safely add the entry text and read more button
      const entryContent = entryEl.querySelector('.entry-content');
      
      // Create and append entry text span
      const entryText = document.createElement('span');
      entryText.className = `entry-text ${showReadMore ? 'short' : ''}`;
      entryText.textContent = truncatedAnswer;
      entryText.dataset.fullText = entry.answer;
      entryContent.appendChild(entryText);
      
      // Add read more button if needed
      if (showReadMore) {
        const readMoreSpan = document.createElement('span');
        readMoreSpan.className = 'read-more';
        readMoreSpan.textContent = 'read more';
        entryContent.appendChild(readMoreSpan);
      }
      
      entriesList.appendChild(entryEl);
      
      // Add divider after each entry except the last one
      if (index < entries.length - 1) {
        const divider = document.createElement('div');
        divider.className = 'entry-divider';
        entriesList.appendChild(divider);
      }
    });
  }
  
  // Screen navigation functions
  function showWelcomeScreen() {
    state.currentScreen = 'welcome';
    welcomeContainer.classList.remove('hidden');
    moodContainer.classList.add('hidden');
    journalEntriesWrapper.classList.add('hidden');
    if (isMobile) {
      settingsElement.classList.add('hidden'); // Hide settings on welcome screen
    }
    settingsAbout.classList.add('hidden'); // Hide settings about button on welcome screen
    settingsHome.classList.add('hidden'); // Hide settings home button on welcome screen
  }
  
  function showMoodScreen() {
    state.currentScreen = 'mood';
    welcomeContainer.classList.add('hidden');
    moodContainer.classList.remove('hidden');
    journalEntriesWrapper.classList.add('hidden');
  }
  
  function showJournalScreen() {
    if (state.userName) {
      greeting.innerHTML = getGreeting() + ', ' + state.userName;
    } else {
      greeting.innerHTML = getGreeting() + '! ';
    }
    moodImageToday.src='moon_new/m'+state.selectedMood+'.png';
    moodSpanToday.innerHTML = moodLabels[state.selectedMood];
    state.currentScreen = 'journal';
    state.currentSection = 'journal';
    welcomeContainer.classList.add('hidden');
    moodContainer.classList.add('hidden');
    journalEntriesWrapper.classList.remove('hidden');
    renderEntries();
  }
  
  function showEntriesScreen() {
    state.currentSection = 'entries';
  }

  function writingMode() {
    state.writingModeIsActive = true;
    viewEntriesBtn.classList.remove('hidden');
    saveEntryBtn.classList.remove('hidden');
    entriesContainer.style.display = 'none';
    entriesContainer.style.opacity = '0%';
  }

  function readingMode() {
    entriesContainer.style.display = 'block';
    state.writingModeIsActive = false;
    charCount.innerHTML = '';
    viewEntriesBtn.classList.add('hidden');
    saveEntryBtn.classList.add('hidden');
    renderEntries();
    entriesContainer.style.opacity = '44%';
  }

  // const first = document.querySelector('.first');
  // const second = document.querySelector('.second');
  //THEME FUNCTIONS
  function updateTheme() {
    document.body.style.background = backgroundColors[state.currentTheme].color;
    currentThemeSpan.innerHTML = backgroundColors[state.currentTheme].name;

    first.classList.remove('rotate', 'rotate2');
    second.classList.remove('rotate', 'rotate2');

    first.style.display = backgroundColors[state.currentTheme].appearanceSVG1;
    second.style.display = backgroundColors[state.currentTheme].appearanceSVG2;


    first.classList.add(backgroundColors[state.currentTheme].animationSVG1);
    second.classList.add(backgroundColors[state.currentTheme].animationSVG2);
    first.style.fill = backgroundColors[state.currentTheme].colorSVG1;
    second.style.fill = backgroundColors[state.currentTheme].colorSVG2;
    // first.style.width = backgroundColors[state.currentTheme].xySVG1[0];
    // first.style.height = backgroundColors[state.currentTheme].xySVG1[1];
    // second.style.width = backgroundColors[state.currentTheme].xySVG1[0];
    // second.style.height = backgroundColors[state.currentTheme].xySVG1[1];
    // second.classList.add('rotate');

  }

  //SOUND FUNCTIONS
  function loadTrack(index) {
    audio.src = trackList[index].url;
    audio.loop = true;
    audio.load();
    soundName();
  }

  function playTrack() {
    // soundName();
    audio.play();
    showIconSoundOn();
  }

  function pauseTrack() {
    audio.pause();
    showIconSoundOff();
  }

  function nextTrack() {
    pauseTrack();
    currentTrack = (currentTrack + 1) % trackList.length;
    loadTrack(currentTrack);
    playTrack();
    soundName();
    showIconSoundOn();
  }

  function prevTrack() {
    pauseTrack();
    currentTrack = (currentTrack - 1 + trackList.length) % trackList.length;
    loadTrack(currentTrack);
    playTrack();
    soundName();
    showIconSoundOn();
  }

  function showIconSoundOff() {
    iconSoundOn.classList.add('hidden');
    iconSoundOff.classList.remove('hidden');
    iconSoundPause.classList.add('hidden');
    iconSoundPlay.classList.remove('hidden');
  }
  
  function showIconSoundOn() {
    iconSoundOn.classList.remove('hidden');
    iconSoundOff.classList.add('hidden');
    iconSoundPause.classList.remove('hidden');
    iconSoundPlay.classList.add('hidden');
  }

  function soundName() {
    currentSoundSpan.innerHTML = trackList[currentTrack].name;
  }

  //GREETING FUNCTIONS
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good day";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  }

  //QUESTION FUNCTIONS
  function getQuestionByMood(moodLevel) {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const savedDailyData = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_DATA) || '{}');
    
    if (savedDailyData.date === today && savedDailyData.question) {
      // Return same question if it's already saved for today
      state.dailyQuestion = savedDailyData.question;
      dailyQuestionText.innerHTML = savedDailyData.question;
      return savedDailyData.question;
    }
    
    // Pick a new random question based on mood level
    const questions = moodQuestions[moodLevel - 1];
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    
    // Save to state and update UI
    state.dailyQuestion = question;
    dailyQuestionText.innerHTML = question;
    
    return question;
  }

  // this is for the grow-wrap textarea
  growers.forEach((grower) => {
    journalEntry.addEventListener("input", () => {
        grower.dataset.replicatedValue = journalEntry.value;
        if (journalEntry.value.length > 1400) {
            charCount.innerHTML = journalEntry.value.length + '/2000';
        } else {
            charCount.innerHTML = '';
        }
    });
  });

  // Add these functions to handle the About page

  function showAboutPage() {
    // Hide all other containers
    welcomeContainer.classList.add('hidden');
    moodContainer.classList.add('hidden');
    journalEntriesWrapper.classList.add('hidden');
    settingsAbout.classList.toggle('hidden');
    settingsHome.classList.toggle('hidden');
    // settingsElement.classList.toggle('hidden');
    // Show about container
    aboutContainer.classList.remove('hidden');
    containerOfAllElements.classList.remove('hidden');
    if (isMobile) {
      settingsElement.classList.toggle('hidden');
      closeAboutMobile.classList.remove('hidden');
      closeAbout.classList.add('hidden');
    } else if (!isMobile) {
      closeAbout.classList.remove('hidden');
      closeAboutMobile.classList.add('hidden');
    }
    // iconSpread.classList.toggle("morphed");
    //ternary operator
    if (isMobile) {
      isSettingOpen = isSettingOpen ? false : true;
      iconSpread.classList.toggle("morphed");
      settingsWhiteContainer.classList.add('full_width');
    }
    // isSettingOpen = isSettingOpen ? false : true;
    
    state.aboutVisible = true;
  }
  


  function hideAboutPage() {
    settingsAbout.classList.toggle('hidden');
    settingsHome.classList.toggle('hidden');
    if (isMobile) {
      settingsWhiteContainer.classList.remove('full_width');
      settingsElement.classList.toggle('hidden');
      //iconSpread.classList.toggle("morphed");
      isSettingOpen = isSettingOpen ? false : true;
      containerOfAllElements.classList.remove('hidden');
    }

    if (!buttonClicked && isMobile) {
      // iconSpread.classList.toggle("morphed");
      buttonClicked = false; // Reset buttonClicked state
    }
console.log('isSettingOpen:', isSettingOpen);
    // if (buttonClicked && isMobile) {

    //   buttonClicked = false; // Reset buttonClicked state

    // }
    // Reverse the animation first
    if (!isMobile) {
      const arrowSvg = document.getElementById('arrow-animation-svg');
      if (arrowSvg && state.aboutAnimationPlayed) {
        document.getElementById('svg-text-opacity').style.opacity = '0';
        arrowSvg.classList.toggle("morphed");
      }
    } else if (isMobile) {
      const arrowSvgMobile = document.getElementById('arrow-animation-svg-mobile');
      if (arrowSvgMobile && state.aboutAnimationPlayed) {
        document.getElementById('svg-text-opacity-mobile').style.opacity = '0';
        arrowSvgMobile.classList.toggle("morphed");
      }
    }
    // Hide the container after a small delay to allow animation to complete
    // setTimeout(() => {
      closeAbout.classList.add('hidden');
      closeAboutMobile.classList.add('hidden');
      aboutContainer.classList.add('hidden');
      state.aboutVisible = false;
      state.aboutAnimationPlayed = false; // Reset animation state

      // If user hasn't entered name yet, show welcome screen
      if (!state.userName) {
        showWelcomeScreen();
      } else {
        // Otherwise return to the last active screen
        if (state.currentScreen === 'mood') {
          showMoodScreen();
        } else if (state.currentScreen === 'journal') {
          showJournalScreen();
        } else {
          showWelcomeScreen();
        }
      }
    // }, 10); // 300ms delay to allow animation to complete
  }

  // Update today's mood display
  function updateTodayMoodDisplay() {
    const moodImage = document.getElementById('today-mood-image');
    const moodLabel = document.getElementById('today-mood-label');
    
    if (state.selectedMood) {
      moodImage.src = `moon_new/m${state.selectedMood}.png`;
      moodImage.alt = `Mood level ${state.selectedMood}`;
      moodLabel.textContent = moodLabels[state.selectedMood];
    } else {
      // Default mood if none selected
      moodImage.src = 'moon_new/m3.png';
      moodImage.alt = 'Mood level 3';
      moodLabel.textContent = moodLabels[3];
    }
  }

  // Existing function: showJournalView
  function showJournalView() {
    hideAllViews();
    document.getElementById('journal-container').classList.remove('hidden');
    document.getElementById('view-entries').classList.remove('hidden');
    document.getElementById('save-entry').classList.remove('hidden');
    
    // Check for today's mood
    const today = new Date().toISOString().split('T')[0];
    const todayMood = localStorage.getItem(`mood_${today}`);
    
    if (todayMood) {
      state.selectedMood = parseInt(todayMood);
      state.todayMoodSelected = true;
      
      // Get question for this mood
      const todayQuestion = localStorage.getItem(`question_${today}`);
      if (todayQuestion) {
        document.getElementById('daily-question-text').textContent = todayQuestion;
      } else {
        const newQuestion = getQuestionByMood(state.selectedMood);
        document.getElementById('daily-question-text').textContent = newQuestion;
        localStorage.setItem(`question_${today}`, newQuestion);
      }
      
      // Update today's mood display
      updateTodayMoodDisplay();
      
      // Focus on journal entry
      document.getElementById('journal-entry').focus();
    } else {
      // No mood set for today yet
      showMoodSelector();
    }
  }

  // Existing function: moodSelected
  function moodSelected(mood) {
    const today = new Date().toISOString().split('T')[0];
    
    state.selectedMood = mood;
    state.todayMoodSelected = true;
    
    // Save the mood selection for today
    localStorage.setItem(`mood_${today}`, mood);
    
    // Get a question based on the mood
    const question = getQuestionByMood(mood);
    document.getElementById('daily-question-text').textContent = question;
    
    // Save the question for today
    localStorage.setItem(`question_${today}`, question);
    
    // Hide mood selector and show journal
    document.getElementById('mood-selector-container').classList.add('hidden');
    document.getElementById('journal-container').classList.remove('hidden');
    document.getElementById('view-entries').classList.remove('hidden');
    document.getElementById('save-entry').classList.remove('hidden');
    
    // Update today's mood display
    updateTodayMoodDisplay();
    
    // Focus on journal entry
    document.getElementById('journal-entry').focus();
  }

  // Add event listener for expanding/collapsing entries
  entriesList.addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more')) {
      const entryContent = e.target.closest('.entry-content');
      const entryText = entryContent.querySelector('.entry-text');
      
      if (entryText.classList.contains('short')) {
        // Expand
        entryText.textContent = entryText.dataset.fullText;
        entryText.classList.remove('short');
        entryText.classList.add('full');
        e.target.textContent = 'show less';
      } else {
        // Collapse
        entryText.textContent = entryText.dataset.fullText.substring(0, 300) + '…';
        entryText.classList.remove('full');
        entryText.classList.add('short');
        e.target.textContent = 'read more';
      }
    }
  });

  // Function to generate ChatGPT reflection URL
  function generateChatGPTReflectionURL() {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENTRIES) || '[]');
    
    // Format entries as numbered list
    const formattedEntries = entries.map((entry, i) => 
      `${i + 1}. [${entry.date}] ${entry.question}\nAnswer: ${entry.answer}\nMood: ${moodLabels[entry.mood_rating]}`
    ).join('\n\n');
    
    // Create the prompt
    const rawPrompt = `I've been journaling my thoughts and feelings. As a therapist, can you help me process them and uncover deeper insights? Please look over these entries and reflect on what they reveal about my current mindset or emotional patterns. \n\n${formattedEntries}\n\n`;
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(rawPrompt);
    
    // Create ChatGPT redirect URL
    return `https://chat.openai.com/?model=gpt-4&prompt=${encodedPrompt}`;
  }

  // Reflection button event listener
  reflectBtn.addEventListener('click', () => {
    const chatGPTUrl = generateChatGPTReflectionURL();
    window.open(chatGPTUrl, '_blank');
  });
});

function randomSymbolRain() {
const symbols = ["✷", "✹", "*", "★", "✧"];
  let intervalId;

  const createSymbol = () => {
    const symbol = document.createElement("div");
    symbol.classList.add("symbol");
    symbol.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    const size = Math.random() * 20 + 10; // 10px to 30px
    symbol.style.fontSize = `${size}px`;
    symbol.style.left = `${Math.random() * 100}vw`;
    symbol.style.animationDuration = `${Math.random() * 3 + 3}s`; // 3s to 6s

    document.body.appendChild(symbol);

    // Remove normally after fall ends
    setTimeout(() => {
      symbol.remove();
    }, 4000);
  };

  // Start rain
  intervalId = setInterval(createSymbol, 100);

  // Stop rain and fade out all remaining symbols after 5000 seconds
  setTimeout(() => {
    clearInterval(intervalId);

    const allSymbols = document.querySelectorAll('.symbol');
    allSymbols.forEach(el => {
      el.style.opacity = '0';
    });

    // Remove after fade-out (5 seconds)
    setTimeout(() => {
      allSymbols.forEach(el => el.remove());
    }, 4000);

  }, 5000); // 5000 seconds in ms
}

