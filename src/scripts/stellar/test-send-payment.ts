import { Keypair, StrKey } from '@stellar/stellar-sdk';
import { sendPayment } from '../../lib/stellar/transactions';

async function testSendPayment() {
  // Replace with a funded testnet secret key (e.g., from Stellar Laboratory)
  const sourceSecret = 'SDLCVG2JJUJ67OHYQHYXRTAA5UKOKIQ2DKWUXUKSNQYPAJD6CKQGO3JM'; // e.g., SBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  const destination = 'GBJDTATBCDDB4GPBZGQ2XICE5OFZTJQA6EHVR7XVV6KT5WRREIWPPSKE'; // Provided test account
  const amount = '1';
  const memo = 'Test payment';

  // Validate inputs
  if (!sourceSecret || !sourceSecret.startsWith('S')) {
    console.error('Error: Please provide a valid testnet secret key in sourceSecret');
    process.exit(1);
  }
  if (!StrKey.isValidEd25519PublicKey(destination)) {
    console.error('Error: Invalid destination address');
    process.exit(1);
  }

  console.log('Starting test payment...');
  console.log(`Source Secret: ${sourceSecret.slice(0, 6)}...${sourceSecret.slice(-6)}`);
  console.log(`Destination: ${destination}`);
  console.log(`Amount: ${amount} XLM`);
  console.log(`Memo: ${memo}`);

  try {
    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const result = await sendPayment(sourceKeypair, destination, amount, memo);
    console.log('Test payment successful!');
    console.log('Transaction hash:', result.hash);
    console.log('Ledger:', result.ledger);
    console.log('Check transaction at: https://stellar.expert/explorer/testnet/tx/' + result.hash);
  } catch (err) {
    console.error('Test payment failed:', err instanceof Error ? err.message : 'Unknown error');
    process.exit(1);
  }
}

testSendPayment().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});