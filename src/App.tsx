import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import HeightWeightRelationship from './components/HeightWeightRelationship'
import PositionDistribution from './components/PositionDistribution'
import HeightDistribution from './components/HeightDistribution'
import HeightOverTime from './components/HeightOverTime'
import HeightWeightDistributions from './components/HeightWeightDistributions'
import ThreeDVisualization from './components/ThreeDVisualization'
import EducationIncome from './components/EducationIncome'

interface PlayerData {
  position: string;
  height: string;
  weight: number;
  year_start: number;
}

interface EducationData {
  Educ: string;
  Income2005: number;
}

function App() {
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('position');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get the base URL from Vite's import.meta.env
        const baseUrl = import.meta.env.BASE_URL;

        // Load NBA Players data
        const playersResponse = await fetch(`${baseUrl}PlayersBBall.csv`);
        const playersText = await playersResponse.text();
        const playersParsed = Papa.parse<PlayerData>(playersText, {
          header: true,
          skipEmptyLines: true
        });

        // Load Education Income data
        const educationResponse = await fetch(`${baseUrl}Education_Income.csv`);
        const educationText = await educationResponse.text();
        const educationParsed = Papa.parse<EducationData>(educationText, {
          header: true,
          skipEmptyLines: true
        });

        setPlayerData(playersParsed.data);
        setEducationData(educationParsed.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const sections = [
    { id: 'position', label: 'Position Distribution' },
    { id: 'height', label: 'Height Analysis' },
    { id: 'weight', label: 'Weight Analysis' },
    { id: 'relationship', label: 'Height-Weight Relationship' },
    { id: 'trends', label: 'Historical Trends' },
    { id: '3d', label: '3D Analysis' },
    { id: 'education', label: 'Education & Income' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-dark-text text-xl">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-dark-text">
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-lighter shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center mb-2">
            NBA Player Analysis and Education-Income Study
          </h1>
          <p className="text-center text-lg opacity-80 mb-4">
            Interactive visualizations exploring NBA player statistics and education-income relationships
          </p>
          <nav className="flex flex-wrap justify-center gap-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-2 rounded transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-lighter hover:bg-dark-grid text-dark-text'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-48 pb-16 space-y-24">
        {/* NBA Players Analysis Section */}
        <section id="position" className="scroll-mt-40">
          <PositionDistribution data={playerData} />
        </section>

        <section id="height" className="scroll-mt-40">
          <HeightDistribution data={playerData} />
        </section>

        <section id="weight" className="scroll-mt-40">
          <HeightWeightDistributions data={playerData} />
        </section>

        <section id="relationship" className="scroll-mt-40">
          <HeightWeightRelationship data={playerData} />
        </section>

        <section id="trends" className="scroll-mt-40">
          <HeightOverTime data={playerData} />
        </section>

        <section id="3d" className="scroll-mt-40">
          <ThreeDVisualization data={playerData} />
        </section>

        {/* Education and Income Analysis Section */}
        <section id="education" className="scroll-mt-40">
          <EducationIncome data={educationData} />
        </section>
      </main>

      <footer className="bg-dark-lighter py-8 px-4 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-60">
            Created with React, TypeScript, and Recharts
          </p>
          <p className="text-sm opacity-60 mt-2">
            Data visualizations inspired by R analysis using ggplot2
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
