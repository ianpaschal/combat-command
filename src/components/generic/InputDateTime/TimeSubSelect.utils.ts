export const hourOptions = [...Array(24).keys()].map((_, i) => ({
  value: i.toString(),
  label: String(i).padStart(2, '0'),
}));

export const getMinuteOptions = (increment = 1) => {
  const steps = 60 / increment;
  return [...Array(steps).keys()].map((_, i) => {
    const value = i * increment;
    return {
      value: value.toString(),
      label: String(value).padStart(2, '0'),
    };
  });
};
