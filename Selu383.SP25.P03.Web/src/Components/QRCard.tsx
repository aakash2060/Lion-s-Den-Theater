export default function QRCard() {
    return (
      <div className="flex items-center bg-black text-white p-4 rounded-lg shadow-lg max-w-lg">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src="https://hexdocs.pm/qr_code/docs/qrcode.svg"
            alt="QR Code"
            className="w-full h-full"
          />
        </div>
  
        <div className="ml-4 flex flex-col">
          <h2 className="text-lg font-bold">Lion's Den is better in App</h2>
          <div className="flex items-center mt-1">
         
            <div className="ml-2">
              <p className="text-sm">Lion's Don</p>
              <p className="text-yellow-400">★★★★★</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  