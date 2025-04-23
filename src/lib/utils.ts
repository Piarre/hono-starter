const uptime = () => {
  return {
    days: Math.floor(process.uptime() / 86400),
    hours: Math.floor((process.uptime() % 86400) / 3600),
    minutes: Math.floor((process.uptime() % 3600) / 60),
    seconds: Math.floor(process.uptime() % 60),
  };
};

export { uptime };