import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaSearch, FaUserTie, FaEnvelope, FaPhone } from 'react-icons/fa';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import Toggle from '../components/common/Toggle';
import { useToast } from '../components/common/Toast';
import { useConfirm } from '../components/common/ConfirmDialog';
import { SkeletonTable } from '../components/common/Loading';
import './Employee.css';

const Employee = () => {
  const toast = useToast();
  const confirm = useConfirm();
  
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@storybox.com',
      phone: '+1 234 567 8901',
      position: 'Content Manager',
      department: 'Content',
      salary: 75000,
      joinDate: '2023-01-15',
      active: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@storybox.com',
      phone: '+1 234 567 8902',
      position: 'Senior Developer',
      department: 'Engineering',
      salary: 95000,
      joinDate: '2022-08-20',
      active: true
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@storybox.com',
      phone: '+1 234 567 8903',
      position: 'Marketing Manager',
      department: 'Marketing',
      salary: 85000,
      joinDate: '2023-03-10',
      active: true
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@storybox.com',
      phone: '+1 234 567 8904',
      position: 'HR Specialist',
      department: 'HR',
      salary: 65000,
      joinDate: '2023-06-01',
      active: true
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@storybox.com',
      phone: '+1 234 567 8905',
      position: 'QA Engineer',
      department: 'Engineering',
      salary: 70000,
      joinDate: '2022-11-15',
      active: false
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    joinDate: '',
    address: '',
    emergencyContact: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: '',
      joinDate: '',
      address: '',
      emergencyContact: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      joinDate: employee.joinDate,
      address: employee.address || '',
      emergencyContact: employee.emergencyContact || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeId) => {
    const confirmed = await confirm({
      title: 'Delete Employee',
      message: 'Are you sure you want to delete this employee? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      setEmployees(employees.filter(e => e.id !== employeeId));
      toast.success('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentEmployee) {
        setEmployees(employees.map(e => 
          e.id === currentEmployee.id ? { ...e, ...formData } : e
        ));
        toast.success('Employee updated successfully');
      } else {
        const newEmployee = {
          id: employees.length + 1,
          ...formData,
          active: true
        };
        setEmployees([...employees, newEmployee]);
        toast.success('Employee created successfully');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Failed to save employee');
    }
  };

  const handleToggleActive = async (employeeId, currentStatus) => {
    const confirmed = await confirm({
      title: currentStatus ? 'Deactivate Employee' : 'Activate Employee',
      message: currentStatus 
        ? 'This will mark the employee as inactive.' 
        : 'This will mark the employee as active.',
      confirmText: currentStatus ? 'Deactivate' : 'Activate',
      type: 'warning'
    });

    if (!confirmed) return;

    try {
      setEmployees(employees.map(e => 
        e.id === employeeId ? { ...e, active: !currentStatus } : e
      ));
      toast.success(currentStatus ? 'Employee deactivated' : 'Employee activated');
    } catch (error) {
      console.error('Error toggling active:', error);
      toast.error('Failed to update employee status');
    }
  };

  const departments = [...new Set(employees.map(e => e.department))];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const columns = [
    {
      header: 'NO',
      accessor: 'id',
      width: '60px'
    },
    {
      header: 'EMPLOYEE',
      render: (row) => (
        <div className="employee-info-cell">
          <div className="employee-avatar">
            {getInitials(row.name)}
          </div>
          <div>
            <div className="employee-name">{row.name}</div>
            <div className="employee-position">{row.position}</div>
          </div>
        </div>
      )
    },
    {
      header: 'CONTACT',
      render: (row) => (
        <div className="contact-cell">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>{row.email}</span>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span>{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      header: 'DEPARTMENT',
      accessor: 'department',
      render: (row) => (
        <span className="department-badge">{row.department}</span>
      )
    },
    {
      header: 'SALARY',
      accessor: 'salary',
      render: (row) => `$${row.salary.toLocaleString()}`
    },
    {
      header: 'JOIN DATE',
      accessor: 'joinDate',
      render: (row) => new Date(row.joinDate).toLocaleDateString()
    },
    {
      header: 'STATUS',
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
            title="View Details"
            onClick={() => toast.info('View details coming soon!')}
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

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="employee-page">
      <div className="page-header">
        <h2 className="page-title">Employee Management</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FaUserTie /> Add New Employee
        </button>
      </div>

      <div className="employee-stats">
        <div className="employee-stat-card">
          <FaUserTie className="stat-icon" />
          <div className="stat-value">{employees.length}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="employee-stat-card">
          <div className="stat-value">{employees.filter(e => e.active).length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="employee-stat-card">
          <div className="stat-value">{employees.filter(e => !e.active).length}</div>
          <div className="stat-label">Inactive</div>
        </div>
        <div className="employee-stat-card">
          <div className="stat-value">{departments.length}</div>
          <div className="stat-label">Departments</div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterDepartment === 'all' ? 'active' : ''}`}
            onClick={() => setFilterDepartment('all')}
          >
            All Departments ({employees.length})
          </button>
          {departments.map(dept => (
            <button 
              key={dept}
              className={`filter-btn ${filterDepartment === dept ? 'active' : ''}`}
              onClick={() => setFilterDepartment(dept)}
            >
              {dept} ({employees.filter(e => e.department === dept).length})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} columns={8} />
      ) : (
        <Table columns={columns} data={filteredEmployees} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="input-field"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Position *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Senior Developer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                className="input-field"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="">Select department</option>
                <option value="Engineering">Engineering</option>
                <option value="Content">Content</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="Customer Support">Customer Support</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Salary (USD) *</label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g., 75000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Join Date *</label>
              <input
                type="date"
                className="input-field"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input
                type="tel"
                className="input-field"
                placeholder="+1 234 567 8900"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="input-field"
              rows="3"
              placeholder="Full address..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {currentEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employee;
