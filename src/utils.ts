const inset0 = <T extends HTMLElement>(element: T | null, fixed?: boolean) => {
  if (element) {
    element.style.position = fixed ? 'fixed' : 'absolute';
    element.style.top = '0px';
    element.style.right = '0px';
    element.style.bottom = '0px';
    element.style.left = '0px';
  }
};

export { inset0 };
