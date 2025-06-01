// import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

// const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

// export const fetchTransactions = async (address: string) => {
//   try {
//     let transactionCount = 0;
//     let firstTransactionDate: string | null = null;
//     let cursor: string | null = null;

//     do {
//       const txns = await suiClient.queryTransactionBlocks({
//         filter: { FromAddress: address },
//         options: { showInput: true },
//         cursor,
//         limit: 50,
//       });
//       transactionCount += txns.data.length;

//       for (const txn of txns.data) {
//         if (txn.timestampMs) {
//           const date = new Date(Number(txn.timestampMs)).toISOString().split('T')[0];
//           if (!firstTransactionDate || date < firstTransactionDate) {
//             firstTransactionDate = date;
//           }
//         }
//       }

//       cursor = txns.nextCursor || null;
//     } while (cursor);

//     return { transactionCount, firstTransactionDate };
//   } catch (error: any) {
//     throw new Error(`Lỗi khi lấy giao dịch: ${error.message || 'Không xác định'}`);
//   }
// };

// export const fetchBalance = async (address: string) => {
//   try {
//     const balance = await suiClient.getBalance({ owner: address, coinType: '0x2::sui::SUI' });
//     return (Number(balance.totalBalance) / 1_000_000_000).toFixed(2);
//   } catch (error: any) {
//     throw new Error(`Lỗi khi lấy số dư: ${error.message || 'Không xác định'}`);
//   }
// };

// export const fetchObjects = async (address: string) => {
//   try {
//     const objects = await suiClient.getOwnedObjects({
//       owner: address,
//       options: { showType: true, showContent: true },
//       limit: 10,
//     });
//     return objects.data;
//   } catch (error: any) {
//     throw new Error(`Lỗi khi lấy đối tượng sở hữu: ${error.message || 'Không xác định'}`);
//   }
// };