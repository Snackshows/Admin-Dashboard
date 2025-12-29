import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaStar } from 'react-icons/fa';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import Toggle from '../components/common/Toggle';
import { useToast } from '../components/common/Toast';
import { useConfirm } from '../components/common/ConfirmDialog';
import { SkeletonTable } from '../components/common/Loading';
import { seriesAPI, categoryAPI } from '../services/api';
import './FilmList.css';

const FilmList = () => {
  const toast = useToast();
  const confirm = useConfirm();
  
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSeries, setCurrentSeries] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    banner: '',
    thumbnail: '',
    releaseDate: '',
    isTrending: false,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch both series and categories
      const [seriesResponse, categoriesResponse] = await Promise.all([
        seriesAPI.getAllSeries(),
        categoryAPI.getAllCategories()
      ]);
      
      if (seriesResponse.success && seriesResponse.data) {
        const seriesData = Array.isArray(seriesResponse.data) ? seriesResponse.data : 
                          seriesResponse.data.series ? seriesResponse.data.series : [];
        
        const transformedSeries = seriesData.map((item) => ({
          id: item.id,
          uniqueId: item.uniqueId || `#SER${item.id.substring(0, 6)}`,
          name: item.name,
          description: item.description || '',
          categoryId: item.categoryId,
          categoryName: item.categoryName || 'Unknown',
          banner: item.banner || '',
          thumbnail: item.thumbnail || '',
          releaseDate: item.releaseDate ? new Date(item.releaseDate).toLocaleDateString('en-GB') : '',
          isTrending: item.isTrending || false,
          isActive: item.isActive !== false,
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : ''
        }));
        
        setSeries(transformedSeries);
        console.log('Series loaded:', transformedSeries.length);
      }
      
      if (categoriesResponse.success && categoriesResponse.data) {
        const categoriesData = Array.isArray(categoriesResponse.data) ? categoriesResponse.data :
                               categoriesResponse.data.categories ? categoriesResponse.data.categories : [];
        setCategories(categoriesData);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentSeries(null);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      banner: '',
      thumbnail: '',
      releaseDate: '',
      isTrending: false,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (seriesItem) => {
    setCurrentSeries(seriesItem);
    setFormData({
      name: seriesItem.name,
      description: seriesItem.description,
      categoryId: seriesItem.categoryId,
      banner: seriesItem.banner,
      thumbnail: seriesItem.thumbnail,
      releaseDate: seriesItem.releaseDate,
      isTrending: seriesItem.isTrending,
      isActive: seriesItem.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Series',
      message: 'Are you sure you want to delete this series? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await seriesAPI.deleteSeries(id);
      setSeries(series.filter(item => item.id !== id));
      toast.success('Series deleted successfully');
    } catch (error) {
      console.error('Error deleting series:', error);
      toast.error(error.message || 'Failed to delete series');
    }
  };

  const handleToggle = async (id, field, currentStatus) => {
    try {
      const seriesItem = series.find(item => item.id === id);
      
      await seriesAPI.updateSeries({
        id: id,
        name: seriesItem.name,
        categoryId: seriesItem.categoryId,
        [field]: !currentStatus
      });
      
      setSeries(series.map(item =>
        item.id === id ? { ...item, [field]: !currentStatus } : item
      ));
      
      toast.success(`Series ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling series:', error);
      toast.error(error.message || 'Failed to update series');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (currentSeries) {
        await seriesAPI.updateSeries({
          id: currentSeries.id,
          ...formData
        });
        toast.success('Series updated successfully');
      } else {
        await seriesAPI.createSeries(formData);
        toast.success('Series created successfully');
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving series:', error);
      toast.error(error.message || 'Failed to save series');
    }
  };

  const filteredSeries = series.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns = [
    { header: 'NO', accessor: 'id', width: '60px' },
    { header: 'UNIQUE ID', accessor: 'uniqueId' },
    { header: 'NAME', accessor: 'name' },
    { header: 'CATEGORY', accessor: 'categoryName' },
    { header: 'RELEASE DATE', accessor: 'releaseDate' },
    {
      header: 'TRENDING',
      render: (row) => (
        <Toggle
          checked={row.isTrending}
          onChange={() => handleToggle(row.id, 'isTrending', row.isTrending)}
        />
      )
    },
    {
      header: 'STATUS',
      render: (row) => (
        <Toggle
          checked={row.isActive}
          onChange={() => handleToggle(row.id, 'isActive', row.isActive)}
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
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => handleDelete(row.id)}
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="film-list-page">
      <div className="page-header">
        <h2 className="page-title">Film / Series List</h2>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search series..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            <FaPlus /> Add New Series
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} columns={8} />
      ) : (
        <Table
          columns={columns}
          data={filteredSeries}
          emptyMessage="No series found"
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSeries ? 'Edit Series' : 'Add New Series'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Series Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Banner URL</label>
            <input
              type="text"
              value={formData.banner}
              onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Thumbnail URL</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Release Date</label>
            <input
              type="date"
              value={formData.releaseDate}
              onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
              />
              Trending
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              Active
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {currentSeries ? 'Update' : 'Create'} Series
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FilmList;
