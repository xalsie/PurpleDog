"use client";

import { useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6"; 
import { Button, FilterOption,FilterDropdown } from "@/components/ui"; 


export function ProductSearchAndFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    price: "",
    saleType: "",
    category: "",
    status: "",
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche effectuée avec:", searchTerm, "et les filtres:", filters);
  };

  const handleClearFilters = () => {
    setFilters({
      price: "",
      saleType: "",
      category: "",
      status: "",
    });
  };

  const isFilterActive = Object.values(filters).some(value => value !== "");

  const saleTypeOptions: FilterOption[] = [
    { label: "Enchère", value: "auction" },
    { label: "Vente Rapide", value: "quick_sale" },
  ];

  const categoryOptions: FilterOption[] = [
    { label: "Peinture", value: "painting" },
    { label: "Sculpture", value: "sculpture" },
    { label: "Objets", value: "objects" },
    { label: "Montres", value: "watches" },
  ];
  
  const statusOptions: FilterOption[] = [
    { label: "En Vente", value: "available" },
    { label: "Plus Disponible (Historique)", value: "sold" },
  ];

  const priceOptions: FilterOption[] = [
    { label: "Croissant", value: "asc" },
    { label: "Décroissant", value: "desc" },
  ];

  return (
    <div className="w-full p-4 bg-BeigeC md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative rounded-sm shadow-md overflow-hidden border border-gray-200">
            <input
              type="text"
              placeholder="Rechercher des produits sur la plateforme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 text-gray-800 focus:outline-none focus:ring-2 focus:ring-VioletC bg-white text-base"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full w-12 flex items-center justify-center bg-transparent text-gray-500 hover:text-VioletC transition-colors"
              aria-label="Rechercher"
            >
              <FaMagnifyingGlass className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-start sm:items-center sm:justify-center">
          
          {/* Menus déroulants pour les filtres */}
          <FilterDropdown
            label="Prix"
            options={priceOptions}
            onSelect={(v) => handleFilterChange("price", v)}
            selectedValue={filters.price}
          />
          
          <FilterDropdown
            label="Type de Vente"
            options={saleTypeOptions}
            onSelect={(v) => handleFilterChange("saleType", v)}
            selectedValue={filters.saleType}
          />

          <FilterDropdown
            label="Catégorie"
            options={categoryOptions}
            onSelect={(v) => handleFilterChange("category", v)}
            selectedValue={filters.category}
          />

          <FilterDropdown
            label="Statut"
            options={statusOptions}
            onSelect={(v) => handleFilterChange("status", v)}
            selectedValue={filters.status}
          />
          
          {/* Bouton de réinitialisation des filtres */}
          {isFilterActive && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-800 flex items-center mt-2 sm:mt-0"
            >
              {/* Utilisation de l'icône FaXmark de react-icons */}
              <FaXmark className="h-4 w-4 mr-1" />
              Effacer les filtres
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductSearchAndFilters;