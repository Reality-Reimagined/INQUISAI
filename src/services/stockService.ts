interface Stock {
  symbol: string;
  price: number;
  change: number;
  previousPrice?: number;
}

const initialStocks: Stock[] = [
  { symbol: "BTC", price: 52481.23, change: 0 },
  { symbol: "ETH", price: 3214.76, change: 0 },
  { symbol: "AAPL", price: 173.89, change: 0 },
  { symbol: "GOOGL", price: 147.68, change: 0 },
];

// Simulate market volatility
const getRandomChange = () => {
  return (Math.random() - 0.5) * 2; // Random value between -1 and 1
};

// Update stock prices with realistic movements
const updateStockPrice = (stock: Stock): Stock => {
  const previousPrice = stock.price;
  const percentChange = getRandomChange();
  const newPrice = previousPrice * (1 + percentChange / 100);
  
  return {
    ...stock,
    previousPrice,
    price: Number(newPrice.toFixed(2)),
    change: Number(((newPrice - previousPrice) / previousPrice * 100).toFixed(2))
  };
};

class StockService {
  private stocks: Stock[] = initialStocks;
  private subscribers: ((stocks: Stock[]) => void)[] = [];
  private intervalId?: ReturnType<typeof setInterval>;

  constructor() {
    this.startUpdates();
  }

  private startUpdates() {
    // Update every 3 seconds
    this.intervalId = setInterval(() => {
      this.stocks = this.stocks.map(updateStockPrice);
      this.notifySubscribers();
    }, 3000);
  }

  subscribe(callback: (stocks: Stock[]) => void) {
    this.subscribers.push(callback);
    callback(this.stocks); // Initial data
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
      if (this.subscribers.length === 0 && this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.stocks));
  }
}

export type { Stock };
export const stockService = new StockService(); 