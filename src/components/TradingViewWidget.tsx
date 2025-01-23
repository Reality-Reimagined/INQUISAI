import React, { useEffect, useRef } from 'react';

export const TradingViewWidget: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "FOREXCOM:SPXUSD",
            "title": "S&P 500"
          },
          {
            "proName": "BINANCE:BTCUSDT",
            "title": "Bitcoin"
          },
          {
            "proName": "BINANCE:ETHUSDT",
            "title": "Ethereum"
          },
          {
            "description": "Apple",
            "proName": "NASDAQ:AAPL"
          },
          {
            "description": "Tesla",
            "proName": "NASDAQ:TSLA"
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "light",
        "isTransparent": true,
        "displayMode": "regular",
        "locale": "en"
      }`;

    if (container.current) {
      container.current.innerHTML = '';
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="h-[48px]">
      <div ref={container} className="tradingview-widget-container h-full" />
    </div>
  );
}; 