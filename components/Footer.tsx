"use client";

import React from "react";
import { Package, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-divider/30 mt-auto">
      <div className="container-modern py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">CrudProdutos</span>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            <p>© {currentYear} CrudProdutos</p>
            <div className="hidden md:block w-1 h-1 bg-foreground-secondary/50 rounded-full" />
            <p className="flex items-center gap-1">
              Feito com
              <Heart className="w-3 h-3 text-red-500 fill-current" />
              Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
