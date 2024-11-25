import TripPlanner from '@/components/TripPlanner';
import { Leaf } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen eco-gradient" style={{ backgroundImage: 'url(/bgImage.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container mx-auto px-4 py-24 md:py-28 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Generate Sustainable Trips in Seconds
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground">
              Reduce Your Carbon Footprint by 10% With AI-Powered Eco-friendly Travel Recommendations
            </p>
          </div>
          <TripPlanner />
        </div>
      </div>
    </main>
  );
}
