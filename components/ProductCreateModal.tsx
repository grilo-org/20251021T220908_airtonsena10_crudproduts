"use client";

import React, { useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  Image,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { toast } from "sonner";
import { createProductSchema, CreateProductForm } from "../lib/validations/product";
import { useProducts } from "../hooks/useProducts";

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCreateModal({ isOpen, onClose }: ProductCreateModalProps) {
  const { create, loading } = useProducts();
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailType, setThumbnailType] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
  });

  const thumbnailValue = watch('thumbnail');

  // Função para lidar com upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação de tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validação de tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB');
        return;
      }

      setValue('thumbnail', file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clique para abrir seletor de arquivo
  const openFileDialog = () => fileInputRef.current?.click();

  // Drag and Drop
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const synthetic = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(synthetic);
    }
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
  };

  // Função para lidar com URL
  const handleUrlChange = (url: string) => {
    setValue('thumbnail', url);
    if (url && isValidUrl(url)) {
      setThumbnailPreview(url);
    } else {
      setThumbnailPreview('');
    }
  };

  // Validar URL
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Limpar thumbnail
  const clearThumbnail = () => {
    setValue('thumbnail', '');
    setThumbnailPreview('');
  };

  // Submissão do formulário
  const onSubmit = async (data: CreateProductForm) => {
    const result = await create(data);
    
    if (result.success) {
      toast.success('Produto criado com sucesso!');
      handleClose();
    } else {
      toast.error(result.error || 'Erro ao criar produto');
    }
  };

  // Fechar modal e resetar
  const handleClose = () => {
    reset();
    setThumbnailPreview('');
    setThumbnailType('file');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        wrapper: "items-center sm:items-center",
        base: "w-full sm:max-w-2xl mx-2 max-h-[90vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl",
        body: "sm:p-6 p-4 overflow-auto",
        header: "sm:p-6 p-4",
        footer: "sm:p-6 p-4",
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Criar Novo Produto</ModalHeader>
          
          <ModalBody className="space-y-4">
            {/* Título */}
            <Input
              label="Título"
              placeholder="Digite o título do produto"
              {...register('title')}
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              isRequired
            />

            {/* Descrição */}
            <Textarea
              label="Descrição"
              placeholder="Digite a descrição do produto"
              {...register('description')}
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              minRows={3}
              maxRows={6}
              isRequired
            />

            {/* Thumbnail */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Thumbnail <span className="text-danger">*</span>
              </label>
              
              {/* Seletor de tipo */}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant={thumbnailType === 'file' ? 'solid' : 'flat'}
                  color={thumbnailType === 'file' ? 'primary' : 'default'}
                  startContent={<Upload size={16} />}
                  onPress={() => setThumbnailType('file')}
                  type="button"
                >
                  Upload
                </Button>
                <Button
                  size="sm"
                  variant={thumbnailType === 'url' ? 'solid' : 'flat'}
                  color={thumbnailType === 'url' ? 'primary' : 'default'}
                  startContent={<LinkIcon size={16} />}
                  onPress={() => setThumbnailType('url')}
                  type="button"
                >
                  URL
                </Button>
              </div>

              {/* Input baseado no tipo */}
              {thumbnailType === 'file' ? (
                <div className="space-y-2">
                  {/* Dropzone */}
                  <div
                    onClick={openFileDialog}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors h-32 sm:h-40 ${
                      isDragging ? 'border-primary bg-primary-50/30 dark:bg-primary-900/20' : 'border-default-300 dark:border-default-600'
                    }`}
                  >
                    <p className="text-sm text-foreground/80 p-4 text-center">
                      Arraste e solte a imagem aqui ou <span className="text-primary font-medium cursor-pointer">clique para enviar</span>
                    </p>
                    <p className="text-xs text-foreground/60 mt-1 text-center">JPG, PNG, GIF • até 5MB</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <Input
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={typeof thumbnailValue === 'string' ? thumbnailValue : ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  startContent={<LinkIcon size={16} />}
                />
              )}

              {/* Preview da imagem */}
              {thumbnailPreview && (
                <Card>
                  <CardBody className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={thumbnailPreview}
                        alt="Preview"
                        width={72}
                        height={72}
                        className="object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Preview da imagem</p>
                        <p className="text-xs text-foreground/60 truncate">
                          {thumbnailType === 'file' && thumbnailValue instanceof File
                            ? `${thumbnailValue.name} (${(thumbnailValue.size / 1024 / 1024).toFixed(2)} MB)`
                            : 'Imagem da URL'}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={clearThumbnail}
                        type="button"
                        aria-label="Remover thumbnail"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Erro de validação */}
              {errors.thumbnail && (
                <p className="text-xs text-danger">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={handleClose}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={loading}
              isDisabled={!thumbnailPreview}
            >
              Criar Produto
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
