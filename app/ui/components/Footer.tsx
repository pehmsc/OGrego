import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1E3A8A]/10">
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-[#1E3A8A]/70">
        <div className="grid gap-4 text-center sm:grid-cols-3 sm:items-center sm:text-left">
          <p>
            © {new Date().getFullYear()} O Grego. Todos os direitos reservados.
          </p>
          <p className="text-[#1E3A8A]/60 sm:text-center">
            Grécia à mesa. Sem sair do lugar.
          </p>
          <div className="flex items-center justify-center gap-4 sm:justify-end">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition hover:text-[#1E3A8A]"
            >
              <FacebookIcon />
            </Link>

            <Link
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition hover:text-[#1E3A8A]"
            >
              <InstagramIcon />
            </Link>

            <Link
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="transition hover:text-[#1E3A8A]"
            >
              <YouTubeIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A4.5 4.5 0 1016.5 12 4.5 4.5 0 0012 7.5zm0 7.4A2.9 2.9 0 1114.9 12 2.9 2.9 0 0112 14.9zM17.8 6.2a1 1 0 11-1 1 1 1 0 011-1z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.7-.8-1.6-.8-2-.9C17.8 2.8 12 2.8 12 2.8h0s-5.8 0-8.7.2c-.4.1-1.3.1-2 .9-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.6.8 2.3c.7.8 1.7.8 2.1.9 1.5.1 6.6.2 8.6.2s6.2-.1 8.7-.2c.4-.1 1.3-.1 2-.9.6-.7.8-2.3.8-2.3s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.6 14.6V7.8l6.3 3.4-6.3 3.4z" />
    </svg>
  );
}
