import { useState } from 'react';
import { Keypair } from '@stellar/stellar-sdk';
import { sendPayment } from '../lib/stellar/transactions';

export function useSendPayment(sourceKeypair: Keypair | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const send = async (destination: string, amount: string, memo?: string) => {
    if (!sourceKeypair) {
      setError('No source keypair provided');
      console.error('No source keypair provided');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    console.log('Initiating send payment...');

    try {
      await sendPayment(sourceKeypair, destination, amount, memo);
      setSuccess(true);
      console.log('Payment sent successfully');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send transaction';
      setError(errorMsg);
      console.error('Send payment error:', errorMsg);
    } finally {
      setIsLoading(false);
      console.log('Send payment process completed');
    }
  };

  return { send, isLoading, error, success };
}