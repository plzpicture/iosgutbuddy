const analytics = {
  events: [],
  track: (event, props = {}) => {
    analytics.events.push({ event, ...props, timestamp: new Date().toISOString() });
    console.log(`[Amplitude] ${event}`, props);
  },
};

export default analytics;
