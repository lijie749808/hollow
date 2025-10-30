'use client'

import { useRef, useState, useEffect } from 'react'
import Script from 'next/script'
import { decode, encode, downloadData } from '@/lib/crypto'
import { 
  MASTER_TOOL_LIST, 
  MASTER_CREST_LIST, 
  MASTER_COLLECTABLE_LIST,
  MASTER_RELIC_LIST,
  MASTER_QUEST_LIST,
  MASTER_JOURNAL_LIST,
  CREST_SLOT_INFO, 
  formatLabel, 
  formatPlayTime 
} from '@/lib/silksong-data'

interface SaveData {
  playerData: any
}

export default function SilksongSaveEditor() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saveData, setSaveData] = useState<SaveData | null>(null)
  const [fileName, setFileName] = useState("")
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jsonText, setJsonText] = useState("")
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [switchMode, setSwitchMode] = useState(false)
  const [jsonSearchTerm, setJsonSearchTerm] = useState("")
  const dragIndexRef = useRef(0)

  // Setup global drag and drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDragEnter = (e: DragEvent) => {
      dragIndexRef.current++
      e.preventDefault()
      if (dragIndexRef.current === 1) {
        setDragging(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      if (--dragIndexRef.current === 0) {
        setDragging(false)
      }
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent) => {
      if (dragIndexRef.current > 0) {
        dragIndexRef.current = 0
        setDragging(false)
      }
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0])
      }
      e.preventDefault()
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)

    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [])

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file || !file.name.toLowerCase().endsWith('.dat')) {
      setError("Invalid file type. Please upload a .dat file.")
      return
    }

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = () => {
      const resultBytes = new Uint8Array(reader.result as ArrayBuffer)

      try {
        let decrypted: string
        try {
          decrypted = decode(resultBytes)
        } catch {
          if (switchMode) {
            decrypted = new TextDecoder().decode(resultBytes)
          } else {
            throw new Error("This appears to be a Nintendo Switch save file. Please check the 'Nintendo Switch' mode box and try again.")
          }
        }

        const parsedData = JSON.parse(decrypted)

        setSaveData(parsedData)
        setFileName(file.name)
        setError(null)
        setJsonText(JSON.stringify(parsedData, null, 2))
        setJsonError(null)
      } catch (err: any) {
        console.error("File loading failed:", err)
        const errorMessage = err.message?.includes("Nintendo Switch")
          ? err.message
          : "File decryption failed. The file may be corrupt or not a valid save file."
        setError(errorMessage)
      }
    }
  }

  const updateJsonTextFromState = (updatedSaveData: SaveData) => {
    setSaveData(updatedSaveData)
    setJsonText(JSON.stringify(updatedSaveData, null, 2))
    setJsonError(null)
  }

  const handleNestedChange = (value: any, ...keys: string[]) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    let current: any = newState
    const lastKey = keys[keys.length - 1]
    for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]]
    current[lastKey] = value

    // Sync logic for health and silk
    if (lastKey === 'maxHealth') {
      newState.playerData.health = value
      newState.playerData.maxHealthBase = value
    }
    if (lastKey === 'silkMax') {
      newState.playerData.silk = value
    }

    updateJsonTextFromState(newState)
  }

  const ensureItemExists = (newState: SaveData, section: string, masterList: any[], masterIndex: number, subSection = 'savedData') => {
    const pd = newState.playerData
    const masterItem = masterList[masterIndex]

    if (!pd[section]) {
      pd[section] = { [subSection]: [] }
    }
    let savedDataArray = pd[section][subSection]

    if (!savedDataArray) {
      savedDataArray = pd[section][subSection] = []
    }

    let item = savedDataArray.find((x: any) => x.Name === masterItem.Name)
    if (!item) {
      const newItem = JSON.parse(JSON.stringify(masterItem))
      savedDataArray.push(newItem)
      item = savedDataArray.find((x: any) => x.Name === masterItem.Name)
    }
    return item
  }

  const handleToolChange = (masterIndex: number, field: string, value: any) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const tool = ensureItemExists(newState, 'Tools', MASTER_TOOL_LIST, masterIndex)
    tool.Data[field] = value
    if (field === 'IsUnlocked' && value === true) tool.Data.HasBeenSeen = true
    updateJsonTextFromState(newState)
  }

  const handleCollectableChange = (masterIndex: number, value: any, isEnabling: boolean) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    if (isEnabling) {
      ensureItemExists(newState, 'Collectables', MASTER_COLLECTABLE_LIST, masterIndex)
    } else {
      const collectable = newState.playerData.Collectables?.savedData?.find((c: any) => c.Name === MASTER_COLLECTABLE_LIST[masterIndex].Name)
      if (collectable) collectable.Data.Amount = value
    }
    updateJsonTextFromState(newState)
  }

  const handleCrestChange = (masterIndex: number, value: boolean) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const crest = ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, masterIndex)
    crest.Data.IsUnlocked = value
    crest.Data.DisplayNewIndicator = false
    updateJsonTextFromState(newState)
  }

  const handleCrestSlotChange = (masterIndex: number, slotIndex: number, value: boolean) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const crest = ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, masterIndex)
    if (crest.Data.Slots && crest.Data.Slots[slotIndex]) {
      crest.Data.Slots[slotIndex].IsUnlocked = value
    }
    updateJsonTextFromState(newState)
  }

  const getQuestStatus = (questData: any) => {
    if (!questData) return "not_encountered"
    if (questData.IsCompleted) return "completed"
    if (questData.IsAccepted) return "accepted"
    if (questData.HasBeenSeen) return "seen"
    return "not_encountered"
  }

  const handleQuestChange = (masterIndex: number, newStatus: string) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const quest = ensureItemExists(newState, 'QuestCompletionData', MASTER_QUEST_LIST, masterIndex)
    const questData = quest.Data

    if (newStatus === "seen") {
      questData.HasBeenSeen = true
      questData.IsAccepted = false
      questData.IsCompleted = false
    } else if (newStatus === "accepted") {
      questData.HasBeenSeen = true
      questData.IsAccepted = true
      questData.IsCompleted = false
    } else if (newStatus === "completed") {
      questData.HasBeenSeen = true
      questData.IsAccepted = true
      questData.IsCompleted = true
      questData.WasEverCompleted = true
    }
    updateJsonTextFromState(newState)
  }

  const handleQuestCountChange = (masterIndex: number, count: number) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const quest = ensureItemExists(newState, 'QuestCompletionData', MASTER_QUEST_LIST, masterIndex)
    quest.Data.CompletedCount = count
    updateJsonTextFromState(newState)
  }

  const getRelicStatus = (relicData: any) => {
    if (!relicData) return "none"
    if (relicData.HasSeenInRelicBoard) return "seen"
    if (relicData.IsDeposited) return "deposited"
    if (relicData.IsCollected) return "collected"
    return "none"
  }

  const handleRelicChange = (masterIndex: number, newStatus: string) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    if (newStatus === "none") {
      const masterRelic = MASTER_RELIC_LIST[masterIndex]
      const savedDataArray = newState.playerData.Relics?.savedData
      if (savedDataArray) {
        const itemIndex = savedDataArray.findIndex((x: any) => x.Name === masterRelic.Name)
        if (itemIndex > -1) savedDataArray.splice(itemIndex, 1)
      }
    } else {
      const relic = ensureItemExists(newState, 'Relics', MASTER_RELIC_LIST, masterIndex)
      const relicData = relic.Data
      relicData.IsCollected = false
      relicData.IsDeposited = false
      relicData.HasSeenInRelicBoard = false
      if (newStatus === "collected") relicData.IsCollected = true
      else if (newStatus === "deposited") { relicData.IsCollected = true; relicData.IsDeposited = true }
      else if (newStatus === "seen") { relicData.IsCollected = true; relicData.IsDeposited = true; relicData.HasSeenInRelicBoard = true }
    }
    updateJsonTextFromState(newState)
  }

  const handleJournalEntryChange = (masterIndex: number, hasBeenSeen: boolean) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const entry = ensureItemExists(newState, 'EnemyJournalKillData', MASTER_JOURNAL_LIST, masterIndex, 'list')

    entry.Record.HasBeenSeen = hasBeenSeen
    if (hasBeenSeen && entry.Record.Kills < 1) {
      entry.Record.Kills = 1
    } else if (!hasBeenSeen) {
      entry.Record.Kills = 0
    }

    updateJsonTextFromState(newState)
  }

  const handleJournalKillsChange = (masterIndex: number, kills: number) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const entry = ensureItemExists(newState, 'EnemyJournalKillData', MASTER_JOURNAL_LIST, masterIndex, 'list')

    let newKills = parseInt(String(kills), 10)
    if (isNaN(newKills)) newKills = 1
    if (entry.Record.HasBeenSeen && newKills < 1) {
      newKills = 1
    }

    entry.Record.Kills = newKills
    updateJsonTextFromState(newState)
  }

  const handleSelectAll = (section: string) => {
    if (!saveData) return
    const newState = JSON.parse(JSON.stringify(saveData))
    const pd = newState.playerData

    switch (section) {
      case 'upgrades':
        Object.keys(pd).filter(k => k.startsWith('has') && k !== 'hasJournal' && !k.startsWith('hasPin') && !k.startsWith('hasMarker')).forEach(key => pd[key] = true)
        break
      case 'tools':
        MASTER_TOOL_LIST.forEach((_, index) => {
          const tool = ensureItemExists(newState, 'Tools', MASTER_TOOL_LIST, index)
          tool.Data.IsUnlocked = true
          tool.Data.HasBeenSeen = true
        })
        break
      case 'crest':
        MASTER_CREST_LIST.forEach((_, index) => {
          const crest = ensureItemExists(newState, 'ToolEquips', MASTER_CREST_LIST, index)
          crest.Data.IsUnlocked = true
          if (crest.Data.Slots) crest.Data.Slots.forEach((slot: any) => slot.IsUnlocked = true)
        })
        pd.UnlockedExtraBlueSlot = true
        pd.UnlockedExtraYellowSlot = true
        break
      case 'maps':
        Object.keys(pd).filter(k => (k.startsWith('Has') && k.endsWith('Map')) || k.startsWith('hasPin') || k.startsWith('hasMarker')).forEach(key => pd[key] = true)
        break
      case 'fastTravel':
        Object.keys(pd).filter(k => k.startsWith('Unlocked') || k === 'bellCentipedeAppeared').forEach(key => pd[key] = true)
        break
      case 'savedFleas':
        Object.keys(pd).filter(k => k.startsWith('SavedFlea_')).forEach(key => pd[key] = true)
        break
      default: break
    }
    updateJsonTextFromState(newState)
  }

  const handleJsonTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value)
  }

  const handleJsonBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    try {
      const parsedData = JSON.parse(e.target.value)
      setSaveData(parsedData)
      setJsonError(null)
    } catch {
      setJsonError("Invalid JSON syntax. Check for missing commas, brackets, or quotes.")
    }
  }

  const handleSaveEncrypted = () => {
    if (!saveData || jsonError) return
    try {
      const jsonString = JSON.stringify(saveData)
      downloadData(encode(jsonString), fileName)
    } catch {
      setError("Failed to save the file.")
    }
  }

  const handleSaveSwitch = () => {
    if (!saveData || jsonError) return
    try {
      const jsonString = JSON.stringify(saveData)
      downloadData(jsonString, fileName)
    } catch {
      setError("Failed to save the file.")
    }
  }

  const handleSaveJson = () => {
    if (!saveData || jsonError) return
    try {
      const jsonString = JSON.stringify(saveData, null, 2)
      downloadData(jsonString, fileName.replace('.dat', '.json'))
    } catch {
      setError("Failed to save the JSON file.")
    }
  }

  const pd = saveData?.playerData

  // Generate filtered JSON for display
  let jsonDisplayString = jsonText
  if (jsonSearchTerm.trim() !== "") {
    jsonDisplayString = jsonText.split('\n').filter(line => line.toLowerCase().includes(jsonSearchTerm.toLowerCase())).join('\n')
  }

  // Generate key lists
  const upgradeKeys = pd ? Object.keys(pd).filter(k => k.startsWith('has') && k !== 'hasJournal' && !k.startsWith('hasPin') && !k.startsWith('hasMarker')) : []
  const mapKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Has') && k.endsWith('Map')) : []
  const fastTravelKeys = pd ? Object.keys(pd).filter(k => k.startsWith('Unlocked') && !k.includes('Slot')) : []
  const savedFleaKeys = pd ? Object.keys(pd).filter(k => k.startsWith('SavedFlea_')) : []

  return (
    <>
      <Script
        id="silksong-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Hollow Knight Silksong Save Editor",
            "applicationCategory": "Game",
            "operatingSystem": "All (Web-based)",
            "description": "Professional hollow knight silksong save editor for PC and Nintendo Switch. Edit Silksong save files with visual interface. Free online silksong save editor tool.",
            "keywords": "hollow knight silksong save editor, silksong save editor, hollow knight silksong save modifier"
          })
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900">
        {dragging && (
          <div className="fixed inset-0 bg-red-500/30 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-red-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <div className="text-2xl font-bold text-white">Drop your Silksong save file here</div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-orange-300 to-amber-300 mb-4 drop-shadow-2xl tracking-tight">
                Hollow Knight Silksong
              </h1>
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 mb-6">
                Save Editor
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-red-200/90 text-base sm:text-lg">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Complete Visual Editor</span>
              <span className="text-red-400">•</span>
              <span className="font-medium">100% Free</span>
              <span className="text-red-400">•</span>
              <span className="font-medium">Fully Secure</span>
            </div>
          </header>

          <div className="relative mb-8">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-red-600/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-gradient-to-br from-red-900/90 via-orange-900/80 to-red-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-red-400/30">
              {/* Platform badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full text-blue-200 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                  </svg>
                  PC Support
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/50 rounded-full text-red-200 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                  Switch Support
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/50 rounded-full text-purple-200 text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Client-Side Only
                </div>
              </div>

              {/* Main upload area */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Upload Your Save File</h3>
                  <p className="text-red-200/80 text-sm max-w-md mx-auto">
                    Select your .dat save file or drag and drop it anywhere on this page
                  </p>
                </div>

                <button
                  onClick={handleFileClick}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:from-red-600 hover:via-orange-600 hover:to-red-600 text-white text-lg font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 active:scale-95 border-2 border-white/20"
                >
                  <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Select Save File</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>

                {/* Switch mode toggle */}
                <div className="flex justify-center">
                  <label className="group relative flex items-center gap-4 cursor-pointer bg-gradient-to-r from-red-900/60 to-orange-900/60 hover:from-red-900/80 hover:to-orange-900/80 px-6 py-3 rounded-xl border-2 border-red-400/40 hover:border-red-300/60 transition-all duration-300 shadow-lg hover:shadow-xl">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={switchMode}
                        onChange={(e) => setSwitchMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-red-950/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-300 group-hover:text-red-200" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-red-200">Nintendo Switch Mode</span>
                    </div>
                  </label>
                </div>
              </div>

              {error && (
                <div className="mt-6 bg-red-950/80 border-2 border-red-400/80 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-200 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
          </div>

          {!saveData && (
            <>
              {/* About Section */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-orange-600/10 rounded-2xl blur-lg"></div>
                <div className="relative bg-gradient-to-br from-red-900/40 via-orange-900/30 to-red-900/40 backdrop-blur-md rounded-2xl p-8 border border-red-400/40 shadow-xl">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-200 to-orange-200 bg-clip-text text-transparent">
                        About This Hollow Knight Silksong Save Editor
                      </h2>
                      <p className="text-red-100/90 leading-relaxed text-base">
                        Welcome to our professional <strong className="text-red-300 font-semibold">hollow knight silksong save editor</strong>! This free online tool lets you easily modify your Silksong save files with a user-friendly visual interface. Edit Hornet's stats, unlock tools and abilities, manage Crests, adjust currency, and customize your game progression—no JSON knowledge required. Our <strong className="text-red-300 font-semibold">silksong save editor</strong> supports both PC (Steam, GOG, Epic) and Nintendo Switch platforms.
                      </p>
                    </div>
                  </div>
                  
                  {/* Safety Warning */}
                  <div className="relative bg-gradient-to-r from-yellow-900/50 via-amber-900/40 to-yellow-900/50 rounded-xl p-5 border-2 border-yellow-500/50 shadow-lg">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full text-xs font-bold text-yellow-950 shadow-md">
                      IMPORTANT
                    </div>
                    <div className="flex items-start gap-4 mt-1">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-200 mb-2">Safety Reminder</h3>
                        <p className="text-yellow-100/90 text-sm leading-relaxed">
                          Always create a backup copy of your save files before making any modifications! All processing happens entirely in your browser—your data never leaves your computer, ensuring complete privacy and security with this <strong className="text-yellow-200 font-semibold">hollow knight silksong save editor</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Silksong Save File Locations */}
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Silksong Save File Locations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">🖥️ PC (Windows)</h3>
                    <p className="text-red-100 font-mono text-sm bg-red-950/50 p-3 rounded">
                      %USERPROFILE%\AppData\LocalLow\Team Cherry\Hollow Knight Silksong\
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">🍎 macOS</h3>
                    <p className="text-red-100 font-mono text-sm bg-red-950/50 p-3 rounded">
                      ~/Library/Application Support/unity.Team Cherry.Hollow Knight Silksong/
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">🐧 Linux</h3>
                    <p className="text-red-100 font-mono text-sm bg-red-950/50 p-3 rounded">
                      ~/.config/unity3d/Team Cherry/Hollow Knight Silksong/
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-300 mb-2">🎮 Nintendo Switch</h3>
                    <p className="text-red-100 text-sm">
                      Use tools like JKSV or Checkpoint to extract save data from your Switch. Make sure to enable "Nintendo Switch Mode" when uploading Switch saves.
                    </p>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">How to Use This Hollow Knight Silksong Save Editor</h2>
                <ol className="list-decimal list-inside space-y-3 text-red-100">
                  <li className="leading-relaxed">
                    <strong className="text-red-300">Backup your save file</strong> - Make a copy of your original .dat file before editing
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-red-300">Upload your save</strong> - Click "Select Save File" or drag and drop your .dat file
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-red-300">Edit with ease</strong> - Use the visual interface to modify stats, unlock abilities, collect items, and more
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-red-300">Download your modified save</strong> - Click the save button to download your edited .dat file
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-red-300">Replace the original</strong> - Copy the downloaded file back to your save folder (close the game first!)
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-red-300">Launch and enjoy</strong> - Start Silksong and continue your adventure with your modifications
                  </li>
                </ol>
              </div>

              {/* Key Features */}
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Key Features of This Silksong Save Editor</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-950/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">✨ Visual Interface</h3>
                    <p className="text-red-100 text-sm">No JSON knowledge required. Edit everything through an intuitive point-and-click interface designed for the <strong>silksong save editor</strong> experience.</p>
                  </div>
                  <div className="p-4 bg-red-950/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">🔒 100% Client-Side</h3>
                    <p className="text-red-100 text-sm">All processing happens in your browser. Your save files never leave your computer, ensuring maximum privacy and security.</p>
                  </div>
                  <div className="p-4 bg-red-950/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">🎮 Cross-Platform</h3>
                    <p className="text-red-100 text-sm">Works with PC (Steam, GOG, Epic) and Nintendo Switch save files. Just toggle Switch mode for Switch saves.</p>
                  </div>
                  <div className="p-4 bg-red-950/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">⚡ Comprehensive Editing</h3>
                    <p className="text-red-100 text-sm">Modify health, silk, currency, tools, Crests, collectables, maps, fast travel, quests, relics, bestiary—everything!</p>
                  </div>
                  <div className="p-4 bg-red-950/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">🔍 Advanced JSON Editor</h3>
                    <p className="text-red-100 text-sm">For power users: direct JSON editing with search functionality and real-time validation.</p>
                  </div>
                  <div className="p-4 bg-red-950/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">💯 Free Forever</h3>
                    <p className="text-red-100 text-sm">This <strong>hollow knight silksong save editor</strong> is completely free with no ads, no registration, and no hidden costs.</p>
                  </div>
                </div>
              </div>

              {/* Why Choose */}
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Why Choose This Hollow Knight Silksong Save Editor?</h2>
                <p className="text-red-100 mb-4 leading-relaxed">
                  Unlike other save editors that require technical knowledge or risky third-party downloads, our <strong className="text-red-300">hollow knight silksong save editor</strong> runs entirely in your web browser. This means no installation, no malware risk, and no learning curve. Whether you want to experiment with different builds, recover from a difficult section, or simply customize your experience, this tool makes it easy. Our editor supports the complete range of Silksong's game systems including the Crest equipment system, tool upgrades, quest tracking, relic collection, and the comprehensive bestiary—all accessible through an elegant visual interface.
                </p>
              </div>

              {/* Common Use Cases */}
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases for This Silksong Save Editor</h2>
                <ul className="space-y-3 text-red-100">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">•</span>
                    <span><strong className="text-red-300">Test Different Builds:</strong> Unlock all Crests and tools to experiment with various playstyles without grinding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">•</span>
                    <span><strong className="text-red-300">Skip Difficult Sections:</strong> Increase your health and abilities to overcome challenging boss fights or platforming sections</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">•</span>
                    <span><strong className="text-red-300">Complete Collections:</strong> Unlock all bestiary entries, relics, and collectables for 100% completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">•</span>
                    <span><strong className="text-red-300">Recover Lost Progress:</strong> Restore items or abilities lost due to bugs or mistakes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">•</span>
                    <span><strong className="text-red-300">Speed Run Preparation:</strong> Set up ideal starting conditions for speed run attempts</span>
                  </li>
                </ul>
              </div>

              {/* Technical Advantages */}
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-red-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">Technical Advantages</h2>
                <p className="text-red-100 mb-4 leading-relaxed">
                  Our <strong className="text-red-300">silksong save editor</strong> is built with modern web technologies to ensure reliability and performance. The editor automatically detects whether your save file is from PC (encrypted) or Nintendo Switch (unencrypted) and handles the appropriate decryption. All changes are validated in real-time, preventing corruption of your save files. The visual editor syncs bidirectionally with the JSON editor, allowing you to switch between visual and code-based editing seamlessly. Export options include both game-ready .dat files and human-readable .json files for further analysis or backup purposes.
                </p>
              </div>
            </>
          )}

          {saveData && (
            <>
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border border-green-500/50">
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    onClick={handleSaveJson}
                    disabled={!!jsonError}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xl"
                  >
                    Save .json
                  </button>
                  <button
                    onClick={handleSaveEncrypted}
                    disabled={!!jsonError}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl transition-all shadow-xl"
                  >
                    {switchMode ? 'Save PC Format (.dat)' : 'Save & Download (.dat)'}
                  </button>
                  {switchMode && (
                    <button
                      onClick={handleSaveSwitch}
                      disabled={!!jsonError}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl transition-all shadow-xl"
                    >
                      Save Switch Format
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Stats */}
                <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                  <h2 className="text-3xl font-bold text-white mb-4">Basic Stats</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-red-200 mb-2">Health</label>
                      <input
                        type="number"
                        value={pd?.maxHealth || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'maxHealth')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Silk</label>
                      <input
                        type="number"
                        value={pd?.silkMax || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'silkMax')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Silk Regen Max</label>
                      <input
                        type="number"
                        value={pd?.silkRegenMax || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'silkRegenMax')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Rosaries</label>
                      <input
                        type="number"
                        value={pd?.geo || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'geo')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Shell Shards</label>
                      <input
                        type="number"
                        value={pd?.ShellShards || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'ShellShards')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Play Time (seconds)</label>
                      <input
                        type="number"
                        value={pd?.playTime || 0}
                        onChange={(e) => handleNestedChange(parseFloat(e.target.value) || 0, 'playerData', 'playTime')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-xs text-red-300 mt-1 block">
                        {formatPlayTime(pd?.playTime || 0)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Completion %</label>
                      <input
                        type="number"
                        value={pd?.completionPercentage || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'completionPercentage')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Needle Upgrades (0-4)</label>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        value={pd?.nailUpgrades || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'nailUpgrades')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-6 mb-3">Cheats</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pd?.infiniteAirJump || false}
                      onChange={(e) => handleNestedChange(e.target.checked, 'playerData', 'infiniteAirJump')}
                      className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                    />
                    <span className="text-red-200">Infinite Air Jump</span>
                  </label>
                </div>

                {/* Upgrades */}
                <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-white">Upgrades</h2>
                    <button
                      onClick={() => handleSelectAll('upgrades')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-red-200 mb-2">Heart Pieces</label>
                      <input
                        type="number"
                        value={pd?.heartPieces || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'heartPieces')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-red-200 mb-2">Silk Spool Parts</label>
                      <input
                        type="number"
                        value={pd?.silkSpoolParts || 0}
                        onChange={(e) => handleNestedChange(parseInt(e.target.value) || 0, 'playerData', 'silkSpoolParts')}
                        className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {upgradeKeys.map(key => (
                      <label key={key} className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
                        <input
                          type="checkbox"
                          checked={pd?.[key] || false}
                          onChange={(e) => handleNestedChange(e.target.checked, 'playerData', key)}
                          className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-red-200 text-sm">{formatLabel(key)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                {pd?.Tools && (
                  <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-3xl font-bold text-white">Tools</h2>
                      <button
                        onClick={() => handleSelectAll('tools')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MASTER_TOOL_LIST.map((masterTool, masterIndex) => {
                        const currentTool = pd.Tools.savedData?.find((t: any) => t.Name === masterTool.Name)
                        const isEnabled = !!currentTool
                        const isUnlocked = isEnabled && currentTool.Data.IsUnlocked
                        const hasAmount = masterTool.Data.AmountLeft > 0

                        return (
                          <div key={masterTool.Name} className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-500/30">
                            <input
                              type="checkbox"
                              checked={isUnlocked}
                              onChange={(e) => handleToolChange(masterIndex, 'IsUnlocked', e.target.checked)}
                              className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                            />
                            <label className="flex-1 text-red-200 text-sm">{masterTool.Name}</label>
                            {hasAmount && (
                              <input
                                type="number"
                                disabled={!isEnabled}
                                value={isEnabled ? currentTool.Data.AmountLeft : ''}
                                onChange={(e) => handleToolChange(masterIndex, 'AmountLeft', parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-red-950/50 border border-red-500/50 rounded text-white text-sm"
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Crest */}
                {pd?.ToolEquips && (
                  <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-3xl font-bold text-white">Crest System</h2>
                      <button
                        onClick={() => handleSelectAll('crest')}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="mb-4 p-4 bg-red-950/30 rounded-lg border border-red-500/30">
                      <div className="flex gap-4 text-sm flex-wrap">
                        <span className="text-red-300">Slot Colors:</span>
                        <span className="text-red-500 font-bold">Red (Weapons)</span>
                        <span className="text-blue-400 font-bold">Blue (Defense)</span>
                        <span className="text-yellow-400 font-bold">Yellow (Exploration)</span>
                        <span className="text-white font-bold">White (Skills)</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <label className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
                        <input
                          type="checkbox"
                          checked={pd?.UnlockedExtraBlueSlot || false}
                          onChange={(e) => handleNestedChange(e.target.checked, 'playerData', 'UnlockedExtraBlueSlot')}
                          className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-red-200">Unlocked Extra Blue Slot</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
                        <input
                          type="checkbox"
                          checked={pd?.UnlockedExtraYellowSlot || false}
                          onChange={(e) => handleNestedChange(e.target.checked, 'playerData', 'UnlockedExtraYellowSlot')}
                          className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-red-200">Unlocked Extra Yellow Slot</span>
                      </label>
                    </div>
                    <div className="space-y-4">
                      {MASTER_CREST_LIST.map((masterCrest, masterIndex) => {
                        const currentCrest = pd.ToolEquips.savedData?.find((c: any) => c.Name === masterCrest.Name)
                        const isEnabled = !!currentCrest
                        const slotTypes = CREST_SLOT_INFO[masterCrest.Name] || []

                        return (
                          <div key={masterCrest.Name} className="p-4 bg-red-950/30 rounded-lg border border-red-500/30">
                            <div className="flex items-center gap-3 mb-3">
                              <input
                                type="checkbox"
                                checked={isEnabled && currentCrest.Data.IsUnlocked}
                                onChange={(e) => handleCrestChange(masterIndex, e.target.checked)}
                                className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                              />
                              <label className="text-lg font-semibold text-red-200">{masterCrest.Name.replace(/_/g, ' ')}</label>
                            </div>
                            {masterCrest.Data.Slots && masterCrest.Data.Slots.length > 0 && (
                              <div className="ml-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {masterCrest.Data.Slots.map((_, slotIndex) => {
                                  const slotColor = slotTypes[slotIndex] || 'Unknown'
                                  const colorClass = 
                                    slotColor === 'Red' ? 'text-red-500' :
                                    slotColor === 'Blue' ? 'text-blue-400' :
                                    slotColor === 'Yellow' ? 'text-yellow-400' :
                                    'text-white'

                                  return (
                                    <label key={slotIndex} className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        disabled={!isEnabled}
                                        checked={isEnabled && currentCrest.Data.Slots && currentCrest.Data.Slots[slotIndex]?.IsUnlocked}
                                        onChange={(e) => handleCrestSlotChange(masterIndex, slotIndex, e.target.checked)}
                                        className="w-4 h-4 text-red-600 bg-red-900 border-red-500 rounded"
                                      />
                                      <span className={colorClass}>
                                        Slot {slotIndex + 1} ({slotColor})
                                      </span>
                                    </label>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Collectables */}
                {pd?.Collectables && (
                  <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                    <h2 className="text-3xl font-bold text-white mb-4">Collectables</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {MASTER_COLLECTABLE_LIST.map((masterCollectable, masterIndex) => {
                        const currentCollectable = pd.Collectables.savedData?.find((c: any) => c.Name === masterCollectable.Name)
                        const isEnabled = !!currentCollectable

                        return (
                          <div key={masterCollectable.Name} className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-500/30">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) => handleCollectableChange(masterIndex, isEnabled ? 0 : 1, e.target.checked)}
                              className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                            />
                            <label className="flex-1 text-red-200 text-sm">{masterCollectable.Name.replace(/_/g, ' ')}</label>
                            <input
                              type="number"
                              disabled={!isEnabled}
                              value={isEnabled ? currentCollectable.Data.Amount : ''}
                              onChange={(e) => handleCollectableChange(masterIndex, parseInt(e.target.value) || 0, false)}
                              className="w-16 px-2 py-1 bg-red-950/50 border border-red-500/50 rounded text-white text-sm"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Maps */}
                <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-white">Maps</h2>
                    <button
                      onClick={() => handleSelectAll('maps')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3 mb-4">
                    {mapKeys.map(key => (
                      <label key={key} className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
                        <input
                          type="checkbox"
                          checked={pd?.[key] || false}
                          onChange={(e) => handleNestedChange(e.target.checked, 'playerData', key)}
                          className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-red-200 text-sm">{formatLabel(key.replace('Has', '').replace('Map', ' Map'))}</span>
                      </label>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 p-3 bg-red-950/30 rounded-lg border border-red-500/30">
                    <input
                      type="checkbox"
                      checked={pd?.mapAllRooms || false}
                      onChange={(e) => handleNestedChange(e.target.checked, 'playerData', 'mapAllRooms')}
                      className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                    />
                    <span className="text-red-200 font-semibold">All Rooms Mapped</span>
                  </label>
                </div>

                {/* Fast Travel */}
                <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-white">Fast Travel</h2>
                    <button
                      onClick={() => handleSelectAll('fastTravel')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {fastTravelKeys.map(key => (
                      <label key={key} className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
                        <input
                          type="checkbox"
                          checked={pd?.[key] || false}
                          onChange={(e) => handleNestedChange(e.target.checked, 'playerData', key)}
                          className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-red-200 text-sm">{formatLabel(key)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fleas */}
                <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-white">Saved Fleas</h2>
                    <button
                      onClick={() => handleSelectAll('savedFleas')}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Select All
                    </button>
                  </div>
                  <div className="grid md:grid-cols-4 gap-3">
                    {savedFleaKeys.map(key => (
                      <label key={key} className="flex items-center gap-2 p-2 bg-red-950/30 rounded-lg border border-red-500/30">
                        <input
                          type="checkbox"
                          checked={pd?.[key] || false}
                          onChange={(e) => handleNestedChange(e.target.checked, 'playerData', key)}
                          className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                        />
                        <span className="text-red-200 text-sm">{key.substring('SavedFlea_'.length).replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Relics */}
                {pd?.Relics && (
                  <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                    <h2 className="text-3xl font-bold text-white mb-4">Relics</h2>
                    <div className="space-y-3">
                      {MASTER_RELIC_LIST.map((masterRelic, masterIndex) => {
                        const currentRelic = pd.Relics.savedData?.find((r: any) => r.Name === masterRelic.Name)
                        const status = getRelicStatus(currentRelic?.Data)

                        return (
                          <div key={masterRelic.Name} className="p-4 bg-red-950/30 rounded-lg border border-red-500/30">
                            <div className="text-red-200 font-semibold mb-2">{masterRelic.Name.replace(/_/g, ' ')}</div>
                            <div className="flex gap-3 flex-wrap">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`relic-${masterIndex}`}
                                  checked={status === "none"}
                                  onChange={() => handleRelicChange(masterIndex, "none")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">None</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`relic-${masterIndex}`}
                                  checked={status === "collected"}
                                  onChange={() => handleRelicChange(masterIndex, "collected")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Collected</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`relic-${masterIndex}`}
                                  checked={status === "deposited"}
                                  onChange={() => handleRelicChange(masterIndex, "deposited")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Deposited</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`relic-${masterIndex}`}
                                  checked={status === "seen"}
                                  onChange={() => handleRelicChange(masterIndex, "seen")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Seen</span>
                              </label>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Quests */}
                {pd?.QuestCompletionData && (
                  <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                    <h2 className="text-3xl font-bold text-white mb-4">Quests</h2>
                    <div className="space-y-3">
                      {MASTER_QUEST_LIST.map((masterQuest, masterIndex) => {
                        const currentQuest = pd.QuestCompletionData.savedData?.find((q: any) => q.Name === masterQuest.Name)
                        const status = getQuestStatus(currentQuest?.Data)
                        const hasCount = masterQuest.Data.CompletedCount > 0 || (currentQuest && currentQuest.Data.CompletedCount > 0)

                        return (
                          <div key={masterQuest.Name} className="p-4 bg-red-950/30 rounded-lg border border-red-500/30">
                            <div className="text-red-200 font-semibold mb-2">{masterQuest.Name.replace(/_/g, ' ')}</div>
                            <div className="flex gap-3 flex-wrap items-center">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`quest-${masterIndex}`}
                                  checked={status === "not_encountered"}
                                  onChange={() => handleQuestChange(masterIndex, "seen")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Not Encountered</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`quest-${masterIndex}`}
                                  checked={status === "seen"}
                                  onChange={() => handleQuestChange(masterIndex, "seen")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Seen</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`quest-${masterIndex}`}
                                  checked={status === "accepted"}
                                  onChange={() => handleQuestChange(masterIndex, "accepted")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Accepted</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`quest-${masterIndex}`}
                                  checked={status === "completed"}
                                  onChange={() => handleQuestChange(masterIndex, "completed")}
                                  className="w-4 h-4 text-red-600"
                                />
                                <span className="text-red-200 text-sm">Completed</span>
                              </label>
                              {hasCount && currentQuest && (
                                <input
                                  type="number"
                                  value={currentQuest.Data.CompletedCount || 0}
                                  onChange={(e) => handleQuestCountChange(masterIndex, parseInt(e.target.value) || 0)}
                                  className="w-20 px-2 py-1 bg-red-950/50 border border-red-500/50 rounded text-white text-sm"
                                  placeholder="Count"
                                />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Bestiary */}
                {pd?.EnemyJournalKillData && (
                  <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                    <h2 className="text-3xl font-bold text-white mb-4">Bestiary</h2>
                    <label className="flex items-center gap-2 p-3 bg-red-950/30 rounded-lg border border-red-500/30 mb-4">
                      <input
                        type="checkbox"
                        checked={pd?.hasJournal || false}
                        onChange={(e) => handleNestedChange(e.target.checked, 'playerData', 'hasJournal')}
                        className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                      />
                      <span className="text-red-200 font-semibold">Has Journal</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {MASTER_JOURNAL_LIST.map((masterEntry, masterIndex) => {
                        const currentEntry = pd.EnemyJournalKillData.list?.find((e: any) => e.Name === masterEntry.Name)
                        const isEnabled = !!currentEntry && currentEntry.Record.HasBeenSeen
                        const kills = currentEntry ? currentEntry.Record.Kills : 0

                        return (
                          <div key={masterEntry.Name} className="flex items-center gap-3 p-3 bg-red-950/30 rounded-lg border border-red-500/30">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) => handleJournalEntryChange(masterIndex, e.target.checked)}
                              className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500"
                            />
                            <label className="flex-1 text-red-200 text-sm">{masterEntry.Name}</label>
                            <input
                              type="number"
                              disabled={!isEnabled}
                              value={isEnabled ? kills : ''}
                              onChange={(e) => handleJournalKillsChange(masterIndex, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 bg-red-950/50 border border-red-500/50 rounded text-white text-sm"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* JSON Editor */}
                <div className="bg-red-900/40 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-500/50">
                  <h2 className="text-3xl font-bold text-white mb-4">Advanced JSON Editor</h2>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search JSON..."
                      value={jsonSearchTerm}
                      onChange={(e) => setJsonSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 bg-red-950/50 border border-red-500/50 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <p className="text-red-200 mb-4 text-sm">
                    {jsonSearchTerm.trim() !== "" ? "Editing is disabled while searching. Clear search to edit." : "For advanced users: directly edit the JSON data below. Changes will sync with the visual editor above."}
                  </p>
                  {jsonError && (
                    <div className="bg-red-950 border-2 border-red-400 rounded-lg p-3 mb-4">
                      <p className="text-red-200">{jsonError}</p>
                    </div>
                  )}
                  <textarea
                    value={jsonSearchTerm.trim() !== "" ? jsonDisplayString : jsonText}
                    onChange={handleJsonTextChange}
                    onBlur={handleJsonBlur}
                    readOnly={jsonSearchTerm.trim() !== ""}
                    spellCheck="false"
                    className="w-full h-96 px-4 py-3 bg-red-950/50 border border-red-500/50 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-red-500 resize-y"
                    style={{ opacity: jsonSearchTerm.trim() !== "" ? 0.7 : 1 }}
                  />
                </div>
              </div>
            </>
          )}

          <footer className="text-center text-red-300 py-8 border-t border-red-500/30 mt-8">
            <p className="mb-4 text-lg">
              <strong className="text-white">Hollow Knight Silksong Save Editor</strong> - Complete Visual Editor Tool
            </p>
            <p className="text-sm text-red-400 mb-4">
              Back to <a href="/" className="text-red-300 hover:text-red-200 underline">Hollow Knight (Original) Save Editor</a>
            </p>
            <p className="text-xs text-red-400">
              Hollow Knight and Silksong are trademarks of Team Cherry. This save editor is an independent fan-made tool and is not affiliated with or endorsed by Team Cherry.
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}

