"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
  Image,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Pagination,
  Divider,
} from "@heroui/react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  RefreshCw,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Eye,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { TruncatedText } from "../../components/TruncatedText";
import { Header } from "../../components/Header";
import { useAuthGuard } from "../../hooks/useAuthprotect";
import { useProducts } from "../../hooks/useProducts";
import { Product } from "../../types/product";
import { ProductCreateModal } from "../../components/ProductCreateModal";
import { ProductEditModal } from "../../components/ProductEditModal";
import { Footer } from "@/components/Footer";

type ViewMode = "grid" | "list";
type SortOption = "title" | "updatedAt" | "status";
type SortDirection = "asc" | "desc";

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
}

const StatsCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning";
}) => (
  <Card className="border-0 bg-background-secondary/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
    <CardBody className="flex flex-row items-center gap-4 p-6">
      <div className={`p-3 rounded-xl bg-${color}/10`}>
        <div className={`text-${color}`}>{icon}</div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground-secondary font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </CardBody>
  </Card>
);

const ProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) => (
  <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 bg-background-secondary/50 backdrop-blur-sm">
    <CardBody className="p-0">
      {/* Header da imagem */}
      <div className="relative overflow-hidden rounded-t-xl">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width="100%"
          height={200}
          className="object-cover w-full group-hover:scale-110 transition-transform duration-500"
          fallbackSrc="/placeholder-image.png"
        />

        {/* Overlay com ações */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            isIconOnly
            size="sm"
            color="primary"
            variant="solid"
            onPress={() => onEdit(product)}
            className="backdrop-blur-md bg-white/20"
          >
            <Edit size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color="danger"
            variant="solid"
            onPress={() => onDelete(product)}
            className="backdrop-blur-md bg-white/20"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        {/* Badge de status */}
        <div className="absolute top-3 left-3">
          <Chip
            color={product.status ? "success" : "warning"}
            variant="flat"
            size="sm"
            className="backdrop-blur-md"
          >
            {product.status ? "Ativo" : "Inativo"}
          </Chip>
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
            {product.title}
          </h3>

          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="min-w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="edit"
                startContent={<Edit size={16} />}
                onPress={() => onEdit(product)}
              >
                Editar
              </DropdownItem>
              <DropdownItem
                key="delete"
                startContent={<Trash2 size={16} />}
                className="text-danger"
                color="danger"
                onPress={() => onDelete(product)}
              >
                Excluir
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <TruncatedText
          text={product.description}
          className="text-sm text-foreground-secondary leading-relaxed line-clamp-3"
        />

        {/* Footer do card */}
        <div className="flex items-center justify-between pt-2 border-t border-divider">
          <div className="flex items-center gap-1 text-xs text-foreground-secondary">
            <Calendar size={12} />
            {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

const ProductListItem = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) => (
  <Card className="hover:shadow-md transition-shadow duration-200">
    <CardBody className="p-4">
      <div className="flex items-center gap-4">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={80}
          height={80}
          className="object-cover rounded-lg flex-shrink-0"
          fallbackSrc="/placeholder-image.png"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg truncate pr-4">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Chip
                color={product.status ? "success" : "warning"}
                variant="flat"
                size="sm"
              >
                {product.status ? "Ativo" : "Inativo"}
              </Chip>
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="edit"
                    startContent={<Edit size={16} />}
                    onPress={() => onEdit(product)}
                  >
                    Editar
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    startContent={<Trash2 size={16} />}
                    className="text-danger"
                    color="danger"
                    onPress={() => onDelete(product)}
                  >
                    Excluir
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <TruncatedText
            text={product.description}
            className="text-sm text-foreground-secondary mb-3 line-clamp-2"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-foreground-secondary">
              <Calendar size={12} />
              Atualizado em{" "}
              {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      </div>
    </CardBody>
  </Card>
);

export default function ProductsPage() {
  const { isLoading: authLoading, shouldRender } = useAuthGuard();
  const {
    products,
    loading,
    error,
    filters,
    refresh,
    search,
    changePage,
    remove,
    clearError,
    hasProducts,
    totalPages,
    currentPage,
  } = useProducts();

  // Estados da interface
  const [searchTerm, setSearchTerm] = useState(filters.filter || "");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modais
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Produto selecionado para edição/exclusão
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Calcular estatísticas
  const stats: ProductStats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status).length;
    const inactive = total - active;

    return { total, active, inactive };
  }, [products]);

  // Produtos filtrados e ordenados
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por status
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((product) => product.status === isActive);
    }

    // Ordenar produtos
    return [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "updatedAt") {
        aValue = new Date(a.updatedAt).getTime() as unknown as keyof Product;
        bValue = new Date(b.updatedAt).getTime() as unknown as keyof Product;
      }

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [products, statusFilter, sortBy, sortDirection]);

  // Limpar erro quando houver
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background-secondary">
        <div className="text-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-foreground-secondary">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg animate-pulse">Redirecionando...</div>
      </div>
    );
  }

  const handleSearch = () => {
    search({ filter: searchTerm.trim() });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    search({ filter: "" });
  };

  const handleSortChange = (key: SortOption) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDirection("desc");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    const result = await remove(selectedProduct.id);
    if (result.success) {
      toast.success("Produto excluído com sucesso!");
      onDeleteClose();
      setSelectedProduct(null);
    } else {
      toast.error(result.error || "Erro ao excluir produto");
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onEditOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background-secondary">
      <Header />

      <div className="container-modern py-8">
        <div className="space-y-8">
          {/* Cabeçalho da página */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Grid3X3 size={16} />
              Catálogo de Produtos
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Seus Produtos
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Gerencie seu catálogo de produtos de forma simples e eficiente
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              label="Total de Produtos"
              value={stats.total}
              icon={<Grid3X3 size={20} />}
              color="primary"
            />
            <StatsCard
              label="Produtos Ativos"
              value={stats.active}
              icon={<Eye size={20} />}
              color="success"
            />
            <StatsCard
              label="Produtos Inativos"
              value={stats.inactive}
              icon={<Heart size={20} />}
              color="warning"
            />
          </div>

          {/* Barra de ferramentas */}
          <Card className="border-0 bg-background-secondary/30 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                {/* Busca */}
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Buscar por título do produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    startContent={
                      <Search size={20} className="text-foreground-secondary" />
                    }
                    isClearable
                    onClear={handleClearSearch}
                    className="flex-1"
                    classNames={{
                      input: "text-sm",
                      inputWrapper:
                        "bg-background border-1 border-divider hover:border-primary/50 focus-within:border-primary",
                    }}
                  />
                  <Button
                    color="primary"
                    onPress={handleSearch}
                    isLoading={loading}
                    className="px-6"
                  >
                    Buscar
                  </Button>
                </div>

                <Divider
                  orientation="vertical"
                  className="hidden lg:block h-8"
                />

                {/* Controles */}
                <div className="flex gap-2 items-center">
                  {/* Filtro por status */}
                  <Select
                    size="sm"
                    placeholder="Status"
                    selectedKeys={[statusFilter]}
                    onSelectionChange={(keys) =>
                      setStatusFilter(Array.from(keys)[0] as string)
                    }
                    className="w-32"
                    startContent={<Filter size={16} />}
                  >
                    <SelectItem key="all">Todos</SelectItem>
                    <SelectItem key="active">Ativos</SelectItem>
                    <SelectItem key="inactive">Inativos</SelectItem>
                  </Select>

                  {/* Ordenação */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={
                          sortDirection === "asc" ? (
                            <SortAsc size={16} />
                          ) : (
                            <SortDesc size={16} />
                          )
                        }
                        className="min-w-24"
                      >
                        Ordenar
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem
                        key="title"
                        onPress={() => handleSortChange("title")}
                        className={sortBy === "title" ? "bg-primary/10" : ""}
                      >
                        Por título
                      </DropdownItem>
                      <DropdownItem
                        key="updatedAt"
                        onPress={() => handleSortChange("updatedAt")}
                        className={
                          sortBy === "updatedAt" ? "bg-primary/10" : ""
                        }
                      >
                        Por data
                      </DropdownItem>
                      <DropdownItem
                        key="status"
                        onPress={() => handleSortChange("status")}
                        className={sortBy === "status" ? "bg-primary/10" : ""}
                      >
                        Por status
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  {/* Toggle de visualização */}
                  <div className="flex rounded-lg border border-divider overflow-hidden">
                    <Button
                      size="sm"
                      variant={viewMode === "grid" ? "solid" : "light"}
                      color={viewMode === "grid" ? "primary" : "default"}
                      onPress={() => setViewMode("grid")}
                      isIconOnly
                      radius="none"
                    >
                      <Grid3X3 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === "list" ? "solid" : "light"}
                      color={viewMode === "list" ? "primary" : "default"}
                      onPress={() => setViewMode("list")}
                      isIconOnly
                      radius="none"
                    >
                      <List size={16} />
                    </Button>
                  </div>

                  <Button
                    color="default"
                    variant="flat"
                    onPress={refresh}
                    isLoading={loading}
                    isIconOnly
                    size="sm"
                  >
                    <RefreshCw size={16} />
                  </Button>

                  <Button
                    color="primary"
                    startContent={<Plus size={20} />}
                    onPress={onCreateOpen}
                    className="font-medium"
                  >
                    Novo Produto
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Lista de produtos */}
          {loading && !hasProducts ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Spinner size="lg" color="primary" />
              <p className="text-foreground-secondary">
                Carregando produtos...
              </p>
            </div>
          ) : !hasProducts ? (
            <Card className="border-0 bg-background-secondary/30 backdrop-blur-sm">
              <CardBody className="text-center py-24 space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Grid3X3 size={32} className="text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-foreground-secondary">
                    {searchTerm
                      ? "Tente ajustar os filtros de busca"
                      : "Comece criando seu primeiro produto"}
                  </p>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  startContent={<Plus size={20} />}
                  onPress={onCreateOpen}
                  className="font-medium"
                >
                  Criar primeiro produto
                </Button>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Grid/List de produtos */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center py-8">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={changePage}
                    showControls
                    showShadow
                    color="primary"
                    size="lg"
                    classNames={{
                      wrapper: "gap-2",
                      item: "bg-background-secondary border-1 border-divider",
                      cursor: "bg-primary text-white",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        classNames={{
          base: "border-0",
          backdrop: "bg-black/80 backdrop-blur-sm",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">Confirmar Exclusão</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {selectedProduct?.thumbnail && (
                <div className="flex justify-center">
                  <Image
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.title}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg"
                    fallbackSrc="/placeholder-image.png"
                  />
                </div>
              )}
              <div className="text-center space-y-2">
                <p>Tem certeza que deseja excluir o produto</p>
                <p className="font-semibold text-lg">
                  &ldquo;{selectedProduct?.title}&rdquo;?
                </p>
                <p className="text-sm text-foreground-secondary">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onDeleteClose}>
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleDelete}
              isLoading={loading}
              startContent={<Trash2 size={16} />}
            >
              Excluir Produto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de criação */}
      <ProductCreateModal isOpen={isCreateOpen} onClose={onCreateClose} />

      {/* Modal de edição */}
      <ProductEditModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        product={selectedProduct}
      />

      <Footer />
    </div>
  );
}
