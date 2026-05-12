import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import api from "../services/api";
import type { Product } from "../interfaces/Product";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200, flex: 1 },
  { field: "stock", headerName: "Stock", width: 100 },
  { field: "price", headerName: "Price", width: 120 },
];

function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    const response = await api.get("/products");
    return response.data;
  };

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filteredProducts =
    products?.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <CircularProgress size={24} />
            <Typography>Loading products...</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading products.</Alert>;
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Product List
        </Typography>

        <TextField
          fullWidth
          placeholder="Search product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductList;
