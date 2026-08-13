'use client';

import React from 'react';
import { ToastProvider } from '../ui/Toast';

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};
