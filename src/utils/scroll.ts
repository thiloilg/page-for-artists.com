export const scrollToDemo = () => {
  const demoSection = document.getElementById('demo-section');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' });
  }
};
