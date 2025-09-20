import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Truck, 
  Search, 
  ArrowRight, 
  X, 
  Edit, 
  Plus,
  Camera,
  Check,
  Settings,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserNames {
  farmer?: string;
  distributor?: string;
  consumer?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [userNames, setUserNames] = useState<UserNames>({});
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState<{[key: string]: boolean}>({
    farmer: true,
    distributor: true,
    consumer: true
  });

  const roles = [
    {
      key: 'farmer',
      title: 'Farmer Portal',
      icon: Sprout,
      description: 'Register your authentic Ayurvedic harvests on the blockchain. Track from seed to shelf with GPS verification and quality assurance.',
      features: [
        'GPS-Tagged Harvest Registration',
        'Blockchain Certification', 
        'Quality Verification',
        'Real-time Tracking'
      ],
      buttonText: 'Access Farmer Dashboard',
      gradient: 'from-primary to-secondary',
      stats: [
        { number: '23', label: 'Total Harvests' },
        { number: '450kg', label: 'Total Quantity' },
        { number: '8', label: 'Active Batches' }
      ]
    },
    {
      key: 'distributor',
      title: 'Distributor Portal',
      icon: Truck,
      description: 'Manage the supply chain from farm to market. Process, package, and distribute authentic Ayurvedic products with full transparency.',
      features: [
        'Batch Processing Management',
        'Quality Control Systems',
        'Supply Chain Optimization', 
        'Shipment Tracking'
      ],
      buttonText: 'Access Distributor Dashboard',
      gradient: 'from-blue-600 to-blue-700',
      stats: [
        { number: '12', label: 'Processing Batches' },
        { number: '8', label: 'Ready to Ship' },
        { number: '156', label: 'Total Products' }
      ]
    },
    {
      key: 'consumer',
      title: 'Consumer Portal',
      icon: Search,
      description: 'Verify the authenticity of your Ayurvedic products. Trace the complete journey from farm to your hands with blockchain verification.',
      features: [
        'QR Code Verification',
        'Complete Product Journey',
        'Authenticity Guarantee',
        'Lab Test Results'
      ],
      buttonText: 'Verify Products',
      gradient: 'from-accent to-accent-glow',
      stats: []
    }
  ];

  const openModal = (roleKey: string) => {
    setActiveModal(roleKey);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  const setUserName = (roleKey: string, name: string) => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    setUserNames(prev => ({ ...prev, [roleKey]: name }));
    setShowNameInput(prev => ({ ...prev, [roleKey]: false }));
  };

  const editUserName = (roleKey: string) => {
    setShowNameInput(prev => ({ ...prev, [roleKey]: true }));
  };

  const handleConsumerAction = () => {
    navigate('/auth');
    closeModal();
  };

  const handleFarmerAction = () => {
    navigate('/auth');
    closeModal();
  };

  const handleDistributorAction = () => {
    navigate('/auth');
    closeModal();
  };

  const currentRole = roles.find(role => role.key === activeModal);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-5 py-8">
        {/* Header */}
        <div className="text-center text-white mb-12">
          <h1 className="text-6xl font-bold mb-5 text-shadow-lg bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
            🌿 Ayur-Veritas
          </h1>
          <p className="text-2xl opacity-95 font-light tracking-wide mb-3">
            From Soil to Soul, Trust Assured
          </p>
          <p className="text-lg opacity-80 italic">
            Blockchain-Powered Ayurvedic Supply Chain Transparency
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-15">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card
                key={role.key}
                className="min-h-[450px] cursor-pointer transition-all duration-500 hover:transform hover:-translate-y-4 hover:scale-105 hover:shadow-elegant group relative overflow-hidden"
                onClick={() => openModal(role.key)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400"></div>
                
                <CardHeader className="text-center pb-4">
                  <div className="relative h-35 flex items-center justify-center mb-7">
                    <IconComponent className="h-20 w-20 text-primary transition-all duration-400 group-hover:scale-0 group-hover:opacity-0" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                    {role.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      {role.description}
                    </p>
                    
                    <ul className="space-y-2 mb-7">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3 w-3 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${role.gradient} text-white font-semibold py-3 rounded-full uppercase tracking-wide transition-all duration-300 hover:shadow-glow relative overflow-hidden`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {role.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModal && currentRole && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${currentRole.gradient} text-white p-6 rounded-t-3xl flex justify-between items-center`}>
              <div className="flex items-center gap-4">
                <currentRole.icon className="h-8 w-8" />
                <h2 className="text-2xl font-bold">{currentRole.title}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="p-10">
              {/* Name Input Section */}
              {showNameInput[currentRole.key] && (
                <div className="bg-gradient-to-br from-background-light to-background p-10 rounded-2xl mb-8 text-center border border-primary/10">
                  <h3 className="text-2xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
                    <currentRole.icon className="h-6 w-6" />
                    Welcome, {currentRole.key === 'farmer' ? 'Farmer' : currentRole.key === 'distributor' ? 'Distributor' : 'Consumer'}!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {currentRole.key === 'distributor' 
                      ? 'Please enter your company name to access distribution management'
                      : `Please enter your name to start ${currentRole.key === 'farmer' ? 'managing your harvests' : 'verifying products'}`
                    }
                  </p>
                  <div className="max-w-sm mx-auto mb-6">
                    <Input
                      id={`${currentRole.key}-name`}
                      placeholder={currentRole.key === 'distributor' ? 'Enter your company name' : 'Enter your name'}
                      className="text-center"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          setUserName(currentRole.key, input.value);
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const input = document.getElementById(`${currentRole.key}-name`) as HTMLInputElement;
                      setUserName(currentRole.key, input.value);
                    }}
                    className="bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
              )}

              {/* Name Display */}
              {!showNameInput[currentRole.key] && userNames[currentRole.key] && (
                <div className="bg-gradient-to-br from-background-light to-white p-6 rounded-xl mb-8 border-2 border-primary shadow-elegant flex justify-between items-center">
                  <div className="flex items-center gap-4 text-primary font-semibold text-xl">
                    <currentRole.icon className="h-6 w-6" />
                    Hello, {currentRole.key === 'farmer' ? 'Farmer ' : ''}{userNames[currentRole.key]}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editUserName(currentRole.key)}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Name
                  </Button>
                </div>
              )}

              {/* Dashboard Content */}
              {!showNameInput[currentRole.key] && userNames[currentRole.key] && (
                <div>
                  {/* Stats Grid */}
                  {currentRole.stats.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                      {currentRole.stats.map((stat, index) => (
                        <div key={index} className="bg-gradient-to-br from-primary to-secondary text-white p-6 rounded-xl text-center shadow-elegant">
                          <div className="text-4xl font-bold mb-2">{stat.number}</div>
                          <div className="text-sm opacity-90">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="text-center mb-8">
                    {currentRole.key === 'farmer' && (
                      <Button
                        onClick={handleFarmerAction}
                        size="xl"
                        className="bg-gradient-to-r from-primary to-secondary text-white font-semibold"
                      >
                        <Plus className="h-5 w-5 mr-3" />
                        Register New Harvest
                      </Button>
                    )}

                    {currentRole.key === 'distributor' && (
                      <Button
                        onClick={handleDistributorAction}
                        size="xl"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold"
                      >
                        <Settings className="h-5 w-5 mr-3" />
                        Access Dashboard
                      </Button>
                    )}

                    {currentRole.key === 'consumer' && (
                      <div className="bg-gradient-to-br from-background-light to-background p-10 rounded-2xl">
                        <QrCode className="h-16 w-16 text-primary mx-auto mb-5" />
                        <h3 className="text-primary text-2xl font-bold mb-4">Scan QR Code</h3>
                        <p className="text-muted-foreground mb-6">
                          Scan the QR code on your product to verify its authenticity
                        </p>
                        <Button
                          onClick={handleConsumerAction}
                          size="xl"
                          className="bg-gradient-to-r from-primary to-secondary text-white font-semibold mb-6"
                        >
                          <Camera className="h-5 w-5 mr-3" />
                          Start Verification
                        </Button>
                        
                        <div className="text-lg mb-4">- OR -</div>
                        
                        <div className="max-w-xs mx-auto space-y-3">
                          <Input placeholder="Enter QR code manually" className="text-center" />
                          <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                            <Check className="h-4 w-4 mr-2" />
                            Verify
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Message */}
                  <p className="text-center text-muted-foreground italic">
                    {currentRole.key === 'farmer' 
                      ? 'Your harvests are secured on blockchain technology, ensuring complete transparency and authenticity.'
                      : currentRole.key === 'distributor'
                      ? 'Monitor and manage the entire supply chain with real-time blockchain updates.'
                      : 'Every scan reveals the complete journey of your Ayurvedic product from farm to your hands.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}