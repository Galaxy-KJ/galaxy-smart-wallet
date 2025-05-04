import { Horizon, Keypair, TransactionBuilder, Operation, Asset, Networks, StrKey, Memo } from '@stellar/stellar-sdk';

export async function sendPayment(
  sourceKeypair: Keypair,
  destination: string,
  amount: string,
  memo?: string
): Promise<Horizon.HorizonApi.SubmitTransactionResponse> {
  console.log('Starting transaction:');
  console.log(`Source: ${sourceKeypair.publicKey()}`);
  console.log(`Destination: ${destination}`);
  console.log(`Amount: ${amount} XLM`);
  console.log(`Memo: ${memo || 'None'}`);

  // Validate inputs
  if (!StrKey.isValidEd25519PublicKey(destination)) {
    throw new Error('Invalid destination address');
  }
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Amount must be a positive number');
  }

  const server = new Horizon.Server('https://horizon-testnet.stellar.org');

  // Load source account
  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
    console.log('Source account loaded successfully');
  } catch (err) {
    throw new Error('Failed to load source account: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }

  // Fetch dynamic fee
  let fee: string;
  try {
    const feeStats = await server.feeStats();
    fee = feeStats.fee_charged?.p50 || '100';
    console.log(`Using fee: ${fee} stroops`);
  } catch (err) {
    console.warn('Failed to fetch fee stats, using default 100 stroops');
    fee = '100';
  }

  // Build transaction
  const transaction = new TransactionBuilder(sourceAccount, {
    fee,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount: parsedAmount.toString(),
      })
    )
    .addMemo(memo ? Memo.text(memo) : Memo.none())
    .setTimeout(30)
    .build();
  console.log('Transaction built successfully');

  // Sign transaction
  transaction.sign(sourceKeypair);
  console.log('Transaction signed');

  // Submit transaction
  try {
    const result = await server.submitTransaction(transaction);
    console.log('Transaction submitted successfully:', result.hash);
    return result;
  } catch (err) {
    if (err instanceof Error && 'response' in err && err.response?.data?.extras?.result_codes) {
      const codes = err.response.data.extras.result_codes;
      throw new Error(`Transaction failed: ${codes.transaction || codes.operations?.[0] || 'Unknown error'}`);
    }
    throw new Error('Failed to submit transaction: ' + (err instanceof Error ? err.message : 'Unknown error'));
  }
}