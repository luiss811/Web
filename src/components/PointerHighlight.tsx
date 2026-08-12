import React, { useEffect } from 'react';

export const PointerHighlight: React.FC = () => {
  useEffect(() => {
    const follower = document.createElement('div');
    follower.className = 'pointer-spotlight-follower';
    follower.style.opacity = '0';
    follower.style.transition = 'opacity 0.3s ease, width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease';
    document.body.appendChild(follower);

    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved) {
        follower.style.opacity = '1';
        hasMoved = true;
      }

      const target = e.target as HTMLElement;
      const isHoveringInteractive = !!target.closest('a, button, select, input, [role="button"], .spotlight-card, .glass-card');

      if (isHoveringInteractive) {
        follower.classList.add('hovering');
      } else {
        follower.classList.remove('hovering');
      }

      follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      const card = target.closest('.spotlight-card') as HTMLElement;
      if (card) {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${cardX}px`);
        card.style.setProperty('--mouse-y', `${cardY}px`);
      }
    };

    const handleMouseLeave = () => {
      follower.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      follower.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      follower.remove();
    };
  }, []);

  return null;
};
