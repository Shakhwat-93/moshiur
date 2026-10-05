import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import DynamicTicker from './components/DynamicTicker';
import DynamicNavbar from './components/DynamicNavbar';
import DynamicHero from './components/DynamicHero';
import DynamicTrustStrip from './components/DynamicTrustStrip';
import DynamicSymptoms from './components/DynamicSymptoms';
import DynamicBenefits from './components/DynamicBenefits';
import DynamicBeforeAfter from './components/DynamicBeforeAfter';
import DynamicPackages from './components/DynamicPackages';
import DynamicLabReport from './components/DynamicLabReport';
import DynamicReviews from './components/DynamicReviews';
import DynamicOrderForm from './components/DynamicOrderForm';
import DynamicFaq from './components/DynamicFaq';
import InfoSection from '../components/InfoSection';
import DynamicFooter from './components/DynamicFooter';
import DynamicFloatingActions from './components/DynamicFloatingActions';
import SocialToast from '../components/SocialToast';
import SuccessModal from '../components/SuccessModal';

export default function Storefront({ onOpenAdmin }) {
  const { homepageSections, loading } = useCms();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Render individual section dynamically based on section id
  const renderSection = (sec) => {
    if (!sec.is_enabled) return null;

    switch (sec.id) {
      case 'hero':
        return <DynamicHero key={sec.id} />;
      case 'trust_strip':
        return <DynamicTrustStrip key={sec.id} />;
      case 'symptoms':
        return <DynamicSymptoms key={sec.id} />;
      case 'benefits':
        return <DynamicBenefits key={sec.id} />;
      case 'before_after':
        return <DynamicBeforeAfter key={sec.id} />;
      case 'packages':
        return (
          <DynamicPackages
            key={sec.id}
            onSelectProduct={(pId) => setSelectedProductId(pId)}
          />
        );
      case 'lab_report':
        return <DynamicLabReport key={sec.id} />;
      case 'reviews':
        return <DynamicReviews key={sec.id} />;
      case 'order_form':
        return (
          <DynamicOrderForm
            key={sec.id}
            selectedProductId={selectedProductId}
            onSelectProduct={(pId) => setSelectedProductId(pId)}
            onOrderSuccess={(order) => setCompletedOrder(order)}
          />
        );
      case 'faq':
        return <DynamicFaq key={sec.id} />;
      case 'info':
        return <InfoSection key={sec.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="storefront-app">
      {/* Dynamic Announcement Ticker */}
      <DynamicTicker />

      {/* Dynamic Header & Navigation */}
      <DynamicNavbar onOpenAdmin={onOpenAdmin} />

      {/* Dynamic Homepage Sections loop (Ordered by sort_order from Supabase) */}
      <main>
        {homepageSections.map((sec) => (
          <React.Fragment key={sec.id}>
            {renderSection(sec)}
            {sec.id === 'benefits' && !homepageSections.some((s) => s.id === 'before_after') && (
              <DynamicBeforeAfter />
            )}
          </React.Fragment>
        ))}
        {/* Render FAQ if not explicitly in sections */}
        {!homepageSections.some((s) => s.id === 'faq') && <DynamicFaq />}
      </main>

      {/* Dynamic Footer with helpline phones */}
      <DynamicFooter onOpenAdmin={onOpenAdmin} />

      {/* Floating Call & WhatsApp Buttons */}
      <DynamicFloatingActions />

      {/* Social proof toast */}
      <SocialToast />

      {/* Success Modal */}
      <SuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />
    </div>
  );
}
