function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" /></svg>;
}

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h3.8l3.5 5.1L16.5 4H19l-5.5 6.4L19.5 20h-3.8l-3.9-5.7L7 20H4.5l5.7-6.8Z" fill="currentColor" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>;
}

export function SocialLinks() {
  return <nav className="social-links" aria-label="Redes sociais e contato">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
            <InstagramIcon />
            </a>
            <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X" title="X">
              <XIcon />
            </a>
            <a href="mailto:dummyemail@example.com" aria-label="Contato por e-mail" title="Contato">
              <MailIcon />
            </a>
          </nav>;
}
