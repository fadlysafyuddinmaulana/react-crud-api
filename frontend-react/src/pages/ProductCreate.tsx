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
import { NumericFormat } from "react-number-format";
import api from "../services/api";

interface ProductCreateProps {
  mode?: "card" | "plain";
  onCreated?: () => void;
}

function ProductCreate({ mode = "card", onCreated }: ProductCreateProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("stock", stock);
      formData.append("price", price);
      if (image) {
        formData.append("image", image);
      }

      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setName("");
      setStock("");
      setPrice("");
      setImage(null);
      if (onCreated) {
        onCreated();
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const handleReset = () => {
    setName("");
    setStock("");
    setPrice("");
    setImage(null);
  };

  const formContent = (
    <>
      {mode === "card" && (
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Create Product
        </Typography>
      )}

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create product.
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ pt: mode === "plain" ? 1 : 0 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <NumericFormat
              customInput={TextField}
              fullWidth
              label="Stock"
              value={stock}
              onValueChange={(values) => {
                setStock(values.value);
              }}
              valueIsNumericString
            />
            <NumericFormat
              customInput={TextField}
              fullWidth
              label="Price"
              value={price}
              onValueChange={(values) => {
                setPrice(values.value);
              }}
              thousandSeparator="."
              decimalSeparator=","
              prefix="Rp "
              valueIsNumericString
            />
          </Stack>

          <Button component="label" variant="outlined" size="medium">
            {image ? "Change Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={mutation.isPending}
            sx={{ mt: 1 }}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>

          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleReset}
            disabled={mutation.isPending}
          >
            Reset Form
          </Button>
        </Stack>
      </Box>
    </>
  );

  if (mode === "plain") {
    return formContent;
  }

  return (
    <Card elevation={3}>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}

export default ProductCreate;
