/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { defaultWeddingConfig, initialRSVPList, initialInvitedGuests } from './data/weddingData';
import { RSVPGuest, InvitedGuest, WeddingConfig } from './types/wedding';
import {
  subscribeToRSVPs,
  saveRSVPToCloud,
  deleteRSVPFromCloud,
  subscribeToPadron,
  saveInvitedGuestToCloud,
  deleteInvitedGuestFromCloud,
} from './services/rsvpService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { LoveStory } from './components/LoveStory';
import { EventDetails } from './components/EventDetails';
import { DressCodeAndTips } from './components/DressCodeAndTips';
import { GiftRegistry } from './components/GiftRegistry';
import { Guestbook } from './components/Guestbook';
import { RSVPForm } from './components/RSVPForm';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';
import { OrganizerModal } from './components/OrganizerModal';

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const saved = localStorage.getItem('wedding_config_v3');
      if (saved) return JSON.parse(saved);
      // Clean up previous test version if any
      localStorage.removeItem('wedding_config');
      localStorage.removeItem('wedding_config_v2');
      return defaultWeddingConfig;
    } catch {
      return defaultWeddingConfig;
    }
  });

  const [rsvpList, setRsvpList] = useState<RSVPGuest[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_rsvps_v4');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('wedding_rsvps_v2');
      localStorage.removeItem('wedding_rsvps_v3');
      return initialRSVPList;
    } catch {
      return initialRSVPList;
    }
  });

  const [invitedGuests, setInvitedGuests] = useState<InvitedGuest[]>(() => {
    try {
      localStorage.removeItem('wedding_invited_guests_v1');
      localStorage.removeItem('wedding_invited_guests_v2');
      localStorage.removeItem('wedding_invited_guests_v3');
      const saved = localStorage.getItem('wedding_invited_guests_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialInvitedGuests;
    } catch {
      return initialInvitedGuests;
    }
  });

  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

  // Private route listener: opens organizer on /novios or #novios
  useEffect(() => {
    const checkNoviosRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes('novios') ||
        hash.includes('novios') ||
        search.includes('novios')
      ) {
        setIsOrganizerOpen(true);
      }
    };

    // Check on initial render
    checkNoviosRoute();

    // Listen to history and hash changes
    window.addEventListener('popstate', checkNoviosRoute);
    window.addEventListener('hashchange', checkNoviosRoute);

    // Secret shortcut: Ctrl/Cmd + Shift + N
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsOrganizerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkNoviosRoute);
      window.removeEventListener('hashchange', checkNoviosRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenOrganizer = () => {
    setIsOrganizerOpen(true);
  };

  const handleCloseOrganizer = () => {
    setIsOrganizerOpen(false);
    // Clean up /novios or #novios from URL without reloading
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('novios')) {
      const cleanPath = window.location.pathname.replace(/\/novios\/?$/, '') || '/';
      window.history.replaceState(null, '', cleanPath);
    } else if (hash.includes('novios')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Cloud Firestore Real-time subscriptions across all devices
  useEffect(() => {
    const unsubRSVPs = subscribeToRSVPs((cloudRSVPs) => {
      if (cloudRSVPs) {
        setRsvpList(cloudRSVPs);
      }
    });

    const unsubPadron = subscribeToPadron((cloudPadron) => {
      if (cloudPadron && cloudPadron.length > 0) {
        setInvitedGuests(cloudPadron);
      }
    });

    return () => {
      unsubRSVPs();
      unsubPadron();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_config_v3', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_rsvps_v4', JSON.stringify(rsvpList));
    } catch {
      // ignore
    }
  }, [rsvpList]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_invited_guests_v4', JSON.stringify(invitedGuests));
    } catch {
      // ignore
    }
  }, [invitedGuests]);

  const handleAddRSVP = async (newGuest: RSVPGuest) => {
    // Optimistic update
    setRsvpList((prev) => [newGuest, ...prev.filter((g) => g.id !== newGuest.id)]);
    // Persist to Cloud Firestore (real-time for all devices)
    try {
      await saveRSVPToCloud(newGuest);
    } catch (e) {
      console.error('Failed to sync RSVP to cloud:', e);
    }
  };

  const handleDeleteRSVP = async (id: string) => {
    setRsvpList((prev) => prev.filter((item) => item.id !== id));
    try {
      await deleteRSVPFromCloud(id);
    } catch (e) {
      console.error('Failed to delete RSVP from cloud:', e);
    }
  };

  const handleUpdateInvitedGuests = async (newList: InvitedGuest[]) => {
    const oldIds = new Set(invitedGuests.map((g) => g.id));
    const newIds = new Set(newList.map((g) => g.id));
    const deletedIds = Array.from(oldIds).filter((id) => !newIds.has(id));

    setInvitedGuests(newList);

    try {
      for (const delId of deletedIds) {
        await deleteInvitedGuestFromCloud(delId);
      }
      for (const guest of newList) {
        await saveInvitedGuestToCloud(guest);
      }
    } catch (e) {
      console.error('Failed to sync padron to cloud:', e);
    }
  };

  const handleUpdateConfig = (newConfig: WeddingConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2724] paper-texture flex flex-col font-sans selection:bg-[#E8D8C3] selection:text-[#1F1B18]">
      {/* Navigation Top Bar (clean, private) */}
      <Navbar config={config} />

      <main className="flex-1">
        {/* Hero Section with Monogram & Names */}
        <Hero config={config} />

        {/* Real-time Countdown & Add to Calendar */}
        <Countdown config={config} />

        {/* Romantic Timeline / Story */}
        <LoveStory />

        {/* Venue, Schedule & Interactive Map in San Telmo */}
        <EventDetails config={config} />

        {/* Dress Code, Color Palette & Practical Tips */}
        <DressCodeAndTips config={config} />

        {/* Honeymoon Gift Registry & Bank Transfer Details */}
        <GiftRegistry config={config} />

        {/* Guestbook / Warm Wishes Wall */}
        <Guestbook guests={rsvpList} />

        {/* RSVP Attendance Confirmation Form with Personalized Quota Lookup */}
        <RSVPForm
          config={config}
          invitedGuests={invitedGuests}
          existingRSVPs={rsvpList}
          onAddRSVP={handleAddRSVP}
        />
      </main>

      {/* Footer */}
      <Footer config={config} onOpenNovios={handleOpenOrganizer} />

      {/* Floating Gentle Wedding Melodies Player */}
      <MusicPlayer />

      {/* Organizer / Guest List Management Modal (Protected by PIN) */}
      {isOrganizerOpen && (
        <OrganizerModal
          isOpen={isOrganizerOpen}
          onClose={handleCloseOrganizer}
          guests={rsvpList}
          onAddGuest={handleAddRSVP}
          onDeleteGuest={handleDeleteRSVP}
          invitedGuests={invitedGuests}
          onUpdateInvitedGuests={handleUpdateInvitedGuests}
          config={config}
          onUpdateConfig={handleUpdateConfig}
        />
      )}
    </div>
  );
}
