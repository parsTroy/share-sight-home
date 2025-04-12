
export const generatePortfolioData = (timeRange: string) => {
  let days: number;
  
  // Determine number of data points based on time range
  switch (timeRange) {
    case "1d":
      days = 1;
      break;
    case "1w":
      days = 7;
      break;
    case "1m":
      days = 30;
      break;
    case "3m":
      days = 90;
      break;
    case "1y":
      days = 365;
      break;
    case "all":
      days = 730; // 2 years
      break;
    default:
      days = 30;
  }

  // Generate dates backwards from today
  const now = new Date();
  const data = [];
  
  // Starting portfolio value
  const startValue = 10000;
  
  // Generate random fluctuations while maintaining an overall trend
  let previousValue = startValue;
  
  // Volatility and trend factors
  const volatility = timeRange === "1d" ? 0.005 : 0.01;
  const trend = 0.0005; // Slight upward trend
  
  // For daily view, generate hourly data points
  if (timeRange === "1d") {
    for (let i = 0; i < 24; i++) {
      const hour = i;
      const date = new Date(now);
      date.setHours(hour, 0, 0, 0);
      
      // Random walk with volatility
      const change = (Math.random() * 2 - 1) * volatility * previousValue;
      const trendChange = previousValue * trend;
      const newValue = previousValue + change + trendChange;
      previousValue = newValue;
      
      data.push({
        date: `${hour}:00`,
        value: parseFloat(newValue.toFixed(2))
      });
    }
  } else {
    // Daily data points for longer time ranges
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Random walk with volatility
      const change = (Math.random() * 2 - 1) * volatility * previousValue;
      const trendChange = previousValue * trend * (days - i) / days; // Stronger trend over time
      const newValue = previousValue + change + trendChange;
      previousValue = newValue;
      
      // Format date based on time range
      let dateStr: string;
      if (timeRange === "1w") {
        dateStr = date.toLocaleDateString(undefined, { weekday: 'short' });
      } else if (timeRange === "1m") {
        dateStr = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      } else {
        dateStr = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      }
      
      data.push({
        date: dateStr,
        value: parseFloat(newValue.toFixed(2))
      });
    }
  }
  
  return data;
};
