export const startTimer = (time: number, onTimeOver: () => void) => {
  let end = false;

  const timer = setTimeout(() => {
    if (!end) onTimeOver();
  }, time * 1000);

  return {
    cancel: () => {
      end = true;
      clearTimeout(timer);
    },
  };
};
