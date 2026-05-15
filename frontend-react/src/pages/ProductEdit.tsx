import { useEffect, useState } from "react";

import { Alert, Button, TextField, Stack, Typography } from "@mui/material";

import api from "../services/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useProductStore } from "../store/productStore";
import { NumericFormat } from "react-number-format";

interface ProductEditProps {
  onUpdated?: () => void;
}

function ProductUpdate({ onUpdated }: ProductEditProps) {
  const queryClient = useQueryClient();

  const { selectedProduct, setSelectedProduct } = useProductStore();

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name ?? "");
      setStock(String(selectedProduct.stock ?? ""));
      setPrice(String(selectedProduct.price ?? ""));
      // don't try to construct File from filename; image stays null until user selects a new file
      setImage(null);
    }
  }, [selectedProduct]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProduct?.id) {
        throw new Error("No product selected");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("stock", stock);
      formData.append("price", price);
      if (image) {
        formData.append("image", image);
      }
      // method spoof for Laravel to accept multipart PUT
      formData.append("_method", "PUT");

      // debug: log form data entries
      for (const pair of formData.entries()) {
        console.debug("formData", pair[0], pair[1]);
      }

      return await api.post(`/products/${selectedProduct.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onError: (err: any) => {
      console.error("Update failed", err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      alert(
        `Update failed (${status || "unknown"}): ${JSON.stringify(
          data || err.message,
        )}`,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      setSelectedProduct(null);
      onUpdated?.();

      alert("Updated");
    },
  });

  if (!selectedProduct) {
    return null;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Update Product</Typography>

      <TextField
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

      {selectedProduct?.image && !image && (
        <Typography variant="caption" color="text.secondary">
          Current file: {selectedProduct.image}
        </Typography>
      )}
      {image && (
        <Typography variant="caption" color="text.secondary">
          {image.name} ({(image.size / 1024).toFixed(1)} KB)
        </Typography>
      )}

      {updateMutation.isError && (
        <Alert severity="error">Failed to update product.</Alert>
      )}

      <Button
        variant="contained"
        onClick={() => updateMutation.mutate()}
        disabled={(updateMutation as any).isPending}
      >
        {(updateMutation as any).isPending ? "Updating..." : "Update"}
      </Button>
    </Stack>
  );
}

export default ProductUpdate;
