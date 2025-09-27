// Twilio SMS Service for SkinCoach
export class TwilioSMSService {
  private accountSid: string
  private authToken: string
  private fromNumber: string
  private baseUrl: string

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID!
    this.authToken = process.env.TWILIO_AUTH_TOKEN!
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM! // We'll use the same number for SMS
    this.baseUrl = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}`
  }

  // Check if Twilio is configured
  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken && this.fromNumber)
  }

  // Send SMS message via Twilio
  async sendSMS(to: string, message: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Twilio not configured. Check your environment variables.')
    }

    try {
      // Clean the phone number - remove whatsapp: prefix if present and ensure + prefix
      let cleanNumber = to.replace('whatsapp:', '').trim()
      if (!cleanNumber.startsWith('+')) {
        cleanNumber = '+' + cleanNumber
      }

      const response = await fetch(`${this.baseUrl}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.fromNumber.replace('whatsapp:', ''), // Remove whatsapp prefix for SMS
          To: cleanNumber,
          Body: message
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`Twilio API Error: ${result.message || 'Unknown error'}`)
      }

      return result
    } catch (error) {
      console.error('Twilio SMS send error:', error)
      throw error
    }
  }

  // Generate a random 6-digit verification code
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Send verification code via SMS
  async sendVerificationCode(phoneNumber: string, code: string, name?: string): Promise<any> {
    const message = `🔐 SkinCoach Verification\n\nHi${name ? ` ${name}` : ''}! Your verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nWelcome to personalized skincare! 🌟`

    return this.sendSMS(phoneNumber, message)
  }

  // Send welcome message after successful verification
  async sendWelcomeMessage(phoneNumber: string, name: string): Promise<any> {
    const message = `🎉 Welcome to SkinCoach, ${name}!\n\nYour personalized skincare plan is ready! Get ready to transform your skin with AI-powered recommendations.\n\nLet's start your skincare journey! 🌟`

    return this.sendSMS(phoneNumber, message)
  }
}

export default new TwilioSMSService()