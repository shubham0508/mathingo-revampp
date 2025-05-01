import React from 'react';

const sizes = {
  textxs: 'text-[10px] font-normal',
  texts: 'text-[11px] font-normal',
  textmd: 'text-[15px] font-normal',
  textxl: 'text-[20px] font-normal leading-7 sm:text-[17px]',
};

const Text = ({
  children,
  className = '',
  as,
  size = 'texts',
  ...restProps
}) => {
  const Component = as || 'p';

  return (
    <Component
      className={`text-black-900_01 font-avenir ${sizes[size]} ${className}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Text };
