import React from "react";

export default function Footer() {
  const APP_NAME = "Planora";
  const AUTHOR = "Tamana Majedi";

  
  const GITHUB = "https://github.com/TamanaMajedi-CS";
  const LINKEDIN = "https://www.linkedin.com/in/tamana-majedi-8259a3355?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app";
  const WHATSAPP = "https://wa.me/93708552635";

  return (
    <footer className="app-footer">
      <div className="app-footer__inner container">
        <div className="app-footer__brand">
          <strong>{APP_NAME}</strong> • by <span>{AUTHOR}</span>
        </div>

        <nav className="app-footer__links" aria-label="Contact links">
          <a className="icon-btn" href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub">
            {/* GitHub */}
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.05c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.76.09-.75.09-.75 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.79.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.6-2.8 5.61-5.47 5.91.43.37.82 1.1.82 2.22v3.3c0 .32.21.69.83.57A12 12 0 0 0 12 .5Z"/>
            </svg>
          </a>

          <a className="icon-btn" href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            {/* LinkedIn */}
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.86-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.86 3.38-1.86 3.61 0 4.28 2.38 4.28 5.47v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm-1.78 13.02h3.58V9H3.56v11.45Z"/>
            </svg>
          </a>

          <a className="icon-btn" href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            {/* WhatsApp */}
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path fill="currentColor" d="M17.47 14.28c-.27-.13-1.6-.79-1.85-.87-.25-.09-.43-.13-.63.13-.19.27-.73.87-.9 1.05-.17.18-.33.2-.6.07-.27-.13-1.13-.41-2.15-1.31-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.41.12-.54.12-.11.27-.3.4-.45.13-.15.17-.27.27-.45.09-.18.04-.34-.02-.48-.06-.13-.63-1.52-.86-2.08-.23-.55-.46-.47-.63-.48h-.54c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.99 2.66 1.12 2.85c.13.18 1.95 2.98 4.7 4.18.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.06-.11-.23-.18-.5-.31ZM12.1 2a9.9 9.9 0 0 0-8.45 15.03L2 22l5.12-1.49A9.9 9.9 0 1 0 12.1 2Zm6.08 15.96a7.84 7.84 0 0 1-4.43 2.26 7.87 7.87 0 0 1-4.77-.6l-.34-.16-3.04.89.9-2.96-.18-.3a7.86 7.86 0 1 1 11.85 1.87Z"/>
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
