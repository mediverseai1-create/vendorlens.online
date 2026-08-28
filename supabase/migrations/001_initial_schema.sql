-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  job_role TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  industry TEXT,
  size TEXT,
  country TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Members
CREATE TABLE organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'analyst', 'member', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  UNIQUE(organization_id, user_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'business')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  vendor_limit INTEGER NOT NULL DEFAULT 5,
  user_limit INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Categories
CREATE TABLE vendor_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors (CORE TABLE)
CREATE TABLE vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  legal_name TEXT,
  description TEXT,
  website TEXT,
  category_id UUID REFERENCES vendor_categories(id),
  category_name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'under_evaluation', 'approved', 'active', 'review_required', 'suspended', 'archived')),
  risk_level TEXT DEFAULT 'unknown' CHECK (risk_level IN ('critical', 'high', 'medium', 'low', 'unknown')),
  risk_score DECIMAL(5,2) DEFAULT 0,
  criticality TEXT DEFAULT 'medium' CHECK (criticality IN ('critical', 'high', 'medium', 'low')),
  spend_annual DECIMAL(15,2),
  spend_currency TEXT DEFAULT 'USD',
  contract_start_date DATE,
  contract_end_date DATE,
  next_review_date DATE,
  owner_id UUID REFERENCES auth.users(id),
  owner_name TEXT,
  department TEXT,
  country TEXT,
  address TEXT,
  tax_id TEXT,
  founded_year INTEGER,
  employee_count TEXT,
  services_provided TEXT[],
  data_access TEXT[] DEFAULT '{}',
  system_access TEXT[] DEFAULT '{}',
  has_nda BOOLEAN DEFAULT false,
  has_contract BOOLEAN DEFAULT false,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Vendor Contacts
CREATE TABLE vendor_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  title TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Status History
CREATE TABLE vendor_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_by_name TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Evaluations
CREATE TABLE vendor_evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  evaluation_type TEXT DEFAULT 'general' CHECK (evaluation_type IN ('general', 'security', 'compliance', 'financial', 'operational', 'performance', 'risk')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  overall_score DECIMAL(5,2),
  findings TEXT,
  recommendations TEXT,
  notes TEXT,
  evaluated_by UUID REFERENCES auth.users(id),
  evaluated_by_name TEXT,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluation Criteria
CREATE TABLE evaluation_criteria (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  evaluation_id UUID REFERENCES vendor_evaluations(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  criterion TEXT NOT NULL,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2) DEFAULT 10,
  weight DECIMAL(5,2) DEFAULT 1,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'pass', 'fail', 'partial', 'na'))
);

-- Risk Assessments
CREATE TABLE vendor_risk_assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  overall_risk_level TEXT DEFAULT 'unknown' CHECK (overall_risk_level IN ('critical', 'high', 'medium', 'low', 'unknown')),
  overall_risk_score DECIMAL(5,2) DEFAULT 0,
  cybersecurity_score DECIMAL(5,2) DEFAULT 0,
  compliance_score DECIMAL(5,2) DEFAULT 0,
  financial_score DECIMAL(5,2) DEFAULT 0,
  operational_score DECIMAL(5,2) DEFAULT 0,
  privacy_score DECIMAL(5,2) DEFAULT 0,
  continuity_score DECIMAL(5,2) DEFAULT 0,
  performance_score DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  assessed_by UUID REFERENCES auth.users(id),
  assessed_by_name TEXT,
  next_assessment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Findings
CREATE TABLE risk_findings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  risk_assessment_id UUID REFERENCES vendor_risk_assessments(id),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low', 'informational')),
  category TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'accepted', 'mitigated')),
  owner_id UUID REFERENCES auth.users(id),
  owner_name TEXT,
  due_date DATE,
  resolution TEXT,
  evidence TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Documents
CREATE TABLE vendor_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'certification', 'compliance', 'insurance', 'security', 'policy', 'financial', 'nda', 'sow', 'other')),
  file_name TEXT,
  file_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending_review', 'archived')),
  expiration_date DATE,
  issue_date DATE,
  issued_by TEXT,
  notes TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Performance
CREATE TABLE vendor_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  overall_score DECIMAL(5,2),
  sla_compliance DECIMAL(5,2),
  delivery_score DECIMAL(5,2),
  quality_score DECIMAL(5,2),
  responsiveness_score DECIMAL(5,2),
  cost_performance DECIMAL(5,2),
  incidents_count INTEGER DEFAULT 0,
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs
CREATE TABLE activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  entity_name TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Analysis Records
CREATE TABLE ai_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  vendor_id UUID REFERENCES vendors(id),
  analysis_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports
CREATE TABLE reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('vendor_portfolio', 'risk', 'evaluation', 'compliance', 'performance', 'executive')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'error')),
  content JSONB DEFAULT '{}',
  generated_by UUID REFERENCES auth.users(id),
  generated_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_read BOOLEAN DEFAULT false,
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vendors_org ON vendors(organization_id);
CREATE INDEX idx_vendors_status ON vendors(organization_id, status);
CREATE INDEX idx_vendors_risk ON vendors(organization_id, risk_level);
CREATE INDEX idx_vendor_docs_vendor ON vendor_documents(vendor_id);
CREATE INDEX idx_vendor_docs_expiry ON vendor_documents(expiration_date) WHERE expiration_date IS NOT NULL;
CREATE INDEX idx_activity_logs_org ON activity_logs(organization_id, created_at DESC);
CREATE INDEX idx_evaluations_vendor ON vendor_evaluations(vendor_id);
CREATE INDEX idx_risk_findings_vendor ON risk_findings(vendor_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(organization_id) FROM organization_members WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (id = auth.uid());

-- Organizations policies
CREATE POLICY "Members can view their organizations" ON organizations FOR SELECT USING (is_org_member(id));
CREATE POLICY "Owners can update organizations" ON organizations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = id AND user_id = auth.uid() AND role IN ('owner', 'admin'))
);
CREATE POLICY "Anyone can insert organization" ON organizations FOR INSERT WITH CHECK (true);

-- Organization members policies
CREATE POLICY "Members can view org members" ON organization_members FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Owners can manage members" ON organization_members FOR ALL USING (
  EXISTS (SELECT 1 FROM organization_members m2 WHERE m2.organization_id = organization_members.organization_id AND m2.user_id = auth.uid() AND m2.role IN ('owner', 'admin'))
);
CREATE POLICY "Users can insert own membership" ON organization_members FOR INSERT WITH CHECK (user_id = auth.uid());

-- Subscriptions
CREATE POLICY "Members can view subscription" ON subscriptions FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Owners can update subscription" ON subscriptions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = subscriptions.organization_id AND user_id = auth.uid() AND role = 'owner')
);
CREATE POLICY "Allow insert subscription" ON subscriptions FOR INSERT WITH CHECK (is_org_member(organization_id));

-- Vendors
CREATE POLICY "Members can view vendors" ON vendors FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Members can insert vendors" ON vendors FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Members can update vendors" ON vendors FOR UPDATE USING (is_org_member(organization_id));
CREATE POLICY "Admins can delete vendors" ON vendors FOR DELETE USING (
  EXISTS (SELECT 1 FROM organization_members WHERE organization_id = vendors.organization_id AND user_id = auth.uid() AND role IN ('owner', 'admin', 'manager'))
);

-- Apply policies for all related tables
CREATE POLICY "Members can CRUD vendor_contacts" ON vendor_contacts FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD vendor_status_history" ON vendor_status_history FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD vendor_categories" ON vendor_categories FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD vendor_evaluations" ON vendor_evaluations FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD evaluation_criteria" ON evaluation_criteria FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD vendor_risk_assessments" ON vendor_risk_assessments FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD risk_findings" ON risk_findings FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD vendor_documents" ON vendor_documents FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD vendor_performance" ON vendor_performance FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can view activity_logs" ON activity_logs FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Members can insert activity_logs" ON activity_logs FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Members can CRUD ai_analyses" ON ai_analyses FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Members can CRUD reports" ON reports FOR ALL USING (is_org_member(organization_id));
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid() OR is_org_member(organization_id));
CREATE POLICY "Members can insert notifications" ON notifications FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Trigger to auto-create profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
