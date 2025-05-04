import { useState } from 'react';
import { useWallet } from '../../store/wallet-store';
import { useSendPayment } from '../../hooks/useSendPayment';
import { StrKey } from '@stellar/stellar-sdk';

export function SendForm() {
  const { keypair } = useWallet();
  const { send, isLoading, error, success } = useSendPayment(keypair);

  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const validateInputs = () => {
    if (!destination) {
      return 'Destination address is required';
    }
    if (!StrKey.isValidEd25519PublicKey(destination)) {
      return 'Invalid Stellar address';
    }
    if (!amount) {
      return 'Amount is required';
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return 'Amount must be a positive number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validateInputs();
    if (validationError) {
      setFormError(validationError);
      console.error('Form validation error:', validationError);
      return;
    }

    if (!keypair) {
      setFormError('Wallet not initialized');
      console.error('Wallet not initialized');
      return;
    }

    console.log('Submitting transaction form...');
    await send(destination, amount, memo);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Send XLM</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Destination Address</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter Stellar Address"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (XLM)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            step="0.0000001"
            min="0"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Memo (Optional)</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Enter Memo"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 text-white rounded-md ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send XLM'}
        </button>
        {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">Transaction successful!</p>}
      </form>
    </div>
  );
}