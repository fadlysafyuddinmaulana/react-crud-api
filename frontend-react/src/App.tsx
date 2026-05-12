import { Box, Container, Typography } from "@mui/material";
import ProductCreate from "./pages/ProductCreate";
import ProductList from "./pages/ProductList";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Product Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage products with Material UI
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          <ProductList />
          <ProductCreate />
        </Box>
      </Container>
    </Box>
  );
}

export default App;
