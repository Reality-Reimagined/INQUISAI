import React from 'react';
import { Cloud } from 'lucide-react';
import { TradingViewWidget } from './TradingViewWidget';

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

interface InfoWidgetsProps {
  weather: WeatherData;
}

export const InfoWidgets: React.FC<InfoWidgetsProps> = ({ weather }) => {
  return (
    <div className="space-y-4">
      {/* TradingView Widget */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <TradingViewWidget />
      </div>

      {/* Weather Widget */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-gray-500" />
              <span className="text-xl font-semibold">{weather.temp}°F</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <div>{weather.condition}</div>
              <div>{weather.location}</div>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            {weather.forecast.map((day) => (
              <div key={day.day} className="text-center">
                <div>{day.day}</div>
                <div>{day.temp}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 