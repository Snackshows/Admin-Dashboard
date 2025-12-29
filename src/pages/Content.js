import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch, FaFire, FaHeart } from 'react-icons/fa';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import Toggle from '../components/common/Toggle';
import { useToast } from '../components/common/Toast';
import { useConfirm } from '../components/common/ConfirmDialog';
import { SkeletonTable } from '../components/common/Loading';
import './Content.css';

const Content = () => {
  const toast = useToast();
  const confirm = useConfirm();
  
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'Epic Dance Challenge',
      creator: 'Sarah Johnson',
      duration: '0:45',
      views: 1250000,
      likes: 89000,
      category: 'Dance',
      uploadDate: '2024-12-20',
      trending: true,
      active: true
    },
    {
      id: 2,
      title: 'Cooking Hack: Perfect Pasta',
      creator: 'Chef Mike',
      duration: '1:20',
      views: 567000,
      likes: 45000,
      category: 'Food',
      uploadDate: '2024-12-19',
      trending: false,
      active: true
    },
    {
      id: 3,
      title: 'Amazing Magic Trick Revealed',
      creator: 'Magic Master',
      duration: '0:58',
      views: 890000,
      likes: 67000,
      category: 'Entertainment',
      uploadDate: '2024-12-18',
      trending: true,
      active: true
    },
    {
      id: 4,
      title: 'Funny Cat Compilation',
      creator: 'Pet Lover',
      duration: '1:15',
      views: 2100000,
      likes: 156000,
      category: 'Pets',
      uploadDate: '2024-12-17',
      trending: true,
      active: true
    },
    {
      id: 5,
      title: 'Workout Routine for Beginners',
      creator: 'Fitness Pro',
      duration: '2:30',
      views: 345000,
      likes: 28000,
      category: 'Fitness',
      uploadDate: '2024-12-16',
      trending: false,
      active: true
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    category: '',
    description: '',
    video: null,
    thumbnail: null
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentVideo(null);
    setFormData({
      title: '',
      creator: '',
      category: '',
      description: '',
      video: null,
      thumbnail: null
    });
    setIsModalOpen(true);
  };

  const handleEdit = (video) => {
    setCurrentVideo(video);
    setFormData({
      title: video.title,
      creator: video.creator,
      category: video.category,
      description: video.description || '',
      video: null,
      thumbnail: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (videoId) => {
    const confirmed = await confirm({
      title: 'Delete Video',
      message: 'Are you sure you want to delete this video? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      setVideos(videos.filter(v => v.id !== videoId));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentVideo) {
        setVideos(videos.map(v => 
          v.id === currentVideo.id ? { ...v, ...formData } : v
        ));
        toast.success('Video updated successfully');
      } else {
        const newVideo = {
          id: videos.length + 1,
          ...formData,
          duration: '1:00',
          views: 0,
          likes: 0,
          uploadDate: new Date().toISOString().split('T')[0],
          trending: false,
          active: true
        };
        setVideos([...videos, newVideo]);
        toast.success('Video created successfully');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    }
  };

  const handleToggleTrending = async (videoId, currentStatus) => {
    try {
      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, trending: !currentStatus } : v
      ));
      toast.success(currentStatus ? 'Removed from trending' : 'Added to trending');
    } catch (error) {
      console.error('Error toggling trending:', error);
      toast.error('Failed to update trending status');
    }
  };

  const handleToggleActive = async (videoId, currentStatus) => {
    try {
      setVideos(videos.map(v => 
        v.id === videoId ? { ...v, active: !currentStatus } : v
      ));
      toast.success(currentStatus ? 'Video deactivated' : 'Video activated');
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Failed to update active status');
    }
  };

  const categories = [...new Set(videos.map(v => v.category))];

  const columns = [
    {
      header: 'NO',
      accessor: 'id',
      width: '60px'
    },
    {
      header: 'VIDEO',
      render: (row) => (
        <div className="video-title-cell">
          <div className="video-thumbnail-small">
            <div className="play-overlay">▶</div>
            <div className="duration-badge">{row.duration}</div>
          </div>
          <div>
            <div className="video-name">{row.title}</div>
            <div className="video-meta">{row.creator}</div>
          </div>
        </div>
      )
    },
    {
      header: 'CATEGORY',
      accessor: 'category',
      render: (row) => (
        <span className="category-badge">{row.category}</span>
      )
    },
    {
      header: 'VIEWS',
      accessor: 'views',
      render: (row) => (
        <div className="stat-cell">
          <FaEye className="stat-icon" />
          <span>{(row.views / 1000).toFixed(0)}K</span>
        </div>
      )
    },
    {
      header: 'LIKES',
      accessor: 'likes',
      render: (row) => (
        <div className="stat-cell">
          <FaHeart className="stat-icon heart" />
          <span>{(row.likes / 1000).toFixed(0)}K</span>
        </div>
      )
    },
    {
      header: 'UPLOAD DATE',
      accessor: 'uploadDate',
      render: (row) => new Date(row.uploadDate).toLocaleDateString()
    },
    {
      header: 'TRENDING',
      render: (row) => (
        <button
          className={`trending-btn ${row.trending ? 'is-trending' : ''}`}
          onClick={() => handleToggleTrending(row.id, row.trending)}
          title={row.trending ? 'Remove from trending' : 'Add to trending'}
        >
          <FaFire />
        </button>
      )
    },
    {
      header: 'ACTIVE',
      render: (row) => (
        <Toggle
          checked={row.active}
          onChange={() => handleToggleActive(row.id, row.active)}
        />
      )
    },
    {
      header: 'ACTION',
      render: (row) => (
        <div className="action-buttons">
          <button 
            className="action-btn view-btn" 
            title="View"
            onClick={() => toast.info('Video preview coming soon!')}
          >
            <FaEye />
          </button>
          <button 
            className="action-btn edit-btn" 
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <FaEdit />
          </button>
          <button 
            className="action-btn delete-btn" 
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="content-page">
      <div className="page-header">
        <h2 className="page-title">Short Videos / Content</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          + Add New Video
        </button>
      </div>

      <div className="stats-overview">
        <div className="stat-card-mini">
          <div className="stat-value">{videos.length}</div>
          <div className="stat-label">Total Videos</div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-value">
            {videos.filter(v => v.trending).length}
          </div>
          <div className="stat-label">Trending</div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-value">
            {(videos.reduce((sum, v) => sum + v.views, 0) / 1000000).toFixed(1)}M
          </div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card-mini">
          <div className="stat-value">
            {(videos.reduce((sum, v) => sum + v.likes, 0) / 1000).toFixed(0)}K
          </div>
          <div className="stat-label">Total Likes</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All ({videos.length})
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
              onClick={() => setFilterCategory(category)}
            >
              {category} ({videos.filter(v => v.category === category).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} columns={9} />
      ) : (
        <Table columns={columns} data={filteredVideos} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentVideo ? 'Edit Video' : 'Add New Video'}
      >
        <form onSubmit={handleSubmit} className="video-form">
          <div className="form-group">
            <label className="form-label">Video Title *</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter video title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Creator Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Creator/Channel name"
                value={formData.creator}
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                <option value="Dance">Dance</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Pets">Pets</option>
                <option value="Fitness">Fitness</option>
                <option value="Comedy">Comedy</option>
                <option value="Education">Education</option>
                <option value="Music">Music</option>
                <option value="Travel">Travel</option>
                <option value="Gaming">Gaming</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Video description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Video File *</label>
            <input
              type="file"
              className="file-input"
              accept="video/*"
              onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
            />
            <small className="form-hint">Max file size: 100MB. Recommended: MP4, max 3 minutes</small>
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail Image *</label>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files[0] })}
            />
            <small className="form-hint">Recommended size: 1080x1920px (9:16 ratio)</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentVideo ? 'Update Video' : 'Upload Video'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Content;
