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
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 mb-3">
              Hollow Knight Silksong Save Editor
            </h1>
            <p className="text-lg text-red-200 mb-3">
              Complete Visual Save Editor for Silksong - 100% Free & Secure
            </p>
          </header>

          <div className="bg-gradient-to-br from-red-800/70 to-orange-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-2 border-red-400/60">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
              <button
                onClick={handleFileClick}
                className="px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white text-lg font-bold rounded-2xl transition-all shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 border-2 border-white/20"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Select Save File
                </span>
              </button>

              <label className="flex items-center gap-3 cursor-pointer bg-red-900/60 px-6 py-4 rounded-2xl border-2 border-red-400/50 hover:border-red-300 hover:bg-red-900/80 transition-all">
                <input
                  type="checkbox"
                  checked={switchMode}
                  onChange={(e) => setSwitchMode(e.target.checked)}
                  className="w-5 h-5 text-red-600 bg-red-900 border-red-500 rounded focus:ring-red-500 focus:ring-2"
                />
                <span className="font-semibold text-red-300">Nintendo Switch Mode</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-950/50 border-2 border-red-400 rounded-xl p-4 mb-4">
                <p className="text-red-200 text-center">{error}</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
          </div>

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

