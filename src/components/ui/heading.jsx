import React from 'react';

const sizes = {
  textlg: 'text-[18px] font-medium sm:text-[15px]',
  text2xl: 'text-[30px] font-medium md:text-[28px] sm:text-[25px]',
  headingxs: 'text-[25px] font-extrabold md:text-[23px] sm:text-[21px]',
  headings: 'text-[30px] font-bold md:text-[28px] sm:text-[25px]',
  headingmd: 'text-[40px] font-bold md:text-[38px] sm:text-[34px]',
};

const Heading = ({
  children,
  className = '',
  size = 'headings',
  as,
  ...restProps
}) => {
  const Component = as || 'h6';

  return (
    <Component
      className={`text-black-900_01 font-roca ${sizes[size]} ${className}`}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export { Heading };
