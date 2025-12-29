import React, { useState } from 'react';
import { FaCrown, FaCheck } from 'react-icons/fa';
import { useToast } from '../components/common/Toast';
import './VIPPlan.css';

const VIPPlan = () => {
  const toast = useToast();
  const [plans] = useState([
    { id: 1, name: 'Free', price: 0, features: ['Watch with ads', 'SD quality', 'Limited content'], users: 15000, popular: false },
    { id: 2, name: 'Basic', price: 4.99, features: ['Ad-free', 'HD quality', 'Download videos', 'Early access'], users: 3500, popular: false },
    { id: 3, name: 'Premium', price: 9.99, features: ['All Basic features', '4K quality', 'Offline downloads', 'Exclusive content', 'Priority support'], users: 8200, popular: true },
    { id: 4, name: 'Ultimate', price: 19.99, features: ['All Premium features', 'Family sharing (5 devices)', 'VIP events access', '24/7 premium support'], users: 2100, popular: false }
  ]);

  return (
    <div className="vip-plan-page">
      <div className="page-header">
        <h2 className="page-title">VIP Subscription Plans</h2>
        <button className="btn btn-primary">+ Add New Plan</button>
      </div>
      <div className="vip-plans-grid">
        {plans.map(plan => (
          <div key={plan.id} className={`vip-plan-card ${plan.popular ? 'popular' : ''}`}>
            {plan.popular && <div className="popular-badge"><FaCrown /> Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{plan.price}</span>
              <span className="period">/month</span>
            </div>
            <div className="plan-users">{plan.users.toLocaleString()} active users</div>
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}><FaCheck className="check-icon" /> {feature}</li>
              ))}
            </ul>
            <button className="btn btn-block btn-primary" onClick={() => toast.info('Edit plan coming soon')}>
              Manage Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VIPPlan;