
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import {
  Container,
  Flex,
  Heading,
  Text,
  Card,
  TextField,
  Button,
  Separator,
  ScrollArea,
} from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";

interface DailyWallet {
  [date: string]: any[];
}

export function WalletStatus() {
  const account = useCurrentAccount();
  const [dailyWallet, setDailyWallet] = useState<DailyWallet>({});
  const [totalBalance, setTotalBalance] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<string | null>(null);
  const [hackStatus, setHackStatus] = useState<string | null>(null);
  const [newWalletAddress, setNewWalletAddress] = useState<string>("");
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

  // Hàm thêm transaction mới vào dailyWallet (cập nhật state)
  const addTransactionToDailyWallet = (txn: any) => {
    const timestamp = txn.timestampMs
      ? new Date(Number(txn.timestampMs)).toISOString().split("T")[0]
      : "Unknown";

    setDailyWallet((prev) => {
      const updated = { ...prev };
      if (!updated[timestamp]) updated[timestamp] = [];
      updated[timestamp] = [...updated[timestamp], txn];
      return updated;
    });
  };

  // Tách useEffect rõ ràng, load balance + check eligibility khi account thay đổi
  useEffect(() => {
    if (account?.address) {
      fetchBalance(account.address);
      checkEligibilityWrapper(account.address);
    } else {
      setDailyWallet({});
      setTotalBalance("0");
      setError(null);
      setEligibility(null);
      setHackStatus(null);
      setNewWalletAddress("");
      setIsEligible(false);
    }
  }, [account]);

  // Khi isEligible thay đổi (được xác nhận) thì load giao dịch chi tiết
  useEffect(() => {
    if (account?.address && isEligible) {
      fetchTransactions(account.address);
    }
  }, [account, isEligible]);

  const fetchBalance = async (address: string) => {
    try {
      const balance = await suiClient.getBalance({
        owner: address,
        coinType: "0x2::sui::SUI",
      });
      const balanceInSui = Number(balance.totalBalance) / 1_000_000_000;
      setTotalBalance(balanceInSui.toFixed(2));
      setError(null);
    } catch (error: any) {
      console.error("Error getting balance:", error);
      setTotalBalance("0");
      setError("Unable to load balance.");
    }
  };

  const checkEligibilityWrapper = async (address: string) => {
    try {
      const txns = await suiClient.queryTransactionBlocks({
        filter: { FromAddress: address },
        options: { showInput: true },
        limit: 50,
      });
      const groupedByDay: DailyWallet = {};
      let totalTransactions = 0;

      for (const txn of txns.data) {
        const timestamp = txn.timestampMs
          ? new Date(Number(txn.timestampMs)).toISOString().split("T")[0]
          : "Unknown";
        if (!groupedByDay[timestamp]) {
          groupedByDay[timestamp] = [];
        }
        groupedByDay[timestamp].push(txn);
        totalTransactions++;
      }

      const earliestDate = Object.keys(groupedByDay).sort()[0];
      if (!earliestDate || earliestDate === "Unknown") {
        setEligibility(
          "⚠️ Unable to determine eligibility due to lack of transaction date.",
        );
        setIsEligible(false);
        setHackStatus(null); // Explicitly reset hackStatus
        return;
      }

      const firstTxDate = new Date(earliestDate);
      const currentDate = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(currentDate.getFullYear() - 1); // Fix: Set to one year ago
      const isOverOneYear = firstTxDate <= oneYearAgo; // Fix: Check if firstTxDate is older than one year
      const hasEnoughTransactions = totalTransactions >= 1;

      if ( hasEnoughTransactions) {
        setEligibility("✅ Eligible wallet!");
        setIsEligible(true);
      } else {
        setEligibility("❌ Wallet not eligible!!");
        setIsEligible(false);
        setHackStatus(null); // Explicitly reset hackStatus
      }

      setDailyWallet(groupedByDay);
    } catch (error: any) {
      console.error("Error checking eligibility:", error);
      setEligibility("⚠️ Unable to check eligibility.");
      setIsEligible(false);
      setHackStatus(null); // Explicitly reset hackStatus
      setError("Error while retrieving transaction data.");
    }
  };

  const fetchTransactions = async (address: string) => {
    try {
      const txns = await suiClient.queryTransactionBlocks({
        filter: { FromAddress: address },
        options: {
          showInput: true,
          showEffects: true,
          showBalanceChanges: true,
        },
        limit: 50,
      });
      let suspiciousActivity = false;
      let largeTransferThreshold = Number(totalBalance) * 0.5;
      const timeWindow = 60 * 60 * 1000;
      const transactionTimes: number[] = [];

      for (const txn of txns.data) {
        const timestamp = Number(txn.timestampMs) || 0;
        transactionTimes.push(timestamp);

        const balanceChanges = txn.balanceChanges || [];
        for (const change of balanceChanges) {
          if (change.coinType === "0x2::sui::SUI") {
            if (
              typeof change.owner === "object" &&
              change.owner !== null &&
              "AddressOwner" in change.owner &&
              change.owner.AddressOwner === address
            ) {
              const amount = Math.abs(Number(change.amount)) / 1_000_000_000;
              if (amount > largeTransferThreshold) {
                suspiciousActivity = true;
                break;
              }
            }
          }
        }
      }

      transactionTimes.sort((a, b) => a - b);
      for (let i = 0; i < transactionTimes.length - 5; i++) {
        if (transactionTimes[i + 5] - transactionTimes[i] <= timeWindow) {
          suspiciousActivity = true;
          break;
        }
      }

      setHackStatus(
        suspiciousActivity
          ? "⚠️ Warning: Possible wallet hack detected!"
          : "✅ No suspicious activity detected.",
      );
      setError(null);
    } catch (error: any) {
      console.error("Error while retrieving transaction:", error);
      setError("Unable to load transaction.");
      setHackStatus(null);
      setNewWalletAddress("");
    }
  };

  const handleSuspiciousObject = (message: string) => {
    setHackStatus((prev) =>
      prev && !prev.includes("object") ? `${prev} ${message}` : message,
    );
  };

  const handleConfirmNewWallet = () => {
    if (newWalletAddress) {
      alert(`✅ New wallet confirmed: ${newWalletAddress}`);
      setNewWalletAddress("");
    } else {
      alert("Please enter new wallet address!");
    }
  };

  return (
    <Container my="4" size="2">
      <Card size="4" variant="classic">
        <Flex direction="column" gap="4">
          <Heading size="6">🎁 Check Airdrop</Heading>

          {account ? (
            <>
              <Flex direction="column" gap="2" style={{ lineHeight: 1.6 }}>
                <Flex justify="between" align="center">
                  <Text size="3" color="gray">
                    Address:
                  </Text>
                  <Text size="4" weight="medium">
                    {account.address.slice(0, 6)}...{account.address.slice(-4)}
                  </Text>
                </Flex>

                <Flex justify="between" align="center">
                  <Text size="3" color="gray">
                    Total Balance:
                  </Text>
                  <Text size="4" weight="medium">
                    {totalBalance} SUI
                  </Text>
                </Flex>

                {eligibility && (
                  <Flex justify="between" align="center">
                    <Text size="3" color="gray">
                      Eligibility:
                    </Text>
                    <Text
                      size="4"
                      weight="medium"
                      color={
                        eligibility.includes("Eligible") ? "green" : "orange"
                      }
                    >
                      {eligibility}
                    </Text>
                  </Flex>
                )}
              </Flex>

              {isEligible && hackStatus && (
                <Text
                  size="3"
                  color={
                    hackStatus.includes("✅") ? "green" : "red"
                  }
                >
                  {hackStatus}
                </Text>
              )}

              {isEligible && hackStatus && !hackStatus.includes("✅") && (
                <Flex direction="column" gap="2">
                  <Text size="2" weight="medium">
                    🔐 Enter new wallet address:
                  </Text>
                  <Flex gap="2" align="center" wrap="wrap">
                    <TextField.Root
                      placeholder="0x... wallet address"
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                      style={{ minWidth: 280 }}
                      size="2"
                    />
                    <Button
                      size="2"
                      variant="solid"
                      onClick={handleConfirmNewWallet}
                      disabled={!newWalletAddress.trim()}
                    >
                      Confirm
                    </Button>
                  </Flex>
                </Flex>
              )}

              {isEligible && (
                <>
                  <Separator my="2" />
                  <Heading size="5">
                    🔄 Transactions (Total: {" "}
                    {Object.values(dailyWallet).reduce(
                      (sum, txns) => sum + txns.length,
                      0,
                    )}
                    )
                  </Heading>
                  <ScrollArea
                    type="auto"
                    scrollbars="vertical"
                    style={{ maxHeight: 400 }}
                  >
                    <Flex direction="column" gap="4">
                      {Object.entries(dailyWallet).map(([date, txns]) => (
                        <Card key={date} variant="surface">
                          <Heading size="4">{date}</Heading>
                          <Flex direction="column" gap="2" mt="2">
                            {txns.map((txn, index) => (
                              <Card key={index} size="1" variant="classic">
                                <Text size="2">
                                  <strong>Digest:</strong> {txn.digest || "N/A"}
                                  <br />
                                  <strong>Type:</strong>{" "}
                                  {txn.transaction?.data?.transaction?.kind ||
                                    "Unknown"}
                                </Text>
                              </Card>
                            ))}
                          </Flex>
                        </Card>
                      ))}
                    </Flex>
                  </ScrollArea>

                  <Separator my="2" />
                  <OwnedObjects
                    onSuspiciousObjectDetected={handleSuspiciousObject}
                  />
                </>
              )}
            </>
          ) : (
            <Text size="3" color="gray">
              Wallet not connected.
            </Text>
          )}

          {error && (
            <Text size="3" color="red" weight="medium">
              {error}
            </Text>
          )}
        </Flex>
      </Card>
    </Container>
  );
}
