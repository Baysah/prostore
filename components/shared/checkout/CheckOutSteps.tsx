import { cn } from '@/lib/utils';
import React from 'react';
import Link from 'next/link';

interface Props {
  current?: number;
}

const steps = [
  {
    title: 'User Login',
    description: 'Sign in to your account to continue',
  },
  {
    title: 'Shipping Address',
    href: '/shipping-address',
    description: 'Enter your shipping address',
  },
  {
    title: 'Payment Method',
    href: '/payment-method',
    description: 'Select your payment method',
  },
  {
    title: 'Place Order',
    href: '/place-order',
    description: 'Review your order and place it',
  },
];

const CheckOutSteps = ({ current = 0, } : Props) => {
  
  return (
    <div className="flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {steps.map(
        (step, index) => (
          <React.Fragment key={index}>
            {step.href ? (
              <Link
                href={step.href}
                className={cn(
                  'p-2 w-56 rounded-full text-center text-sm',
                  index === current ? 'bg-secondary' : ''
                )}
              >
                {step.title}
              </Link>
            ) : (
              <div
                className={cn(
                  'p-2 w-56 rounded-full text-center text-sm',
                  index === current ? 'bg-secondary' : ''
                )}
              >
                {step.title}
              </div>
            )}
            {step.title !== 'Place Order' && (
              <hr className="w-16 border-t border-gray-300 mx-2" />
            )}
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default CheckOutSteps;
