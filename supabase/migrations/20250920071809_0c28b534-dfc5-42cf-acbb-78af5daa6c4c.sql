-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('farmer', 'distributor', 'consumer');

-- Create enum for product status
CREATE TYPE public.product_status AS ENUM ('harvested', 'processed', 'in_transit', 'delivered', 'verified');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create farms table
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  area_hectares DECIMAL(10,2),
  certification_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create batches table for product tracking
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT NOT NULL UNIQUE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  harvest_date DATE NOT NULL,
  status product_status DEFAULT 'harvested',
  quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
  organic_certified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create supply chain tracking table
CREATE TABLE public.supply_chain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  status product_status NOT NULL,
  location TEXT,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);

-- Create QR codes table
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create verification table for consumer scans
CREATE TABLE public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  consumer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL,
  scan_location TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_chain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_role user_role)
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = _role;
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for farms
CREATE POLICY "Farmers can manage their own farms" ON public.farms
  FOR ALL USING (farmer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Everyone can view farms" ON public.farms
  FOR SELECT USING (true);

-- RLS Policies for products
CREATE POLICY "Everyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Farmers can create products" ON public.products
  FOR INSERT WITH CHECK (public.has_role('farmer'));

-- RLS Policies for batches
CREATE POLICY "Farmers can manage their own batches" ON public.batches
  FOR ALL USING (farmer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Everyone can view batches" ON public.batches
  FOR SELECT USING (true);

-- RLS Policies for supply chain events
CREATE POLICY "Users can create events for their role" ON public.supply_chain_events
  FOR INSERT WITH CHECK (actor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Everyone can view supply chain events" ON public.supply_chain_events
  FOR SELECT USING (true);

-- RLS Policies for QR codes
CREATE POLICY "Everyone can view QR codes" ON public.qr_codes
  FOR SELECT USING (true);

CREATE POLICY "Farmers can create QR codes for their batches" ON public.qr_codes
  FOR INSERT WITH CHECK (
    batch_id IN (
      SELECT b.id FROM public.batches b 
      JOIN public.profiles p ON b.farmer_id = p.id 
      WHERE p.user_id = auth.uid()
    )
  );

-- RLS Policies for verifications
CREATE POLICY "Users can view their own verifications" ON public.verifications
  FOR SELECT USING (consumer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Consumers can create verifications" ON public.verifications
  FOR INSERT WITH CHECK (
    consumer_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
    consumer_id IS NULL
  );

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_batches_updated_at
    BEFORE UPDATE ON public.batches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'consumer'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products
INSERT INTO public.products (name, category, description) VALUES
  ('Organic Tomatoes', 'Vegetables', 'Fresh organic tomatoes grown with sustainable practices'),
  ('Basmati Rice', 'Grains', 'Premium quality basmati rice'),
  ('Organic Milk', 'Dairy', 'Fresh organic milk from grass-fed cows'),
  ('Green Tea', 'Beverages', 'Organic green tea leaves'),
  ('Honey', 'Natural Products', 'Pure wildflower honey');