import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import api from "../services/api";
import {
  analyzeProducts,
  type ProductAnalysisResponse,
} from "../services/analysis";
import type { Product } from "../interfaces/Product";
import ProductCreate from "./ProductCreate";
import ProductEdit from "./ProductEdit";
import { useProductStore } from "../store/productStore";

function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeResult, setAnalyzeResult] =
    useState<ProductAnalysisResponse | null>(null);
  const [openAnalyzeDialog, setOpenAnalyzeDialog] = useState(false);
  const queryClient = useQueryClient();
  const { setSelectedProduct } = useProductStore();

  const fetchProducts = async () => {
    const response = await api.get("/products");
    return response.data;
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const stockColor = (stock: number): "success" | "warning" | "error" => {
    if (stock > 100) {
      return "success";
    }
    if (stock > 50) {
      return "warning";
    }
    return "error";
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 72 },
    {
      field: "image",
      headerName: "Image",
      width: 92,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const baseStorageUrl = import.meta.env.VITE_API_URL
          ? import.meta.env.VITE_API_URL.replace("/api", "/storage")
          : "http://localhost:8000/storage";
        const imageUrl = params.row.image
          ? `${baseStorageUrl}/${params.row.image}`
          : null;
        return (
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt={params.row.name}
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1.5,
                  objectFit: "cover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                No Image
              </Typography>
            )}
          </Box>
        );
      },
    },
    { field: "name", headerName: "Name", minWidth: 240, flex: 1 },
    {
      field: "stock",
      headerName: "Stock",
      width: 108,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<Product, number>) => (
        <Chip
          label={params.value ?? 0}
          color={stockColor(params.value ?? 0)}
          size="small"
          sx={{ minWidth: 56, fontWeight: 700, borderRadius: 99 }}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 116,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<Product, number>) => (
        <Typography sx={{ fontWeight: 600, color: "primary.main" }}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(params.value ?? 0)}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            color="warning"
            onClick={() => {
              setSelectedProduct(params.row);
              setOpenEditDialog(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => deleteMutation.mutate(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filteredProducts =
    products?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(product.id).includes(searchQuery),
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
    <Card
      elevation={0}
      sx={{ borderRadius: 1, border: "1px solid", borderColor: "divider" }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 2.5,
            justifyContent: "space-between",
            alignItems: { sm: "center" },
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontSize: { xs: 30, md: 38 }, fontWeight: 600 }}
          >
            Products
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenCreateDialog(true)}
              sx={{ px: 2.5, minWidth: 160, borderRadius: 1 }}
            >
              + Add Product
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={async () => {
                setAnalyzing(true);
                try {
                  const result = await analyzeProducts();
                  setAnalyzeResult(result);
                } catch (e: any) {
                  const errorMsg =
                    e?.response?.data?.message ||
                    e?.message ||
                    "Failed to call analysis";
                  console.error("Analysis error:", e);
                  setAnalyzeResult({
                    status: "error",
                    message: errorMsg,
                  });
                } finally {
                  setAnalyzing(false);
                  setOpenAnalyzeDialog(true);
                }
              }}
              sx={{ px: 2.5, minWidth: 160, borderRadius: 1 }}
            >
              Analyze
            </Button>
          </Stack>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search by product name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ color: "text.secondary" }}
                >
                  Search
                </InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2.5 }}
        />

        <Box sx={{ height: 480, width: "100%" }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSizeOptions={[8, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 8 },
              },
            }}
            disableRowSelectionOnClick
            rowHeight={68}
            sx={{
              borderRadius: 0,
              border: "1px solid",
              borderColor: "divider",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f7f8fb",
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-cell": {
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                color: "text.secondary",
              },
            }}
          />
        </Box>

        <Dialog
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Add Product</DialogTitle>
          <DialogContent>
            <ProductCreate
              mode="plain"
              onCreated={() => {
                setOpenCreateDialog(false);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedProduct(null);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Product</DialogTitle>
          <DialogContent>
            <ProductEdit
              onUpdated={() => {
                setOpenEditDialog(false);
                setSelectedProduct(null);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openAnalyzeDialog}
          onClose={() => setOpenAnalyzeDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Analysis Result</DialogTitle>
          <DialogContent>
            {analyzing ? (
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <CircularProgress size={20} />
                <Typography>Running analysis...</Typography>
              </Stack>
            ) : (
              <Box
                sx={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              >
                {analyzeResult
                  ? JSON.stringify(analyzeResult, null, 2)
                  : "No result"}
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default ProductList;
