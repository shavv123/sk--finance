import React from 'react';
import { Link } from 'react-router-dom';
import { LOAN_PRODUCTS } from '../constants';
import { ArrowRight, CheckCircle, Smartphone, Home as HomeIcon, Car, Coins } from 'lucide-react';
import { Button, Card } from '../components/UI';

const Home: React.FC = () => {
  const getIcon = (type: string) => {
    if (type.includes('Gold')) return <Coins className="h-8 w-8 text-yellow-500" />;
    if (type.includes('Home')) return <HomeIcon className="h-8 w-8 text-blue-500" />;
    if (type.includes('Car')) return <Car className="h-8 w-8 text-red-500" />;
    return <Smartphone className="h-8 w-8 text-purple-500" />;
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative bg-brand-900 rounded-3xl overflow-hidden shadow-2xl mx-4 lg:mx-0">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/1200/600')] bg-cover bg-center" />
        <div className="relative z-10 px-8 py-20 lg:py-32 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Finance Your Future with <span className="text-brand-400">SK Finance</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Fast approvals, minimal documentation, and competitive rates for Gold, Vehicle, and Home loans.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/apply">
              <Button size="lg" className="w-full sm:w-auto">Apply Now</Button>
            </Link>
            <Link to="/calculator">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-brand-900">
                Calculate EMI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Our Loan Products</h2>
          <p className="mt-4 text-gray-600">Tailored financial solutions to meet your specific needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {LOAN_PRODUCTS.map((product) => (
            <Card key={product.id} className="p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col h-full">
                <div className="mb-4 bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  {getIcon(product.type)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.type}</h3>
                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Rate: {product.interestRateBase}% p.a.
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Up to {product.maxTenureMonths} months
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Low Processing Fee
                  </div>
                </div>
                <Link to="/apply" className="mt-auto">
                  <Button variant="outline" className="w-full group">
                    View Details <ArrowRight className="h-4 w-4 ml-2 inline transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white py-16 px-4 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-brand-600 mb-2">10k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-600 mb-2">₹50Cr+</div>
            <div className="text-gray-600">Loans Disbursed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-600 mb-2">24h</div>
            <div className="text-gray-600">Average Approval Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;