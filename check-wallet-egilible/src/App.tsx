import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Theme } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import "@radix-ui/themes/styles.css";
import "./App.css"; // File CSS tùy chỉnh

function App() {
  return (
    <Theme
      accentColor="blue"
      grayColor="slate"
      panelBackground="solid"
      radius="medium"
      appearance="dark" // Sử dụng dark theme để phù hợp với Sui
    >
      <Flex
        direction="column"
        minHeight="100vh"
        style={{ background: "#121212" }}
      >
        {/* Header */}
        <Flex
          position="sticky"
          top="0"
          px={{ initial: "3", md: "5" }}
          py="3"
          justify="between"
          align="center"
          style={{
            background: "rgb(3, 15, 28)", // <- màu bạn muốn
            borderBottom: "1px solid #2A3B5A",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <Box>
            <img
              src="../src/img/Gr5cVGIXAAMIoi6.jpg"
              alt="Sui Logo"
              style={{
                height: "50px", // Bạn có thể thay đổi kích thước ở đây
                width: "auto",
              }}
            />
          </Box>

          <Box>
            <ConnectButton
              style={{
                background: "#6FB3F2",
                color: "#FFFFFF",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              className="connect-button"
            />
          </Box>
        </Flex>

        {/* Main Content */}
        <Container
          size="4"
          px={{ initial: "3", md: "5" }}
          py="5"
          style={{ flex: 1 }}
        >
          <Box
            style={{
              background: "#1E2A3C", // Màu nền tối của Sui
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minHeight: "500px",
            }}
          >
            <WalletStatus />
          </Box>
        </Container>

        {/* Footer */}
        <Flex
          as="footer"
          justify="center"
          py="3"
          style={{
            background: "#1A2A44",
            borderTop: "1px solid #2A3B5A",
            color: "#A0AEC0",
            fontSize: "14px",
          }}
        >
          <Box>
            Powered by{" "}
            <a
              href="https://sui.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6FB3F2", textDecoration: "none" }}
            >
              Sui Blockchain
            </a>
          </Box>
        </Flex>
      </Flex>
    </Theme>
  );
}

export default App;
