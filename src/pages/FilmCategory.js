import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Table from '../components/common/Table';
import Toggle from '../components/common/Toggle';
import Modal from '../components/common/Modal';
import { categoryAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import { useConfirm } from '../components/common/ConfirmDialog';
import { SkeletonTable } from '../components/common/Loading';
import './FilmCategory.css';

const FilmCategory = () => {
  const toast = useToast();
  const confirm = useConfirm();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAllCategories();
      
      if (response.success && response.data) {
        // Transform API data
        const categoriesData = Array.isArray(response.data) ? response.data : 
                              response.data.categories ? response.data.categories : [];
        
        const transformedCategories = categoriesData.map((cat, index) => ({
          id: cat.id,
          uniqueId: cat.uniqueId || `#CAT${cat.id.substring(0, 6)}`,
          name: cat.name,
          description: cat.description || '',
          image: cat.image || cat.thumbnail || '',
          totalMovies: cat.totalMovies || cat.seriesCount || 0,
          date: cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'),
          active: cat.isActive !== false
        }));
        
        setCategories(transformedCategories);
        console.log('Categories loaded:', transformedCategories.length);
      } else {
        console.error('API response:', response);
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentCategory(null);
    setFormData({ name: '', description: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({ 
      name: category.name, 
      description: category.description || '',
      isActive: category.active 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await categoryAPI.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      // Find the category
      const category = categories.find(cat => cat.id === id);
      
      // Update via API
      await categoryAPI.updateCategory({
        id: id,
        name: category.name,
        description: category.description,
        isActive: !currentStatus
      });
      
      // Update local state
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, active: !currentStatus } : cat
      ));
      
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling category:', error);
      toast.error(error.message || 'Failed to update category status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentCategory) {
        // Update existing category
        await categoryAPI.updateCategory({
          id: currentCategory.id,
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive
        });
        toast.success('Category updated successfully');
      } else {
        // Create new category
        await categoryAPI.createCategory({
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive
        });
        toast.success('Category created successfully');
      }
      
      setIsModalOpen(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const columns = [
    { header: 'NO', accessor: 'id', width: '60px' },
    { header: 'UNIQUE ID', accessor: 'uniqueId' },
    {
      header: 'CATEGORY IMAGE',
      render: (row) => (
        <div className="category-image">
          <img src={row.image} alt={row.name} />
        </div>
      )
    },
    { header: 'CATEGORY NAME', accessor: 'name' },
    { header: 'TOTAL MOVIES', accessor: 'totalMovies' },
    { header: 'DATE', accessor: 'date' },
    {
      header: 'ACTIVE',
      render: (row) => (
        <Toggle
          checked={row.active}
          onChange={() => handleToggle(row.id, row.active)}
        />
      )
    },
    {
      header: 'ACTION',
      render: (row) => (
        <div className="action-buttons">
          <button 
            className="action-btn edit-btn"
            onClick={() => handleEdit(row)}
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="film-category-page">
      <div className="page-header">
        <h2 className="page-title">Film Category</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FaPlus /> New
        </button>
      </div>

      <Table columns={columns} data={categories} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCategory ? 'Edit Film Category' : 'Add Film Category'}
      >
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label className="form-label">Image</label>
            <div className="file-input-container">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="file-input"
              />
              {formData.image && (
                <div className="preview-image">
                  <img src={URL.createObjectURL(formData.image)} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      <div className="pagination">
        <span>Showing 1 out of 1 pages</span>
        <div className="pagination-controls">
          <button className="pagination-btn">&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default FilmCategory;
