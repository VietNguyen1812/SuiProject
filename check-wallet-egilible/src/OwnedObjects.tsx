import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import {
  Card,
  Flex,
  Heading,
  Text,
  ScrollArea,
  Separator,
} from "@radix-ui/themes";
import { useState, useEffect } from "react";

export function OwnedObjects({
  onSuspiciousObjectDetected,
}: {
  onSuspiciousObjectDetected: (message: string) => void;
}) {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { data, isPending, error } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    }
  );

  const [suspiciousObjects, setSuspiciousObjects] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data) {
      const checkObjects = async () => {
        const suspicious: string[] = [];

        for (const object of data.data) {
          try {
            const objectDetails = await suiClient.getObject({
              id: object.data?.objectId as string,
              options: { showContent: true },
            });

            const objectType = objectDetails.data?.type;

            if (objectType && typeof objectType === "string") {
              if (objectType.includes("unknown") || !objectType.includes("0x2::")) {
                suspicious.push(`⚠️ Suspicious object: ${object.data?.objectId}`);
              }
            } else {
              suspicious.push(`✅ Normal object: ${object.data?.objectId}`);
            }
          } catch (err) {
            console.error(`Error checking object ${object.data?.objectId}:`, err);
          }
        }

        setSuspiciousObjects(suspicious);

        if (suspicious.length > 0) {
          onSuspiciousObjectDetected(
            `⚠️ Warning: Detected ${suspicious.length} suspicious object(s) in wallet.`
          );
        }
      };

      checkObjects();
    }
  }, [data, suiClient, onSuspiciousObjectDetected]);

  if (!account) {
    return null;
  }

  if (error) {
    return (
      <Card mt="4">
        <Text color="red">❌ Error loading objects: {error.message}</Text>
      </Card>
    );
  }

  if (isPending || !data) {
    return (
      <Card mt="4">
        <Text>🔄 Loading owned objects...</Text>
      </Card>
    );
  }

  return (
    <Card mt="4" variant="classic">
      <Flex direction="column" gap="3">
        <Heading size="4">🎒 Owned Objects</Heading>

        {suspiciousObjects.length > 0 && (
          <Text color="green" size="3">
            {suspiciousObjects.join(", ")}
          </Text>
        )}

        {data.data.length === 0 ? (
          <Text>No objects found in wallet.</Text>
        ) : (
          <>
            <Separator />
            <ScrollArea type="auto" scrollbars="vertical" style={{ maxHeight: 300 }}>
              <Flex direction="column" gap="2">
                {data.data.map((object) => (
                  <Card key={object.data?.objectId} size="1" variant="surface">
                    <Text size="2" wrap="break-word">
                      🧾 <strong>Object ID:</strong> {object.data?.objectId}
                    </Text>
                  </Card>
                ))}
              </Flex>
            </ScrollArea>
          </>
        )}
      </Flex>
    </Card>
  );
}
