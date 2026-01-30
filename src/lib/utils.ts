const workerStartTime: number = Date.now();

const uptime = () => {
  const totalSeconds: number = Math.floor((Date.now() - workerStartTime) / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

export { uptime };
