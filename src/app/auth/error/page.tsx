'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    OAuthSignin: 'Error starting OAuth flow. Please try again.',
    OAuthCallback: 'Error during OAuth callback. Please try again.',
    OAuthCreateAccount: 'Could not create account. Try a different email.',
    EmailCreateAccount: 'Could not create account with this email.',
    Callback: 'Error during authentication callback.',
    OAuthAccountNotLinked: 'This email is already linked to another account.',
    EmailSignin: 'Error sending sign-in email.',
    CredentialsSignin: 'Invalid credentials.',
    SessionRequired: 'Please sign in to access this page.',
    Default: 'An unexpected authentication error occurred.',
  }

  const message = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,0,0,0.2)',
        maxWidth: '400px',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff6b6b' }}>
          Authentication Error
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
          {message}
        </p>
        {error && (
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
            Error code: {error}
          </p>
        )}
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #6c5ce7, #a855f7)',
            borderRadius: '0.5rem',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
