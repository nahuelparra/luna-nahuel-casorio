import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  Trash2,
  Plus,
  Save,
  Check,
  Edit2,
  UserCheck,
  Users,
  Search,
  Filter,
  Calendar,
  Sparkles,
  CreditCard,
  Building,
  UserPlus,
  Lock,
  KeyRound,
  LogOut,
  ShieldCheck,
  ArrowUpDown,
} from 'lucide-react';
import { RSVPGuest, InvitedGuest, WeddingConfig } from '../types/wedding';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: RSVPGuest[];
  onAddGuest: (guest: RSVPGuest) => void;
  onDeleteGuest: (id: string) => void;
  invitedGuests: InvitedGuest[];
  onUpdateInvitedGuests: (list: InvitedGuest[]) => void;
  config: WeddingConfig;
  onUpdateConfig: (newConfig: WeddingConfig) => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  guests,
  onAddGuest,
  onDeleteGuest,
  invitedGuests,
  onUpdateInvitedGuests,
  config,
  onUpdateConfig,
}) => {
  // Security PIN authentication
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('wedding_admin_pin') || '2111';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('wedding_admin_auth') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [newPinSetting, setNewPinSetting] = useState('');

  const [activeTab, setActiveTab] = useState<'padron' | 'rsvps' | 'settings'>('padron');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttending, setFilterAttending] = useState<'all' | 'yes' | 'no'>('all');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sorting state (alphabetical by default)
  const [padronSort, setPadronSort] = useState<'name-asc' | 'name-desc' | 'group' | 'seats'>('name-asc');
  const [rsvpSort, setRsvpSort] = useState<'name-asc' | 'name-desc' | 'recent' | 'attending'>('name-asc');

  // New manual RSVP form state
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCount, setManualCount] = useState(1);
  const [manualCompanion, setManualCompanion] = useState('');
  const [manualDiet, setManualDiet] = useState<RSVPGuest['dietaryRequirement']>('none');

  // New invited guest (padrón) state
  const [newInvitedName, setNewInvitedName] = useState('');
  const [newInvitedSeats, setNewInvitedSeats] = useState<1 | 2>(2);
  const [newInvitedCompanion, setNewInvitedCompanion] = useState('');
  const [newInvitedCategory, setNewInvitedCategory] = useState('Familia');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkNamesText, setBulkNamesText] = useState('');
  const [bulkSeatsChoice, setBulkSeatsChoice] = useState<1 | 2>(2);

  // Inline companion editor state
  const [editingCompanionId, setEditingCompanionId] = useState<string | null>(null);
  const [editingCompanionText, setEditingCompanionText] = useState('');

  // Editable config state
  const [editBride, setEditBride] = useState(config.brideName);
  const [editGroom, setEditGroom] = useState(config.groomName);
  const [editDate, setEditDate] = useState(config.eventDate);
  const [editPartyVenue, setEditPartyVenue] = useState(config.partyVenue.name);
  const [editAlias, setEditAlias] = useState(config.bankDetails.alias);

  React.useEffect(() => {
    if (isOpen) {
      setEditBride(config.brideName);
      setEditGroom(config.groomName);
      setEditDate(config.eventDate);
      setEditPartyVenue(config.partyVenue.name);
      setEditAlias(config.bankDetails.alias);
    }
  }, [isOpen, config]);

  // Metrics for RSVPs
  const confirmedList = guests.filter((g) => g.attending === 'yes');
  const declinedList = guests.filter((g) => g.attending === 'no');
  const totalAttendingSeats = confirmedList.reduce((acc, curr) => acc + curr.guestsCount, 0);

  // Dietary counts
  const dietaryCounts = {
    celiac: confirmedList.filter((g) => g.dietaryRequirement === 'celiac').length,
    vegetarian: confirmedList.filter((g) => g.dietaryRequirement === 'vegetarian').length,
    vegan: confirmedList.filter((g) => g.dietaryRequirement === 'vegan').length,
    hypertensive: confirmedList.filter((g) => g.dietaryRequirement === 'hypertensive').length,
    other: confirmedList.filter((g) => g.dietaryRequirement === 'other').length,
  };

  // Filtered RSVPs
  const filteredRSVPs = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.companionNames && g.companionNames.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterAttending === 'all' || g.attending === filterAttending;
    return matchesSearch && matchesFilter;
  });

  // Filtered Padrón
  const availableGroups = Array.from(
    new Set(invitedGuests.map((ig) => ig.groupCategory).filter(Boolean))
  ) as string[];

  const filteredPadron = invitedGuests.filter((ig) => {
    const matchesSearch = ig.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroupFilter === 'all' || ig.groupCategory === selectedGroupFilter;
    return matchesSearch && matchesGroup;
  });

  // Sorted Padrón (alphabetical A-Z by default)
  const sortedPadron = useMemo(() => {
    return [...filteredPadron].sort((a, b) => {
      if (padronSort === 'name-asc') {
        return a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' });
      }
      if (padronSort === 'name-desc') {
        return b.fullName.localeCompare(a.fullName, 'es', { sensitivity: 'base' });
      }
      if (padronSort === 'group') {
        const grpA = a.groupCategory || '';
        const grpB = b.groupCategory || '';
        const comp = grpA.localeCompare(grpB, 'es', { sensitivity: 'base' });
        return comp !== 0 ? comp : a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' });
      }
      if (padronSort === 'seats') {
        return b.allowedSeats - a.allowedSeats;
      }
      return 0;
    });
  }, [filteredPadron, padronSort]);

  // Sorted RSVPs (alphabetical A-Z by default)
  const sortedRSVPs = useMemo(() => {
    return [...filteredRSVPs].sort((a, b) => {
      if (rsvpSort === 'name-asc') {
        return a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' });
      }
      if (rsvpSort === 'name-desc') {
        return b.fullName.localeCompare(a.fullName, 'es', { sensitivity: 'base' });
      }
      if (rsvpSort === 'attending') {
        if (a.attending === b.attending) {
          return a.fullName.localeCompare(b.fullName, 'es', { sensitivity: 'base' });
        }
        return a.attending === 'yes' ? -1 : 1;
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [filteredRSVPs, rsvpSort]);

  // Padrón metrics
  const totalReservedSeats = invitedGuests.reduce((acc, curr) => acc + curr.allowedSeats, 0);
  const totalDoublePasses = invitedGuests.filter((ig) => ig.allowedSeats === 2).length;
  const totalSinglePasses = invitedGuests.filter((ig) => ig.allowedSeats === 1).length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Nombre y Apellido',
      'Asiste',
      'Cantidad de Personas',
      'Acompañante',
      'Teléfono',
      'Email',
      'Menú Especial',
      'Detalles Menú',
      'Canción Solicitada',
      'Mensaje',
      'Fecha Confirmación',
    ];

    const rows = guests.map((g) => [
      `"${g.fullName}"`,
      g.attending === 'yes' ? 'SÍ' : 'NO',
      g.guestsCount,
      `"${g.companionNames || ''}"`,
      `"${g.phone}"`,
      `"${g.email || ''}"`,
      `"${g.dietaryRequirement}"`,
      `"${g.dietaryDetails || ''}"`,
      `"${g.songRequest || ''}"`,
      `"${(g.personalMessage || '').replace(/"/g, '""')}"`,
      `"${new Date(g.createdAt).toLocaleString('es-AR')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Confirmaciones-Boda-Luna-y-Nahuel-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add manual RSVP
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newGuest: RSVPGuest = {
      id: `rsvp-${Date.now()}`,
      fullName: manualName.trim(),
      phone: manualPhone.trim() || 'Carga manual',
      attending: 'yes',
      guestsCount: manualCount,
      companionNames: manualCount === 2 ? manualCompanion.trim() : undefined,
      dietaryRequirement: manualDiet,
      createdAt: new Date().toISOString(),
    };

    onAddGuest(newGuest);
    setManualName('');
    setManualPhone('');
    setManualCompanion('');
    setManualCount(1);
    setShowAddForm(false);
  };

  // Add single invited guest to Padrón
  const handleAddInvitedGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvitedName.trim()) return;

    const newGuest: InvitedGuest = {
      id: `inv-${Date.now()}`,
      fullName: newInvitedName.trim(),
      allowedSeats: newInvitedSeats,
      suggestedCompanion: newInvitedSeats === 2 && newInvitedCompanion.trim() ? newInvitedCompanion.trim() : undefined,
      groupCategory: newInvitedCategory,
    };

    onUpdateInvitedGuests([newGuest, ...invitedGuests]);
    setNewInvitedName('');
    setNewInvitedCompanion('');
  };

  // Bulk add invited guests
  const handleBulkAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkNamesText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length === 0) return;

    const created: InvitedGuest[] = lines.map((name, idx) => ({
      id: `inv-${Date.now()}-${idx}`,
      fullName: name,
      allowedSeats: bulkSeatsChoice,
    }));

    onUpdateInvitedGuests([...created, ...invitedGuests]);
    setBulkNamesText('');
    setShowBulkAdd(false);
  };

  // Toggle seat allowance (1 vs 2) for an invited guest
  const handleToggleSeats = (id: string) => {
    const updated = invitedGuests.map((ig) => {
      if (ig.id === id) {
        const nextSeats = (ig.allowedSeats === 2 ? 1 : 2) as 1 | 2;
        return {
          ...ig,
          allowedSeats: nextSeats,
          // if toggled to 1, clear suggested companion
          suggestedCompanion: nextSeats === 1 ? undefined : ig.suggestedCompanion,
        };
      }
      return ig;
    });
    onUpdateInvitedGuests(updated);
  };

  const handleStartEditCompanion = (guest: InvitedGuest) => {
    setEditingCompanionId(guest.id);
    setEditingCompanionText(guest.suggestedCompanion || '');
  };

  const handleSaveCompanion = (id: string) => {
    const trimmed = editingCompanionText.trim();
    const updated = invitedGuests.map((ig) => {
      if (ig.id === id) {
        return {
          ...ig,
          suggestedCompanion: trimmed ? trimmed : undefined,
          allowedSeats: (trimmed ? 2 : ig.allowedSeats) as 1 | 2,
        };
      }
      return ig;
    });
    onUpdateInvitedGuests(updated);
    setEditingCompanionId(null);
    setEditingCompanionText('');
  };

  const handleCancelEditCompanion = () => {
    setEditingCompanionId(null);
    setEditingCompanionText('');
  };

  const handleRemoveCompanion = (id: string) => {
    const updated = invitedGuests.map((ig) => {
      if (ig.id === id) {
        return {
          ...ig,
          suggestedCompanion: undefined,
          allowedSeats: 1 as 1 | 2,
        };
      }
      return ig;
    });
    onUpdateInvitedGuests(updated);
  };

  // Delete invited guest from padrón
  const handleDeleteInvitedGuest = (id: string) => {
    onUpdateInvitedGuests(invitedGuests.filter((ig) => ig.id !== id));
  };

  // Save config settings
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      ...config,
      brideName: editBride,
      groomName: editGroom,
      brideInitial: editBride.charAt(0) || 'L',
      groomInitial: editGroom.charAt(0) || 'N',
      eventDate: editDate,
      partyVenue: {
        ...config.partyVenue,
        name: editPartyVenue,
      },
      bankDetails: {
        ...config.bankDetails,
        alias: editAlias,
      },
    });
    alert('¡Configuración guardada exitosamente!');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === adminPin.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('wedding_admin_auth', 'true');
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('wedding_admin_auth');
    setEnteredPin('');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinSetting.trim() || newPinSetting.trim().length < 4) {
      alert('El nuevo PIN debe tener al menos 4 caracteres.');
      return;
    }
    setAdminPin(newPinSetting.trim());
    localStorage.setItem('wedding_admin_pin', newPinSetting.trim());
    setNewPinSetting('');
    alert('¡PIN de seguridad actualizado con éxito!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#E5DAC8] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-[#E8DFD1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#D8C7B0] flex items-center justify-center text-[#996D29]">
              {isAuthenticated ? (
                <Users className="w-5 h-5 stroke-[1.8]" />
              ) : (
                <Lock className="w-5 h-5 stroke-[1.8]" />
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#2C2724] font-normal leading-tight">
                {isAuthenticated ? 'Panel de los Novios' : 'Acceso Privado para Novios'}
              </h2>
              <span className="text-[11px] text-[#8A7C70]">
                {isAuthenticated
                  ? 'Gestión de Invitados, Asignación de Cupos y Confirmaciones RSVP'
                  : 'Ingreso exclusivo para Luna & Nahuel'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#73675E] hover:text-red-700 hover:bg-[#FAF7F2] rounded-lg transition-colors border border-transparent hover:border-[#D5C7B2]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-[#73675E] hover:text-[#2C2724] hover:bg-[#FAF7F2] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PIN Verification Barrier if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#C5A880] flex items-center justify-center text-[#996D29] mx-auto shadow-xs">
              <Lock className="w-7 h-7 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="font-serif text-2xl text-[#2C2724] font-normal mb-2">
                Panel Protegido con PIN
              </h3>
              <p className="text-xs text-[#70645B] leading-relaxed">
                Este panel contiene la lista confidencial de invitados, datos de regalos y ajustes de la boda.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={10}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="••••"
                  autoFocus
                  className={`w-full text-center tracking-widest text-2xl font-mono py-3 px-4 rounded-xl border ${
                    pinError
                      ? 'border-red-400 bg-red-50/50 text-red-800'
                      : 'border-[#D5C7B2] bg-white text-[#2C2724]'
                  } focus:outline-none focus:ring-2 focus:ring-[#996D29]/40 shadow-inner`}
                />

                {pinError && (
                  <p className="text-xs text-red-600 font-medium mt-2">
                    El PIN ingresado no es correcto. Por favor intentá nuevamente.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Ingresar al Panel
              </button>
            </form>

            <div className="bg-[#FAF7F2] border border-[#E8DFD1] p-3 rounded-xl text-[11px] text-[#8A7C70] space-y-1">
              <p>
                💡 <strong>Clave inicial para los novios:</strong> <span className="font-mono font-semibold text-[#2C2724]">2111</span> (fecha del casamiento).
              </p>
              <p>
                Pueden cambiar este PIN en cualquier momento dentro de la pestaña de configuración.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Tab switcher */}
            <div className="px-6 pt-3 bg-white border-b border-[#E8DFD1] flex gap-4 text-xs font-semibold uppercase tracking-wider overflow-x-auto">
              <button
                onClick={() => setActiveTab('padron')}
                className={`pb-3 relative transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'padron'
                    ? 'text-[#2C2724] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#996D29]'
                    : 'text-[#8A7C70] hover:text-[#2C2724]'
                }`}
              >
                Lista de Invitados / Padrón ({invitedGuests.length})
              </button>

              <button
                onClick={() => setActiveTab('rsvps')}
                className={`pb-3 relative transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'rsvps'
                    ? 'text-[#2C2724] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#996D29]'
                    : 'text-[#8A7C70] hover:text-[#2C2724]'
                }`}
              >
                Confirmaciones Recibidas ({guests.length})
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-3 relative transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'text-[#2C2724] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-[#996D29]'
                    : 'text-[#8A7C70] hover:text-[#2C2724]'
                }`}
              >
                Datos de la Boda
              </button>
            </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RSVPS */}
          {activeTab === 'rsvps' && (
            <>
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    Personas Confirmadas
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#2C2724] block mt-1">
                    {totalAttendingSeats}
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    en {confirmedList.length} respuestas
                  </span>
                </div>

                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    No Asisten
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#8A7C70] block mt-1">
                    {declinedList.length}
                  </span>
                  <span className="text-[10px] text-[#8A7C70]">respuestas</span>
                </div>

                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    Menús Especiales
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#996D29] block mt-1">
                    {dietaryCounts.celiac +
                      dietaryCounts.vegetarian +
                      dietaryCounts.vegan +
                      dietaryCounts.hypertensive +
                      dietaryCounts.other}
                  </span>
                  <span className="text-[10px] text-[#7A6D63]">
                    {dietaryCounts.celiac} celíaco · {dietaryCounts.vegetarian} veg
                  </span>
                </div>

                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                      Exportar Lista
                    </span>
                    <span className="text-xs text-[#6B5E53] mt-1 block">Formato Excel / CSV</span>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#2C2724] hover:bg-[#433B37] text-white text-[11px] uppercase tracking-wider font-semibold rounded-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nombre o acompañante..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#D5C7B2] rounded-lg bg-white"
                    />
                    <Search className="w-4 h-4 text-[#8A7C70] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={filterAttending}
                    onChange={(e) => setFilterAttending(e.target.value as any)}
                    className="text-xs border border-[#D5C7B2] rounded-lg px-2.5 py-2 bg-white"
                  >
                    <option value="all">Todos ({guests.length})</option>
                    <option value="yes">Confirmados ({confirmedList.length})</option>
                    <option value="no">No Asisten ({declinedList.length})</option>
                  </select>

                  <div className="flex items-center gap-1.5 bg-white border border-[#D5C7B2] rounded-lg px-2.5 py-1">
                    <span className="text-[11px] text-[#8A7C70]">Orden:</span>
                    <select
                      value={rsvpSort}
                      onChange={(e) => setRsvpSort(e.target.value as any)}
                      className="text-xs bg-transparent font-medium text-[#2C2724] focus:outline-none cursor-pointer"
                    >
                      <option value="name-asc">Alfabético (A - Z)</option>
                      <option value="name-desc">Alfabético (Z - A)</option>
                      <option value="recent">Más recientes</option>
                      <option value="attending">Confirmados primero</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#C5A880] text-[#2C2724] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#996D29]" />
                  <span>Cargar Manual</span>
                </button>
              </div>

              {/* Manual Add RSVP Form */}
              {showAddForm && (
                <form
                  onSubmit={handleManualAdd}
                  className="bg-white border border-[#D8C7B0] p-4 rounded-xl shadow-xs space-y-3"
                >
                  <span className="text-xs font-semibold text-[#2C2724] block">
                    Cargar Confirmación Manual (por llamado o WhatsApp)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Nombre y Apellido *"
                      required
                      className="px-3 py-1.5 text-xs border border-[#D5C7B2] rounded-md"
                    />
                    <input
                      type="text"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      placeholder="Teléfono / WhatsApp"
                      className="px-3 py-1.5 text-xs border border-[#D5C7B2] rounded-md"
                    />
                    <select
                      value={manualCount}
                      onChange={(e) => setManualCount(Math.min(2, Math.max(1, Number(e.target.value))))}
                      className="px-3 py-1.5 text-xs border border-[#D5C7B2] rounded-md bg-white"
                    >
                      <option value={1}>1 persona (solo)</option>
                      <option value={2}>2 personas (con 1 acompañante)</option>
                    </select>
                  </div>

                  {manualCount === 2 && (
                    <input
                      type="text"
                      value={manualCompanion}
                      onChange={(e) => setManualCompanion(e.target.value)}
                      placeholder="Nombre y apellido del acompañante (máx. 1)"
                      className="w-full px-3 py-1.5 text-xs border border-[#D5C7B2] rounded-md"
                    />
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1 text-xs text-[#73675E]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#2C2724] text-white text-xs font-semibold rounded-md"
                    >
                      Guardar Confirmación
                    </button>
                  </div>
                </form>
              )}

              {/* Guest RSVPs Table */}
              <div className="bg-white border border-[#E5DAC8] rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFD1] text-[#73675E] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th
                          onClick={() => setRsvpSort((prev) => (prev === 'name-asc' ? 'name-desc' : 'name-asc'))}
                          className="p-3 font-semibold cursor-pointer hover:text-[#2C2724] select-none"
                          title="Hacé clic para ordenar alfabéticamente A-Z o Z-A"
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <span>Invitado</span>
                            <ArrowUpDown className="w-3 h-3 text-[#996D29]" />
                            {rsvpSort === 'name-asc' && (
                              <span className="text-[#996D29] text-[9px] font-bold">A-Z</span>
                            )}
                            {rsvpSort === 'name-desc' && (
                              <span className="text-[#996D29] text-[9px] font-bold">Z-A</span>
                            )}
                          </div>
                        </th>
                        <th className="p-3 font-semibold">Estado</th>
                        <th className="p-3 font-semibold">Lugares</th>
                        <th className="p-3 font-semibold">Menú</th>
                        <th className="p-3 font-semibold">Contacto</th>
                        <th className="p-3 font-semibold">Mensaje / Canción</th>
                        <th className="p-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE1]">
                      {sortedRSVPs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-xs text-[#8A7C70]">
                            {guests.length === 0 ? (
                              <div className="space-y-2 py-4">
                                <p className="font-medium text-[#2C2724] text-sm">
                                  Todavía no hay confirmaciones RSVP registradas.
                                </p>
                                <p className="text-[#73675E] max-w-md mx-auto">
                                  Tus <strong className="text-[#2C2724]">{invitedGuests.length} invitados oficiales</strong> están cargados en la pestaña{' '}
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab('padron')}
                                    className="text-[#996D29] hover:underline font-semibold cursor-pointer"
                                  >
                                    «Lista de Invitados / Padrón»
                                  </button>
                                  . A medida que confirmen en la web, sus respuestas aparecerán acá automáticamente.
                                </p>
                              </div>
                            ) : (
                              'No se encontraron confirmaciones con ese criterio de búsqueda.'
                            )}
                          </td>
                        </tr>
                      ) : (
                        sortedRSVPs.map((guest) => (
                        <tr key={guest.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="p-3 font-medium text-[#2C2724]">
                            <div>{guest.fullName}</div>
                            {guest.companionNames && (
                              <div className="text-[11px] text-[#996D29]">
                                + Acomp: {guest.companionNames}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {guest.attending === 'yes' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                Confirmado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                                No Asiste
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-[#2C2724]">
                            {guest.guestsCount}
                          </td>
                          <td className="p-3 capitalize text-[#63574E]">
                            {guest.dietaryRequirement}
                            {guest.dietaryDetails && (
                              <div className="text-[10px] text-[#8A7C70] truncate max-w-[120px]">
                                {guest.dietaryDetails}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-[#63574E]">
                            <div>{guest.phone || '—'}</div>
                            {guest.email && (
                              <div className="text-[10px] text-[#8A7C70]">{guest.email}</div>
                            )}
                          </td>
                          <td className="p-3 text-[#63574E] max-w-[200px]">
                            {guest.personalMessage && (
                              <p className="italic truncate text-[11px]">«{guest.personalMessage}»</p>
                            )}
                            {guest.songRequest && (
                              <p className="text-[10px] text-[#996D29] truncate">
                                🎵 {guest.songRequest}
                              </p>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => onDeleteGuest(guest.id)}
                              title="Eliminar de la lista"
                              className="p-1 text-[#8A7C70] hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PADRÓN DE CUPOS (1 O 2 PASES) */}
          {activeTab === 'padron' && (
            <div className="space-y-6">
              {/* Padrón metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    Total Invitaciones
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#2C2724] block mt-1">
                    {invitedGuests.length}
                  </span>
                  <span className="text-[10px] text-[#8A7C70]">titulares registrados</span>
                </div>

                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    Con Acompañante
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#996D29] block mt-1">
                    {totalDoublePasses}
                  </span>
                  <span className="text-[10px] text-[#996D29]">2 lugares reservados</span>
                </div>

                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    Individuales
                  </span>
                  <span className="font-serif text-3xl font-normal text-[#5C534D] block mt-1">
                    {totalSinglePasses}
                  </span>
                  <span className="text-[10px] text-[#5C534D]">1 lugar reservado</span>
                </div>

                <div className="bg-white border border-[#E5DAC8] p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A7C70] font-medium block">
                    Total Lugares Asignados
                  </span>
                  <span className="font-serif text-3xl font-normal text-emerald-800 block mt-1">
                    {totalReservedSeats}
                  </span>
                  <span className="text-[10px] text-emerald-700">capacidad total prevista</span>
                </div>
              </div>

              {/* Add Single Invited Guest Form */}
              <form
                onSubmit={handleAddInvitedGuest}
                className="bg-white border border-[#D8C7B0] p-4 rounded-xl shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#2C2724] block">
                    Agregar Invitado al Padrón con su Cupo Asignado
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBulkAdd(!showBulkAdd)}
                    className="text-xs text-[#996D29] hover:underline"
                  >
                    {showBulkAdd ? 'Ocultar carga masiva' : 'Cargar lista de varios nombres'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newInvitedName}
                    onChange={(e) => setNewInvitedName(e.target.value)}
                    placeholder="Nombre y Apellido *"
                    required
                    className="px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg"
                  />

                  <select
                    value={newInvitedSeats}
                    onChange={(e) => setNewInvitedSeats(Number(e.target.value) as 1 | 2)}
                    className="px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg bg-white"
                  >
                    <option value={2}>2 lugares (con acompañante)</option>
                    <option value={1}>1 lugar (individual)</option>
                  </select>

                  {newInvitedSeats === 2 ? (
                    <input
                      type="text"
                      value={newInvitedCompanion}
                      onChange={(e) => setNewInvitedCompanion(e.target.value)}
                      placeholder="Nombre del acomp. (opcional)"
                      className="px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg"
                    />
                  ) : (
                    <div className="text-[11px] text-[#8A7C70] flex items-center px-2">
                      Sin acompañante
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Guardar Invitado</span>
                  </button>
                </div>
              </form>

              {/* Bulk add textarea */}
              {showBulkAdd && (
                <form
                  onSubmit={handleBulkAdd}
                  className="bg-[#FAF7F2] border border-[#E0D5C3] p-4 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2C2724]">
                      Pegar lista de nombres (uno por línea):
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#70645B]">Asignar a todos:</span>
                      <select
                        value={bulkSeatsChoice}
                        onChange={(e) => setBulkSeatsChoice(Number(e.target.value) as 1 | 2)}
                        className="text-xs border border-[#D5C7B2] rounded px-2 py-1 bg-white"
                      >
                        <option value={2}>2 lugares (con acompañante)</option>
                        <option value={1}>1 lugar (individual)</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={bulkNamesText}
                    onChange={(e) => setBulkNamesText(e.target.value)}
                    placeholder="Juan Pérez&#10;María González&#10;Carlos Rodríguez"
                    className="w-full p-2 text-xs border border-[#D5C7B2] rounded-lg bg-white font-mono"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#2C2724] text-white text-xs font-semibold rounded-md"
                    >
                      Procesar e Importar al Padrón
                    </button>
                  </div>
                </form>
              )}

              {/* Search & Sort bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar invitado por nombre o apellido..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#D5C7B2] rounded-lg bg-white"
                  />
                  <Search className="w-4 h-4 text-[#8A7C70] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-[#D5C7B2] rounded-lg px-2.5 py-1.5 shrink-0">
                  <span className="text-[11px] text-[#8A7C70] font-medium">Ordenar lista:</span>
                  <select
                    value={padronSort}
                    onChange={(e) => setPadronSort(e.target.value as any)}
                    className="text-xs bg-transparent font-medium text-[#2C2724] focus:outline-none cursor-pointer"
                  >
                    <option value="name-asc">Alfabético (A - Z)</option>
                    <option value="name-desc">Alfabético (Z - A)</option>
                    <option value="group">Por Grupo / Familia</option>
                    <option value="seats">Por Lugares (2 primero)</option>
                  </select>
                </div>
              </div>

              {/* Group Category Filter Tabs */}
              {availableGroups.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <span className="text-[#8A7C70] text-[11px] font-medium shrink-0">Filtrar por grupo:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedGroupFilter('all')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                      selectedGroupFilter === 'all'
                        ? 'bg-[#2C2724] text-white shadow-xs'
                        : 'bg-white border border-[#D5C7B2] text-[#63574E] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    Todos ({invitedGuests.length})
                  </button>
                  {availableGroups.map((group) => {
                    const count = invitedGuests.filter((ig) => ig.groupCategory === group).length;
                    return (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setSelectedGroupFilter(group)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                          selectedGroupFilter === group
                            ? 'bg-[#996D29] text-white shadow-xs'
                            : 'bg-white border border-[#D5C7B2] text-[#63574E] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {group} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Padrón Table */}
              <div className="bg-white border border-[#E5DAC8] rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DFD1] text-[#73675E] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th
                          onClick={() => setPadronSort((prev) => (prev === 'name-asc' ? 'name-desc' : 'name-asc'))}
                          className="p-3 font-semibold cursor-pointer hover:text-[#2C2724] select-none"
                          title="Hacé clic para ordenar alfabéticamente A-Z o Z-A"
                        >
                          <div className="inline-flex items-center gap-1.5">
                            <span>Nombre del Titular</span>
                            <ArrowUpDown className="w-3 h-3 text-[#996D29]" />
                            {padronSort === 'name-asc' && (
                              <span className="text-[#996D29] text-[9px] font-bold">A-Z</span>
                            )}
                            {padronSort === 'name-desc' && (
                              <span className="text-[#996D29] text-[9px] font-bold">Z-A</span>
                            )}
                          </div>
                        </th>
                        <th
                          onClick={() => setPadronSort('group')}
                          className="p-3 font-semibold cursor-pointer hover:text-[#2C2724] select-none"
                          title="Ordenar por Grupo"
                        >
                          Grupo {padronSort === 'group' && <span className="text-[#996D29]">●</span>}
                        </th>
                        <th
                          onClick={() => setPadronSort('seats')}
                          className="p-3 font-semibold cursor-pointer hover:text-[#2C2724] select-none"
                          title="Ordenar por Cupo de lugares"
                        >
                          Cupo Asignado {padronSort === 'seats' && <span className="text-[#996D29]">●</span>}
                        </th>
                        <th className="p-3 font-semibold">Acompañante Sugerido</th>
                        <th className="p-3 font-semibold">Estado de Confirmación</th>
                        <th className="p-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2ECE1]">
                      {sortedPadron.map((guest) => {
                        // Check status in RSVPs
                        const rsvp = guests.find(
                          (r) => r.fullName.toLowerCase() === guest.fullName.toLowerCase()
                        );

                        return (
                          <tr key={guest.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                            <td className="p-3 font-medium text-[#2C2724]">
                              {guest.fullName}
                            </td>

                            <td className="p-3">
                              {guest.groupCategory ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF7F2] text-[#7A5B3E] border border-[#E2D4C1]">
                                  {guest.groupCategory}
                                </span>
                              ) : (
                                <span className="text-[#A89E92] text-[11px]">—</span>
                              )}
                            </td>

                            <td className="p-3">
                              <button
                                onClick={() => handleToggleSeats(guest.id)}
                                title="Hacé clic para cambiar entre 1 y 2 lugares"
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                                  guest.allowedSeats === 2
                                    ? 'bg-[#996D29]/10 text-[#996D29] border-[#996D29]/30 hover:bg-[#996D29]/20'
                                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                                }`}
                              >
                                {guest.allowedSeats === 2 ? (
                                  <>
                                    <Users className="w-3.5 h-3.5" />
                                    <span>2 Lugares (con acomp.)</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>1 Lugar (individual)</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="p-3">
                              {editingCompanionId === guest.id ? (
                                <div className="flex items-center gap-1.5 min-w-[200px]">
                                  <input
                                    type="text"
                                    value={editingCompanionText}
                                    onChange={(e) => setEditingCompanionText(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSaveCompanion(guest.id);
                                      } else if (e.key === 'Escape') {
                                        handleCancelEditCompanion();
                                      }
                                    }}
                                    placeholder="Nombre del acompañante"
                                    autoFocus
                                    className="w-full px-2 py-1 text-xs border border-[#996D29] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#996D29]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSaveCompanion(guest.id)}
                                    title="Guardar acompañante"
                                    className="p-1 text-white bg-[#996D29] hover:bg-[#7D5417] rounded transition-colors cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEditCompanion}
                                    title="Cancelar"
                                    className="p-1 text-[#70645B] hover:bg-stone-200 rounded transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : guest.suggestedCompanion ? (
                                <div className="flex items-center gap-1.5 group">
                                  <span className="text-[#2C2724] font-medium text-xs">
                                    {guest.suggestedCompanion}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditCompanion(guest)}
                                    title="Modificar nombre del acompañante"
                                    className="text-[#996D29] hover:text-[#7A541C] p-1 rounded hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCompanion(guest.id)}
                                    title="Quitar acompañante (volver a 1 lugar)"
                                    className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStartEditCompanion(guest)}
                                  className="inline-flex items-center gap-1 text-[11px] text-[#996D29] hover:text-[#7A541C] hover:underline transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Asignar acompañante</span>
                                </button>
                              )}
                            </td>

                            <td className="p-3">
                              {rsvp ? (
                                rsvp.attending === 'yes' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                    ✅ Confirmó ({rsvp.guestsCount} pers.)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                                    ❌ No asistirá
                                  </span>
                                )
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                  ⏳ Pendiente de respuesta
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteInvitedGuest(guest.id)}
                                title="Eliminar del padrón"
                                className="p-1 text-[#8A7C70] hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-xl mx-auto">
              <div className="bg-white border border-[#E5DAC8] p-6 rounded-xl space-y-4">
                <span className="text-xs uppercase tracking-wider text-[#996D29] font-semibold block mb-1">
                  Datos Principales
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#63574E] block mb-1">
                      Nombre de la Novia
                    </label>
                    <input
                      type="text"
                      value={editBride}
                      onChange={(e) => setEditBride(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#63574E] block mb-1">
                      Nombre del Novio
                    </label>
                    <input
                      type="text"
                      value={editGroom}
                      onChange={(e) => setEditGroom(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#63574E] block mb-1">
                    Fecha y Hora de la Boda (ISO)
                  </label>
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg font-mono"
                  />
                  <span className="text-[10px] text-[#8A7C70] mt-0.5 block">
                    Formato: YYYY-MM-DDTHH:mm:ss (Ej: 2026-11-21T20:00:00)
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#63574E] block mb-1">
                    Nombre del Salón
                  </label>
                  <input
                    type="text"
                    value={editPartyVenue}
                    onChange={(e) => setEditPartyVenue(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#63574E] block mb-1">
                    Alias Bancario para Regalos
                  </label>
                  <input
                    type="text"
                    value={editAlias}
                    onChange={(e) => setEditAlias(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Security PIN Change Card */}
              <div className="bg-white border border-[#E5DAC8] p-6 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#996D29]" />
                  <span className="text-xs uppercase tracking-wider text-[#996D29] font-semibold">
                    Seguridad & PIN del Panel
                  </span>
                </div>
                <p className="text-xs text-[#70645B]">
                  El PIN actual protege este panel de accesos no autorizados.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    maxLength={10}
                    value={newPinSetting}
                    onChange={(e) => setNewPinSetting(e.target.value)}
                    placeholder="Nuevo PIN (mín. 4 caracteres)"
                    className="flex-1 px-3 py-2 text-xs border border-[#D5C7B2] rounded-lg font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleUpdatePin}
                    className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#C5A880] text-[#2C2724] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Actualizar PIN
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2C2724] hover:bg-[#433B37] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Guardar Cambios</span>
              </button>
            </form>
          )}
        </div>
      </>
    )}
  </div>
</div>
  );
};
