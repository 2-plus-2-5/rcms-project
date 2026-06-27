import { useState, useEffect } from 'react'
import { Settings, Database, RefreshCw, CheckCircle, ExternalLink, AlertCircle, Info } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/Button'
import { SyncStatusBar } from '@/components/ui/SyncStatusBar'
import { Badge } from '@/components/ui/Badge'
import { useMembers } from '@/hooks/useMembers'
import { loadAdapterConfig, saveAdapterConfig, resetAdapter } from '@/adapters/adapter.factory'
import { clearMembersCache } from '@/services/member.service'
import { toast } from '@/stores/ui.store'
import { AdapterConfig } from '@/types/sync.types'
import { isValidAppsScriptUrl } from '@/utils/validators'

function Section({ icon: Icon, title, description, children }: {
  icon: React.ElementType; title: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-lg bg-rcms-raised border border-rcms-border shrink-0">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function LabelledInput({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {children}
      {note && <p className="text-xs text-slate-600">{note}</p>}
    </div>
  )
}

export default function SettingsPage() {
  const { load, syncFromForms } = useMembers()

  const [config, setConfig] = useState<AdapterConfig>(loadAdapterConfig)
  const [sheetsUrl, setSheetsUrl] = useState(config.sheetsUrl ?? '')
  const [apiToken, setApiToken] = useState(config.apiToken ?? '')
  const [saved, setSaved] = useState(false)
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    const c = loadAdapterConfig()
    setConfig(c)
    setSheetsUrl(c.sheetsUrl ?? '')
    setApiToken(c.apiToken ?? '')
  }, [])

  const handleSave = () => {
    if (sheetsUrl && !isValidAppsScriptUrl(sheetsUrl)) {
      setUrlError('URL must start with https://script.google.com/macros/s/')
      return
    }
    setUrlError('')
    const newConfig: AdapterConfig = {
      type: sheetsUrl ? 'sheets' : 'mock',
      sheetsUrl: sheetsUrl || undefined,
      apiToken: apiToken || undefined,
    }
    saveAdapterConfig(newConfig)
    resetAdapter(newConfig)
    setConfig(newConfig)
    setSaved(true)
    toast.success('Settings saved. Data source switched to ' + (sheetsUrl ? 'Google Sheets' : 'Mock data') + '.')
    setTimeout(() => setSaved(false), 3000)
    // Reload data from new adapter
    clearMembersCache()
    load(true)
  }

  const handleClearCache = () => {
    clearMembersCache()
    toast.info('Local cache cleared. Data will re-fetch on next load.')
    load(true)
  }

  const handleSwitchToMock = () => {
    const mockConfig: AdapterConfig = { type: 'mock' }
    saveAdapterConfig(mockConfig)
    resetAdapter(mockConfig)
    setSheetsUrl('')
    setApiToken('')
    setConfig(mockConfig)
    clearMembersCache()
    load(true)
    toast.info('Switched to mock data mode.')
  }

  const isMock = config.type === 'mock'
  const isSheets = config.type === 'sheets' && !!config.sheetsUrl

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Settings" subtitle="Configure data source and sync preferences" />

      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Current mode banner */}
          <div className={['flex items-center gap-3 p-4 rounded-xl border text-sm',
            isMock ? 'bg-rcms-warning/5 border-rcms-warning/20 text-rcms-warning'
                   : 'bg-rcms-success/5 border-rcms-success/20 text-rcms-success'
          ].join(' ')}>
            {isMock ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle className="h-4 w-4 shrink-0" />}
            <div className="flex-1">
              <span className="font-medium">
                {isMock ? 'Running in Demo Mode' : 'Connected to Google Sheets'}
              </span>
              <span className="text-xs ml-2 opacity-70">
                {isMock ? 'Using seed data. Configure Google Sheets below to use real data.' : config.sheetsUrl?.slice(0, 60) + '…'}
              </span>
            </div>
            <Badge variant={isMock ? 'warning' : 'success'}>{isMock ? 'Mock' : 'Live'}</Badge>
          </div>

          {/* Sync status */}
          <Section icon={RefreshCw} title="Sync Status" description="Last synchronization state with your data source.">
            <SyncStatusBar onSync={syncFromForms} />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" icon={<RefreshCw className="h-3.5 w-3.5" />} onClick={syncFromForms}>
                Sync from Google Forms
              </Button>
              <Button variant="secondary" size="sm" onClick={handleClearCache}>
                Clear Cache
              </Button>
            </div>
          </Section>

          {/* Google Sheets config */}
          <Section
            icon={Database}
            title="Google Sheets Integration"
            description="Connect to your Google Apps Script web app to sync real member data."
          >
            <div className="p-3 rounded-lg bg-rcms-info/5 border border-rcms-info/20 flex gap-2">
              <Info className="h-4 w-4 text-rcms-info shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 space-y-1">
                <p>To connect Google Sheets:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-500">
                  <li>Open your Google Sheet → Extensions → Apps Script</li>
                  <li>Paste the <code className="text-rcms-primary-light bg-rcms-raised px-1 rounded">Code.gs</code> contents from the <code className="text-rcms-primary-light bg-rcms-raised px-1 rounded">/scripts</code> folder</li>
                  <li>Deploy → New deployment → Web app → Execute as Me → Access: Anyone</li>
                  <li>Copy the web app URL and paste it below</li>
                </ol>
                <a href="https://developers.google.com/apps-script/guides/web" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-rcms-info hover:underline">
                  Apps Script docs <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <LabelledInput
              label="Apps Script Web App URL"
              note="Format: https://script.google.com/macros/s/{deployment-id}/exec"
            >
              <input
                type="url"
                value={sheetsUrl}
                onChange={(e) => { setSheetsUrl(e.target.value); setUrlError('') }}
                placeholder="https://script.google.com/macros/s/…/exec"
                className={['input-base w-full', urlError ? 'border-rcms-danger/50' : ''].join(' ')}
              />
              {urlError && <p className="text-xs text-rcms-danger mt-1">{urlError}</p>}
            </LabelledInput>

            <LabelledInput
              label="API Token (optional but recommended)"
              note="Set this same token in your Apps Script Properties to restrict access."
            >
              <input
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="your-secret-token"
                className="input-base w-full"
              />
            </LabelledInput>

            <div className="flex items-center gap-3 pt-1">
              <Button variant="primary" onClick={handleSave}
                icon={saved ? <CheckCircle className="h-3.5 w-3.5" /> : <Settings className="h-3.5 w-3.5" />}>
                {saved ? 'Saved!' : 'Save & Connect'}
              </Button>
              {isSheets && (
                <Button variant="ghost" size="sm" onClick={handleSwitchToMock}>
                  Switch to Demo Mode
                </Button>
              )}
            </div>
          </Section>

          {/* Sheet structure reference */}
          <Section icon={Database} title="Google Sheet Structure" description="Required tab names and column layout for the Apps Script to work correctly.">
            <div className="space-y-3">
              {[
                { sheet: 'Members_Raw', desc: 'Auto-filled by Google Form responses. Never edit manually.', cols: ['Timestamp', 'Full Name', 'Email Address', 'Phone Number', 'City', 'Reading Interests'] },
                { sheet: 'Members',     desc: 'Canonical member records. Synced from Members_Raw.',        cols: ['id', 'communityId', 'fullName', 'email', 'phone', 'city', 'dateJoined', 'readingInterests', 'membershipStatus', 'notes', 'sourceFormResponseId', 'createdAt', 'updatedAt'] },
              ].map(({ sheet, desc, cols }) => (
                <div key={sheet} className="p-3 rounded-lg bg-rcms-raised/50 border border-rcms-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs font-bold text-rcms-primary-light">{sheet}</code>
                    <span className="text-xs text-slate-600">tab</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{desc}</p>
                  <div className="flex flex-wrap gap-1">
                    {cols.map((c) => (
                      <code key={c} className="text-xs px-1.5 py-0.5 bg-rcms-surface border border-rcms-border rounded text-slate-400">{c}</code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* About */}
          <div className="text-center py-4 space-y-1">
            <p className="text-xs text-slate-600">RCMS — Reading Community Management System</p>
            <p className="text-xs text-slate-700">Milestone 1 · v1.0.0 · React + Vite + TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  )
}
