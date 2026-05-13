import {
  AppBar,
  Avatar,
  Box,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import ProductList from "./pages/ProductList";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f3f5f9" }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ minHeight: "64px", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            Product Management
          </Typography>
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "primary.main",
              fontSize: 14,
            }}
          >
            A
          </Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <ProductList />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
