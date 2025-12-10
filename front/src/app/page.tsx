"use client";

import { Button, Input, CategoryCard, ProductCard, Container, Textarea } from "@/components/ui";

export default function Home() {
  const handleEdit = (id: string) => console.log(`Edit product ${id}`);
  const handleDelete = (id: string) => console.log(`Delete product ${id}`);
  const handleBoost = (id: string) => console.log(`Boost product ${id}`);

  return (
    <Container>
    <div className="min-h-screen bg-linear-to-b">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-6xl font-bold text-white text-center mb-8">
          Welcome to PurpleDog
        </h1>
        <p className="text-xl text-white text-center">
          Your hackathon project homepage
        </p>
        <Button variant="primary" size="lg">S'inscrire</Button>
        <Button variant="secondary" size="lg">S'inscrire</Button>
        <Button variant="outline" size="lg">S'inscrire</Button>
    
<Input variant="light" label="Email" placeholder="Votre adresse email" />
<CategoryCard image="/path/to/image.jpg" title="Joaillerie" />
<ProductCard
  id="1"
  title="Collier Diamants"
  price={98000}
  image="/image.jpg"
  status="online"
  viewMode="seller"
  offersCount={5}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onBoost={handleBoost}
/>
<Textarea variant="transparent" label="Votre message" placeholder="Écrivez votre message ici..." />

      </main>
    </div>
    </Container>
  );
}