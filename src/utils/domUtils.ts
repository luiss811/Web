export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const showBackendToast = (
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
) => {
  const { duration = 4000, position = 'top-right' } = options;

  const containerId = `toast-container-${position}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    
    let positionClasses = 'fixed z-[9999] flex flex-col gap-3 max-w-md w-full p-4';
    if (position === 'top-right') {
      positionClasses += ' top-4 right-4 items-end';
    } else if (position === 'top-left') {
      positionClasses += ' top-4 left-4 items-start';
    } else if (position === 'bottom-right') {
      positionClasses += ' bottom-4 right-4 items-end';
    } else {
      positionClasses += ' bottom-4 left-4 items-start';
    }
    
    container.className = positionClasses;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  
  const toastId = `toast-${Math.random().toString(36).substr(2, 9)}`;
  toast.id = toastId;
  
  let baseClasses = 'relative flex items-stretch rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out translate-x-12 opacity-0 max-w-sm w-full backdrop-blur-md border';
  let themeStyles = '';
  let iconSvg = '';

  if (type === 'success') {
    baseClasses += ' bg-emerald-950/85 dark:bg-emerald-950/90 border-emerald-500/30 text-emerald-100';
    themeStyles = 'box-shadow: 0 8px 32px 0 rgba(16, 185, 129, 0.25);';
    iconSvg = `
      <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;
  } else if (type === 'error') {
    baseClasses += ' bg-rose-950/85 dark:bg-rose-950/90 border-rose-500/30 text-rose-100';
    themeStyles = 'box-shadow: 0 8px 32px 0 rgba(244, 63, 94, 0.25);';
    iconSvg = `
      <svg class="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    `;
  } else if (type === 'warning') {
    baseClasses += ' bg-amber-950/85 dark:bg-amber-950/90 border-amber-500/30 text-amber-100';
    themeStyles = 'box-shadow: 0 8px 32px 0 rgba(245, 158, 11, 0.25);';
    iconSvg = `
      <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    `;
  } else {
    baseClasses += ' bg-slate-900/90 dark:bg-slate-950/90 border-blue-500/30 text-slate-100';
    themeStyles = 'box-shadow: 0 8px 32px 0 rgba(59, 130, 246, 0.25);';
    iconSvg = `
      <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    `;
  }

  toast.className = baseClasses;
  toast.style.cssText = themeStyles;

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'flex items-center gap-3.5 p-4 pr-10 w-full';

  // Contenedor del ícono
  const iconContainer = document.createElement('div');
  iconContainer.className = 'flex-shrink-0 flex items-center justify-center';
  iconContainer.innerHTML = iconSvg;
  contentWrapper.appendChild(iconContainer);

  // Contenedor del mensaje
  const textContainer = document.createElement('div');
  textContainer.className = 'flex-grow text-[13.5px] font-medium leading-snug tracking-wide';
  textContainer.innerText = message;
  contentWrapper.appendChild(textContainer);

  // Botón de cerrar
  const closeButton = document.createElement('button');
  closeButton.className = 'absolute top-3.5 right-3.5 text-white/50 hover:text-white/80 transition-colors p-0.5 rounded-lg hover:bg-white/10';
  closeButton.innerHTML = `
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l18 18"></path>
    </svg>
  `;
  
  // Agregar evento de cierre inmediato al hacer click en el botón de cerrar
  closeButton.onclick = () => dismissToast(toast);
  toast.appendChild(closeButton);
  toast.appendChild(contentWrapper);

  const progressBar = document.createElement('div');
  progressBar.className = 'absolute bottom-0 left-0 h-[3px] w-full transition-all linear';
  
  let progressBg = 'bg-blue-500';
  if (type === 'success') progressBg = 'bg-emerald-500';
  if (type === 'error') progressBg = 'bg-rose-500';
  if (type === 'warning') progressBg = 'bg-amber-500';
  
  progressBar.className += ` ${progressBg}`;
  progressBar.style.width = '100%';
  progressBar.style.transition = `width ${duration}ms linear`;
  toast.appendChild(progressBar);

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-12', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
    progressBar.style.width = '0%';
  });

  const autoDismissTimeout = setTimeout(() => {
    dismissToast(toast);
  }, duration);

  toast.setAttribute('data-timeout-id', autoDismissTimeout.toString());

  // Función interna para remover con animación de salida suave
  function dismissToast(element: HTMLDivElement) {
    const timeoutId = element.getAttribute('data-timeout-id');
    if (timeoutId) {
      clearTimeout(parseInt(timeoutId, 10));
    }
    
    // Cambiar clases para animar salida
    element.classList.remove('translate-x-0', 'opacity-100');
    element.classList.add('translate-x-12', 'opacity-0');
    
    setTimeout(() => {
      element.remove();
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 500);
  }
};
