import { useState, useRef } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import api from '../services/api'
import './Auth.css'
import './CheckIn.css'

function CheckIn() {
  const busyRef = useRef(false)

  const [result, setResult] = useState(null)
  const [paused, setPaused] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [cameraError, setCameraError] = useState('')

  const submitCheckIn = async (code) => {
    // Ignore extra scans while one is already being processed
    if (busyRef.current) return
    busyRef.current = true
    setPaused(true)

    try {
      const response = await api.post('/checkin', { registrationCode: code })
      setResult({ type: 'success', ...response.data })
    } catch (err) {
      const data = err.response?.data
      setResult({
        type: err.response?.status === 409 ? 'warning' : 'error',
        message: data?.message || 'Could not reach the server. Is it running?',
        student: data?.student,
        event: data?.event,
        checkInTime: data?.checkInTime,
      })
    } finally {
      busyRef.current = false
    }
  }

  const handleScan = (detectedCodes) => {
    if (!detectedCodes || detectedCodes.length === 0) return
    submitCheckIn(detectedCodes[0].rawValue)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    submitCheckIn(manualCode.trim())
    setManualCode('')
  }

  const scanNext = () => {
    setResult(null)
    setPaused(false)
  }

  const titles = {
    success: '✓ Check-in successful',
    warning: 'Already checked in',
    error: 'Check-in failed',
  }

  return (
    <div>
      <h2>Event Check-in</h2>
      <p className="admin-subtitle">
        Scan a student's QR pass to mark them as present.
      </p>

      <div className="checkin-grid">
        <div>
          <div className="scanner-box">
            <Scanner
              onScan={handleScan}
              onError={() =>
                setCameraError(
                  'Could not open the camera. Allow camera access, or use manual entry below.'
                )
              }
              paused={paused}
              formats={['qr_code']}
            />
          </div>
          {cameraError && (
            <p className="scanner-note" style={{ color: '#b91c1c' }}>
              {cameraError}
            </p>
          )}
          <p className="scanner-note">
            Hold the QR code steady in front of the camera.
          </p>

          <div className="manual-box">
            <h4>No camera? Enter the code manually</h4>
            <form className="manual-row" onSubmit={handleManualSubmit}>
              <input
                type="text"
                placeholder="Paste the registration code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <button type="submit" disabled={paused}>
                Check in
              </button>
            </form>
          </div>
        </div>

        <div>
          {result ? (
            <div className={`result-card result-${result.type}`}>
              <h3>{titles[result.type]}</h3>
              {result.type !== 'success' && <p>{result.message}</p>}

              {result.student && (
                <>
                  <p><strong>{result.student.name}</strong></p>
                  <p>College ID: {result.student.collegeId || 'Not added'}</p>
                  <p>{result.student.email}</p>
                </>
              )}
              {result.event && <p>Event: {result.event.title}</p>}
              {result.checkInTime && (
                <p>
                  {result.type === 'success' ? 'Checked in at' : 'First checked in at'}{' '}
                  {new Date(result.checkInTime).toLocaleTimeString('en-IN')}
                </p>
              )}

              <button className="auth-btn" onClick={scanNext}>
                Scan next person
              </button>
            </div>
          ) : (
            <div className="result-card">
              <p>Waiting for a scan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckIn