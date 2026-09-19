import './globals.css';
import { AuthProvider } from '../lib/authContext';
import { ThemeProvider } from '../lib/themeContext';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { Shield, Phone, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'SVI — Smart Victim Intelligence | NHAA 14566',
  description: 'AI-Based Real-Time Stress & Trauma Assessment Module for National Helpline Against Atrocities (14566), Ministry of Social Justice & Empowerment, Government of India.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192.png',
    shortcut: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SVI',
  },
  formatDetection: {
    telephone: true,
  },
};

export const viewport = {
  themeColor: '#0B2545',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SVI" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('svi_theme');
                  var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gov-cream dark:bg-slate-950 min-h-screen flex flex-col antialiased text-gov-textMain dark:text-slate-100 selection:bg-gov-tealSoft selection:text-gov-teal transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <PWAInstallPrompt />
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
              {children}
            </main>

            {/* Official Government Footer */}
            <footer className="bg-gov-navyDark dark:bg-slate-950 text-slate-300 border-t border-slate-800 dark:border-slate-800/80 text-xs mt-auto transition-colors pb-24 md:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Col 1: Initiative info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>National Helpline Against Atrocities (NHAA)</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  A flagship grievance redressal and victim intelligence initiative by the Ministry of Social Justice and Empowerment, Government of India.
                </p>
                <p className="text-[11px] text-slate-500">
                  Operated under the Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act & Protection of Civil Rights Act.
                </p>
              </div>

              {/* Col 2: Emergency Helplines */}
              <div className="space-y-2">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Emergency & 24x7 Helplines</h4>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>NHAA National Toll-Free: <strong>14566</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tele-MANAS Psychological Support: <strong>14416 / 1800-891-4416</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>National Emergency Response Support: <strong>112</strong></span>
                  </li>
                </ul>
              </div>

              {/* Col 3: Privacy & Accessibility Compliance */}
              <div className="space-y-2">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider">Compliance & Privacy</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Compliant with Guidelines for Indian Government Websites (GIGW) and Digital Personal Data Protection (DPDP) Act. All AI assessments are non-diagnostic decision-support signals.
                </p>
                <div className="pt-1 text-[11px] text-slate-500">
                  © 2026 Government of India. All Rights Reserved.
                </div>
              </div>
            </div>
          </footer>

          <MobileBottomNav />
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}
