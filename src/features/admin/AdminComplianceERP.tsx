import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  FileText,
  Cookie,
  Scale,
  Truck,
  RotateCcw,
  DollarSign,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Save,
  Plus,
  RefreshCw,
  Search,
  Lock,
  Server,
  Database,
  History,
  Eye,
  Edit3,
  ExternalLink,
  Ban,
  FileSpreadsheet,
  AlertCircle,
  Key,
  Globe,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import {
  getSavedLegalDocuments,
  saveLegalDocument,
  revertLegalDocumentVersion,
  getSavedUserConsents,
  revokeUserConsentRecord,
  getSavedSubjectRequests,
  createSubjectRequest,
  updateSubjectRequestStatus,
  getSavedAdminAuditLogs,
  recordAdminAuditLog,
  getSecurityStatus,
  getSavedBackups,
  triggerManualBackup,
  exportBackupJSON,
  exportConsentsCSV,
  exportAuditLogsCSV
} from '../../utils/complianceStorage';
import {
  LegalDocument,
  LegalDocumentId,
  UserConsentRecord,
  DataSubjectRequest,
  SubjectRequestType,
  SubjectRequestStatus,
  AdminAuditLog,
  SecurityStatus,
  BackupRecord,
  DocumentVersionHistory
} from '../../types/compliance';

type ComplianceSubTab =
  | 'privacy-policy'
  | 'cookie-policy'
  | 'terms-of-use'
  | 'shipping-policy'
  | 'returns-policy'
  | 'refund-policy'
  | 'lgpd-consents'
  | 'subject-requests'
  | 'audit-logs'
  | 'security'
  | 'backup'
  | 'document-versions';

export type { ComplianceSubTab };

interface AdminComplianceERPProps {
  initialTab?: ComplianceSubTab;
}

export const AdminComplianceERP: React.FC<AdminComplianceERPProps> = ({ initialTab = 'privacy-policy' }) => {
  const [activeTab, setActiveTab] = useState<ComplianceSubTab>(initialTab);
  const [documents, setDocuments] = useState<LegalDocument[]>(getSavedLegalDocuments());
  const [consents, setConsents] = useState<UserConsentRecord[]>(getSavedUserConsents());
  const [subjectRequests, setSubjectRequests] = useState<DataSubjectRequest[]>(getSavedSubjectRequests());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(getSavedAdminAuditLogs());
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>(getSecurityStatus());
  const [backups, setBackups] = useState<BackupRecord[]>(getSavedBackups());

  // Editing state for legal documents
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [changeNotes, setChangeNotes] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  // Filters state
  const [consentSearch, setConsentSearch] = useState<string>('');
  const [logCategoryFilter, setLogCategoryFilter] = useState<string>('all');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

  // Modal states
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<DataSubjectRequest | null>(null);
  const [interactionMessage, setInteractionMessage] = useState<string>('');
  const [newRequestStatus, setNewRequestStatus] = useState<SubjectRequestStatus>('in_analysis');

  // New Request Form State
  const [newRequesterName, setNewRequesterName] = useState<string>('');
  const [newRequesterEmail, setNewRequesterEmail] = useState<string>('');
  const [newRequesterCpf, setNewRequesterCpf] = useState<string>('');
  const [newRequestType, setNewRequestType] = useState<SubjectRequestType>('access');
  const [newRequestDesc, setNewRequestDesc] = useState<string>('');

  // Version diff selection state
  const [diffDocId, setDiffDocId] = useState<LegalDocumentId>('privacy-policy');
  const [diffVersionA, setDiffVersionA] = useState<string>('');
  const [diffVersionB, setDiffVersionB] = useState<string>('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Sync current editing document when tab switches to a document type
    if (
      activeTab === 'privacy-policy' ||
      activeTab === 'cookie-policy' ||
      activeTab === 'terms-of-use' ||
      activeTab === 'shipping-policy' ||
      activeTab === 'returns-policy' ||
      activeTab === 'refund-policy'
    ) {
      const doc = documents.find((d) => d.id === activeTab);
      if (doc) {
        setEditingDoc({ ...doc });
        setChangeNotes('');
        setPreviewMode(false);
      }
    }
  }, [activeTab, documents]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveCurrentDoc = () => {
    if (!editingDoc) return;
    const updatedDocs = saveLegalDocument(editingDoc, changeNotes || 'Alteração pelo editor administrativo');
    setDocuments(updatedDocs);
    setChangeNotes('');
    showToast(`Documento "${editingDoc.title}" atualizado para v${editingDoc.version}!`);
  };

  const handleRevertVersion = (docId: LegalDocumentId, historyId: string) => {
    if (window.confirm('Deseja restaurar esta versão anterior? As alterações atuais serão salvas no histórico.')) {
      const updatedDocs = revertLegalDocumentVersion(docId, historyId);
      setDocuments(updatedDocs);
      showToast('Versão anterior restaurada com sucesso!');
    }
  };

  const handleRevokeConsent = (id: string) => {
    const reason = window.prompt('Informe a justificativa ou notas do titular para a revogação:');
    if (reason !== null) {
      const updated = revokeUserConsentRecord(id, reason || 'Revogação manual');
      setConsents(updated);
      showToast('Consentimento revogado com sucesso!');
    }
  };

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequesterName || !newRequesterEmail) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const newReq = createSubjectRequest({
      requesterName: newRequesterName,
      requesterEmail: newRequesterEmail,
      requesterCpf: newRequesterCpf,
      requestType: newRequestType,
      description: newRequestDesc,
      status: 'pending',
      assignedTo: 'DPO Omiaá'
    });

    setSubjectRequests(getSavedSubjectRequests());
    setIsNewRequestModalOpen(false);
    setNewRequesterName('');
    setNewRequesterEmail('');
    setNewRequesterCpf('');
    setNewRequestDesc('');
    showToast(`Protocolo ${newReq.protocolNumber} gerado com sucesso!`);
  };

  const handleAddRequestInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !interactionMessage) return;

    const updated = updateSubjectRequestStatus(
      selectedRequest.id,
      newRequestStatus,
      interactionMessage,
      'DPO Omiaá'
    );

    setSubjectRequests(updated);
    setIsInteractionModalOpen(false);
    setInteractionMessage('');
    showToast(`Protocolo ${selectedRequest.protocolNumber} atualizado!`);
  };

  const handleTriggerBackupNow = () => {
    const newBkp = triggerManualBackup();
    setBackups(getSavedBackups());
    setAuditLogs(getSavedAdminAuditLogs());
    showToast(`Backup manual ${newBkp.filename} gerado com sucesso!`);
  };

  const handleExportPortabilityJSON = (req: DataSubjectRequest) => {
    const payload = {
      protocol: req.protocolNumber,
      requester: {
        name: req.requesterName,
        email: req.requesterEmail,
        cpf: req.requesterCpf
      },
      exportedAt: new Date().toISOString(),
      consents: consents.filter((c) => c.userIdentifier.toLowerCase() === req.requesterEmail.toLowerCase()),
      dataSummary: 'Exportação de dados pessoais e histórico de interação sob o Artigo 18 da LGPD.'
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PORTABILIDADE_LGPD_${req.protocolNumber}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Pacote de portabilidade para ${req.requesterName} baixado.`);
  };

  const filteredConsents = consents.filter(
    (c) =>
      c.userIdentifier.toLowerCase().includes(consentSearch.toLowerCase()) ||
      (c.userName && c.userName.toLowerCase().includes(consentSearch.toLowerCase())) ||
      c.ipAddress.includes(consentSearch)
  );

  const filteredLogs = auditLogs.filter((l) => {
    if (logCategoryFilter === 'all') return true;
    return l.category === logCategoryFilter;
  });

  const filteredRequests = subjectRequests.filter((r) => {
    if (requestStatusFilter === 'all') return true;
    return r.status === requestStatusFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2A2421] text-[#D4AF37] flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#2A2421]">
                Centro de Conformidade
              </h1>
              <span className="text-xs bg-[#EFE8DC] text-[#8B5A2B] px-3 py-0.5 rounded-full font-mono font-semibold border border-[#D8C7B5]">
                LGPD & Segurança 100% Ativos
              </span>
            </div>
            <p className="text-xs text-[#6B5748] mt-0.5">
              Gestão unificada de documentos legais, versão histórica, registros de consentimento, atendimento a titulares, auditoria e backups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerBackupNow}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#5C4D42] bg-[#EFE8DC] hover:bg-[#E2D6C5] rounded-xl transition-all border border-[#D8C7B5]"
          >
            <Database className="w-4 h-4 text-[#8B5A2B]" />
            Gerar Backup Agora
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="p-4 bg-[#2A2421] text-[#FAF7F2] rounded-xl text-xs font-medium flex items-center justify-between shadow-lg animate-fade-in border border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* SUB MENU NAVIGATION TABS */}
      <div className="flex items-center border-b border-[#D8C7B5] gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('privacy-policy')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'privacy-policy'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Política de Privacidade
        </button>

        <button
          onClick={() => setActiveTab('cookie-policy')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'cookie-policy'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Cookie className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Política de Cookies
        </button>

        <button
          onClick={() => setActiveTab('terms-of-use')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'terms-of-use'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Termos de Uso
        </button>

        <button
          onClick={() => setActiveTab('shipping-policy')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'shipping-policy'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Política de Entrega
        </button>

        <button
          onClick={() => setActiveTab('returns-policy')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'returns-policy'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Trocas e Devoluções
        </button>

        <button
          onClick={() => setActiveTab('refund-policy')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'refund-policy'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Política de Reembolso
        </button>

        <button
          onClick={() => setActiveTab('lgpd-consents')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'lgpd-consents'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Consentimentos LGPD ({consents.length})
        </button>

        <button
          onClick={() => setActiveTab('subject-requests')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'subject-requests'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Solicitações de Titulares ({subjectRequests.filter((r) => r.status !== 'completed').length})
        </button>

        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'audit-logs'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Auditoria e Logs
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Segurança
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'backup'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <Server className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Backup ({backups.length})
        </button>

        <button
          onClick={() => setActiveTab('document-versions')}
          className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
            activeTab === 'document-versions'
              ? 'bg-[#FAF7F2] border-[#2A2421] text-[#2A2421] shadow-sm'
              : 'border-transparent text-[#7A6251] hover:text-[#2A2421] hover:bg-[#EFE8DC]/50'
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#8B5A2B]" />
          Versões
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TABS 1-6: LEGAL DOCUMENT EDITORS */}
      {/* ==================================================================== */}
      {(activeTab === 'privacy-policy' ||
        activeTab === 'cookie-policy' ||
        activeTab === 'terms-of-use' ||
        activeTab === 'shipping-policy' ||
        activeTab === 'returns-policy' ||
        activeTab === 'refund-policy') &&
        editingDoc && (
          <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCF] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                    {editingDoc.title}
                  </h3>
                  <span className="text-xs font-mono bg-[#EFE8DC] text-[#8B5A2B] px-2.5 py-0.5 rounded-full border border-[#D8C7B5] font-semibold">
                    v{editingDoc.version}
                  </span>
                </div>
                <p className="text-xs text-[#6B5748] mt-0.5">
                  Última atualização: {editingDoc.updatedAt} • Status: <span className="text-emerald-700 font-semibold">Publicado</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#5C4D42] bg-[#EFE8DC] hover:bg-[#E2D6C5] rounded-xl transition-all border border-[#D8C7B5]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {previewMode ? 'Modo Editor' : 'Pré-visualizar'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveCurrentDoc}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl transition-all shadow-md"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  Salvar Nova Versão
                </button>
              </div>
            </div>

            {/* DOCUMENT METADATA INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#EFE8DC]/50 p-4 rounded-xl border border-[#D8C7B5]">
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Título do Documento
                </label>
                <input
                  type="text"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8C7B5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Versão
                </label>
                <input
                  type="text"
                  value={editingDoc.version}
                  onChange={(e) => setEditingDoc({ ...editingDoc, version: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-[#D8C7B5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Autor / Responsável Jurídico
                </label>
                <input
                  type="text"
                  value={editingDoc.author}
                  onChange={(e) => setEditingDoc({ ...editingDoc, author: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#D8C7B5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B5A2B]"
                />
              </div>
            </div>

            {/* CHANGE NOTES FOR VERSION CONTROL */}
            <div>
              <label className="block text-xs font-semibold text-[#423833] mb-1">
                Notas do Histórico da Alteração (Auditoria)
              </label>
              <input
                type="text"
                placeholder="Ex: Atualização do Artigo 4º conforme nova nota explicativa da ANPD"
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
              />
            </div>

            {/* EDITOR OR PREVIEW MODE */}
            {previewMode ? (
              <div className="bg-white p-6 rounded-2xl border border-[#D8C7B5] max-h-[500px] overflow-y-auto space-y-4">
                <div className="border-b border-[#E8DCCF] pb-3 mb-4">
                  <h2 className="font-serif text-xl font-bold text-[#2A2421]">{editingDoc.title}</h2>
                  <p className="text-xs text-[#7A6251]">Versão {editingDoc.version} • {editingDoc.author}</p>
                </div>
                <div
                  className="prose prose-stone text-xs md:text-sm text-[#382E2B]"
                  dangerouslySetInnerHTML={{ __html: editingDoc.content }}
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">
                  Conteúdo do Documento (Suporta Formatação HTML / Markdown)
                </label>
                <textarea
                  rows={14}
                  value={editingDoc.content}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  className="w-full p-4 text-xs font-mono bg-white border border-[#D8C7B5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B] leading-relaxed text-[#2A2421]"
                />
              </div>
            )}

            {/* VERSION HISTORY SNAPSHOTS FOR THIS SPECIFIC DOC */}
            {editingDoc.history && editingDoc.history.length > 0 && (
              <div className="pt-4 border-t border-[#E8DCCF] space-y-3">
                <h4 className="font-serif text-sm font-bold text-[#2A2421] flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#8B5A2B]" />
                  Histórico de Versões Deste Documento
                </h4>

                <div className="space-y-2">
                  {editingDoc.history.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 bg-white border border-[#D8C7B5] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#8B5A2B]">v{h.version}</span>
                          <span className="text-[#7A6251]">• {h.updatedAt}</span>
                          <span className="text-[#5C4D42]">({h.updatedBy})</span>
                        </div>
                        <p className="text-[#6B5748] text-[11px] italic">{h.changeNotes}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRevertVersion(editingDoc.id, h.id)}
                        className="px-3 py-1 bg-[#EFE8DC] hover:bg-[#E2D6C5] text-[#2A2421] font-semibold text-[11px] rounded-lg border border-[#D8C7B5] transition-all"
                      >
                        Restaurar Esta Versão
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* ==================================================================== */}
      {/* TAB 7: CONSENTIMENTOS LGPD */}
      {/* ==================================================================== */}
      {activeTab === 'lgpd-consents' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCF] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Registro de Consentimentos dos Usuários
              </h3>
              <p className="text-xs text-[#6B5748] mt-0.5">
                Base imutável para prestação de contas perante a Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </div>

            <button
              type="button"
              onClick={() => exportConsentsCSV(consents)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl shadow-sm"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              Exportar para CSV
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8B5A2B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por e-mail do usuário, nome ou endereço IP..."
              value={consentSearch}
              onChange={(e) => setConsentSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
            />
          </div>

          {/* TABLE OF CONSENTS */}
          <div className="overflow-x-auto rounded-xl border border-[#D8C7B5] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE8DC] text-[#423833] uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Usuário</th>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">IP</th>
                  <th className="p-3">Categorias Aceitas</th>
                  <th className="p-3">Versão Termos</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DC]">
                {filteredConsents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#7A6251]">
                      Nenhum registro de consentimento encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredConsents.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FAF7F2]">
                      <td className="p-3 font-medium text-[#2A2421]">
                        <div>{c.userIdentifier}</div>
                        {c.userName && <div className="text-[10px] text-[#7A6251]">{c.userName}</div>}
                      </td>
                      <td className="p-3 font-mono text-[#6B5748]">
                        {new Date(c.acceptedAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3 font-mono text-[#8B5A2B]">{c.ipAddress}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.consents.cookiesNecessary && (
                            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                              Necessários
                            </span>
                          )}
                          {c.consents.cookiesFunctional && (
                            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                              Funcionais
                            </span>
                          )}
                          {c.consents.cookiesAnalytics && (
                            <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                              Analíticos
                            </span>
                          )}
                          {c.consents.cookiesMarketing && (
                            <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                              Marketing
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[#8B5A2B]">
                        v{c.documentVersionsAccepted?.privacyPolicy || '1.0.0'}
                      </td>
                      <td className="p-3">
                        {c.revoked ? (
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Revogado
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Ativo
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {!c.revoked && (
                          <button
                            type="button"
                            onClick={() => handleRevokeConsent(c.id)}
                            className="px-2.5 py-1 text-[10px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                          >
                            Revogar Consentimento
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 8: SOLICITAÇÕES DE TITULARES (LGPD REQUESTS) */}
      {/* ==================================================================== */}
      {activeTab === 'subject-requests' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCF] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Gestão de Direitos dos Titulares (Art. 18 LGPD)
              </h3>
              <p className="text-xs text-[#6B5748] mt-0.5">
                Atendimento de pedidos de Acesso, Exclusão, Correção, Anonimização e Portabilidade dentro do prazo legal de 15 dias.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              Abrir Novo Protocolo
            </button>
          </div>

          {/* FILTER STATUS */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#423833]">Filtrar por Status:</span>
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
            >
              <option value="all">Todos os Protocolos</option>
              <option value="pending">Pendentes</option>
              <option value="in_analysis">Em Análise</option>
              <option value="in_progress">Em Andamento</option>
              <option value="completed">Concluídos</option>
            </select>
          </div>

          {/* REQUESTS LIST */}
          <div className="space-y-3">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-[#D8C7B5] text-[#7A6251] text-xs">
                Nenhuma solicitação de titular encontrada neste filtro.
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-xl border border-[#D8C7B5] shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DCCF] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#8B5A2B] bg-[#EFE8DC] px-2.5 py-1 rounded-lg border border-[#D8C7B5]">
                        {req.protocolNumber}
                      </span>
                      <span className="text-xs font-semibold text-[#2A2421]">{req.requesterName}</span>
                      <span className="text-xs text-[#7A6251]">({req.requesterEmail})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                          req.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {req.status === 'pending'
                          ? 'Pendente'
                          : req.status === 'in_analysis'
                          ? 'Em Análise'
                          : req.status === 'in_progress'
                          ? 'Em Andamento'
                          : 'Concluído'}
                      </span>

                      <span className="text-[11px] font-mono text-[#7A6251] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D8C7B5]">
                        Prazo Legal: {req.deadlineDate}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#423833] leading-relaxed">{req.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8DCCF]">
                    <div className="text-[11px] text-[#7A6251]">
                      Aberto em: {new Date(req.createdAt).toLocaleDateString('pt-BR')} • Responsável: {req.assignedTo}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleExportPortabilityJSON(req)}
                        className="px-3 py-1 bg-[#EFE8DC] hover:bg-[#E2D6C5] text-[#2A2421] text-xs font-semibold rounded-lg border border-[#D8C7B5] transition-all flex items-center gap-1"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-[#8B5A2B]" />
                        Exportar Portabilidade (JSON)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRequest(req);
                          setNewRequestStatus(req.status);
                          setIsInteractionModalOpen(true);
                        }}
                        className="px-3.5 py-1 bg-[#2A2421] text-[#FAF7F2] hover:bg-[#423833] text-xs font-semibold rounded-lg transition-all"
                      >
                        Atualizar Status & Interação
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 9: AUDITORIA E LOGS (ADMIN AUDIT LOGS) */}
      {/* ==================================================================== */}
      {activeTab === 'audit-logs' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCF] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Trilha de Auditoria Administrativa
              </h3>
              <p className="text-xs text-[#6B5748] mt-0.5">
                Rastreabilidade de logins, criação de produtos, cupons, preços e alterações no Centro de Conformidade.
              </p>
            </div>

            <button
              type="button"
              onClick={() => exportAuditLogsCSV(auditLogs)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl shadow-sm"
            >
              <Download className="w-4 h-4 text-[#D4AF37]" />
              Exportar para CSV
            </button>
          </div>

          {/* FILTER BY CATEGORY */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#423833]">Categoria do Log:</span>
            <select
              value={logCategoryFilter}
              onChange={(e) => setLogCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              <option value="compliance">Conformidade e LGPD</option>
              <option value="login">Logins e Segurança</option>
              <option value="coupon">Cupons e Promoções</option>
              <option value="inventory">Estoque e Produtos</option>
              <option value="order">Pedidos e Vendas</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl border border-[#D8C7B5] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE8DC] text-[#423833] uppercase font-mono tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Data / Hora</th>
                  <th className="p-3">Usuário Admin</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Ação Executada</th>
                  <th className="p-3">IP / Dispositivo</th>
                  <th className="p-3">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DC]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF7F2]">
                    <td className="p-3 font-mono text-[#2A2421]">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-medium text-[#2A2421]">
                      <div>{log.userName}</div>
                      <div className="text-[10px] text-[#7A6251]">{log.userEmail}</div>
                    </td>
                    <td className="p-3 font-mono text-[#8B5A2B] font-semibold uppercase text-[10px]">
                      {log.category}
                    </td>
                    <td className="p-3 text-[#382E2B]">
                      <div className="font-semibold">{log.action}</div>
                      {log.details && <div className="text-[11px] text-[#7A6251]">{log.details}</div>}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-[#7A6251]">
                      <div>{log.ipAddress}</div>
                      <div className="truncate max-w-xs">{log.device}</div>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold text-[10px]">
                        Sucesso
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 10: SEGURANÇA (SECURITY DASHBOARD) */}
      {/* ==================================================================== */}
      {activeTab === 'security' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-[#E8DCCF] pb-4">
            <h3 className="font-serif text-lg font-bold text-[#2A2421]">
              Painel de Segurança & Integridade
            </h3>
            <p className="text-xs text-[#6B5748] mt-0.5">
              Diagnóstico em tempo real de certificados SSL, cabeçalhos de segurança, conexões de API e integridade do ambiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SSL STATUS CARD */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2A2421]">Certificado SSL / TLS</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold font-serif text-emerald-800">Ativo & Válido</p>
              <p className="text-[11px] text-[#7A6251] font-mono">{securityStatus.sslCertificate.issuer}</p>
              <p className="text-[10px] text-[#8B5A2B] font-mono">Validade: {securityStatus.sslCertificate.validUntil}</p>
            </div>

            {/* HEADERS CARD */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2A2421]">Cabeçalhos de Segurança</span>
                <Lock className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold font-serif text-emerald-800">HSTS & CSP OK</p>
              <p className="text-[11px] text-[#7A6251]">X-Frame-Options • X-Content-Type</p>
              <p className="text-[10px] text-[#8B5A2B]">Proteção Anti-Clickjacking Ativa</p>
            </div>

            {/* ENV INTEGRITY */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2A2421]">Variáveis de Ambiente</span>
                <Key className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold font-serif text-emerald-800">Seguras (.env)</p>
              <p className="text-[11px] text-[#7A6251]">Keys do Gemini & Gateways Protegidas</p>
              <p className="text-[10px] text-[#8B5A2B]">Execução Server-Side Proxy</p>
            </div>

            {/* API INTEGRITY */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2A2421]">Status das APIs</span>
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xl font-bold font-serif text-emerald-800">100% Operacional</p>
              <p className="text-[11px] text-[#7A6251]">Google GenAI • Mercado Pago • Correios</p>
              <p className="text-[10px] text-[#8B5A2B]">Latência Média: 42ms</p>
            </div>
          </div>

          {/* ALERTS SECTION */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-sm font-bold text-[#2A2421]">Registro de Auditoria de Segurança</h4>
            <div className="space-y-2">
              {securityStatus.alerts.map((alt) => (
                <div key={alt.id} className="p-4 bg-white border border-[#D8C7B5] rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-xs text-[#2A2421]">{alt.title}</h5>
                    <p className="text-xs text-[#6B5748] mt-0.5">{alt.message}</p>
                    <span className="text-[10px] font-mono text-[#7A6251]">
                      {new Date(alt.date).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 11: BACKUP */}
      {/* ==================================================================== */}
      {activeTab === 'backup' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DCCF] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Gestão de Backups do Sistema
              </h3>
              <p className="text-xs text-[#6B5748] mt-0.5">
                Snapshots completos e verificados de catálogo, pedidos, conformidade legal, consentimentos e auditoria.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTriggerBackupNow}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] hover:bg-[#423833] rounded-xl shadow-sm"
            >
              <Database className="w-4 h-4 text-[#D4AF37]" />
              Gerar Backup Manual Agora
            </button>
          </div>

          {/* BACKUPS LIST */}
          <div className="space-y-3">
            {backups.map((bkp) => (
              <div
                key={bkp.id}
                className="bg-white p-5 rounded-xl border border-[#D8C7B5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#8B5A2B]">{bkp.filename}</span>
                    <span className="text-[10px] font-semibold uppercase bg-[#EFE8DC] text-[#7A6251] px-2 py-0.5 rounded border border-[#D8C7B5]">
                      {bkp.type === 'manual' ? 'Manual' : 'Agendado'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      Verificado
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5748]">{bkp.contentsSummary}</p>
                  <p className="text-[10px] font-mono text-[#7A6251]">
                    Data: {new Date(bkp.timestamp).toLocaleString('pt-BR')} • Tamanho: {(bkp.sizeBytes / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportBackupJSON(bkp.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-[#2A2421] bg-[#EFE8DC] hover:bg-[#E2D6C5] rounded-xl border border-[#D8C7B5] transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    Baixar Pacote JSON
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 12: VERSÕES DOS DOCUMENTOS (VERSIONING HUB) */}
      {/* ==================================================================== */}
      {activeTab === 'document-versions' && (
        <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-[#E8DCCF] pb-4">
            <h3 className="font-serif text-lg font-bold text-[#2A2421]">
              Central de Controle de Versões dos Documentos Legais
            </h3>
            <p className="text-xs text-[#6B5748] mt-0.5">
              Visualização de histórico completo e ferramentas de restauração e comparação.
            </p>
          </div>

          {/* ALL DOCUMENTS VERSIONS OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white p-5 rounded-2xl border border-[#D8C7B5] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#E8DCCF] pb-2">
                  <h4 className="font-serif font-bold text-sm text-[#2A2421]">{doc.title}</h4>
                  <span className="font-mono text-xs text-[#8B5A2B] font-semibold bg-[#EFE8DC] px-2 py-0.5 rounded border border-[#D8C7B5]">
                    v{doc.version}
                  </span>
                </div>
                <p className="text-xs text-[#6B5748]">{doc.summary}</p>

                <div className="pt-2 text-xs text-[#7A6251]">
                  <strong>{doc.history ? doc.history.length : 0}</strong> versões gravadas no histórico.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW LGPD REQUEST MODAL */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D8C7B5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">Abrir Novo Protocolo LGPD</h3>
              <button onClick={() => setIsNewRequestModalOpen(false)}>
                <X className="w-5 h-5 text-[#5C4D42]" />
              </button>
            </div>

            <form onSubmit={handleCreateNewRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">Nome do Titular *</label>
                <input
                  type="text"
                  required
                  value={newRequesterName}
                  onChange={(e) => setNewRequesterName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">E-mail do Titular *</label>
                <input
                  type="email"
                  required
                  value={newRequesterEmail}
                  onChange={(e) => setNewRequesterEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">CPF (Opcional para Validação)</label>
                <input
                  type="text"
                  value={newRequesterCpf}
                  onChange={(e) => setNewRequesterCpf(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">Tipo de Direito Solicitado</label>
                <select
                  value={newRequestType}
                  onChange={(e) => setNewRequestType(e.target.value as SubjectRequestType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                >
                  <option value="access">Acesso aos Dados (Art. 18, II)</option>
                  <option value="rectification">Correção de Dados (Art. 18, III)</option>
                  <option value="erasure">Exclusão de Dados / Eliminação (Art. 18, VI)</option>
                  <option value="anonymization">Anonimização ou Bloqueio (Art. 18, IV)</option>
                  <option value="portability">Portabilidade de Dados (Art. 18, V)</option>
                  <option value="revocation">Revogação do Consentimento (Art. 18, IX)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">Descrição do Pedido</label>
                <textarea
                  rows={3}
                  value={newRequestDesc}
                  onChange={(e) => setNewRequestDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C4D42] bg-[#EFE8DC] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] rounded-xl shadow-md"
                >
                  Gerar Protocolo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTION UPDATE MODAL */}
      {isInteractionModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] border border-[#D8C7B5] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D8C7B5] pb-3">
              <h3 className="font-serif text-lg font-bold text-[#2A2421]">
                Atualizar Protocolo {selectedRequest.protocolNumber}
              </h3>
              <button onClick={() => setIsInteractionModalOpen(false)}>
                <X className="w-5 h-5 text-[#5C4D42]" />
              </button>
            </div>

            <form onSubmit={handleAddRequestInteraction} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">Novo Status</label>
                <select
                  value={newRequestStatus}
                  onChange={(e) => setNewRequestStatus(e.target.value as SubjectRequestStatus)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                >
                  <option value="pending">Pendente</option>
                  <option value="in_analysis">Em Análise</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluído</option>
                  <option value="rejected">Rejeitado (Motivo Legal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#423833] mb-1">Mensagem de Resposta / Observação Interna *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva as providências adotadas pela equipe ou DPO..."
                  value={interactionMessage}
                  onChange={(e) => setInteractionMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#D8C7B5] rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInteractionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C4D42] bg-[#EFE8DC] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-[#FAF7F2] bg-[#2A2421] rounded-xl shadow-md"
                >
                  Salvar Resposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
