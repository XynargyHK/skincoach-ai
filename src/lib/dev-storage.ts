// Simple file-based storage for development mode
import fs from 'fs'
import path from 'path'

const DEV_STORAGE_FILE = path.join(process.cwd(), '.next', 'dev-verification-codes.json')

interface VerificationData {
  code: string
  timestamp: number
  attempts: number
}

export class DevStorage {
  private ensureFileExists() {
    try {
      if (!fs.existsSync(DEV_STORAGE_FILE)) {
        fs.writeFileSync(DEV_STORAGE_FILE, '{}')
      }
    } catch (error) {
      console.log('Could not create dev storage file:', error)
    }
  }

  set(phoneNumber: string, data: VerificationData): void {
    if (process.env.NODE_ENV !== 'development') return

    try {
      this.ensureFileExists()
      const storage = this.getAll()
      storage[phoneNumber] = data
      fs.writeFileSync(DEV_STORAGE_FILE, JSON.stringify(storage, null, 2))
      console.log('💾 Saved verification code to dev storage:', { phoneNumber, code: data.code })
    } catch (error) {
      console.error('Error saving to dev storage:', error)
    }
  }

  get(phoneNumber: string): VerificationData | null {
    if (process.env.NODE_ENV !== 'development') return null

    try {
      this.ensureFileExists()
      const storage = this.getAll()
      const data = storage[phoneNumber]
      console.log('📖 Retrieved from dev storage:', { phoneNumber, found: !!data, code: data?.code })
      return data || null
    } catch (error) {
      console.error('Error reading from dev storage:', error)
      return null
    }
  }

  delete(phoneNumber: string): void {
    if (process.env.NODE_ENV !== 'development') return

    try {
      this.ensureFileExists()
      const storage = this.getAll()
      delete storage[phoneNumber]
      fs.writeFileSync(DEV_STORAGE_FILE, JSON.stringify(storage, null, 2))
      console.log('🗑️ Deleted from dev storage:', phoneNumber)
    } catch (error) {
      console.error('Error deleting from dev storage:', error)
    }
  }

  private getAll(): { [key: string]: VerificationData } {
    try {
      const content = fs.readFileSync(DEV_STORAGE_FILE, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      return {}
    }
  }

  // Clean up expired codes
  cleanup(): void {
    if (process.env.NODE_ENV !== 'development') return

    try {
      const storage = this.getAll()
      const now = Date.now()
      const fifteenMinutes = 15 * 60 * 1000
      let cleaned = 0

      for (const [phone, data] of Object.entries(storage)) {
        if (now - data.timestamp > fifteenMinutes) {
          delete storage[phone]
          cleaned++
        }
      }

      if (cleaned > 0) {
        fs.writeFileSync(DEV_STORAGE_FILE, JSON.stringify(storage, null, 2))
        console.log(`🧹 Cleaned up ${cleaned} expired codes`)
      }
    } catch (error) {
      console.error('Error during cleanup:', error)
    }
  }
}

export const devStorage = new DevStorage()