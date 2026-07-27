import React, { useState } from 'react';
import {
  PlusCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryId } from '../../types';

export const AdminView: React.FC = () => {
  const { products, addNewProduct, setViewMode, categories, orders } = useShop();

  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('elixires');
  const [price, setPrice] = useState('160.00');
  const [originalPrice] = useState('190.00');
  const [stock, setStock] = useState('20');
  const [volumeOrWeight, setVolumeOrWeight] = useState('50ml');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [ancestralOrigin, setAncestralOrigin] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortDescription) return;

    addNewProduct({
      slug: name.toLowerCase().replace(/ /g, '-'),
      name,
      subtitle,
      category,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      stock: parseInt(stock, 10) || 10,
      featured: true,
      badges: ['Lançamento Alquímico'],
      volumeOrWeight,
      shortDescription,
      fullDescription: fullDescription || shortDescription,
      ingredients: ingredientsText.split('\n').filter((i) => i.trim().length > 0),
      ancestralOrigin: ancestralOrigin || 'Macerado sob sabedoria botânica tradicional',
      usageInstructions: usageInstructions || 'Uso diário ritualístico com respiração profunda.',
      images: [imageUrl],
      sku: `OMIA-ALQ-${Math.floor(100 + Math.random() * 900)}`
    });

    setIsAddingProduct(false);
    // Reset form
    setName('');
    setSubtitle('');
    setShortDescription('');
  };

  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-6">
        <div>
          <button
            onClick={() => setViewMode('catalog')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#14281D] hover:text-[#C5A059] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
            Voltar para a Loja
          </button>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14281D] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#C5A059]" />
            Painel de Gestão da Apotheca OMIAÁ
          </h1>
          <p className="text-xs text-[#5A6578] mt-1">
            Controle de inventário, cadastro de novos preparados e relatórios de vendas.
          </p>
        </div>

        <button
          onClick={() => setIsAddingProduct(!isAddingProduct)}
          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#C5A059]" />
          <span>{isAddingProduct ? 'Cancelar Cadastro' : 'Cadastrar Novo Produto'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1">
          <span className="text-gray-400 font-bold uppercase text-[10px]">Total em Estoque</span>
          <div className="font-serif text-3xl font-bold text-[#14281D]">{products.length} Produtos</div>
          <span className="text-amber-700 font-bold">{lowStockProducts.length} com estoque baixo</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1">
          <span className="text-gray-400 font-bold uppercase text-[10px]">Pedidos Recebidos</span>
          <div className="font-serif text-3xl font-bold text-[#14281D]">{orders.length} Pedidos</div>
          <span className="text-emerald-800 font-bold">100% liquidados e em preparo</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-1">
          <span className="text-gray-400 font-bold uppercase text-[10px]">Faturamento Acumulado</span>
          <div className="font-serif text-3xl font-bold text-[#14281D]">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </div>
          <span className="text-gray-500 font-medium">Faturamento real gerado</span>
        </div>
      </div>

      {/* Add Product Form */}
      {isAddingProduct && (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C5A059]/50 shadow-xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#14281D]">
            Cadastrar Novo Elixir ou Preparado Botânico
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Nome do Produto</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Bálsamo de Resinas Sagradas"
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Subtítulo / Macerado</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ex: Infusão de Breu Branco e Lavanda"
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              >
                {categories.filter((c) => c.id !== 'todos').map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Volume / Peso</label>
              <input
                type="text"
                value={volumeOrWeight}
                onChange={(e) => setVolumeOrWeight(e.target.value)}
                placeholder="Ex: 50ml ou 100g"
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Preço de Venda (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Quantidade em Estoque</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#4A5568] uppercase mb-1">Descrição Curta</label>
              <textarea
                required
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Resumo das propriedades botânicas..."
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#4A5568] uppercase mb-1">
                Ingredientes Botânicos (Um por linha)
              </label>
              <textarea
                rows={3}
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="Óleo de Rosa Mosqueta Virgem&#10;Extrato de Camomila Romana"
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#4A5568] uppercase mb-1">URL da Imagem</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
          >
            Salvar e Publicar na Apotheca
          </button>
        </form>
      )}

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-[#E2D9C8] overflow-hidden shadow-xs">
        <div className="p-6 border-b border-[#E2D9C8] flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#14281D]">
            Catálogo Atual de Produtos
          </h3>
          <span className="text-xs text-[#8C7A5B] font-bold">
            {products.length} itens cadastrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4A5568]">
            <thead className="bg-[#FAF7F2] text-[#14281D] uppercase font-bold text-[10px] tracking-wider border-b border-[#E2D9C8]">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Avaliação</th>
                <th className="p-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9C8]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="p-4 font-bold text-[#14281D] flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-[#F4EFE6] border border-[#E2D9C8]" />
                    <div>
                      <span className="block">{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{p.sku}</span>
                    </div>
                  </td>
                  <td className="p-4 uppercase font-bold text-[11px] text-[#8C7A5B]">{p.category}</td>
                  <td className="p-4 font-serif font-bold text-[#14281D]">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      p.stock > 10 ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {p.stock} un.
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#C5A059]">★ {p.rating}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewMode('catalog')}
                      className="text-xs text-[#14281D] hover:text-[#C5A059] font-bold underline transition-colors"
                    >
                      Ver na Loja
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

