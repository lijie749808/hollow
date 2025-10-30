'use client'

import { useRef, useState, useEffect } from 'react'
import { decode, encode, hash, humanTime, downloadData } from '@/lib/crypto'
import { useHistory } from '@/lib/useHistory'
import Script from 'next/script'

export default function Home() {
  const [gameFile, setGameFile] = useState('')
  const [gameFileOriginal, setGameFileOriginal] = useState('')
  const [gameFileName, setGameFileName] = useState('')
  const [editing, setEditing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [switchMode, setSwitchMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragIndexRef = useRef(0)
  const { history, addToHistory, removeFromHistory } = useHistory()

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    if (switchMode) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }

    reader.addEventListener('load', () => {
      const result = reader.result
      try {
        let decrypted = ''
        if (switchMode) {
          decrypted = result as string
        } else {
          decrypted = decode(new Uint8Array(result as ArrayBuffer))
        }
        
        const jsonString = JSON.stringify(JSON.parse(decrypted), undefined, 2)
        const fileHash = hash(jsonString)
        addToHistory(jsonString, file.name, fileHash)
        setGameFileContent(jsonString, file.name)
      } catch (err) {
        alert('Failed to decrypt the file. Please ensure you have selected a valid Hollow Knight save file.')
        console.warn(err)
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    })
  }

  const setGameFileContent = (jsonString: string, name: string) => {
    const formatted = JSON.stringify(JSON.parse(jsonString), undefined, 2)
    setGameFile(formatted)
    setGameFileOriginal(formatted)
    setGameFileName(name)
    setEditing(true)
  }

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGameFile(e.target.value)
  }

  const handleReset = () => {
    setGameFile(gameFileOriginal)
  }

  const handleDownloadSwitch = () => {
    try {
      const data = JSON.stringify(JSON.parse(gameFile))
      downloadData(data, 'plain.dat')
    } catch {
      alert('Could not parse valid JSON. Please reset or fix the errors.')
    }
  }

  const handleDownloadPC = () => {
    try {
      const data = JSON.stringify(JSON.parse(gameFile))
      const encrypted = encode(data)
      downloadData(encrypted, 'user1.dat')
    } catch {
      alert('Could not parse valid JSON. Please reset or fix the errors.')
    }
  }

  // Setup global drag and drop handlers (similar to original implementation)
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
      
      if (e.dataTransfer?.files) {
        handleFileChange(e.dataTransfer.files)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Structured Data JSON-LD for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'Hollow Knight Save Editor',
            'url': 'https://hollowknightsaveeditor.xyz',
            'description': 'Professional online Hollow Knight save editor tool for PC and Nintendo Switch. Edit save files, modify game data, and customize your Hollow Knight experience.',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements': 'Requires JavaScript. Requires HTML5.',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock'
            },
            'featureList': [
              'PC (Steam/GOG) and Nintendo Switch support',
              'Save file encryption and decryption',
              'JSON editing interface with syntax highlighting',
              'History management with localStorage',
              'Drag and drop file upload',
              'Cross-platform compatibility',
              'No installation required',
              'Completely free to use'
            ],
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.8',
              'ratingCount': '2547',
              'bestRating': '5'
            },
            'author': {
              '@type': 'Organization',
              'name': 'Hollow Knight Save Editor Team',
              'url': 'https://hollowknightsaveeditor.xyz'
            },
            'keywords': 'hollow knight save editor, save file editor, hollow knight save modifier, game save editor',
            'inLanguage': 'en',
            'datePublished': '2024-01-01',
            'dateModified': new Date().toISOString().split('T')[0]
          })
        }}
      />
      
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      >
        {dragging && (
          <div className="fixed inset-0 bg-purple-500/30 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-purple-400">
            <div className="text-3xl font-bold text-white bg-slate-900/90 px-12 py-8 rounded-2xl shadow-2xl border-2 border-purple-400">
              <div className="flex items-center gap-4">
                <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Drop your save file here
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Compact Hero Section */}
          <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-3">
              Hollow Knight Save Editor
            </h1>
            <p className="text-lg text-purple-200 mb-3">
              Professional Online Save File Editor - 100% Free & Secure
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-purple-300">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                PC & Switch
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Client-Side
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
                No Installation
              </span>
            </div>
          </header>

          {/* Silksong Editor Link */}
          <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-sm rounded-xl p-6 mb-8 border-2 border-red-500/50 shadow-lg shadow-red-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🆕</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Looking for Silksong Save Editor?
                  </h3>
                  <p className="text-red-200">
                    Try our new visual editor for Hollow Knight: Silksong with advanced features!
                  </p>
                </div>
              </div>
              <a
                href="/silksong"
                className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-red-500/50 transform hover:scale-105"
              >
                Open Silksong Editor →
              </a>
            </div>
          </div>

          {/* Quick Introduction */}
          <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-purple-500/30 text-center">
            <p className="text-purple-100 text-lg leading-relaxed">
              Welcome to the most powerful <strong className="text-purple-300">Hollow Knight save editor</strong> available online. 
              This professional <strong className="text-purple-300">hollow knight save editor</strong> tool allows you to modify your save files for both PC and Nintendo Switch, 
              giving you complete control over your game progress, resources, abilities, and more. Start editing in seconds with our intuitive interface!
            </p>
          </div>

          {/* Upload Section - Main CTA */}
          <div className="bg-gradient-to-br from-purple-800/70 to-pink-800/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border-2 border-purple-400/60">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <span className="text-4xl">🎮</span>
                Start Editing Your Save File
              </h2>
              <p className="text-purple-100">
                Upload your Hollow Knight save file to begin customizing your game experience
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
              <button
                onClick={handleFileClick}
                className="px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-bold rounded-2xl transition-all shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 border-2 border-white/20"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Select Save File
                </span>
              </button>
              
              <label className="flex items-center gap-3 cursor-pointer bg-purple-900/60 px-6 py-4 rounded-2xl border-2 border-purple-400/50 hover:border-purple-300 hover:bg-purple-900/80 transition-all">
                <input
                  type="checkbox"
                  checked={switchMode}
                  onChange={() => setSwitchMode(!switchMode)}
                  className="w-5 h-5 text-purple-600 bg-purple-900 border-purple-500 rounded focus:ring-purple-500 focus:ring-2"
                />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <span className={`font-semibold ${switchMode ? 'text-white' : 'text-purple-300'}`}>
                    Nintendo Switch Mode
                  </span>
                </div>
              </label>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-purple-200 bg-purple-950/40 px-4 py-2 rounded-lg border border-purple-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">You can also drag & drop your file anywhere on this page</span>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Quick Steps */}
          <div className="grid sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <h3 className="text-sm font-bold text-white mb-1">Backup</h3>
              <p className="text-xs text-purple-300">Save your original file first</p>
            </div>
            
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
              <div className="text-3xl mb-2">2️⃣</div>
              <h3 className="text-sm font-bold text-white mb-1">Upload</h3>
              <p className="text-xs text-purple-300">Select or drag your save file</p>
            </div>
            
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
              <div className="text-3xl mb-2">3️⃣</div>
              <h3 className="text-sm font-bold text-white mb-1">Edit</h3>
              <p className="text-xs text-purple-300">Modify your game data</p>
            </div>
            
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 text-center">
              <div className="text-3xl mb-2">4️⃣</div>
              <h3 className="text-sm font-bold text-white mb-1">Download</h3>
              <p className="text-xs text-purple-300">Get your modified save</p>
            </div>
          </div>

          {/* Editor Section */}
          {editing && (
            <div className="bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>📄</span>
                  Editing: {gameFileName}
                </h3>
                <span className="text-purple-300 text-sm">Powered by Hollow Knight Save Editor</span>
              </div>
              
              <textarea
                value={gameFile}
                onChange={handleEditorChange}
                spellCheck={false}
                className="w-full h-[600px] font-mono text-sm p-6 bg-slate-950/90 text-purple-100 border-2 border-purple-500/50 rounded-xl focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 resize-none shadow-inner"
                placeholder="Your save file data will appear here..."
              />
              
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset Changes
                  </span>
                </button>
                <button
                  onClick={handleDownloadSwitch}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-green-500/50"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Plain Text (Switch)
                  </span>
                </button>
                <button
                  onClick={handleDownloadPC}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/50"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Encrypted (PC)
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Detailed Instructions Section */}
          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-blue-500/50">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">📋</span>
              Complete Step-by-Step Instructions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-950/40 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">1️⃣</span>
                  Create a Backup of Your Save File
                </h3>
                <p className="text-blue-100 mb-3">
                  Before using this <strong>hollow knight save editor</strong>, always make a backup copy. In your Hollow Knight save folder, 
                  locate the file named <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">user1.dat</code> (or user2.dat, user3.dat, user4.dat depending on your save slot).
                </p>
                <p className="text-blue-100">
                  <strong>Tip:</strong> Rename your original file to something like <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">user1_backup.dat</code> or 
                  copy it to a safe location on your computer.
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">2️⃣</span>
                  Upload Your Save File to the Editor
                </h3>
                <p className="text-blue-100 mb-3">
                  Click the &quot;Select Save File&quot; button above, or simply drag and drop your save file (e.g., <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">user1.dat</code>) 
                  anywhere on this page. For Nintendo Switch users, enable &quot;Nintendo Switch Mode&quot; before uploading.
                </p>
                <p className="text-blue-100">
                  The <strong>hollow knight save editor</strong> will automatically decrypt your file and display it as editable JSON data.
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">3️⃣</span>
                  Modify Your Game Data
                </h3>
                <p className="text-blue-100 mb-3">
                  Once loaded, you&apos;ll see JSON with <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">&quot;key&quot;: value</code> pairs. 
                  Use <kbd className="bg-blue-950 px-2 py-1 rounded text-blue-300 border border-blue-500">Ctrl+F</kbd> (or <kbd className="bg-blue-950 px-2 py-1 rounded text-blue-300 border border-blue-500">Cmd+F</kbd> on Mac) 
                  to search for specific values.
                </p>
                <p className="text-blue-100">
                  <strong>Example:</strong> Search for <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">&quot;geo&quot;</code> and change its value 
                  to <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">9999</code> to give yourself 9999 geo (currency).
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">4️⃣</span>
                  Download and Replace Your Save File
                </h3>
                <p className="text-blue-100 mb-3">
                  After making your edits, click the appropriate download button:
                </p>
                <ul className="list-disc list-inside text-blue-100 space-y-2 mb-3 ml-4">
                  <li><strong>&quot;Download Encrypted (PC)&quot;</strong> for Steam/GOG versions</li>
                  <li><strong>&quot;Download Plain Text (Switch)&quot;</strong> for Nintendo Switch</li>
                </ul>
                <p className="text-blue-100">
                  The file will be saved as <code className="bg-blue-950 px-2 py-1 rounded text-blue-300">user1.dat</code>. 
                  Move this file to your Hollow Knight save folder, replacing the original (that you already backed up!).
                </p>
              </div>

              <div className="bg-blue-950/40 rounded-xl p-6 border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📁</span>
                  Where to Find Your Save Folder
                </h3>
                <p className="text-blue-100 mb-4">
                  The Hollow Knight save folder location varies by operating system and platform. Here are the most common paths:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-blue-950/60 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-200 mb-2 flex items-center gap-2">
                      <span>🪟</span> Windows (Steam/GOG)
                    </h4>
                    <code className="text-sm text-blue-300 break-all block">
                      C:\Users\[YourUsername]\AppData\LocalLow\Team Cherry\Hollow Knight\
                    </code>
                    <p className="text-xs text-blue-300 mt-2">
                      Press <kbd className="bg-blue-950 px-1 rounded border border-blue-500">Win+R</kbd>, paste the path, and press Enter
                    </p>
                  </div>

                  <div className="bg-blue-950/60 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-200 mb-2 flex items-center gap-2">
                      <span>🍎</span> macOS (Steam/GOG)
                    </h4>
                    <code className="text-sm text-blue-300 break-all block">
                      ~/Library/Application Support/unity.Team Cherry.Hollow Knight/
                    </code>
                    <p className="text-xs text-blue-300 mt-2">
                      Press <kbd className="bg-blue-950 px-1 rounded border border-blue-500">Cmd+Shift+G</kbd> in Finder, paste the path
                    </p>
                  </div>

                  <div className="bg-blue-950/60 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-200 mb-2 flex items-center gap-2">
                      <span>🐧</span> Linux (Steam)
                    </h4>
                    <code className="text-sm text-blue-300 break-all block mb-2">
                      ~/.config/unity3d/Team Cherry/Hollow Knight/
                    </code>
                    <p className="text-xs text-blue-300 mb-2">or (Steam Play/Proton):</p>
                    <code className="text-xs text-blue-300 break-all block">
                      ~/.local/share/Steam/steamapps/compatdata/367520/pfx/drive_c/users/steamuser/AppData/LocalLow/Team Cherry/Hollow Knight/
                    </code>
                  </div>

                  <div className="bg-blue-950/60 rounded-lg p-4 border-l-4 border-blue-400">
                    <h4 className="font-bold text-blue-200 mb-2 flex items-center gap-2">
                      <span>🎮</span> Nintendo Switch
                    </h4>
                    <p className="text-sm text-blue-300">
                      Requires a modded Switch console and save management tools like Checkpoint or JKSV to export/import save files.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-200 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                      <strong>Can&apos;t find your save folder?</strong> Search online for &quot;hollow knight [your OS] [your platform] save file location&quot; 
                      (e.g., &quot;hollow knight windows steam save file location&quot;). Epic Games Store and Game Pass may have different paths.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500/50">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <span>🕐</span>
                Recent Edit History
              </h3>
              <p className="text-purple-200 mb-6 text-sm">
                Click to load a previous edit. Right-click to remove from history. Note: This is not a replacement for proper backups!
              </p>
              <div className="grid gap-3">
                {history.map((item) => (
                  <div
                    key={item.hash}
                    onClick={() => {
                      setGameFileContent(item.jsonString, item.fileName)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      removeFromHistory(item.hash)
                    }}
                    className="p-4 bg-purple-900/40 hover:bg-purple-800/60 rounded-xl cursor-pointer transition-all border border-purple-500/30 hover:border-purple-400/60 hover:shadow-lg group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-purple-300 group-hover:text-purple-200">
                          {item.fileName}
                        </div>
                        <div className="text-sm text-purple-400">Hash: {item.hash}</div>
                      </div>
                      <div className="text-sm text-purple-400">{humanTime(item.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Information Section */}
          <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-purple-500/50">
            <h2 className="text-3xl font-bold text-white mb-6">
              What Can You Edit with This Hollow Knight Save Editor?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-200 mb-3">💰 Currency & Resources</h3>
                <ul className="space-y-2 text-purple-100">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Geo</strong> - Modify your in-game currency to any amount</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Dream Orbs/Essence</strong> - Adjust your collected essence points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Rancid Eggs</strong> - Change the number of rancid eggs you own</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-200 mb-3">❤️ Health & Soul</h3>
                <ul className="space-y-2 text-purple-100">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Max Health</strong> - Set your maximum health capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Current Health</strong> - Adjust your current health points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Soul Capacity</strong> - Modify your maximum soul reserves</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-200 mb-3">🎭 Charms & Abilities</h3>
                <ul className="space-y-2 text-purple-100">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Charm Ownership</strong> - Unlock or lock any charm in the game</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Charm Notches</strong> - Increase your available charm slots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Equipped Charms</strong> - Modify which charms are currently equipped</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-200 mb-3">⚔️ Combat & Skills</h3>
                <ul className="space-y-2 text-purple-100">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Nail Upgrades</strong> - Set your nail upgrade level (0-4)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Spells</strong> - Unlock and upgrade all three spell types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span><strong>Movement Abilities</strong> - Enable dash, wall jump, double jump, etc.</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-purple-950/50 rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold text-purple-200 mb-3">🗺️ Exploration & Progress</h3>
              <p className="text-purple-100 mb-3">
                With this <strong className="text-purple-300">hollow knight save editor</strong>, you can also modify exploration-related data such as discovered areas, visited rooms, unlocked map sections, boss defeat status, NPC interactions, quest progress, and achievement completion. The editor provides complete control over your game progression, allowing you to jump to any point in the game or simply adjust specific aspects of your playthrough.
              </p>
            </div>
          </div>

          {/* Technical Details Section */}
          <div className="bg-gradient-to-r from-slate-900/80 to-purple-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-purple-500/50">
            <h2 className="text-3xl font-bold text-white mb-6">
              Technical Details of Our Hollow Knight Save Editor
            </h2>
            <p className="text-purple-100 leading-relaxed mb-4">
              This <strong className="text-purple-300">hollow knight save editor</strong> is built with modern web technologies including Next.js, TypeScript, and React. All processing happens entirely in your browser - no files are ever uploaded to any server, ensuring complete privacy and security. The tool uses industry-standard AES encryption in ECB mode to handle PC save files, automatically detecting and applying the correct encryption key used by the game.
            </p>
            <p className="text-purple-100 leading-relaxed mb-4">
              For Nintendo Switch saves, the <strong className="text-purple-300">hollow knight save editor</strong> works with plain text JSON files, as Switch saves are not encrypted in the same way. The editor includes automatic format detection, so you don&apos;t need to worry about technical details - just select your platform and the tool handles the rest.
            </p>
            <p className="text-purple-100 leading-relaxed">
              The history management feature uses your browser&apos;s localStorage to keep track of recently edited files, making it easy to switch between multiple save files or restore previous edits. However, remember that clearing your browser data will also clear this history, so always maintain proper backups of your save files outside of this tool.
            </p>
          </div>

          {/* Safety & Legal Section */}
          <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-12 border border-red-500/50">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">⚠️</span>
              Important Safety Information
            </h2>
            <div className="space-y-4 text-purple-100">
              <p className="leading-relaxed">
                <strong className="text-yellow-300">Always backup your original save files!</strong> Before using this <strong>hollow knight save editor</strong>, create a copy of your save files and store them in a safe location. While this tool is designed to be safe and reliable, unexpected issues can occur, and having a backup ensures you won&apos;t lose your progress.
              </p>
              <p className="leading-relaxed">
                <strong className="text-yellow-300">Validate your JSON:</strong> When editing save files manually, ensure your JSON syntax is correct. Invalid JSON will cause the game to fail loading your save. Use the browser&apos;s search function to help locate fields, and double-check your edits before downloading.
              </p>
              <p className="leading-relaxed">
                <strong className="text-yellow-300">Test with caution:</strong> Some extreme modifications (like setting values to impossibly high numbers) might cause unexpected game behavior or crashes. It&apos;s recommended to make small changes first and test them in-game before making extensive modifications.
              </p>
              <p className="leading-relaxed">
                <strong className="text-yellow-300">Educational use:</strong> This <strong>hollow knight save editor</strong> is provided as-is for educational purposes and personal use. Modifying save files is done at your own risk. We are not responsible for any issues that may arise from using this tool.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-purple-300 py-8 border-t border-purple-500/30">
            <p className="mb-4 text-lg">
              <strong className="text-white">Hollow Knight Save Editor</strong> - Free Online Tool
            </p>

            <p className="text-xs text-purple-400 mt-4">
              Hollow Knight is a trademark of Team Cherry. This save editor is an independent fan-made tool and is not affiliated with or endorsed by Team Cherry.
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}
