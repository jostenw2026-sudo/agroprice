import React, { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import { Modal } from '../components/Modal'
import { Edit2, Trash2, Plus, Search, Loader } from 'lucide-react'

export const Products: React.FC = () => {
  const { products, loading } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formData, setFormData] = useState({
    name_fr: '',
    name_cn: '',
    category: '',
  })

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name_cn.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, categoryFilter])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category))
    return Array.from(cats).sort()
  }, [products])

  const handleAdd = () => {
    setEditingProduct(null)
    setFormData({ name_fr: '', name_cn: '', category: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name_fr: product.name_fr,
      name_cn: product.name_cn,
      category: product.category,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Supabase insert/update
    console.log('Submit:', editingProduct ? 'Update' : 'Create', formData)
    setIsModalOpen(false)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      // TODO: Implement Supabase delete
      console.log('Delete:', id)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gestion des Produits</h2>
          <p className="text-slate-400">Gérez les 25 produits agricoles camerounais</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Ajouter Produit
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher (FR/CN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-semibold text-white mb-4">
          Produits ({filteredProducts.length}/{products.length})
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
            <p className="text-slate-400 mt-3">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Aucun produit trouvé</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Nom (FR)</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Nom (CN)</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Catégorie</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-300">Statut</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-700/50 hover:bg-slate-800/30 transition"
                >
                  <td className="px-4 py-3 font-medium text-white">{product.name_fr}</td>
                  <td className="px-4 py-3 text-slate-300">{product.name_cn}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-slate-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.is_active
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-700/20 text-slate-400'
                    }`}>
                      {product.is_active ? '✓ Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition text-blue-400"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-slate-700 rounded-lg transition text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Modifier Produit' : 'Ajouter Produit'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nom (Français)</label>
            <input
              type="text"
              value={formData.name_fr}
              onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nom (Chinois)</label>
            <input
              type="text"
              value={formData.name_cn}
              onChange={(e) => setFormData({ ...formData, name_cn: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition"
            >
              {editingProduct ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600 font-medium transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Products
