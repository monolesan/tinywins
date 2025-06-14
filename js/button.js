const button = document.getElementById('save-entry');
const starSVGs = [
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.87516 7.6835L13.4166 7.74895L8.96071 6.86356L13.136 5.06615L8.70753 6.07955L11.7947 2.72973L8.15882 5.4667L9.62405 1.14403L7.40993 5.1316L6.99977 0.583313L6.5899 5.1316L4.37551 1.14403L5.84102 5.4667L2.20517 2.72973L5.29231 6.07955L0.863796 5.06615L5.03885 6.86356L0.583252 7.74895L5.12468 7.6835L1.41221 10.3148L5.53455 8.39743L3.20753 12.3193L6.19789 8.88197L5.65841 13.4166L6.99977 9.05343L8.34144 13.4166L7.80195 8.88197L10.7923 12.3193L8.46529 8.39743L12.5873 10.3148L8.87516 7.6835Z" fill="black"/>
    </svg>`,
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5209 6.72126C8.80324 6.55577 7.44414 5.1973 7.27883 3.48113L6.99992 0.583313L6.72101 3.48113C6.5557 5.19759 5.19659 6.55606 3.47897 6.72126L0.583252 6.99998L3.47897 7.2787C5.19659 7.44419 6.5557 8.80266 6.72101 10.5188L6.99992 13.4166L7.27883 10.5188C7.44414 8.80237 8.80324 7.4439 10.5209 7.2787L13.4166 6.99998L10.5209 6.72126Z" fill="black"/>
    </svg>`
  ];

  button.addEventListener('mouseenter', () => {
    const rect = button.getBoundingClientRect();

    for (let i = 0; i < 8; i++) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("sparkle-star");
      wrapper.innerHTML = starSVGs[Math.floor(Math.random() * starSVGs.length)];

      const angle = Math.random() * 2 * Math.PI;
      const distance = 60 + Math.random() * 50;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      wrapper.style.left = `${rect.left + rect.width / 2}px`;
      wrapper.style.top = `${rect.top + rect.height / 2}px`;
      wrapper.style.setProperty('--x', `${x}px`);
      wrapper.style.setProperty('--y', `${y}px`);

      document.body.appendChild(wrapper);

      setTimeout(() => {
        wrapper.remove();
      }, 1000);
    }
  });

  // Add scroll animation for landing button
const landingButton = document.getElementById('start_journey');
if (landingButton) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const border = entry.target.querySelector('.button-border');
        if (border) {
          border.style.strokeDashoffset = '0';
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(landingButton);
}