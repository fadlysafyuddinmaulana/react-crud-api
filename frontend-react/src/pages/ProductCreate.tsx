import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import api from "../services/api";

function ProductCreate() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

  const handleNumberInput = (value: string) => {
    // Hanya izinkan angka, hapus karakter non-angka
    return value.replace(/[^0-9]/g, "");
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/products", {
        name,
        stock: Number(stock),
        price: Number(price),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setName("");
      setStock("");
      setPrice("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Create Product
        </Typography>

        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to create product.
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                type="text"
                label="Stock"
                value={stock}
                onChange={(e) => setStock(handleNumberInput(e.target.value))}
                placeholder="Hanya angka"
              />
              <TextField
                fullWidth
                type="text"
                label="Price"
                value={price}
                onChange={(e) => setPrice(handleNumberInput(e.target.value))}
                placeholder="Hanya angka"
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={mutation.isPending}
              sx={{ mt: 1 }}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCreate;
