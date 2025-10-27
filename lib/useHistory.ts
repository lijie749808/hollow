import { useState, useEffect } from 'react'

export interface HistoryItem {
    hash: number
    jsonString: string
    fileName: string
    date: Date
}

const MAX_HISTORY = 10
const STORAGE_KEY = 'hollow_knight_save_history'

export function useHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        // 从 localStorage 加载历史记录
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // 将日期字符串转换回 Date 对象
                const items = parsed.map((item: any) => ({
                    ...item,
                    date: new Date(item.date)
                }))
                setHistory(items)
            } catch (err) {
                console.error('Failed to load history:', err)
            }
        }
    }, [])

    const saveToLocalStorage = (items: HistoryItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch (err) {
            console.error('Failed to save history:', err)
        }
    }

    const addToHistory = (jsonString: string, fileName: string, hash: number) => {
        const newItem: HistoryItem = {
            hash,
            jsonString,
            fileName,
            date: new Date()
        }

        setHistory(prev => {
            // 移除相同 hash 的项目
            const filtered = prev.filter(item => item.hash !== hash)
            // 添加新项目到开头
            const updated = [newItem, ...filtered].slice(0, MAX_HISTORY)
            saveToLocalStorage(updated)
            return updated
        })
    }

    const removeFromHistory = (hash: number) => {
        setHistory(prev => {
            const updated = prev.filter(item => item.hash !== hash)
            saveToLocalStorage(updated)
            return updated
        })
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem(STORAGE_KEY)
    }

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory
    }
}

