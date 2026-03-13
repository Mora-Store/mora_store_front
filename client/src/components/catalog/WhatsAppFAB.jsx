/**
 * WhatsApp Floating Action Button — fixed bottom-right
 * Shows on all public pages when a whatsappNumber is configured
 */
const WhatsAppFAB = ({ phoneNumber }) => {
    if (!phoneNumber) return null;

    const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('¡Hola! Quiero conocer más sobre sus productos 😊')}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="fixed bottom-6 right-6 z-50 group"
        >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-0 transition-opacity" />

            {/* Button */}
            <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-xl shadow-[#25D366]/40
                hover:bg-[#1ebe5d] hover:scale-110 transition-all duration-200">
                {/* Official WhatsApp SVG icon */}
                <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.004 0C7.164 0 0 7.16 0 16c0 2.82.736 5.477 2.02 7.793L0 32l8.43-2.01A15.937 15.937 0 0016.004 32C24.836 32 32 24.84 32 16S24.836 0 16.004 0zm0 29.2a13.14 13.14 0 01-6.71-1.84l-.48-.285-4.98 1.19 1.24-4.843-.314-.5A13.117 13.117 0 012.8 16c0-7.28 5.924-13.2 13.204-13.2 7.276 0 13.196 5.92 13.196 13.2 0 7.277-5.92 13.2-13.196 13.2zm7.232-9.888c-.4-.2-2.35-1.16-2.714-1.29-.364-.135-.629-.2-.893.2-.264.4-1.02 1.29-1.25 1.556-.23.264-.46.3-.856.1a10.81 10.81 0 01-3.184-1.965 11.93 11.93 0 01-2.203-2.745c-.23-.4-.025-.614.174-.812.178-.178.396-.464.594-.695.2-.23.264-.397.396-.66.133-.264.066-.497-.033-.696-.1-.2-.893-2.147-1.223-2.94-.322-.77-.648-.666-.893-.68h-.762c-.264 0-.695.1-1.058.497-.364.397-1.388 1.357-1.388 3.306 0 1.948 1.422 3.833 1.62 4.097.2.264 2.795 4.27 6.77 5.987.946.41 1.685.655 2.261.837.95.302 1.815.26 2.498.158.762-.113 2.35-.96 2.682-1.888.33-.928.33-1.722.23-1.888-.1-.166-.364-.264-.762-.464z" />
                </svg>
            </span>
        </a>
    );
};

export default WhatsAppFAB;
