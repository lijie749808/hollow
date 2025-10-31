import { Locale } from './i18n'

export interface Translation {
  // Common
  selectFile: string
  switchMode: string
  dragDrop: string
  uploadTitle: string
  uploadDescription: string
  noInstallation: string
  description: string
  
  // Home page
  home: {
    title: string
    subtitle: string
    metaTitle: string
    metaDescription: string
    keywords: string[]
    
    // Badges
    badges: {
      pcSwitch: string
      clientSide: string
      noInstallation: string
    }
    
    // Silksong link
    silksongPromo: {
      title: string
      description: string
      button: string
    }
    
    // Quick intro
    quickIntro: {
      title: string
      content: string
      note: string
    }
    
    // Upload section
    upload: {
      title: string
      description: string
      selectFile: string
      switchMode: string
      dragHint: string
    }
    
    // Quick steps
    quickSteps: {
      backup: { title: string; desc: string }
      upload: { title: string; desc: string }
      edit: { title: string; desc: string }
      download: { title: string; desc: string }
    }
    
    // Editor section
    editor: {
      title: string
      editing: string
      poweredBy: string
      placeholder: string
      fileName: string
      modified: string
      original: string
      reset: string
      downloadTitle: string
      downloadSwitch: string
      downloadPC: string
      historyTitle: string
      noHistory: string
      restore: string
      delete: string
      editedAt: string
    }
    
    // History section
    history: {
      title: string
      description: string
      fileName: string
      hash: string
    }
    
    // Detailed instructions
    detailedInstructions: {
      title: string
      step1: { title: string; content: string[]; tip: string }
      step2: { title: string; content: string[] }
      step3: { title: string; content: string[]; example: string }
      step4: { title: string; content: string; buttons: string[]; final: string }
      step5: { title: string; content: string }
      step6: { title: string; content: string }
    }
    
    // Features
    features: {
      title: string
      pcSwitch: string
      clientSide: string
      visualEditor: string
    }
    
    // Instructions
    instructions: {
      title: string
      steps: string[]
    }
    
    // Save locations (detailed)
    saveLocationsDetailed: {
      title: string
      intro: string
      windows: { title: string; path: string; tip: string }
      mac: { title: string; path: string; tip: string }
      linux: { title: string; path: string; altPath: string; altIntro: string }
      switch: { title: string; description: string }
      warning: string
    }
    
    // Save locations (simple)
    saveLocations: {
      title: string
      windows: string
      mac: string
      linux: string
      switch: string
    }
    
    // What can edit
    whatCanEdit: {
      title: string
      categories: {
        currency: { title: string; items: string[] }
        health: { title: string; items: string[] }
        charms: { title: string; items: string[] }
        combat: { title: string; items: string[] }
        exploration: { title: string; items: string[] }
        progress: { title: string; items: string[] }
      }
      explorationProgress: { title: string; content: string }
    }
    
    // Technical details
    technicalDetails: {
      title: string
      paragraphs: string[]
    }
    
    // Safety
    safety: {
      title: string
      paragraphs: Array<{ title: string; content: string }>
      finalWarning: string
    }
    
    // Footer
    footer: {
      title: string
      disclaimer: string
    }
  }
  
  // Silksong page
  silksong: {
    title: string
    subtitle: string
    metaTitle: string
    metaDescription: string
    keywords: string[]
    backToHome: string
    
    // Header badges
    headerBadges: {
      complete: string
      free: string
      secure: string
    }
    
    badges: {
      pcSupport: string
      switchSupport: string
      clientSide: string
    }
    
    // Upload section
    upload: {
      dropHint: string
      title: string
      description: string
      selectButton: string
      switchModeLabel: string
    }
    
    // Editor UI
    editor: {
      statsTitle: string
      jsonTitle: string
      jsonSearch: string
      jsonError: string
      downloadButtons: {
        saveEncrypted: string
        saveSwitch: string
        saveJson: string
      }
    }
    
    // Stats sections
    stats: {
      basic: {
        title: string
        health: string
        silk: string
        shards: string
        rosaries: string
        playtime: string
      }
      tools: {
        title: string
        unlockAll: string
      }
      crests: {
        title: string
        unlockAll: string
        slot: string
      }
      collectables: {
        title: string
        unlockAll: string
      }
      relics: {
        title: string
        statuses: {
          none: string
          collected: string
          deposited: string
          seen: string
        }
      }
      quests: {
        title: string
        statuses: {
          notEncountered: string
          seen: string
          accepted: string
          completed: string
        }
        completedCount: string
      }
      journal: {
        title: string
        seen: string
        kills: string
      }
      quickActions: {
        title: string
        actions: {
          completeMaps: string
          unlockFastTravel: string
          saveFleas: string
        }
      }
    }
    
    about: {
      title: string
      content: string
      safetyTitle: string
      safetyContent: string
    }
    
    locations: {
      title: string
      windows: string
      mac: string
      linux: string
      switch: string
    }
    
    howToUse: {
      title: string
      steps: string[]
    }
    
    features: {
      title: string
      visual: { title: string; desc: string }
      clientSide: { title: string; desc: string }
      crossPlatform: { title: string; desc: string }
      comprehensive: { title: string; desc: string }
      jsonEditor: { title: string; desc: string }
      free: { title: string; desc: string }
    }
    
    whyChoose: {
      title: string
      content: string
    }
    
    useCases: {
      title: string
      items: Array<{ title: string; desc: string }>
    }
    
    technical: {
      title: string
      content: string
    }
    
    footer: {
      title: string
      backLink: string
      disclaimer: string
    }
  }
}

export const translations: Record<Locale, Translation> = {
  en: {
    selectFile: 'Select Save File',
    switchMode: 'Nintendo Switch Mode',
    dragDrop: 'Select your .dat save file or drag and drop it anywhere on this page',
    uploadTitle: 'Upload Your Save File',
    uploadDescription: 'Select your .dat save file or drag and drop it anywhere on this page',
    noInstallation: 'No Installation',
    description: 'Professional Online Save File Editor - 100% Free & Secure',
    
    home: {
      title: 'Hollow Knight Save Editor',
      subtitle: 'Professional Online Save File Editor - 100% Free & Secure',
      metaTitle: 'Hollow Knight Save Editor - Online Save File Editor & Modifier Tool',
      metaDescription: 'Free online Hollow Knight save editor for PC and Nintendo Switch. Edit game progress, unlock achievements, modify stats. 100% client-side processing, secure and easy to use.',
      keywords: ['hollow knight save editor', 'hollow knight save modifier', 'hollow knight pc save editor', 'hollow knight switch save editor', 'hollow knight online editor'],
      
      badges: {
        pcSwitch: 'PC & Switch',
        clientSide: 'Client-Side',
        noInstallation: 'No Installation',
      },
      
      silksongPromo: {
        title: 'Looking for Silksong Save Editor?',
        description: 'Try our new visual editor for Hollow Knight: Silksong with advanced features!',
        button: 'Open Silksong Editor →',
      },
      
      quickIntro: {
        title: 'Quick Introduction',
        content: 'Welcome to the most powerful Hollow Knight save editor available online. This professional hollow knight save editor tool allows you to modify your save files for both PC and Nintendo Switch, giving you complete control over your game progress, resources, abilities, and more. Start editing in seconds with our intuitive interface!',
        note: 'All processing happens in your browser - your save files never leave your computer.',
      },
      
      upload: {
        title: 'Start Editing Your Save File',
        description: 'Upload your Hollow Knight save file to begin customizing your game experience',
        selectFile: 'Select Save File',
        switchMode: 'Nintendo Switch Mode',
        dragHint: 'Select your .dat save file or drag and drop it anywhere on this page',
      },
      
      quickSteps: {
        backup: { title: 'Backup', desc: 'Save your original file first' },
        upload: { title: 'Upload', desc: 'Select or drag your save file' },
        edit: { title: 'Edit', desc: 'Modify your game data' },
        download: { title: 'Download', desc: 'Get your modified save' },
      },
      
      editor: {
        title: 'Save File Editor',
        editing: 'Editing',
        poweredBy: 'Powered by Hollow Knight Save Editor',
        placeholder: 'Your save file data will appear here...',
        fileName: 'File Name',
        modified: 'Modified',
        original: 'Original',
        reset: 'Reset to Original',
        downloadTitle: 'Download Modified Save',
        downloadSwitch: 'Download for Nintendo Switch',
        downloadPC: 'Download for PC',
        historyTitle: 'Recent Edits',
        noHistory: 'No recent edits',
        restore: 'Restore',
        delete: 'Delete',
        editedAt: 'Edited',
      },
      
      history: {
        title: 'Recent Edit History',
        description: 'Click to load a previous edit. Right-click to remove from history. Note: This is not a replacement for proper backups!',
        fileName: 'File Name',
        hash: 'Hash',
      },
      
      detailedInstructions: {
        title: 'Complete Step-by-Step Instructions',
        step1: {
          title: 'Create a Backup of Your Save File',
          content: [
            'Before using this hollow knight save editor, always make a backup copy. In your Hollow Knight save folder, locate the file named user1.dat (or user2.dat, user3.dat, user4.dat depending on your save slot).',
          ],
          tip: 'Rename your original file to something like user1_backup.dat or copy it to a safe location on your computer.',
        },
        step2: {
          title: 'Upload Your Save File to the Editor',
          content: [
            'Click the "Select Save File" button above, or simply drag and drop your save file (e.g., user1.dat) anywhere on this page. For Nintendo Switch users, enable "Nintendo Switch Mode" before uploading.',
            'The hollow knight save editor will automatically decrypt your file and display it as editable JSON data.',
          ],
        },
        step3: {
          title: 'Modify Your Game Data',
          content: [
            'Once loaded, you\'ll see JSON with "key": value pairs. Use Ctrl+F (or Cmd+F on Mac) to search for specific values.',
          ],
          example: 'Search for "geo" and change its value to 9999 to give yourself 9999 geo (currency).',
        },
        step4: {
          title: 'Download and Replace Your Save File',
          content: 'After making your edits, click the appropriate download button:',
          buttons: ['"Download Encrypted (PC)" for Steam/GOG versions', '"Download Plain Text (Switch)" for Nintendo Switch'],
          final: 'The file will be saved as user1.dat. Move this file to your Hollow Knight save folder, replacing the original (that you already backed up!).',
        },
        step5: {
          title: 'Close the Game (If Running)',
          content: 'Make sure Hollow Knight is completely closed before replacing the save file. The game only loads save files when it starts.',
        },
        step6: {
          title: 'Launch Hollow Knight',
          content: 'Start the game and enjoy your modifications! Your edited save file should now be loaded with all your changes.',
        },
      },
      
      features: {
        title: 'Key Features',
        pcSwitch: 'PC & Switch Support',
        clientSide: 'Client-Side Processing',
        visualEditor: 'Visual Editor',
      },
      
      instructions: {
        title: 'Complete Step-by-Step Instructions',
        steps: [
          'Backup your save file - Make a copy before editing',
          'Upload your save - Click "Select Save File" or drag and drop',
          'Edit with ease - Modify stats, unlock achievements, adjust progress',
          'Download your modified save - Click the save button',
          'Replace the original - Copy the file back to your save folder',
          'Launch and enjoy - Start Hollow Knight with your modifications',
        ],
      },
      
      saveLocationsDetailed: {
        title: 'Where to Find Your Save Folder',
        intro: 'The Hollow Knight save folder location varies by operating system and platform. Here are the most common paths:',
        windows: {
          title: 'Windows (Steam/GOG)',
          path: 'C:\\Users\\[YourUsername]\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\',
          tip: 'Press Win+R, paste the path, and press Enter',
        },
        mac: {
          title: 'macOS (Steam/GOG)',
          path: '~/Library/Application Support/unity.Team Cherry.Hollow Knight/',
          tip: 'Press Cmd+Shift+G in Finder, paste the path',
        },
        linux: {
          title: 'Linux (Steam)',
          path: '~/.config/unity3d/Team Cherry/Hollow Knight/',
          altIntro: 'or (Steam Play/Proton):',
          altPath: '~/.local/share/Steam/steamapps/compatdata/367520/pfx/drive_c/users/steamuser/AppData/LocalLow/Team Cherry/Hollow Knight/',
        },
        switch: {
          title: 'Nintendo Switch',
          description: 'Requires a modded Switch console and save management tools like Checkpoint or JKSV to export/import save files.',
        },
        warning: 'Tip: If you can\'t find the folder, make sure "Show hidden files" is enabled in your file explorer settings.',
      },
      
      saveLocations: {
        title: 'Where to Find Your Save Folder',
        windows: '%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\',
        mac: '~/Library/Application Support/unity.Team Cherry.Hollow Knight/',
        linux: '~/.config/unity3d/Team Cherry/Hollow Knight/',
        switch: 'Use tools like JKSV or Checkpoint to extract save data from your Nintendo Switch.',
      },
      
      whatCanEdit: {
        title: 'What Can You Edit with This Hollow Knight Save Editor?',
        categories: {
          currency: {
            title: '💰 Currency & Resources',
            items: [
              'Geo - Modify your in-game currency to any amount',
              'Dream Orbs/Essence - Adjust your collected essence points',
              'Rancid Eggs - Change the number of rancid eggs you own',
            ],
          },
          health: {
            title: '❤️ Health & Soul',
            items: [
              'Max Health - Set your maximum health capacity',
              'Current Health - Adjust your current health points',
              'Soul Capacity - Modify your maximum soul reserves',
            ],
          },
          charms: {
            title: '🎭 Charms & Abilities',
            items: [
              'Charm Ownership - Unlock or lock any charm in the game',
              'Charm Notches - Increase your available charm slots',
              'Equipped Charms - Modify which charms are currently equipped',
            ],
          },
          combat: {
            title: '⚔️ Combat & Skills',
            items: [
              'Nail Upgrades - Set your nail upgrade level (0-4)',
              'Spells - Unlock and upgrade all three spell types',
              'Special Abilities - Enable dash, double jump, and more',
            ],
          },
          exploration: {
            title: '🗺️ Exploration & Map',
            items: [
              'Map Unlocks - Reveal all map areas',
              'Wayward Compass - Toggle map marker visibility',
              'Dream Gate Locations - Modify fast travel points',
            ],
          },
          progress: {
            title: '🏆 Progress & Achievements',
            items: [
              'Boss Defeats - Mark bosses as defeated or undefeated',
              'Completion Percentage - Adjust your game completion',
              'Achievement Flags - Unlock or lock specific achievements',
            ],
          },
        },
        explorationProgress: {
          title: '🗺️ Exploration & Progress',
          content: 'With this hollow knight save editor, you can also modify exploration-related data such as discovered areas, visited rooms, unlocked map sections, boss defeat status, NPC interactions, quest progress, and achievement completion. The editor provides complete control over your game progression, allowing you to jump to any point in the game or simply adjust specific aspects of your playthrough.',
        },
      },
      
      technicalDetails: {
        title: 'Technical Details of Our Hollow Knight Save Editor',
        paragraphs: [
          'This hollow knight save editor is built with modern web technologies including Next.js, TypeScript, and React. All processing happens entirely in your browser - no files are ever uploaded to any server, ensuring complete privacy and security. The tool uses industry-standard AES encryption in ECB mode to handle PC save files, automatically detecting and applying the correct encryption key used by the game.',
          'For Nintendo Switch saves, the hollow knight save editor works with plain text JSON files, as Switch saves are not encrypted in the same way. The editor includes automatic format detection, so you don\'t need to worry about technical details - just select your platform and the tool handles the rest.',
          'The history management feature uses your browser\'s localStorage to keep track of recently edited files, making it easy to switch between multiple save files or restore previous edits. However, remember that clearing your browser data will also clear this history, so always maintain proper backups of your save files outside of this tool.',
        ],
      },
      
      safety: {
        title: 'Important Safety Information',
        paragraphs: [
          {
            title: 'Always backup your original save files!',
            content: 'Before using this hollow knight save editor, create a copy of your save files and store them in a safe location. While this tool is designed to be safe and reliable, unexpected issues can occur, and having a backup ensures you won\'t lose your progress.',
          },
          {
            title: 'Validate your JSON:',
            content: 'When editing save files manually, ensure your JSON syntax is correct. Invalid JSON will cause the game to fail loading your save. Use the browser\'s search function to help locate fields, and double-check your edits before downloading.',
          },
          {
            title: 'Test with caution:',
            content: 'Some extreme modifications (like setting values to impossibly high numbers) might cause unexpected game behavior or crashes. It\'s recommended to make small changes first and test them in-game before making extensive modifications.',
          },
          {
            title: 'Educational use:',
            content: 'This hollow knight save editor is provided as-is for educational purposes and personal use. Modifying save files is done at your own risk. We are not responsible for any issues that may arise from using this tool.',
          },
        ],
        finalWarning: '',
      },
      
      footer: {
        title: 'Hollow Knight Save Editor - Free Online Tool',
        disclaimer: 'Hollow Knight is a trademark of Team Cherry. This save editor is an independent fan-made tool and is not affiliated with or endorsed by Team Cherry.',
      },
    },
    
    silksong: {
      title: 'Hollow Knight Silksong',
      subtitle: 'Save Editor',
      metaTitle: 'Hollow Knight Silksong Save Editor - Visual Online Tool for PC & Switch',
      metaDescription: 'Professional hollow knight silksong save editor with visual interface. Edit Silksong save files for PC and Nintendo Switch. Free online silksong save editor tool.',
      keywords: ['hollow knight silksong save editor', 'silksong save editor', 'hollow knight silksong save modifier'],
      backToHome: '← Back to Home',
      
      headerBadges: {
        complete: 'Complete Visual Editor',
        free: '100% Free',
        secure: 'Fully Secure',
      },
      
      badges: {
        pcSupport: 'PC Support',
        switchSupport: 'Switch Support',
        clientSide: 'Client-Side Only',
      },
      
      upload: {
        dropHint: 'Drop your Silksong save file here',
        title: 'Upload Your Save File',
        description: 'Select your .dat save file or drag and drop it anywhere on this page',
        selectButton: 'Select Save File',
        switchModeLabel: 'Nintendo Switch Mode',
      },
      
      editor: {
        statsTitle: 'Stats & Settings',
        jsonTitle: 'JSON Data',
        jsonSearch: 'Search JSON...',
        jsonError: 'Invalid JSON syntax. Check for missing commas, brackets, or quotes.',
        downloadButtons: {
          saveEncrypted: 'Save Encrypted (PC)',
          saveSwitch: 'Save Unencrypted (Switch)',
          saveJson: 'Export as JSON',
        },
      },
      
      stats: {
        basic: {
          title: 'Basic Stats',
          health: 'Health',
          silk: 'Silk',
          shards: 'Shards',
          rosaries: 'Rosaries',
          playtime: 'Playtime',
        },
        tools: {
          title: 'Tools',
          unlockAll: 'Unlock All Tools',
        },
        crests: {
          title: 'Crests',
          unlockAll: 'Unlock All Crests',
          slot: 'Slot',
        },
        collectables: {
          title: 'Collectables',
          unlockAll: 'Unlock All Collectables',
        },
        relics: {
          title: 'Relics',
          statuses: {
            none: 'None',
            collected: 'Collected',
            deposited: 'Deposited',
            seen: 'Seen',
          },
        },
        quests: {
          title: 'Quests',
          statuses: {
            notEncountered: 'Not Encountered',
            seen: 'Seen',
            accepted: 'Accepted',
            completed: 'Completed',
          },
          completedCount: 'Completed Count',
        },
        journal: {
          title: 'Bestiary',
          seen: 'Seen',
          kills: 'Kills',
        },
        quickActions: {
          title: 'Quick Actions',
          actions: {
            completeMaps: 'Complete All Maps',
            unlockFastTravel: 'Unlock All Fast Travel',
            saveFleas: 'Save All Fleas',
          },
        },
      },
      
      about: {
        title: 'About This Hollow Knight Silksong Save Editor',
        content: 'Welcome to our professional hollow knight silksong save editor! This free online tool lets you easily modify your Silksong save files with a user-friendly visual interface. Edit Hornet\'s stats, unlock tools and abilities, manage Crests, adjust currency, and customize your game progression—no JSON knowledge required. Our silksong save editor supports both PC (Steam, GOG, Epic) and Nintendo Switch platforms.',
        safetyTitle: 'Safety Reminder',
        safetyContent: 'Always create a backup copy of your save files before making any modifications! All processing happens entirely in your browser—your data never leaves your computer, ensuring complete privacy and security with this hollow knight silksong save editor.',
      },
      
      locations: {
        title: 'Silksong Save File Locations',
        windows: '%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight Silksong\\',
        mac: '~/Library/Application Support/unity.Team Cherry.Hollow Knight Silksong/',
        linux: '~/.config/unity3d/Team Cherry/Hollow Knight Silksong/',
        switch: 'Use tools like JKSV or Checkpoint to extract save data from your Switch. Make sure to enable "Nintendo Switch Mode" when uploading Switch saves.',
      },
      
      howToUse: {
        title: 'How to Use This Hollow Knight Silksong Save Editor',
        steps: [
          'Backup your save file - Make a copy of your original .dat file before editing',
          'Upload your save - Click "Select Save File" or drag and drop your .dat file',
          'Edit with ease - Use the visual interface to modify stats, unlock abilities, collect items, and more',
          'Download your modified save - Click the save button to download your edited .dat file',
          'Replace the original - Copy the downloaded file back to your save folder (close the game first!)',
          'Launch and enjoy - Start Silksong and continue your adventure with your modifications',
        ],
      },
      
      features: {
        title: 'Key Features of This Silksong Save Editor',
        visual: {
          title: '✨ Visual Interface',
          desc: 'No JSON knowledge required. Edit everything through an intuitive point-and-click interface designed for the silksong save editor experience.',
        },
        clientSide: {
          title: '🔒 100% Client-Side',
          desc: 'All processing happens in your browser. Your save files never leave your computer, ensuring maximum privacy and security.',
        },
        crossPlatform: {
          title: '🎮 Cross-Platform',
          desc: 'Works with PC (Steam, GOG, Epic) and Nintendo Switch save files. Just toggle Switch mode for Switch saves.',
        },
        comprehensive: {
          title: '⚡ Comprehensive Editing',
          desc: 'Modify health, silk, currency, tools, Crests, collectables, maps, fast travel, quests, relics, bestiary—everything!',
        },
        jsonEditor: {
          title: '🔍 Advanced JSON Editor',
          desc: 'For power users: direct JSON editing with search functionality and real-time validation.',
        },
        free: {
          title: '💯 Free Forever',
          desc: 'This hollow knight silksong save editor is completely free with no ads, no registration, and no hidden costs.',
        },
      },
      
      whyChoose: {
        title: 'Why Choose This Hollow Knight Silksong Save Editor?',
        content: 'Unlike other save editors that require technical knowledge or risky third-party downloads, our hollow knight silksong save editor runs entirely in your web browser. This means no installation, no malware risk, and no learning curve.',
      },
      
      useCases: {
        title: 'Common Use Cases for This Silksong Save Editor',
        items: [
          { title: 'Test Different Builds', desc: 'Unlock all Crests and tools to experiment with various playstyles without grinding' },
          { title: 'Skip Difficult Sections', desc: 'Increase your health and abilities to overcome challenging boss fights or platforming sections' },
          { title: 'Complete Collections', desc: 'Unlock all bestiary entries, relics, and collectables for 100% completion' },
          { title: 'Recover Lost Progress', desc: 'Restore items or abilities lost due to bugs or mistakes' },
          { title: 'Speed Run Preparation', desc: 'Set up ideal starting conditions for speed run attempts' },
        ],
      },
      
      technical: {
        title: 'Technical Advantages',
        content: 'Our silksong save editor is built with modern web technologies to ensure reliability and performance. The editor automatically detects whether your save file is from PC (encrypted) or Nintendo Switch (unencrypted) and handles the appropriate decryption.',
      },
      
      footer: {
        title: 'Hollow Knight Silksong Save Editor - Complete Visual Editor Tool',
        backLink: 'Back to Hollow Knight (Original) Save Editor',
        disclaimer: 'Hollow Knight and Silksong are trademarks of Team Cherry. This save editor is an independent fan-made tool and is not affiliated with or endorsed by Team Cherry.',
      },
    },
  },
  
  ar: {
    selectFile: 'اختر ملف الحفظ',
    switchMode: 'وضع نينتندو سويتش',
    dragDrop: 'اختر ملف الحفظ .dat أو اسحبه وأفلته في أي مكان على هذه الصفحة',
    uploadTitle: 'تحميل ملف الحفظ',
    uploadDescription: 'اختر ملف الحفظ .dat أو اسحبه وأفلته في أي مكان على هذه الصفحة',
    noInstallation: 'بدون تثبيت',
    description: 'محرر ملفات الحفظ الاحترافي عبر الإنترنت - مجاني 100٪ وآمن',
    
    home: {
      title: 'محرر حفظ Hollow Knight',
      subtitle: 'محرر ملفات الحفظ الاحترافي عبر الإنترنت - مجاني 100٪ وآمن',
      metaTitle: 'محرر حفظ Hollow Knight - أداة تحرير وتعديل ملفات الحفظ عبر الإنترنت',
      metaDescription: 'محرر حفظ Hollow Knight المجاني عبر الإنترنت لأجهزة الكمبيوتر ونينتندو سويتش. تحرير تقدم اللعبة، فتح الإنجازات، تعديل الإحصائيات. معالجة 100٪ من جانب العميل، آمن وسهل الاستخدام.',
      keywords: ['محرر حفظ hollow knight', 'معدل حفظ hollow knight', 'محرر حفظ hollow knight للكمبيوتر', 'محرر حفظ hollow knight للسويتش', 'محرر hollow knight عبر الإنترنت'],
      
      badges: {
        pcSwitch: 'الكمبيوتر والسويتش',
        clientSide: 'من جانب العميل',
        noInstallation: 'بدون تثبيت',
      },
      
      silksongPromo: {
        title: 'تبحث عن محرر حفظ Silksong؟',
        description: 'جرب محررنا المرئي الجديد لـ Hollow Knight: Silksong مع ميزات متقدمة!',
        button: 'فتح محرر Silksong ←',
      },
      
      quickIntro: {
        title: 'مقدمة سريعة',
        content: 'مرحبًا بك في أقوى محرر حفظ Hollow Knight المتاح عبر الإنترنت. تتيح لك هذه الأداة الاحترافية لمحرر حفظ hollow knight تعديل ملفات الحفظ الخاصة بك لكل من الكمبيوتر ونينتندو سويتش، مما يمنحك التحكم الكامل في تقدم لعبتك والموارد والقدرات والمزيد. ابدأ التحرير في ثوانٍ مع واجهتنا البديهية!',
        note: 'تتم جميع المعالجات في متصفحك - ملفات الحفظ الخاصة بك لا تغادر جهاز الكمبيوتر الخاص بك أبدًا.',
      },
      
      upload: {
        title: 'ابدأ تحرير ملف الحفظ الخاص بك',
        description: 'قم بتحميل ملف حفظ Hollow Knight الخاص بك لبدء تخصيص تجربة اللعبة الخاصة بك',
        selectFile: 'اختر ملف الحفظ',
        switchMode: 'وضع نينتندو سويتش',
        dragHint: 'اختر ملف الحفظ .dat أو اسحبه وأفلته في أي مكان على هذه الصفحة',
      },
      
      quickSteps: {
        backup: { title: 'النسخ الاحتياطي', desc: 'احفظ ملفك الأصلي أولاً' },
        upload: { title: 'التحميل', desc: 'اختر أو اسحب ملف الحفظ الخاص بك' },
        edit: { title: 'التحرير', desc: 'قم بتعديل بيانات لعبتك' },
        download: { title: 'التنزيل', desc: 'احصل على ملف الحفظ المعدل' },
      },
      
      editor: {
        title: 'محرر ملف الحفظ',
        editing: 'جاري التحرير',
        poweredBy: 'مدعوم من محرر حفظ Hollow Knight',
        placeholder: 'ستظهر بيانات ملف الحفظ الخاص بك هنا...',
        fileName: 'اسم الملف',
        modified: 'معدل',
        original: 'أصلي',
        reset: 'إعادة تعيين إلى الأصلي',
        downloadTitle: 'تنزيل الحفظ المعدل',
        downloadSwitch: 'تنزيل لنينتندو سويتش',
        downloadPC: 'تنزيل للكمبيوتر',
        historyTitle: 'التعديلات الأخيرة',
        noHistory: 'لا توجد تعديلات حديثة',
        restore: 'استعادة',
        delete: 'حذف',
        editedAt: 'تم التحرير',
      },
      
      history: {
        title: 'سجل التحرير الأخير',
        description: 'انقر للتحميل تعديل سابق. انقر بزر الماوس الأيمن للإزالة من السجل. ملاحظة: هذا ليس بديلاً عن النسخ الاحتياطية المناسبة!',
        fileName: 'اسم الملف',
        hash: 'التجزئة',
      },
      
      detailedInstructions: {
        title: 'تعليمات كاملة خطوة بخطوة',
        step1: {
          title: 'إنشاء نسخة احتياطية من ملف الحفظ الخاص بك',
          content: [
            'قبل استخدام محرر حفظ hollow knight هذا، قم دائمًا بعمل نسخة احتياطية. في مجلد حفظ Hollow Knight الخاص بك، ابحث عن الملف المسمى user1.dat (أو user2.dat، user3.dat، user4.dat اعتمادًا على فتحة الحفظ الخاصة بك).',
          ],
          tip: 'أعد تسمية ملفك الأصلي إلى شيء مثل user1_backup.dat أو انسخه إلى موقع آمن على جهاز الكمبيوتر الخاص بك.',
        },
        step2: {
          title: 'تحميل ملف الحفظ إلى المحرر',
          content: [
            'انقر على زر "اختر ملف الحفظ" أعلاه، أو ببساطة اسحب وأفلت ملف الحفظ الخاص بك (مثل user1.dat) في أي مكان على هذه الصفحة. لمستخدمي نينتندو سويتش، قم بتمكين "وضع نينتندو سويتش" قبل التحميل.',
            'سيقوم محرر حفظ hollow knight تلقائيًا بفك تشفير ملفك وعرضه كبيانات JSON قابلة للتحرير.',
          ],
        },
        step3: {
          title: 'تعديل بيانات لعبتك',
          content: [
            'بمجرد التحميل، سترى JSON مع أزواج "key": value. استخدم Ctrl+F (أو Cmd+F على Mac) للبحث عن قيم محددة.',
          ],
          example: 'ابحث عن "geo" وغير قيمته إلى 9999 لمنح نفسك 9999 جيو (عملة).',
        },
        step4: {
          title: 'تنزيل واستبدال ملف الحفظ الخاص بك',
          content: 'بعد إجراء التعديلات، انقر على زر التنزيل المناسب:',
          buttons: ['"تنزيل مشفر (PC)" لإصدارات Steam/GOG', '"تنزيل نص عادي (Switch)" لنينتندو سويتش'],
          final: 'سيتم حفظ الملف باسم user1.dat. انقل هذا الملف إلى مجلد حفظ Hollow Knight الخاص بك، مستبدلاً الأصلي (الذي قمت بعمل نسخة احتياطية منه بالفعل!).',
        },
        step5: {
          title: 'أغلق اللعبة (إذا كانت قيد التشغيل)',
          content: 'تأكد من إغلاق Hollow Knight تمامًا قبل استبدال ملف الحفظ. تقوم اللعبة بتحميل ملفات الحفظ فقط عند بدء التشغيل.',
        },
        step6: {
          title: 'تشغيل Hollow Knight',
          content: 'ابدأ اللعبة واستمتع بتعديلاتك! يجب أن يتم تحميل ملف الحفظ المحرر الآن مع جميع تغييراتك.',
        },
      },
      
      features: {
        title: 'الميزات الرئيسية',
        pcSwitch: 'دعم الكمبيوتر والسويتش',
        clientSide: 'معالجة من جانب العميل',
        visualEditor: 'محرر مرئي',
      },
      
      saveLocationsDetailed: {
        title: 'أين تجد مجلد الحفظ الخاص بك',
        intro: 'يختلف موقع مجلد حفظ Hollow Knight حسب نظام التشغيل والمنصة. إليك المسارات الأكثر شيوعًا:',
        windows: {
          title: 'Windows (Steam/GOG)',
          path: 'C:\\Users\\[YourUsername]\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\',
          tip: 'اضغط Win+R، الصق المسار، واضغط Enter',
        },
        mac: {
          title: 'macOS (Steam/GOG)',
          path: '~/Library/Application Support/unity.Team Cherry.Hollow Knight/',
          tip: 'اضغط Cmd+Shift+G في Finder، الصق المسار',
        },
        linux: {
          title: 'Linux (Steam)',
          path: '~/.config/unity3d/Team Cherry/Hollow Knight/',
          altIntro: 'أو (Steam Play/Proton):',
          altPath: '~/.local/share/Steam/steamapps/compatdata/367520/pfx/drive_c/users/steamuser/AppData/LocalLow/Team Cherry/Hollow Knight/',
        },
        switch: {
          title: 'Nintendo Switch',
          description: 'يتطلب وحدة Switch معدلة وأدوات إدارة الحفظ مثل Checkpoint أو JKSV لتصدير/استيراد ملفات الحفظ.',
        },
        warning: 'نصيحة: إذا لم تتمكن من العثور على المجلد، تأكد من تمكين "إظهار الملفات المخفية" في إعدادات مستكشف الملفات.',
      },
      
      instructions: {
        title: 'تعليمات كاملة خطوة بخطوة',
        steps: [
          'نسخ احتياطي لملف الحفظ - قم بعمل نسخة قبل التحرير',
          'تحميل ملف الحفظ - انقر على "اختر ملف الحفظ" أو اسحب وأفلت',
          'التحرير بسهولة - تعديل الإحصائيات، فتح الإنجازات، ضبط التقدم',
          'تنزيل ملف الحفظ المعدل - انقر على زر الحفظ',
          'استبدال الملف الأصلي - انسخ الملف مرة أخرى إلى مجلد الحفظ',
          'التشغيل والاستمتاع - ابدأ Hollow Knight مع تعديلاتك',
        ],
      },
      
      saveLocations: {
        title: 'أين تجد مجلد الحفظ الخاص بك',
        windows: '%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\',
        mac: '~/Library/Application Support/unity.Team Cherry.Hollow Knight/',
        linux: '~/.config/unity3d/Team Cherry/Hollow Knight/',
        switch: 'استخدم أدوات مثل JKSV أو Checkpoint لاستخراج بيانات الحفظ من نينتندو سويتش الخاص بك.',
      },
      
      whatCanEdit: {
        title: 'ماذا يمكنك تحرير باستخدام محرر حفظ Hollow Knight هذا؟',
        categories: {
          currency: {
            title: '💰 العملة والموارد',
            items: [
              'جيو - قم بتعديل عملتك داخل اللعبة إلى أي مبلغ',
              'كرات الأحلام/الجوهر - اضبط نقاط الجوهر المجمعة',
              'البيض الفاسد - غيّر عدد البيض الفاسد الذي تمتلكه',
            ],
          },
          health: {
            title: '❤️ الصحة والروح',
            items: [
              'الصحة القصوى - اضبط سعة صحتك القصوى',
              'الصحة الحالية - اضبط نقاط صحتك الحالية',
              'سعة الروح - عدّل احتياطيات روحك القصوى',
            ],
          },
          charms: {
            title: '🎭 التمائم والقدرات',
            items: [
              'ملكية التمائم - افتح أو أغلق أي تميمة في اللعبة',
              'فتحات التمائم - زد فتحات التمائم المتاحة لديك',
              'التمائم المجهزة - عدّل التمائم المجهزة حاليًا',
            ],
          },
          combat: {
            title: '⚔️ القتال والمهارات',
            items: [
              'ترقيات المسمار - اضبط مستوى ترقية مسمارك (0-4)',
              'التعويذات - افتح وطور جميع أنواع التعويذات الثلاثة',
              'القدرات الخاصة - فعّل الاندفاع والقفز المزدوج والمزيد',
            ],
          },
          exploration: {
            title: '🗺️ الاستكشاف والخريطة',
            items: [
              'فتح الخريطة - اكشف جميع مناطق الخريطة',
              'البوصلة الضالة - بدّل رؤية علامة الخريطة',
              'مواقع بوابة الأحلام - عدّل نقاط السفر السريع',
            ],
          },
          progress: {
            title: '🏆 التقدم والإنجازات',
            items: [
              'هزائم الزعماء - حدد الزعماء كمهزومين أو غير مهزومين',
              'نسبة الإكمال - اضبط نسبة إكمال لعبتك',
              'أعلام الإنجازات - افتح أو أغلق إنجازات محددة',
            ],
          },
        },
        explorationProgress: {
          title: '🗺️ الاستكشاف والتقدم',
          content: 'باستخدام محرر حفظ hollow knight هذا، يمكنك أيضًا تعديل البيانات المتعلقة بالاستكشاف مثل المناطق المكتشفة والغرف التي تمت زيارتها وأقسام الخريطة المفتوحة وحالة هزيمة الزعماء وتفاعلات الشخصيات غير القابلة للعب وتقدم المهام وإكمال الإنجازات. يوفر المحرر تحكمًا كاملاً في تقدم لعبتك، مما يسمح لك بالانتقال إلى أي نقطة في اللعبة أو ببساطة ضبط جوانب محددة من تجربة اللعب الخاصة بك.',
        },
      },
      
      technicalDetails: {
        title: 'التفاصيل التقنية لمحرر حفظ Hollow Knight الخاص بنا',
        paragraphs: [
          'تم بناء محرر حفظ hollow knight هذا باستخدام تقنيات الويب الحديثة بما في ذلك Next.js و TypeScript و React. تتم جميع المعالجات بالكامل في متصفحك - لا يتم تحميل أي ملفات إلى أي خادم على الإطلاق، مما يضمن الخصوصية والأمان الكاملين. تستخدم الأداة تشفير AES القياسي في الصناعة في وضع ECB للتعامل مع ملفات حفظ الكمبيوتر، وتكتشف تلقائيًا وتطبق مفتاح التشفير الصحيح المستخدم من قبل اللعبة.',
          'بالنسبة لملفات حفظ Nintendo Switch، يعمل محرر حفظ hollow knight مع ملفات JSON النصية العادية، حيث لا يتم تشفير ملفات حفظ Switch بنفس الطريقة. يتضمن المحرر كشف تنسيق تلقائي، لذلك لا داعي للقلق بشأن التفاصيل التقنية - ما عليك سوى تحديد منصتك وستتولى الأداة الباقي.',
          'تستخدم ميزة إدارة السجل localStorage الخاص بمتصفحك لتتبع الملفات المحررة مؤخرًا، مما يسهل التبديل بين ملفات حفظ متعددة أو استعادة التعديلات السابقة. ومع ذلك، تذكر أن مسح بيانات المتصفح سيؤدي أيضًا إلى مسح هذا السجل، لذا احتفظ دائمًا بنسخ احتياطية مناسبة من ملفات الحفظ الخاصة بك خارج هذه الأداة.',
        ],
      },
      
      safety: {
        title: 'معلومات السلامة المهمة',
        paragraphs: [
          {
            title: 'قم دائمًا بعمل نسخة احتياطية من ملفات الحفظ الأصلية!',
            content: 'قبل استخدام محرر حفظ hollow knight هذا، قم بإنشاء نسخة من ملفات الحفظ الخاصة بك وتخزينها في مكان آمن. بينما تم تصميم هذه الأداة لتكون آمنة وموثوقة، قد تحدث مشكلات غير متوقعة، ووجود نسخة احتياطية يضمن عدم فقدان تقدمك.',
          },
          {
            title: 'التحقق من صحة JSON:',
            content: 'عند تحرير ملفات الحفظ يدويًا، تأكد من صحة بناء جملة JSON. سيتسبب JSON غير الصالح في فشل اللعبة في تحميل ملف الحفظ الخاص بك. استخدم وظيفة البحث في المتصفح للمساعدة في تحديد موقع الحقول، وتحقق مرة أخرى من تعديلاتك قبل التنزيل.',
          },
          {
            title: 'اختبر بحذر:',
            content: 'قد تتسبب بعض التعديلات الشديدة (مثل تعيين القيم لأرقام عالية بشكل مستحيل) في سلوك غير متوقع في اللعبة أو تعطل. يوصى بإجراء تغييرات صغيرة أولاً واختبارها في اللعبة قبل إجراء تعديلات واسعة.',
          },
          {
            title: 'الاستخدام التعليمي:',
            content: 'يتم توفير محرر حفظ hollow knight هذا كما هو للأغراض التعليمية والاستخدام الشخصي. يتم تعديل ملفات الحفظ على مسؤوليتك الخاصة. نحن لسنا مسؤولين عن أي مشاكل قد تنشأ عن استخدام هذه الأداة.',
          },
        ],
        finalWarning: '',
      },
      
      footer: {
        title: 'محرر حفظ Hollow Knight - أداة مجانية عبر الإنترنت',
        disclaimer: 'Hollow Knight هي علامة تجارية لـ Team Cherry. هذا المحرر للحفظ هو أداة مستقلة من صنع المعجبين وليس منتسبًا أو معتمدًا من قبل Team Cherry.',
      },
    },
    
    silksong: {
      title: 'Hollow Knight Silksong',
      subtitle: 'محرر الحفظ',
      metaTitle: 'محرر حفظ Hollow Knight Silksong - أداة مرئية عبر الإنترنت للكمبيوتر والسويتش',
      metaDescription: 'محرر حفظ hollow knight silksong احترافي مع واجهة مرئية. تحرير ملفات حفظ Silksong لأجهزة الكمبيوتر ونينتندو سويتش. أداة محرر حفظ silksong مجانية عبر الإنترنت.',
      keywords: ['محرر حفظ hollow knight silksong', 'محرر حفظ silksong', 'معدل حفظ hollow knight silksong'],
      backToHome: '→ العودة إلى الصفحة الرئيسية',
      
      headerBadges: {
        complete: 'محرر مرئي كامل',
        free: '100% مجاني',
        secure: 'آمن تمامًا',
      },
      
      badges: {
        pcSupport: 'دعم الكمبيوتر',
        switchSupport: 'دعم السويتش',
        clientSide: 'من جانب العميل فقط',
      },
      
      upload: {
        dropHint: 'أفلت ملف حفظ Silksong هنا',
        title: 'تحميل ملف الحفظ الخاص بك',
        description: 'حدد ملف .dat الخاص بك أو اسحبه وأفلته في أي مكان على هذه الصفحة',
        selectButton: 'اختر ملف الحفظ',
        switchModeLabel: 'وضع نينتندو سويتش',
      },
      
      editor: {
        statsTitle: 'الإحصائيات والإعدادات',
        jsonTitle: 'بيانات JSON',
        jsonSearch: 'البحث في JSON...',
        jsonError: 'بناء جملة JSON غير صالح. تحقق من الفواصل أو الأقواس أو علامات الاقتباس المفقودة.',
        downloadButtons: {
          saveEncrypted: 'حفظ مشفر (PC)',
          saveSwitch: 'حفظ غير مشفر (Switch)',
          saveJson: 'تصدير كـ JSON',
        },
      },
      
      stats: {
        basic: {
          title: 'الإحصائيات الأساسية',
          health: 'الصحة',
          silk: 'الحرير',
          shards: 'الشظايا',
          rosaries: 'المسابح',
          playtime: 'وقت اللعب',
        },
        tools: {
          title: 'الأدوات',
          unlockAll: 'فتح جميع الأدوات',
        },
        crests: {
          title: 'الشعارات',
          unlockAll: 'فتح جميع الشعارات',
          slot: 'الفتحة',
        },
        collectables: {
          title: 'المقتنيات',
          unlockAll: 'فتح جميع المقتنيات',
        },
        relics: {
          title: 'الآثار',
          statuses: {
            none: 'لا شيء',
            collected: 'تم جمعه',
            deposited: 'تم إيداعه',
            seen: 'تمت رؤيته',
          },
        },
        quests: {
          title: 'المهام',
          statuses: {
            notEncountered: 'لم يتم مواجهته',
            seen: 'تمت رؤيته',
            accepted: 'مقبول',
            completed: 'مكتمل',
          },
          completedCount: 'عدد المكتمل',
        },
        journal: {
          title: 'دليل الوحوش',
          seen: 'تمت رؤيته',
          kills: 'القتلى',
        },
        quickActions: {
          title: 'الإجراءات السريعة',
          actions: {
            completeMaps: 'إكمال جميع الخرائط',
            unlockFastTravel: 'فتح جميع السفر السريع',
            saveFleas: 'حفظ جميع البراغيث',
          },
        },
      },
      
      about: {
        title: 'حول محرر حفظ Hollow Knight Silksong هذا',
        content: 'مرحبًا بك في محرر حفظ hollow knight silksong الاحترافي الخاص بنا! تتيح لك هذه الأداة المجانية عبر الإنترنت تعديل ملفات حفظ Silksong الخاصة بك بسهولة باستخدام واجهة مرئية سهلة الاستخدام. تحرير إحصائيات هورنت، فتح الأدوات والقدرات، إدارة الشارات، ضبط العملة، وتخصيص تقدم لعبتك - لا حاجة لمعرفة JSON. يدعم محرر حفظ silksong الخاص بنا كلاً من منصات الكمبيوتر (Steam وGOG وEpic) ونينتندو سويتش.',
        safetyTitle: 'تذكير بالسلامة',
        safetyContent: 'قم دائمًا بإنشاء نسخة احتياطية من ملفات الحفظ الخاصة بك قبل إجراء أي تعديلات! تتم جميع المعالجات بالكامل في متصفحك - بياناتك لا تغادر جهاز الكمبيوتر الخاص بك أبدًا، مما يضمن الخصوصية والأمان الكاملين مع محرر حفظ hollow knight silksong هذا.',
      },
      
      locations: {
        title: 'مواقع ملفات حفظ Silksong',
        windows: '%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight Silksong\\',
        mac: '~/Library/Application Support/unity.Team Cherry.Hollow Knight Silksong/',
        linux: '~/.config/unity3d/Team Cherry/Hollow Knight Silksong/',
        switch: 'استخدم أدوات مثل JKSV أو Checkpoint لاستخراج بيانات الحفظ من السويتش الخاص بك. تأكد من تمكين "وضع نينتندو سويتش" عند تحميل ملفات حفظ السويتش.',
      },
      
      howToUse: {
        title: 'كيفية استخدام محرر حفظ Hollow Knight Silksong هذا',
        steps: [
          'نسخ احتياطي لملف الحفظ - قم بعمل نسخة من ملف .dat الأصلي قبل التحرير',
          'تحميل ملف الحفظ - انقر على "اختر ملف الحفظ" أو اسحب وأفلت ملف .dat الخاص بك',
          'التحرير بسهولة - استخدم الواجهة المرئية لتعديل الإحصائيات وفتح القدرات وجمع العناصر والمزيد',
          'تنزيل ملف الحفظ المعدل - انقر على زر الحفظ لتنزيل ملف .dat المعدل',
          'استبدال الملف الأصلي - انسخ الملف المنزل مرة أخرى إلى مجلد الحفظ (أغلق اللعبة أولاً!)',
          'التشغيل والاستمتاع - ابدأ Silksong واستمر في مغامرتك مع تعديلاتك',
        ],
      },
      
      features: {
        title: 'الميزات الرئيسية لمحرر حفظ Silksong هذا',
        visual: {
          title: '✨ واجهة مرئية',
          desc: 'لا حاجة لمعرفة JSON. قم بتحرير كل شيء من خلال واجهة بديهية للنقر والتأشير مصممة لتجربة محرر حفظ silksong.',
        },
        clientSide: {
          title: '🔒 100٪ من جانب العميل',
          desc: 'تتم جميع المعالجات في متصفحك. ملفات الحفظ الخاصة بك لا تغادر جهاز الكمبيوتر الخاص بك أبدًا، مما يضمن أقصى قدر من الخصوصية والأمان.',
        },
        crossPlatform: {
          title: '🎮 متعدد المنصات',
          desc: 'يعمل مع ملفات حفظ الكمبيوتر (Steam وGOG وEpic) ونينتندو سويتش. فقط قم بتبديل وضع السويتش لملفات حفظ السويتش.',
        },
        comprehensive: {
          title: '⚡ تحرير شامل',
          desc: 'تعديل الصحة والحرير والعملة والأدوات والشارات والمقتنيات والخرائط والسفر السريع والمهام والآثار والكتيب - كل شيء!',
        },
        jsonEditor: {
          title: '🔍 محرر JSON متقدم',
          desc: 'لمستخدمي الطاقة: تحرير JSON مباشر مع وظيفة البحث والتحقق في الوقت الفعلي.',
        },
        free: {
          title: '💯 مجاني للأبد',
          desc: 'محرر حفظ hollow knight silksong هذا مجاني تمامًا بدون إعلانات ولا تسجيل ولا تكاليف خفية.',
        },
      },
      
      whyChoose: {
        title: 'لماذا تختار محرر حفظ Hollow Knight Silksong هذا؟',
        content: 'على عكس محررات الحفظ الأخرى التي تتطلب معرفة تقنية أو تنزيلات محفوفة بالمخاطر من طرف ثالث، يعمل محرر حفظ hollow knight silksong الخاص بنا بالكامل في متصفح الويب الخاص بك. هذا يعني عدم التثبيت، وعدم خطر البرامج الضارة، وعدم منحنى التعلم.',
      },
      
      useCases: {
        title: 'حالات الاستخدام الشائعة لمحرر حفظ Silksong هذا',
        items: [
          { title: 'اختبار بنى مختلفة', desc: 'فتح جميع الشارات والأدوات لتجربة أنماط لعب مختلفة دون الطحن' },
          { title: 'تخطي الأقسام الصعبة', desc: 'زيادة صحتك وقدراتك للتغلب على معارك الزعماء الصعبة أو أقسام القفز' },
          { title: 'إكمال المجموعات', desc: 'فتح جميع إدخالات الكتيب والآثار والمقتنيات لإكمال 100٪' },
          { title: 'استعادة التقدم المفقود', desc: 'استعادة العناصر أو القدرات المفقودة بسبب الأخطاء أو الأخطاء' },
          { title: 'التحضير للجري السريع', desc: 'إعداد ظروف البداية المثالية لمحاولات الجري السريع' },
        ],
      },
      
      technical: {
        title: 'المزايا التقنية',
        content: 'تم بناء محرر حفظ silksong الخاص بنا باستخدام تقنيات الويب الحديثة لضمان الموثوقية والأداء. يكتشف المحرر تلقائيًا ما إذا كان ملف الحفظ الخاص بك من الكمبيوتر (مشفر) أو نينتندو سويتش (غير مشفر) ويتعامل مع فك التشفير المناسب.',
      },
      
      footer: {
        title: 'محرر حفظ Hollow Knight Silksong - أداة محرر مرئي كامل',
        backLink: 'العودة إلى محرر حفظ Hollow Knight (الأصلي)',
        disclaimer: 'Hollow Knight وSilksong علامتان تجاريتان لـ Team Cherry. محرر الحفظ هذا هو أداة مستقلة من صنع المعجبين وغير تابعة أو معتمدة من Team Cherry.',
      },
    },
  },
  
  pt: {
    selectFile: 'Selecionar Arquivo de Save',
    switchMode: 'Modo Nintendo Switch',
    dragDrop: 'Selecione seu arquivo de save .dat ou arraste e solte em qualquer lugar desta página',
    uploadTitle: 'Carregar Seu Arquivo de Save',
    uploadDescription: 'Selecione seu arquivo de save .dat ou arraste e solte em qualquer lugar desta página',
    noInstallation: 'Sem Instalação',
    description: 'Editor de Arquivo de Save Online Profissional - 100% Gratuito e Seguro',
    
    home: {
      title: 'Editor de Save do Hollow Knight',
      subtitle: 'Editor de Arquivo de Save Online Profissional - 100% Gratuito e Seguro',
      metaTitle: 'Editor de Save do Hollow Knight - Ferramenta de Edição e Modificação de Arquivos de Save Online',
      metaDescription: 'Editor de save gratuito do Hollow Knight para PC e Nintendo Switch. Edite o progresso do jogo, desbloqueie conquistas, modifique estatísticas. Processamento 100% do lado do cliente, seguro e fácil de usar.',
      keywords: ['editor de save hollow knight', 'modificador de save hollow knight', 'editor de save hollow knight pc', 'editor de save hollow knight switch', 'editor hollow knight online'],
      
      badges: {
        pcSwitch: 'PC & Switch',
        clientSide: 'Lado do Cliente',
        noInstallation: 'Sem Instalação',
      },
      
      silksongPromo: {
        title: 'Procurando pelo Editor de Save do Silksong?',
        description: 'Experimente nosso novo editor visual para Hollow Knight: Silksong com recursos avançados!',
        button: 'Abrir Editor do Silksong →',
      },
      
      quickIntro: {
        title: 'Introdução Rápida',
        content: 'Bem-vindo ao mais poderoso editor de save do Hollow Knight disponível online. Esta ferramenta profissional de editor de save do hollow knight permite que você modifique seus arquivos de save para PC e Nintendo Switch, dando-lhe controle completo sobre o progresso do jogo, recursos, habilidades e mais. Comece a editar em segundos com nossa interface intuitiva!',
        note: 'Todo o processamento acontece em seu navegador - seus arquivos de save nunca saem do seu computador.',
      },
      
      upload: {
        title: 'Comece a Editar Seu Arquivo de Save',
        description: 'Carregue seu arquivo de save do Hollow Knight para começar a personalizar sua experiência de jogo',
        selectFile: 'Selecionar Arquivo de Save',
        switchMode: 'Modo Nintendo Switch',
        dragHint: 'Selecione seu arquivo de save .dat ou arraste e solte em qualquer lugar desta página',
      },
      
      quickSteps: {
        backup: { title: 'Backup', desc: 'Salve seu arquivo original primeiro' },
        upload: { title: 'Upload', desc: 'Selecione ou arraste seu arquivo de save' },
        edit: { title: 'Editar', desc: 'Modifique os dados do seu jogo' },
        download: { title: 'Download', desc: 'Obtenha seu save modificado' },
      },
      
      editor: {
        title: 'Editor de Arquivo de Save',
        editing: 'Editando',
        poweredBy: 'Desenvolvido por Editor de Save do Hollow Knight',
        placeholder: 'Os dados do seu arquivo de save aparecerão aqui...',
        fileName: 'Nome do Arquivo',
        modified: 'Modificado',
        original: 'Original',
        reset: 'Redefinir para Original',
        downloadTitle: 'Baixar Save Modificado',
        downloadSwitch: 'Baixar para Nintendo Switch',
        downloadPC: 'Baixar para PC',
        historyTitle: 'Edições Recentes',
        noHistory: 'Nenhuma edição recente',
        restore: 'Restaurar',
        delete: 'Excluir',
        editedAt: 'Editado',
      },
      
      history: {
        title: 'Histórico de Edições Recentes',
        description: 'Clique para carregar uma edição anterior. Clique com o botão direito para remover do histórico. Nota: Isso não substitui backups adequados!',
        fileName: 'Nome do Arquivo',
        hash: 'Hash',
      },
      
      detailedInstructions: {
        title: 'Instruções Completas Passo a Passo',
        step1: {
          title: 'Crie um Backup do Seu Arquivo de Save',
          content: [
            'Antes de usar este editor de save do hollow knight, sempre faça uma cópia de backup. Na pasta de save do Hollow Knight, localize o arquivo chamado user1.dat (ou user2.dat, user3.dat, user4.dat dependendo do seu slot de save).',
          ],
          tip: 'Renomeie seu arquivo original para algo como user1_backup.dat ou copie-o para um local seguro no seu computador.',
        },
        step2: {
          title: 'Carregue Seu Arquivo de Save no Editor',
          content: [
            'Clique no botão "Selecionar Arquivo de Save" acima, ou simplesmente arraste e solte seu arquivo de save (por exemplo, user1.dat) em qualquer lugar desta página. Para usuários do Nintendo Switch, ative o "Modo Nintendo Switch" antes de fazer o upload.',
            'O editor de save do hollow knight descriptografará automaticamente seu arquivo e o exibirá como dados JSON editáveis.',
          ],
        },
        step3: {
          title: 'Modifique os Dados do Seu Jogo',
          content: [
            'Uma vez carregado, você verá JSON com pares "chave": valor. Use Ctrl+F (ou Cmd+F no Mac) para procurar valores específicos.',
          ],
          example: 'Procure por "geo" e altere seu valor para 9999 para dar a si mesmo 9999 geo (moeda).',
        },
        step4: {
          title: 'Baixe e Substitua Seu Arquivo de Save',
          content: 'Após fazer suas edições, clique no botão de download apropriado:',
          buttons: ['"Baixar Criptografado (PC)" para versões Steam/GOG', '"Baixar Texto Simples (Switch)" para Nintendo Switch'],
          final: 'O arquivo será salvo como user1.dat. Mova este arquivo para sua pasta de save do Hollow Knight, substituindo o original (do qual você já fez backup!).',
        },
        step5: {
          title: 'Feche o Jogo (Se Estiver Rodando)',
          content: 'Certifique-se de que o Hollow Knight está completamente fechado antes de substituir o arquivo de save. O jogo só carrega arquivos de save quando inicia.',
        },
        step6: {
          title: 'Inicie o Hollow Knight',
          content: 'Inicie o jogo e aproveite suas modificações! Seu arquivo de save editado agora deve estar carregado com todas as suas alterações.',
        },
      },
      
      features: {
        title: 'Principais Recursos',
        pcSwitch: 'Suporte para PC e Switch',
        clientSide: 'Processamento do Lado do Cliente',
        visualEditor: 'Editor Visual',
      },
      
      saveLocationsDetailed: {
        title: 'Onde Encontrar Sua Pasta de Save',
        intro: 'O local da pasta de save do Hollow Knight varia de acordo com o sistema operacional e plataforma. Aqui estão os caminhos mais comuns:',
        windows: {
          title: 'Windows (Steam/GOG)',
          path: 'C:\\Users\\[SeuNomeDeUsuário]\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\',
          tip: 'Pressione Win+R, cole o caminho e pressione Enter',
        },
        mac: {
          title: 'macOS (Steam/GOG)',
          path: '~/Library/Application Support/unity.Team Cherry.Hollow Knight/',
          tip: 'Pressione Cmd+Shift+G no Finder, cole o caminho',
        },
        linux: {
          title: 'Linux (Steam)',
          path: '~/.config/unity3d/Team Cherry/Hollow Knight/',
          altIntro: 'ou (Steam Play/Proton):',
          altPath: '~/.local/share/Steam/steamapps/compatdata/367520/pfx/drive_c/users/steamuser/AppData/LocalLow/Team Cherry/Hollow Knight/',
        },
        switch: {
          title: 'Nintendo Switch',
          description: 'Requer um console Switch modificado e ferramentas de gerenciamento de saves como Checkpoint ou JKSV para exportar/importar arquivos de save.',
        },
        warning: 'Dica: Se você não conseguir encontrar a pasta, certifique-se de que "Mostrar arquivos ocultos" esteja ativado nas configurações do explorador de arquivos.',
      },
      
      instructions: {
        title: 'Instruções Completas Passo a Passo',
        steps: [
          'Faça backup do seu arquivo de save - Faça uma cópia antes de editar',
          'Carregue seu save - Clique em "Selecionar Arquivo de Save" ou arraste e solte',
          'Edite com facilidade - Modifique estatísticas, desbloqueie conquistas, ajuste o progresso',
          'Baixe seu save modificado - Clique no botão salvar',
          'Substitua o original - Copie o arquivo de volta para sua pasta de save',
          'Inicie e divirta-se - Comece Hollow Knight com suas modificações',
        ],
      },
      
      saveLocations: {
        title: 'Onde Encontrar Sua Pasta de Save',
        windows: '%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight\\',
        mac: '~/Library/Application Support/unity.Team Cherry.Hollow Knight/',
        linux: '~/.config/unity3d/Team Cherry/Hollow Knight/',
        switch: 'Use ferramentas como JKSV ou Checkpoint para extrair dados de save do seu Nintendo Switch.',
      },
      
      whatCanEdit: {
        title: 'O Que Você Pode Editar com Este Editor de Save do Hollow Knight?',
        categories: {
          currency: {
            title: '💰 Moeda e Recursos',
            items: [
              'Geo - Modifique sua moeda no jogo para qualquer quantia',
              'Orbes dos Sonhos/Essência - Ajuste seus pontos de essência coletados',
              'Ovos Rançosos - Altere o número de ovos rançosos que você possui',
            ],
          },
          health: {
            title: '❤️ Saúde e Alma',
            items: [
              'Saúde Máxima - Defina sua capacidade máxima de saúde',
              'Saúde Atual - Ajuste seus pontos de saúde atuais',
              'Capacidade de Alma - Modifique suas reservas máximas de alma',
            ],
          },
          charms: {
            title: '🎭 Amuletos e Habilidades',
            items: [
              'Posse de Amuletos - Desbloqueie ou bloqueie qualquer amuleto no jogo',
              'Entalhes de Amuletos - Aumente seus slots de amuletos disponíveis',
              'Amuletos Equipados - Modifique quais amuletos estão atualmente equipados',
            ],
          },
          combat: {
            title: '⚔️ Combate e Habilidades',
            items: [
              'Melhorias do Prego - Defina o nível de melhoria do seu prego (0-4)',
              'Feitiços - Desbloqueie e melhore todos os três tipos de feitiços',
              'Habilidades Especiais - Ative dash, pulo duplo e mais',
            ],
          },
          exploration: {
            title: '🗺️ Exploração e Mapa',
            items: [
              'Desbloqueios de Mapa - Revele todas as áreas do mapa',
              'Bússola Errante - Alterne a visibilidade do marcador do mapa',
              'Localizações do Portão dos Sonhos - Modifique pontos de viagem rápida',
            ],
          },
          progress: {
            title: '🏆 Progresso e Conquistas',
            items: [
              'Derrotas de Chefes - Marque chefes como derrotados ou não derrotados',
              'Porcentagem de Conclusão - Ajuste sua conclusão do jogo',
              'Sinalizadores de Conquistas - Desbloqueie ou bloqueie conquistas específicas',
            ],
          },
        },
        explorationProgress: {
          title: '🗺️ Exploração e Progresso',
          content: 'Com este editor de save do hollow knight, você também pode modificar dados relacionados à exploração, como áreas descobertas, salas visitadas, seções de mapa desbloqueadas, status de derrota de chefes, interações com NPCs, progresso de missões e conclusão de conquistas. O editor fornece controle completo sobre a progressão do seu jogo, permitindo que você pule para qualquer ponto do jogo ou simplesmente ajuste aspectos específicos da sua jogada.',
        },
      },
      
      technicalDetails: {
        title: 'Detalhes Técnicos do Nosso Editor de Save do Hollow Knight',
        paragraphs: [
          'Este editor de save do hollow knight é construído com tecnologias web modernas, incluindo Next.js, TypeScript e React. Todo o processamento acontece inteiramente no seu navegador - nenhum arquivo é enviado para qualquer servidor, garantindo privacidade e segurança completas. A ferramenta usa criptografia AES padrão da indústria no modo ECB para lidar com arquivos de save de PC, detectando e aplicando automaticamente a chave de criptografia correta usada pelo jogo.',
          'Para saves do Nintendo Switch, o editor de save do hollow knight trabalha com arquivos JSON de texto simples, pois os saves do Switch não são criptografados da mesma maneira. O editor inclui detecção automática de formato, então você não precisa se preocupar com detalhes técnicos - basta selecionar sua plataforma e a ferramenta cuida do resto.',
          'O recurso de gerenciamento de histórico usa o localStorage do seu navegador para acompanhar arquivos editados recentemente, facilitando a alternância entre vários arquivos de save ou a restauração de edições anteriores. No entanto, lembre-se de que limpar os dados do seu navegador também limpará este histórico, portanto, sempre mantenha backups adequados dos seus arquivos de save fora desta ferramenta.',
        ],
      },
      
      safety: {
        title: 'Informações Importantes de Segurança',
        paragraphs: [
          {
            title: 'Sempre faça backup dos seus arquivos de save originais!',
            content: 'Antes de usar este editor de save do hollow knight, crie uma cópia dos seus arquivos de save e armazene-os em um local seguro. Embora esta ferramenta seja projetada para ser segura e confiável, problemas inesperados podem ocorrer, e ter um backup garante que você não perderá seu progresso.',
          },
          {
            title: 'Valide seu JSON:',
            content: 'Ao editar arquivos de save manualmente, certifique-se de que sua sintaxe JSON está correta. JSON inválido fará com que o jogo falhe ao carregar seu save. Use a função de pesquisa do navegador para ajudar a localizar campos e verifique suas edições antes de fazer o download.',
          },
          {
            title: 'Teste com cuidado:',
            content: 'Algumas modificações extremas (como definir valores para números impossíveis de serem altos) podem causar comportamento inesperado do jogo ou travamentos. É recomendado fazer pequenas alterações primeiro e testá-las no jogo antes de fazer modificações extensas.',
          },
          {
            title: 'Uso educacional:',
            content: 'Este editor de save do hollow knight é fornecido como está para fins educacionais e uso pessoal. Modificar arquivos de save é feito por sua conta e risco. Não somos responsáveis por quaisquer problemas que possam surgir do uso desta ferramenta.',
          },
        ],
        finalWarning: '',
      },
      
      footer: {
        title: 'Editor de Save do Hollow Knight - Ferramenta Online Gratuita',
        disclaimer: 'Hollow Knight é uma marca registrada da Team Cherry. Este editor de save é uma ferramenta independente feita por fãs e não é afiliado ou endossado pela Team Cherry.',
      },
    },
    
    silksong: {
      title: 'Hollow Knight Silksong',
      subtitle: 'Editor de Save',
      metaTitle: 'Editor de Save do Hollow Knight Silksong - Ferramenta Visual Online para PC e Switch',
      metaDescription: 'Editor de save profissional do hollow knight silksong com interface visual. Edite arquivos de save do Silksong para PC e Nintendo Switch. Ferramenta gratuita de editor de save do silksong online.',
      keywords: ['editor de save hollow knight silksong', 'editor de save silksong', 'modificador de save hollow knight silksong'],
      backToHome: '← Voltar à Página Inicial',
      
      headerBadges: {
        complete: 'Editor Visual Completo',
        free: '100% Gratuito',
        secure: 'Totalmente Seguro',
      },
      
      badges: {
        pcSupport: 'Suporte para PC',
        switchSupport: 'Suporte para Switch',
        clientSide: 'Apenas do Lado do Cliente',
      },
      
      upload: {
        dropHint: 'Solte seu arquivo de save do Silksong aqui',
        title: 'Faça Upload do Seu Arquivo de Save',
        description: 'Selecione seu arquivo .dat ou arraste e solte em qualquer lugar desta página',
        selectButton: 'Selecionar Arquivo de Save',
        switchModeLabel: 'Modo Nintendo Switch',
      },
      
      editor: {
        statsTitle: 'Estatísticas e Configurações',
        jsonTitle: 'Dados JSON',
        jsonSearch: 'Pesquisar JSON...',
        jsonError: 'Sintaxe JSON inválida. Verifique vírgulas, colchetes ou aspas ausentes.',
        downloadButtons: {
          saveEncrypted: 'Salvar Criptografado (PC)',
          saveSwitch: 'Salvar Não Criptografado (Switch)',
          saveJson: 'Exportar como JSON',
        },
      },
      
      stats: {
        basic: {
          title: 'Estatísticas Básicas',
          health: 'Saúde',
          silk: 'Seda',
          shards: 'Fragmentos',
          rosaries: 'Rosários',
          playtime: 'Tempo de Jogo',
        },
        tools: {
          title: 'Ferramentas',
          unlockAll: 'Desbloquear Todas as Ferramentas',
        },
        crests: {
          title: 'Emblemas',
          unlockAll: 'Desbloquear Todos os Emblemas',
          slot: 'Slot',
        },
        collectables: {
          title: 'Colecionáveis',
          unlockAll: 'Desbloquear Todos os Colecionáveis',
        },
        relics: {
          title: 'Relíquias',
          statuses: {
            none: 'Nenhum',
            collected: 'Coletado',
            deposited: 'Depositado',
            seen: 'Visto',
          },
        },
        quests: {
          title: 'Missões',
          statuses: {
            notEncountered: 'Não Encontrado',
            seen: 'Visto',
            accepted: 'Aceito',
            completed: 'Completo',
          },
          completedCount: 'Contagem de Concluídos',
        },
        journal: {
          title: 'Bestiário',
          seen: 'Visto',
          kills: 'Mortes',
        },
        quickActions: {
          title: 'Ações Rápidas',
          actions: {
            completeMaps: 'Completar Todos os Mapas',
            unlockFastTravel: 'Desbloquear Toda Viagem Rápida',
            saveFleas: 'Salvar Todas as Pulgas',
          },
        },
      },
      
      about: {
        title: 'Sobre Este Editor de Save do Hollow Knight Silksong',
        content: 'Bem-vindo ao nosso editor de save profissional do hollow knight silksong! Esta ferramenta online gratuita permite que você modifique facilmente seus arquivos de save do Silksong com uma interface visual amigável. Edite as estatísticas de Hornet, desbloqueie ferramentas e habilidades, gerencie Crests, ajuste a moeda e personalize o progresso do seu jogo—sem necessidade de conhecimento de JSON. Nosso editor de save do silksong suporta plataformas PC (Steam, GOG, Epic) e Nintendo Switch.',
        safetyTitle: 'Lembrete de Segurança',
        safetyContent: 'Sempre crie uma cópia de backup dos seus arquivos de save antes de fazer qualquer modificação! Todo o processamento acontece inteiramente em seu navegador—seus dados nunca saem do seu computador, garantindo privacidade e segurança completas com este editor de save do hollow knight silksong.',
      },
      
      locations: {
        title: 'Locais dos Arquivos de Save do Silksong',
        windows: '%USERPROFILE%\\AppData\\LocalLow\\Team Cherry\\Hollow Knight Silksong\\',
        mac: '~/Library/Application Support/unity.Team Cherry.Hollow Knight Silksong/',
        linux: '~/.config/unity3d/Team Cherry/Hollow Knight Silksong/',
        switch: 'Use ferramentas como JKSV ou Checkpoint para extrair dados de save do seu Switch. Certifique-se de ativar o "Modo Nintendo Switch" ao carregar saves do Switch.',
      },
      
      howToUse: {
        title: 'Como Usar Este Editor de Save do Hollow Knight Silksong',
        steps: [
          'Faça backup do seu arquivo de save - Faça uma cópia do seu arquivo .dat original antes de editar',
          'Carregue seu save - Clique em "Selecionar Arquivo de Save" ou arraste e solte seu arquivo .dat',
          'Edite com facilidade - Use a interface visual para modificar estatísticas, desbloquear habilidades, coletar itens e muito mais',
          'Baixe seu save modificado - Clique no botão salvar para baixar seu arquivo .dat editado',
          'Substitua o original - Copie o arquivo baixado de volta para sua pasta de save (feche o jogo primeiro!)',
          'Inicie e divirta-se - Comece Silksong e continue sua aventura com suas modificações',
        ],
      },
      
      features: {
        title: 'Principais Recursos Deste Editor de Save do Silksong',
        visual: {
          title: '✨ Interface Visual',
          desc: 'Não é necessário conhecimento de JSON. Edite tudo através de uma interface intuitiva de apontar e clicar projetada para a experiência do editor de save do silksong.',
        },
        clientSide: {
          title: '🔒 100% do Lado do Cliente',
          desc: 'Todo o processamento acontece em seu navegador. Seus arquivos de save nunca saem do seu computador, garantindo máxima privacidade e segurança.',
        },
        crossPlatform: {
          title: '🎮 Multiplataforma',
          desc: 'Funciona com arquivos de save de PC (Steam, GOG, Epic) e Nintendo Switch. Basta alternar o modo Switch para saves do Switch.',
        },
        comprehensive: {
          title: '⚡ Edição Abrangente',
          desc: 'Modifique saúde, seda, moeda, ferramentas, Crests, colecionáveis, mapas, viagem rápida, missões, relíquias, bestiário—tudo!',
        },
        jsonEditor: {
          title: '🔍 Editor JSON Avançado',
          desc: 'Para usuários avançados: edição JSON direta com funcionalidade de busca e validação em tempo real.',
        },
        free: {
          title: '💯 Gratuito Para Sempre',
          desc: 'Este editor de save do hollow knight silksong é completamente gratuito, sem anúncios, sem registro e sem custos ocultos.',
        },
      },
      
      whyChoose: {
        title: 'Por Que Escolher Este Editor de Save do Hollow Knight Silksong?',
        content: 'Ao contrário de outros editores de save que exigem conhecimento técnico ou downloads arriscados de terceiros, nosso editor de save do hollow knight silksong funciona inteiramente em seu navegador web. Isso significa sem instalação, sem risco de malware e sem curva de aprendizado.',
      },
      
      useCases: {
        title: 'Casos de Uso Comuns Para Este Editor de Save do Silksong',
        items: [
          { title: 'Testar Diferentes Builds', desc: 'Desbloqueie todos os Crests e ferramentas para experimentar vários estilos de jogo sem moer' },
          { title: 'Pular Seções Difíceis', desc: 'Aumente sua saúde e habilidades para superar lutas contra chefes desafiadoras ou seções de plataforma' },
          { title: 'Completar Coleções', desc: 'Desbloqueie todas as entradas do bestiário, relíquias e colecionáveis para conclusão de 100%' },
          { title: 'Recuperar Progresso Perdido', desc: 'Restaure itens ou habilidades perdidos devido a bugs ou erros' },
          { title: 'Preparação para Speedrun', desc: 'Configure condições iniciais ideais para tentativas de speedrun' },
        ],
      },
      
      technical: {
        title: 'Vantagens Técnicas',
        content: 'Nosso editor de save do silksong é construído com tecnologias web modernas para garantir confiabilidade e desempenho. O editor detecta automaticamente se seu arquivo de save é de PC (criptografado) ou Nintendo Switch (não criptografado) e lida com a descriptografia apropriada.',
      },
      
      footer: {
        title: 'Editor de Save do Hollow Knight Silksong - Ferramenta de Editor Visual Completo',
        backLink: 'Voltar para o Editor de Save do Hollow Knight (Original)',
        disclaimer: 'Hollow Knight e Silksong são marcas registradas da Team Cherry. Este editor de save é uma ferramenta independente feita por fãs e não é afiliado ou endossado pela Team Cherry.',
      },
    },
  },
}

