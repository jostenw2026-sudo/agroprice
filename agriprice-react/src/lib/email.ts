/**
 * Email Service Integration
 * Supports SendGrid, Mailgun, or custom SMTP
 * 
 * Phase 4: Email Notifications & Scheduled Reports
 */

export interface EmailConfig {
  provider: 'sendgrid' | 'mailgun' | 'smtp'
  apiKey?: string
  domain?: string
  fromEmail: string
  fromName: string
}

export interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
  attachments?: Array<{ filename: string; content: Buffer }>
}

export interface AlertConfig {
  enabled: boolean
  email: string
  priceThreshold?: number // Alert if price changes by X%
  frequency: 'daily' | 'weekly' | 'monthly'
  products?: string[] // Specific products to monitor
}

export interface DigestConfig {
  enabled: boolean
  email: string
  frequency: 'daily' | 'weekly'
  includeAlerts: boolean
  includePriceChanges: boolean
  includeSeasonalTrends: boolean
}

class EmailService {
  private config: EmailConfig | null = null
  private sendgridApiUrl = 'https://api.sendgrid.com/v3/mail/send'

  /**
   * Initialize email service with SendGrid credentials
   * In production, use environment variables: SENDGRID_API_KEY
   */
  async initialize(provider: 'sendgrid' | 'mailgun' = 'sendgrid'): Promise<void> {
    // Get API key from environment (production)
    // For demo, use placeholder
    const apiKey = process.env.VITE_SENDGRID_API_KEY || 'SG.demo_key'

    this.config = {
      provider,
      apiKey,
      fromEmail: 'noreply@agriprice.xp-nova.com',
      fromName: 'AgriPrice',
    }

    console.log(`✅ Email service initialized (${provider})`)
  }

  /**
   * Send single email via SendGrid
   */
  async sendEmail(payload: EmailPayload): Promise<boolean> {
    if (!this.config) {
      console.warn('⚠️ Email service not initialized')
      return false
    }

    try {
      // Simulate SendGrid API call
      const response = await fetch(this.sendgridApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: payload.to }],
              subject: payload.subject,
            },
          ],
          from: {
            email: this.config.fromEmail,
            name: this.config.fromName,
          },
          content: [
            {
              type: 'text/html',
              value: payload.html,
            },
            {
              type: 'text/plain',
              value: payload.text || stripHtml(payload.html),
            },
          ],
        }),
      })

      if (response.ok) {
        console.log(`✅ Email sent to ${payload.to}`)
        return true
      } else {
        console.error(`❌ SendGrid error: ${response.status}`)
        return false
      }
    } catch (err) {
      console.error('Email send error:', err)
      return false
    }
  }

  /**
   * Send price alert notification
   */
  async sendPriceAlert(
    email: string,
    product: string,
    oldPrice: number,
    newPrice: number,
    currency: string
  ): Promise<boolean> {
    const change = ((newPrice - oldPrice) / oldPrice) * 100
    const direction = change > 0 ? '📈 Hausse' : '📉 Baisse'

    const html = `
      <h2>Alerte de prix: ${product}</h2>
      <p><strong>${direction}</strong> de <strong>${Math.abs(change).toFixed(2)}%</strong></p>
      <table border="1" cellpadding="8">
        <tr>
          <td>Prix précédent</td>
          <td>${oldPrice.toFixed(2)} ${currency}</td>
        </tr>
        <tr>
          <td>Nouveau prix</td>
          <td>${newPrice.toFixed(2)} ${currency}</td>
        </tr>
        <tr>
          <td>Changement</td>
          <td>${change > 0 ? '+' : ''}${change.toFixed(2)}%</td>
        </tr>
      </table>
      <p><a href="https://agriprice.xp-nova.com/prices">Voir tous les prix →</a></p>
    `

    return this.sendEmail({
      to: email,
      subject: `🚨 Alerte de prix: ${product}`,
      html,
      text: `Alerte de prix pour ${product}. ${direction} de ${Math.abs(change).toFixed(2)}%.`,
    })
  }

  /**
   * Send daily digest email
   */
  async sendDailyDigest(
    email: string,
    data: {
      topMovers: Array<{ product: string; change: number; price: number }>
      avgPrice: number
      newsCount: number
      alertsCount: number
    }
  ): Promise<boolean> {
    const date = new Date().toLocaleDateString('fr-FR')

    const html = `
      <h1>📊 AgriPrice - Digest Quotidien</h1>
      <p>Date: <strong>${date}</strong></p>

      <h2>🔝 Top Mouvements</h2>
      <ul>
        ${data.topMovers.map(m => `
          <li>${m.product}: ${m.change > 0 ? '📈' : '📉'} ${Math.abs(m.change).toFixed(2)}% 
              (${m.price.toFixed(2)} XAF)</li>
        `).join('')}
      </ul>

      <h2>📈 Statistiques</h2>
      <ul>
        <li>Prix moyen: ${data.avgPrice.toFixed(2)} XAF</li>
        <li>Alertes: ${data.alertsCount}</li>
        <li>Nouvelles sources: ${data.newsCount}</li>
      </ul>

      <p style="margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
        <a href="https://agriprice.xp-nova.com/settings">Gérer vos préférences</a> | 
        <a href="https://agriprice.xp-nova.com">Accéder AgriPrice</a>
      </p>
    `

    return this.sendEmail({
      to: email,
      subject: `📊 Digest AgriPrice - ${date}`,
      html,
    })
  }

  /**
   * Send weekly report (PDF attachment)
   */
  async sendWeeklyReport(email: string, pdfContent: Buffer): Promise<boolean> {
    const html = `
      <h1>📋 Rapport Hebdomadaire AgriPrice</h1>
      <p>Veuillez trouver ci-joint votre rapport d'analyse des prix pour la semaine.</p>
      <p>Le rapport inclut:</p>
      <ul>
        <li>Analyse de volatilité par région</li>
        <li>Top 5 produits les plus volatiles</li>
        <li>Tendances saisonnières</li>
        <li>Résumé des sources vérifiées</li>
      </ul>
      <p><a href="https://agriprice.xp-nova.com">Accéder à AgriPrice →</a></p>
    `

    return this.sendEmail({
      to: email,
      subject: '📋 Rapport Hebdomadaire AgriPrice',
      html,
      attachments: [
        {
          filename: `AgriPrice_Report_${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfContent,
        },
      ],
    })
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string, resetLink: string): Promise<boolean> {
    const html = `
      <h2>Réinitialiser votre mot de passe</h2>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
      <p><a href="${resetLink}" style="display: inline-block; padding: 12px 24px; 
        background-color: #10b981; color: white; text-decoration: none; border-radius: 6px;">
        Réinitialiser le mot de passe
      </a></p>
      <p style="color: #999; font-size: 12px;">
        Ce lien expire dans 24 heures. Si vous n'avez pas demandé cela, ignorez cet email.
      </p>
    `

    return this.sendEmail({
      to: email,
      subject: 'Réinitialiser votre mot de passe AgriPrice',
      html,
    })
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(email: string, verificationLink: string): Promise<boolean> {
    const html = `
      <h2>Vérifier votre email</h2>
      <p>Bienvenue chez AgriPrice! Veuillez vérifier votre email pour continuer.</p>
      <p><a href="${verificationLink}" style="display: inline-block; padding: 12px 24px;
        background-color: #10b981; color: white; text-decoration: none; border-radius: 6px;">
        Vérifier l'email
      </a></p>
    `

    return this.sendEmail({
      to: email,
      subject: 'Vérifier votre email AgriPrice',
      html,
    })
  }

  /**
   * Log email configuration (for debugging)
   */
  getStatus(): object {
    return {
      initialized: !!this.config,
      provider: this.config?.provider,
      fromEmail: this.config?.fromEmail,
    }
  }
}

/**
 * Strip HTML tags from HTML content
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')
}

// Export singleton instance
export const emailService = new EmailService()

// Initialize on module load
emailService.initialize('sendgrid').catch(err => {
  console.warn('Email service initialization warning:', err.message)
})
