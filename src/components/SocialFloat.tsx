import { Instagram } from "lucide-react";

export function SocialFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://wa.me/919065591253"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="h-12 w-12 rounded-full grid place-items-center shadow-lg shadow-black/30 transition-transform hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="white" aria-hidden="true">
          <path d="M19.11 17.27c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.18-1.34-.81-.72-1.35-1.6-1.51-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.01-.22-.53-.45-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26 0 1.33.97 2.62 1.11 2.8.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zM16.02 5.33c-5.89 0-10.67 4.78-10.67 10.66 0 1.88.49 3.71 1.42 5.33L5.33 26.67l5.5-1.43c1.56.85 3.32 1.3 5.11 1.3h.01c5.88 0 10.66-4.78 10.66-10.66 0-2.85-1.11-5.53-3.12-7.54a10.6 10.6 0 0 0-7.47-3.01zm0 19.53h-.01c-1.6 0-3.16-.43-4.52-1.24l-.32-.19-3.36.88.9-3.27-.21-.34a8.86 8.86 0 0 1-1.36-4.71c0-4.89 3.98-8.87 8.88-8.87 2.37 0 4.6.92 6.27 2.6a8.81 8.81 0 0 1 2.6 6.28c0 4.89-3.98 8.86-8.87 8.86z" />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/gearbox_autos_usedcars/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow us on Instagram"
        className="h-12 w-12 rounded-full grid place-items-center text-white shadow-lg shadow-black/30 transition-transform hover:scale-110"
        style={{ background: "linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)" }}
      >
        <Instagram className="h-6 w-6" />
      </a>
    </div>
  );
}
