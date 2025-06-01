// import {Flex , Heading , Text ,Card } from "@radix-ui/themes";
// import { OwnedObjects } from "../OwnedObjects";


// interface WalletDisplayProps {
//     walletAddress: string;
//     totalBalance: string;
//     transactionCount: number;
//     firstTransactionDate: string | null;
//     objects: any[];
// }

// export function WalletDisplay({
//     walletAddress,
//     totalBalance,
//     transactionCount,
//     firstTransactionDate,
//     objects
// }: WalletDisplayProps) {
//     return (
//     <Flex direction="column" gap="4">
//       <Text size="4">Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</Text>
//       <Text size="4">Total Balance: {totalBalance} SUI</Text>
//       <Text size="4">Total Transaction: {transactionCount}</Text>
//       {firstTransactionDate && (
//         <Text size="4">First Transaction Date: {firstTransactionDate}</Text>
//       )}

//       <Heading size="5" mt="4">
//         Address Objects
//       </Heading>
//       {objects.length > 0 ? (
//         <Flex direction="column" gap="2">
//           {objects.map((obj, index) => (
//             <Card key={index}>
//               <Text as="p" size="3">
//                 ID: {obj.data?.objectId || 'N/A'}
//                 <br />
//                 Type: {obj.data?.type || 'Không xác định'}
//               </Text>
//             </Card>
//           ))}
//         </Flex>
//       ) : (
//         <Text size="3">No found</Text>
//       )}

//       <Heading size="5" mt="4">
//         Address Objects
//       </Heading>
//       <OwnedObjects />
//     </Flex>
//   );
// }