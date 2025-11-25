import React from 'react';
import type { ButtonProps } from './Button.types';

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    children,
    isLoading = false,
    disabled,
    ...rest
}) => {
    return (
        <button disabled={disabled || isLoading} className={`btn btn-${variant} btn-${size}`} {...rest}>
            {isLoading ? 'Loading...' : children}
        </button>
    )
};

export default Button;