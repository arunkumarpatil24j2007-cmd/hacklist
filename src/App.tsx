import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PlatformDirectory } from './components/PlatformDirectory';
import { WeeklyBanner } from './components/WeeklyBanner';
import { Footer } from './components/Footer';
import { AddPlatformModal } from './components/AddPlatformModal';
import { EditPlatformModal } from './components/EditPlatformModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { InfoModal } from './components/InfoModal';
import { DatabaseModal } from './components/DatabaseModal';
import type { Platform, ModalType } from './types';
import {
  subscribeToPlatforms,
  addPlatform as addPlatformToDb,
  updatePlatform as updatePlatformInDb,
  deletePlatform as deletePlatformFromDb,
} from './services/platformsService';

export const App: React.FC = () => {
  // CRITICAL REQUIREMENT: Initial state starts with ZERO platforms
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  // Subscribe to real-time Cloud Database / local cache updates
  useEffect(() => {
    const unsubscribe = subscribeToPlatforms((loaded) => {
      setPlatforms(loaded);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleOpenSubmit = () => {
    setActiveModal('submit');
  };

  const handleOpenAbout = () => {
    setActiveModal('about');
  };

  const handleOpenResources = () => {
    setActiveModal('resources');
  };

  const handleOpenSuggest = () => {
    setActiveModal('suggest');
  };

  const handleOpenContact = () => {
    setActiveModal('contact');
  };

  const handleOpenDatabase = () => {
    setActiveModal('database');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedPlatform(null);
  };

  const handleAddPlatform = (newPlatformData: Omit<Platform, 'id' | 'createdAt'>) => {
    // Check for duplicate URLs across currently loaded platforms
    const isDuplicate = platforms.some(
      (p) =>
        p.url.toLowerCase() === newPlatformData.url.toLowerCase() ||
        p.domain.toLowerCase() === newPlatformData.domain.toLowerCase()
    );

    if (isDuplicate) {
      return { success: false, error: 'This platform URL or domain is already in HackList.' };
    }

    addPlatformToDb(newPlatformData, platforms).then((result) => {
      if (result.newPlatforms) {
        setPlatforms(result.newPlatforms);
      }
    });

    return { success: true };
  };

  const handleEditPlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    setActiveModal('edit');
  };

  const handleSaveEdit = async (id: string, updates: Partial<Pick<Platform, 'name' | 'description'>>) => {
    await updatePlatformInDb(id, updates, platforms);
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleDeletePlatform = (platform: Platform) => {
    setSelectedPlatform(platform);
    setActiveModal('delete');
  };

  const handleConfirmDelete = async (id: string) => {
    await deletePlatformFromDb(id, platforms);
    setPlatforms((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExploreClick = () => {
    const section = document.getElementById('platforms');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-layout">
      {/* A. Minimal Horizontal Header */}
      <Header
        onOpenSubmit={handleOpenSubmit}
        onOpenAbout={handleOpenAbout}
        onOpenResources={handleOpenResources}
      />

      <main>
        {/* B. Hero Section with Exact Copy & Geometric Artwork */}
        <Hero onExploreClick={handleExploreClick} />

        {/* C. Platform Directory Section with 3-Column Grid or Empty State */}
        <PlatformDirectory
          platforms={platforms}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSubmit={handleOpenSubmit}
          onEditPlatform={handleEditPlatform}
          onDeletePlatform={handleDeletePlatform}
        />

        {/* D. Weekly Opportunities Wide Promotional Banner */}
        <WeeklyBanner />
      </main>

      {/* E. Footer */}
      <Footer
        onOpenAbout={handleOpenAbout}
        onOpenSuggest={handleOpenSuggest}
        onOpenContact={handleOpenContact}
        onOpenDatabase={handleOpenDatabase}
      />

      {/* Modals & Dialogs */}
      <AddPlatformModal
        isOpen={activeModal === 'submit'}
        onClose={handleCloseModal}
        onAddPlatform={handleAddPlatform}
      />

      <EditPlatformModal
        platform={selectedPlatform}
        isOpen={activeModal === 'edit'}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        platform={selectedPlatform}
        isOpen={activeModal === 'delete'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />

      <InfoModal
        type={activeModal}
        isOpen={['about', 'resources', 'suggest', 'contact'].includes(activeModal || '')}
        onClose={handleCloseModal}
        onOpenSubmit={handleOpenSubmit}
      />

      <DatabaseModal
        isOpen={activeModal === 'database'}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default App;
