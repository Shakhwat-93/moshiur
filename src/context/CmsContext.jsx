import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const CmsContext = createContext(null);

export const DEFAULT_SITE_SETTINGS = {
  store_name: 'Herbheez BD',
  tagline: 'জিরো এলার্জি — এলার্জি ও পুরাতন চর্মরোগ থেকে স্থায়ী মুক্তির প্রাকৃতিক সমাধান',
  logo_url: '/images/herbheez-logo.webp',
  favicon_url: '/images/herbheez-logo.webp',
  phone_1: '01604-939479',
  phone_2: '01859-020608',
  whatsapp_number: '8801604939479',
  email: 'support@herbheezbd.net',
  address: 'ঢাকা, বাংলাদেশ',
  announcement_text: '🌿 ১০০% ভেষজ ফর্মুলা, কোনো ক্ষতিকর কেমিক্যাল বা পার্শ্বপ্রতিক্রিয়া নেই ★ সারা দেশে হাজারো সন্তুষ্ট গ্রাহকের বিশ্বস্ত সমাধান 🛡️ ক্যাশ অন ডেলিভারি 🚚 সারা দেশে ফ্রি হোম ডেলিভারি!',
  announcement_enabled: true,
  currency_symbol: '৳',
  free_shipping_text: 'সারা দেশে ফ্রি ডেলিভারি',
  cod_enabled: true,
  cod_notice: 'অর্ডার করার পূর্বে অনুগ্রহ করে ভেবে-চিন্তে নিশ্চিত হয়ে অর্ডার করুন। অযথা অর্ডার করে কুরিয়ার চার্জ অপচয় করা থেকে বিরত থাকুন। নবীজী (সা.) বলেছেন: "যে ব্যক্তি অপরকে ধোঁকা দেয়, সে আমাদের দলভুক্ত নয়।" — সহিহ মুসলিম, হাদিস নং ১৮৫',
  timer_enabled: true,
  timer_duration_hours: 2
};

export const DEFAULT_THEME_SETTINGS = {
  primary_color: '#0a8d49',
  secondary_color: '#055e31',
  accent_color: '#f59e0b',
  bg_color: '#f8fafc',
  text_color: '#111827',
  heading_font: 'Noto Serif Bengali',
  body_font: 'Anek Bangla',
  border_radius: '12px',
  button_style: 'rounded'
};

export function CmsProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [themeSettings, setThemeSettings] = useState(DEFAULT_THEME_SETTINGS);
  const [homepageSections, setHomepageSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Synchronize CSS variables with theme settings
  const applyThemeToDom = useCallback((theme) => {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.primary_color) {
      root.style.setProperty('--g', theme.primary_color);
      root.style.setProperty('--grad', `linear-gradient(135deg, ${theme.primary_color} 0%, ${theme.secondary_color || '#055e31'} 100%)`);
    }
    if (theme.secondary_color) root.style.setProperty('--gd', theme.secondary_color);
    if (theme.accent_color) root.style.setProperty('--gy', theme.accent_color);
    if (theme.bg_color) root.style.setProperty('--bg-page', theme.bg_color);
    if (theme.text_color) root.style.setProperty('--ink', theme.text_color);
    if (theme.border_radius) root.style.setProperty('--radius-md', theme.border_radius);
    if (theme.heading_font) root.style.setProperty('--heading-font', `"${theme.heading_font}", serif`);
    if (theme.body_font) root.style.setProperty('--body-font', `"${theme.body_font}", sans-serif`);
  }, []);

  // Fetch all CMS data from Supabase
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Site Settings
      const { data: sData } = await supabase.from('site_settings').select('*').eq('id', 'general').maybeSingle();
      if (sData?.data) {
        setSiteSettings(sData.data);
        if (sData.data.store_name) document.title = sData.data.store_name;
      }

      // 2. Theme Settings
      const { data: tData } = await supabase.from('theme_settings').select('*').eq('id', 'theme').maybeSingle();
      if (tData?.data) {
        setThemeSettings(tData.data);
        applyThemeToDom(tData.data);
      } else {
        applyThemeToDom(DEFAULT_THEME_SETTINGS);
      }

      // 3. Homepage Sections
      const { data: secData } = await supabase
        .from('homepage_sections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (secData && secData.length > 0) {
        setHomepageSections(secData);
      }

      // 4. Products
      const { data: pData } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (pData) setProducts(pData);

      // 5. Categories
      const { data: cData } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (cData) setCategories(cData);

      // 6. Orders
      const { data: oData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (oData) setOrders(oData);

      // 7. Testimonials
      const { data: tmData } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      if (tmData) setTestimonials(tmData);

      // 8. FAQs
      const { data: fData } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      if (fData) setFaqs(fData);

    } catch (err) {
      console.error('Error fetching CMS data:', err);
    } finally {
      setLoading(false);
    }
  }, [applyThemeToDom]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // MUTATION: Update Site Settings
  const updateSiteSettings = async (newData) => {
    const updated = { ...siteSettings, ...newData };
    setSiteSettings(updated);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 'general',
        data: updated,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast('সেটিংস সফলভাবে সেভ হয়েছে!');
      return true;
    } catch (err) {
      console.error('Failed to update site settings:', err);
      showToast('সেটিংস আপডেট করতে ত্রুটি হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Update Theme Settings
  const updateThemeSettings = async (newTheme) => {
    const updated = { ...themeSettings, ...newTheme };
    setThemeSettings(updated);
    applyThemeToDom(updated);
    try {
      const { error } = await supabase.from('theme_settings').upsert({
        id: 'theme',
        data: updated,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      showToast('থিম ও কালার সফলভাবে আপডেট হয়েছে!');
      return true;
    } catch (err) {
      console.error('Failed to update theme:', err);
      showToast('থিম আপডেট করতে ত্রুটি হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Save Product (Create or Update)
  const saveProduct = async (productData) => {
    try {
      if (productData.id) {
        // Update
        const { error } = await supabase
          .from('products')
          .update({ ...productData, updated_at: new Date().toISOString() })
          .eq('id', productData.id);
        if (error) throw error;
        setProducts((prev) => prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p)));
        showToast('প্রোডাক্ট সফলভাবে আপডেট হয়েছে!');
      } else {
        // Create
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...productData, updated_at: new Date().toISOString() }])
          .select()
          .single();
        if (error) throw error;
        if (data) setProducts((prev) => [...prev, data]);
        showToast('নতুন প্রোডাক্ট সফলভাবে তৈরি হয়েছে!');
      }
      return true;
    } catch (err) {
      console.error('Product save error:', err);
      showToast('প্রোডাক্ট সেভ করতে সমস্যা হয়েছে: ' + (err.message || ''), 'error');
      return false;
    }
  };

  // MUTATION: Delete Product
  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('প্রোডাক্ট মুছে ফেলা হয়েছে');
      return true;
    } catch (err) {
      console.error('Delete product error:', err);
      showToast('প্রোডাক্ট মুছতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('order_id', orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`অর্ডার স্ট্যাটাস "${newStatus}" করা হয়েছে`);
      return true;
    } catch (err) {
      console.error('Update order status error:', err);
      showToast('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Delete Order
  const deleteOrder = async (orderId) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('order_id', orderId);
      if (error) throw error;
      setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
      showToast('অর্ডার ডিলিট করা হয়েছে');
      return true;
    } catch (err) {
      console.error('Delete order error:', err);
      showToast('অর্ডার মুছতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Update Homepage Section
  const updateHomepageSection = async (sectionId, updates) => {
    try {
      const current = homepageSections.find((s) => s.id === sectionId);
      if (!current) return false;
      const updatedSection = { ...current, ...updates, updated_at: new Date().toISOString() };
      
      const { error } = await supabase
        .from('homepage_sections')
        .upsert(updatedSection);
      if (error) throw error;

      setHomepageSections((prev) =>
        prev.map((s) => (s.id === sectionId ? updatedSection : s))
      );
      showToast('সেকশন আপডেট সম্পন্ন হয়েছে!');
      return true;
    } catch (err) {
      console.error('Update section error:', err);
      showToast('সেকশন আপডেট করতে ত্রুটি হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Reorder Homepage Sections
  const reorderHomepageSections = async (newSectionsList) => {
    try {
      setHomepageSections(newSectionsList);
      for (let i = 0; i < newSectionsList.length; i++) {
        await supabase
          .from('homepage_sections')
          .update({ sort_order: i + 1 })
          .eq('id', newSectionsList[i].id);
      }
      showToast('সেকশনগুলোর ক্রম সফলভাবে সাজানো হয়েছে!');
      return true;
    } catch (err) {
      console.error('Reorder error:', err);
      showToast('ক্রম পরিবর্তন করতে সমস্যা হয়েছে', 'error');
      return false;
    }
  };

  // MUTATION: Testimonials
  const saveTestimonial = async (testimonialData) => {
    try {
      if (testimonialData.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', testimonialData.id);
        if (error) throw error;
        setTestimonials((prev) =>
          prev.map((t) => (t.id === testimonialData.id ? { ...t, ...testimonialData } : t))
        );
      } else {
        const { data, error } = await supabase
          .from('testimonials')
          .insert([testimonialData])
          .select()
          .single();
        if (error) throw error;
        if (data) setTestimonials((prev) => [...prev, data]);
      }
      showToast('টেস্টিমোনিয়াল সংরক্ষিত হয়েছে!');
      return true;
    } catch (err) {
      console.error('Save testimonial error:', err);
      showToast('ত্রুটি হয়েছে', 'error');
      return false;
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      showToast('টেস্টিমোনিয়াল মুছে ফেলা হয়েছে');
      return true;
    } catch (err) {
      console.error('Delete testimonial error:', err);
      return false;
    }
  };

  // MUTATION: FAQs
  const saveFaq = async (faqData) => {
    try {
      if (faqData.id) {
        const { error } = await supabase
          .from('faqs')
          .update(faqData)
          .eq('id', faqData.id);
        if (error) throw error;
        setFaqs((prev) => prev.map((f) => (f.id === faqData.id ? { ...f, ...faqData } : f)));
      } else {
        const { data, error } = await supabase
          .from('faqs')
          .insert([faqData])
          .select()
          .single();
        if (error) throw error;
        if (data) setFaqs((prev) => [...prev, data]);
      }
      showToast('FAQ সংরক্ষিত হয়েছে!');
      return true;
    } catch (err) {
      console.error('Save FAQ error:', err);
      return false;
    }
  };

  const deleteFaq = async (id) => {
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showToast('FAQ মুছে ফেলা হয়েছে');
      return true;
    } catch (err) {
      console.error('Delete FAQ error:', err);
      return false;
    }
  };

  return (
    <CmsContext.Provider
      value={{
        siteSettings,
        themeSettings,
        homepageSections,
        products,
        categories,
        orders,
        testimonials,
        faqs,
        loading,
        updateSiteSettings,
        updateThemeSettings,
        saveProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        updateHomepageSection,
        reorderHomepageSections,
        saveTestimonial,
        deleteTestimonial,
        saveFaq,
        deleteFaq,
        refreshAll: fetchData,
        showToast
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            background: toastMessage.type === 'error' ? '#ef4444' : '#0a8d49',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: 500,
            animation: 'fadeInUp 0.25s ease-out'
          }}
        >
          <span>{toastMessage.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
